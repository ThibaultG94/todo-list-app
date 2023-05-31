import TaskModel from '../models/task.model';
import express from 'express';

export const getTasks = async (req: any, res: express.Response) => {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const skip = (page - 1) * limit;

		const task: any = await TaskModel.findById(req.params.id)
			.skip(skip)
			.limit(limit);

		if (!task) {
			return res
				.status(400)
				.json({ message: "Cette tâche n'existe pas" });
		}

		// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
		if (task !== null && req.user._id !== task.userId) {
			return res.status(403).json({
				message: "Vous n'avez pas le droit de modifier cette tâche",
			});
		}

		res.status(200).json(task);
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Erreur interne du serveur', result });
	}
};

export const setTasks = async (req: express.Request, res: express.Response) => {
	if (!req.body.title) {
		return res.status(400).json({ message: "Merci d'ajouter une tâche" });
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
	try {
		// Les données à mettre à jour
		const updates = req.body;

		const task: any = await TaskModel.findById(req.params.id);

		if (!task) {
			console.log(res);
			return res
				.status(400)
				.json({ message: "Cette tâche n'existe pas" });
		}

		// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
		if (task && req.user._id !== task.userId) {
			console.log(req.user._id);
			console.log(task.userId);
			return res.status(403).json({
				message: "Vous n'avez pas le droit de modifier cette tâche",
			});
		}

		// const updateTask = await TaskModel.findByIdAndUpdate(task, req.body, {
		// 	new: true,
		// });

		// Mettre à jour les champs de l'utilisateur
		Object.keys(updates).forEach((update) => {
			task[update] = updates[update];
		});

		const updatedTask = await task.save();

		console.log(req.user._id);
		console.log(task.userId);
		res.status(200).json({
			message: 'Utilisateur mis à jour',
			task: updatedTask,
		});
	} catch (err) {
		const result = (err as Error).message;
		return res
			.status(500)
			.json({ message: 'Erreur interne du serveur', result });
	}
};

export const deleteTask = async (req: any, res: express.Response) => {
	const task = await TaskModel.findByIdAndDelete(req.params.id);

	if (!task) {
		return res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
	if (task && req.user._id !== task.userId) {
		return res.status(403).json({
			message: "Vous n'avez pas le droit de modifier cette tâche",
		});
	}

	if (task) {
		await task.deleteOne();
		res.status(200).json('Tâche supprimée ' + req.params.id);
	}
};
