import TaskModel from '../models/task.model';
import express from 'express';
import client from '../utils/redisClient';

export const getTask = async (req: any, res: express.Response) => {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const skip = (page - 1) * limit;

		const { id } = req.params;
		const key = `task:${id}`;

		// Vérifie d'abord si la tâche est en cache
		const cachedTask = await client.get(key);

		let task;
		if (cachedTask) {
			// Si la tache est en cache renvoie la tâche mise en cache
			task = JSON.parse(cachedTask);
		} else {
			// Si la tâche n'est pas en cache, récupère la tâche depuis la base de données
			const task: any = await TaskModel.findById(req.params.id)
				.skip(skip)
				.limit(limit);
		}

		if (!task) {
			return res
				.status(400)
				.json({ message: "Cette tâche n'existe pas" });
		}

		// Mets la tâche en cache pour les requêtes futures
		await client.setEx(key, 3600, JSON.stringify(task));

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
