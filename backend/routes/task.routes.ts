import express from 'express';
import {
	setTasks,
	getTasks,
	editTask,
	deleteTask,
} from '../controllers/task.controller';
const router = express.Router();
import { auth } from '../middlewares/auth.middlewares';

router.post('/', auth, setTasks);
router.get('/:id', auth, getTasks);
router.put('/:id', auth, editTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
