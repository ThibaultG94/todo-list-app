import express from 'express';
import { auth } from '../middlewares/auth.middlewares';

const router = express.Router();

// Route to create a new workspace
router.post('/', auth);

// Route to get a workspace by its id
router.get('/:id', auth);

// Route to get all workspaces for a specific user
router.get('/user/:id', auth);

// Route to update a workspace by its id
router.put('/:id', auth);

// Route to delete a workspace by its id
router.delete('/:id', auth);

export default router;
