import TaskModel from '../models/task.model';
import express from 'express';
import client from '../utils/redisClient';
import userModel from '../models/user.model';

export const getTask = async (req: any, res: express.Response) => {
	try {
		const task: any = await TaskModel.findById(req.params.id);

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
	} catch (error) {
		const result = (error as Error).message;
		res.status(500).json({ message: 'Erreur interne du serveur', result });
	}
};

export const getUserTasks = async (req: any, res: express.Response) => {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const skip = (page - 1) * limit;
		const userId = req.params.id;
		const key = `task:${userId}`;

		// Vérifier que l'utilisateur est le même que celui qui a créer la tâche
		console.log(req.user._id, userId);
		if (req.user._id !== userId) {
			return res.status(403).json({
				message:
					'Vous ne disposez pas des droits suffisants pour effectuer cette action',
			});
		}

		// Vérifie d'abord si les tâches sont en cache
		const cachedTasks = await client.get(key);

		let tasks;
		if (cachedTasks) {
			// Si les tâches sont en cache, les utilisés
			tasks = JSON.parse(cachedTasks);
		} else {
			// Si les tâches ne sont pas en cache, récupère les tâches depuis la base de données
			tasks = await TaskModel.find({ userId }).skip(skip).limit(limit);

			// Mets les tâches en cache pour les requêtes futur
			await client.setEx(key, 3600, JSON.stringify(tasks));
		}

		res.status(200).json(tasks);
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Erreur interne du serveur', result });
	}
};

export const setTasks = async (req: any, res: express.Response) => {
	try {
		if (!req.body.title) {
			return res
				.status(400)
				.json({ message: "Merci d'ajouter une tâche" });
		}

		const userId = req.user._id;

		const userExists = await userModel.exists({ _id: userId });
		if (!userExists) {
			return res
				.status(404)
				.json({ message: "L'utilisateur spécifié n'existe pas" });
		}

		const task = await TaskModel.create({
			title: req.body.title,
			userId: req.body.userId,
			date: req.body.date,
			description: req.body.description,
		});
		res.status(200).json(task);
	} catch (error) {
		const result = (error as Error).message;
		return res
			.status(500)
			.json({ message: 'Erreur interne du serveur', result });
	}
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
	} catch (error) {
		const result = (error as Error).message;
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
