import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
import {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getUser,
} from '../controllers/user.controller';
import {
	validate,
	validateUserID,
} from '../middlewares/validation.middlewares';
import { loginSchema, registerSchema } from '../models/validation.model';

const router = express.Router();

// Route to register a new user
router.post('/register', validate(registerSchema, 'body'), registerUser);

// Route to log in a user
router.post('/login', validate(loginSchema, 'body'), loginUser);

// Route to get a user's account information by their id
router.get('/:id/account', validateUserID, auth, getUser);

// Route to update a user's information by their id
router.put('/:id/update', validateUserID, auth, updateUser);

// Route to delete a user's account by their id
router.delete('/:id/delete', validateUserID, auth, deleteUser);

export default router;
