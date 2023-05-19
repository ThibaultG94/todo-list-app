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

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id/account', auth, getUser);
router.put('/:id/update', auth, updateUser);
router.delete('/:id/delete', auth, deleteUser);

module.exports = router;
