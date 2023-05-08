const express = require('express');
const {
	setTasks,
	getTasks,
	editTask,
	deleteTask,
} = require('../controllers/task.controller');
const router = express.Router();

router.post('/', setTasks);
router.get('/', getTasks);
router.put('/:id', editTask);
router.delete('/:id', deleteTask);

module.exports = router;
