import express from 'express';
import {
	setTasks,
	getTask,
	getUserTasks,
	editTask,
	deleteTask,
} from '../controllers/task.controller';
const router = express.Router();
import { auth } from '../middlewares/auth.middlewares';
import {
	validateUserID,
	validatePageAndLimit,
} from '../middlewares/validation.middlewares';
import { app } from '../server';

router.post('/', auth, setTasks);
router.get('/:id', auth, getTask);
router.get(
	'/user/:id',
	validateUserID,
	validatePageAndLimit,
	auth,
	getUserTasks
);
router.put('/:id', auth, editTask);
router.delete('/:id', auth, deleteTask);

export default router;
