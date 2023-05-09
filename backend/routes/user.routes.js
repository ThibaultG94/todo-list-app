const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middlewares');

const {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
} = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', auth, updateUser);
router.delete('/delete', auth, deleteUser);

module.exports = router;
