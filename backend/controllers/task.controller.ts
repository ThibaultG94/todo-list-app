import TaskModel from '../models/task.model';
import express from 'express';

export const getTasks = async (req: any, res: express.Response) => {
	const task: any = await TaskModel.findById(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
	if (req.user._id !== task.user) {
		res.status(403).json({
			message: "Vous n'avez pas le droit de modifier cette tâche",
		});
	}

	res.status(200).json(task);
};

export const setTasks = async (req: express.Request, res: express.Response) => {
	if (!req.body.title) {
		res.status(400).json({ message: "Merci d'ajouter une tâche" });
	}

	const task = await TaskModel.create({
		title: req.body.title,
		userId: req.body.userId,
		date: req.body.date,
		description: req.body.description,
	});
	res.status(200).json(task);
};
export const editTask = async (req: any, res: express.Response) => {
	const task = await TaskModel.findById(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
	if (task !== null && req.user._id !== task.userId) {
		console.log(req);
		res.status(403).json({
			message: "Vous n'avez pas le droit de modifier cette tâche",
		});
	}

	const updateTask = await TaskModel.findByIdAndUpdate(task, req.body, {
		new: true,
	});

	res.status(200).json(updateTask);
};

export const deleteTask = async (req: any, res: express.Response) => {
	const task = await TaskModel.findByIdAndDelete(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
	if (task && req.user._id !== task.userId) {
		res.status(403).json({
			message: "Vous n'avez pas le droit de modifier cette tâche",
		});
	}

	if (task) {
		await task.deleteOne();
		res.status(200).json('Tâche supprimée ' + req.params.id);
	}
};
