import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
import {
	createWorkspace,
	getUserWorkspaces,
	getWorkspace,
} from '../controllers/workspace.controller';

const router = express.Router();

// Route to create a new workspace
router.post('/', auth, createWorkspace);

// Route to get a workspace by its id
router.get('/:id', auth, getWorkspace);

// Route to get all workspaces for a specific user
router.get('/user/:id', auth, getUserWorkspaces);

// Route to update a workspace by its id
router.put('/:id', auth);

// Route to delete a workspace by its id
router.delete('/:id', auth);

export default router;
