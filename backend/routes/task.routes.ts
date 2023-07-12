import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
import {
	setTasks,
	getTask,
	getWorkspaceTasks,
	editTask,
	deleteTask,
} from '../controllers/task.controller';
import {
	validateUserID,
	validatePageAndLimit,
} from '../middlewares/validation.middlewares';

const router = express.Router();

// Route to create a new task
router.post('/', auth, setTasks);

// Route to get a task by its id
router.get('/:id', auth, getTask);

// Route to get all tasks for a specific user
router.get(
	'/user/:id',
	validateUserID,
	validatePageAndLimit,
	auth,
	getWorkspaceTasks
);

// Route to update a task by its id
router.put('/:id', auth, editTask);

// Route to delete a task by its id
router.delete('/:id', auth, deleteTask);

export default router;
