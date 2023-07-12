import TaskModel from '../models/task.model';
import express from 'express';
import client from '../utils/redisClient';
import userModel from '../models/user.model';
import { Task } from '../types/types';

// Endpoint to get a task by id
export const getTask = async (req: express.Request, res: express.Response) => {
	try {
		// Find the task with the id provided in params
		const task: Task = await TaskModel.findById(req.params.id);

		if (!req.user) {
			return res.status(401).json({ message: 'User not authenticated' });
		}

		// If the task does not exist, return a 400 status
		if (!task) {
			return res
				.status(400)
				.json({ message: 'This task does not exist' });
		}

		// Check if the user making the request is the owner of the task
		// by comparing the user's ID from the request (req.user._id)
		// with the ID of the user who owns the task (task.userId)
		if (task !== null && req.user._id !== task.userId) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		// If everything is okay, return the task
		res.status(200).json(task);
	} catch (error) {
		// In case of error, return a 500 status with the error message
		const result = (error as Error).message;
		console.log(result);

		res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to get tasks of a specific user
export const getUserTasks = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Parsing the page and limit query parameters. If not provided, default value are used.
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = parseInt(req.query.limit as string, 10) || 10;

		// Calculate the number of tasks to skip based on the page and limit.
		const skip = (page - 1) * limit;

		const userId = req.params.id;

		// Generate a unique key for caching purposes using the user ID, page, and limit.
		const key = `task:${userId}:${page}:${limit}`;

		// Check if the user making the request is the one who created the task
		console.log(req.user._id, userId);
		if (req.user._id !== userId) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		// First, check if the tasks are already cached
		const cachedTasks = await client.get(key);

		let tasks: Task[] | null;
		if (cachedTasks) {
			// If the tasks are cached, use them
			tasks = JSON.parse(cachedTasks);
		} else {
			// If the tasks are not cached, fetch the tasks from the database
			tasks = await TaskModel.find({ userId }).skip(skip).limit(limit);

			// Then, cache the fetched tasks for future requests
			await client.setEx(key, 3600, JSON.stringify(tasks));
		}

		// Return the tasks
		res.status(200).json(tasks);
	} catch (err) {
		const result = (err as Error).message;
		console.log(result);

		res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to create a task
export const setTasks = async (req: express.Request, res: express.Response) => {
	try {
		// Check if the request includes task title
		if (!req.body.title) {
			return res.status(400).json({ message: 'Please add a task' });
		}

		const userId = req.user._id;

		// Check if the user exists
		const userExists = await userModel.exists({ _id: userId });
		if (!userExists) {
			return res
				.status(404)
				.json({ message: 'The specified user does not exist' });
		}

		// Create a new task
		const task = await TaskModel.create({
			title: req.body.title,
			userId: req.body.userId,
			date: req.body.date,
			description: req.body.description,
			workspace: req.body.workspace,
		});

		// Invalide all cache keys for this user
		const keys = await client.keys(`task:${userId}:*`);
		keys &&
			keys.forEach(async (key) => {
				await client.del(key);
			});

		res.status(200).json(task);
	} catch (error) {
		// If something goes wrong, log the error and send a server error response
		const result = (error as Error).message;
		console.log(result);

		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to edit a task
export const editTask = async (req: express.Request, res: express.Response) => {
	try {
		// Data to be updated
		const updates = req.body;

		// Find the task by ID
		const task = (await TaskModel.findById(req.params.id)) as Task;

		// Check if the task exists
		if (!task) {
			console.log(res);

			return res
				.status(400)
				.json({ message: 'This task does not exist' });
		}

		// Check if the user making the request is the owner of the task
		if (task && req.user._id !== task.userId) {
			console.log(req.user._id);
			console.log(task.userId);
			return res.status(403).json({
				message:
					'You do not have sufficients rights to perform this action',
			});
		}

		// Update the fields of the task
		if (updates.title !== undefined) {
			task.title = updates.title;
		}
		if (updates.userId !== undefined) {
			task.userId = updates.userId;
		}
		if (updates.date !== undefined) {
			task.date = updates.date;
		}
		if (updates.description !== undefined) {
			task.description = updates.description;
		}
		if (updates.status !== undefined) {
			task.status = updates.status;
		}
		if (updates.estimatedTime !== undefined) {
			task.estimatedTime = updates.estimatedTime;
		}
		if (updates.comments !== undefined) {
			task.comments = updates.comments;
		}
		if (updates.priority !== undefined) {
			task.priority = updates.priority;
		}

		const updatedTask = await task.save();

		console.log(req.user._id);
		console.log(task.userId);
		res.status(200).json({
			message: 'Task updated',
			task: updatedTask,
		});
	} catch (error) {
		// If something goes wrong, log the error and a server error response
		const result = (error as Error).message;
		console.log(result);

		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to delete a task
export const deleteTask = async (
	req: express.Request,
	res: express.Response
) => {
	// Attempt to find and delete the task by the provided id
	const task = await TaskModel.findByIdAndDelete(req.params.id);

	// If no task is found, return a 400 status
	if (!task) {
		return res.status(400).json({ message: 'This task does not exist' });
	}

	// If a task is found, check if the user making the request is the same as the one who created the task
	if (task && req.user._id !== task.userId) {
		return res.status(403).json({
			message: 'You do not have the right to modify this task',
		});
	}

	// If the task is found and the user has sufficients rights, delete the task
	if (task) {
		await task.deleteOne();
		res.status(200).json('Task deleted ' + req.params.id);
	}
};
