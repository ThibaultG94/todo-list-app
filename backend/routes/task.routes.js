const express = require('express');
const {
	setTasks,
	getTasks,
	editTask,
	deleteTask,
} = require('../controllers/task.controller');
const router = express.Router();
const auth = require('../middlewares/auth.middlewares');

router.post('/', auth, setTasks);
router.get('/', auth, getTasks);
router.put('/:id', auth, editTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
