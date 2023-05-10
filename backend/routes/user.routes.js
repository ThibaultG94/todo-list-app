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
router.get('/my-account', auth, getUser);
router.put('/update', auth, updateUser);
router.delete('/delete', auth, deleteUser);

module.exports = router;
