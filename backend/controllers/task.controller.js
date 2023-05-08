const TaskModel = require('../models/task.model');

module.exports.getTasks = async (req, res) => {
	const task = await TaskModel.find();
	res.status(200).json(task);
};

module.exports.setTasks = async (req, res) => {
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

module.exports.editTask = async (req, res) => {
	const task = await TaskModel.findById(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}
};

module.exports.deleteTask = async (req, res) => {
	const task = await TaskModel.findById(req.params.id);

	if (!task) {
		res.status(400).json({ message: "Cette tâche n'existe pas" });
	}

	await task.remove();
	res.status(200).json('Tâche supprimée ' + req.params.id);
};
