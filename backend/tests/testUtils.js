const mongoose = require('mongoose');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	username: 'testuser',
	email: 'test@example.com',
	password: 'Mypassword77',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
		},
	],
};

const setupDataBase = async () => {
	await User.deleteMany(); // supprime tous les utilisateurs de la base de données
	await new User(userOne).save();
};

module.exports(userOneId, userOne, setupDataBase);
