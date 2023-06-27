import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
const router = express.Router();

import {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getUser,
} from '../controllers/user.controller';
import { validateUserID } from '../middlewares/validation.middlewares';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id/account', validateUserID, auth, getUser);
router.put('/:id/update', validateUserID, auth, updateUser);
router.delete('/:id/delete', validateUserID, auth, deleteUser);

export default router;
