const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middlewares');

const {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getUser,
} = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id/account', auth, getUser);
router.put('/:id/update', auth, updateUser);
router.delete('/:id/delete', auth, deleteUser);

module.exports = router;
