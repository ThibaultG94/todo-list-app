import TaskModel from '../models/task.model';
import express from 'express';

export const getTasks = async (req: express.Request, res: express.Response) => {
	const task = await TaskModel.find();
	res.status(200).json(task);
};

export const setTasks = async (req: express.Request, res: express.Response) => {
	if (!req.body.name) {
		res.status(400).json({ message: "Merci d'ajouter une tâche" });
	}

	const task = await TaskModel.create({
		name: req.body.name,
		author: req.body.author,
		date: req.body.date,
	});
	res.status(200).json(task);
};
export const editTask = async (req: express.Request, res: express.Response) => {
	const task = await TaskModel.findById(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	const updateTask = await TaskModel.findByIdAndUpdate(task, req.body, {
		new: true,
	});

	res.status(200).json(updateTask);
};

export const deleteTask = async (
	req: express.Request,
	res: express.Response
) => {
	const task = await TaskModel.findByIdAndDelete(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	await task.deleteOne();
	res.status(200).json('Tâche supprimée ' + req.params.id);
};
