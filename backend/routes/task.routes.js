const express = require('express');
const {
	setTasks,
	getTasks,
	editTask,
	deleteTask,
} = require('../controllers/task.controller');
const router = express.Router();

router.get('/', getTasks);
router.post('/', setTasks);
router.put('/:id', editTask);
router.delete('/:id', deleteTask);

module.exports = router;
