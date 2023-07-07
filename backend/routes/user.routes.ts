import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
import {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getUser,
	forgotPassword,
} from '../controllers/user.controller';
import {
	validate,
	validateUserID,
} from '../middlewares/validation.middlewares';
import { loginSchema, registerSchema } from '../models/validation.model';
import { apiRegisterAndLoginLimiter } from '../middlewares/rateLimiter.middlewares';

const router = express.Router();

// Route to register a new user
router.post(
	'/register',
	apiRegisterAndLoginLimiter,
	validate(registerSchema, 'body'),
	registerUser
);

// Route to log in a user
router.post(
	'/login',
	apiRegisterAndLoginLimiter,
	validate(loginSchema, 'body'),
	loginUser
);

// Route to get a user's account information by their id
router.get('/:id/account', validateUserID, auth, getUser);

// Route to update a user's information by their id
router.put('/:id/update', validateUserID, auth, updateUser);

// Route to delete a user's account by their id
router.delete('/:id/delete', validateUserID, auth, deleteUser);

// Route to reset password with email adress
router.post('/forgot-password', forgotPassword);

export default router;
