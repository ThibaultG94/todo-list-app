const mongoose = require('mongoose');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userOne = {
	username: 'testuser',
	email: 'test@example.com',
	password: 'Mypassword77',
	// tokens: [
	// 	{
	// 		token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
	// 	},
	// ],
};

const userTwo = {
	username: 'testusertwo',
	email: 'testtwo@example.com',
	password: 'Mysecondpassword88',
	// tokens: [
	// 	{
	// 		token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
	// 	},
	// ],
};

const setupDataBase = async () => {
	await User.deleteMany(); // supprime tous les utilisateurs de la base de données
};

module.exports = { userOne, userTwo, setupDataBase };
