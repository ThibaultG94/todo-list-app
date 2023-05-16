const mongoose = require('mongoose');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userOne = {
	username: 'testuser',
	email: 'test@example.com',
	password: 'Mypassword77',
};

const userTwo = {
	username: 'testusertwo',
	email: 'testtwo@example.com',
	password: 'Mysecondpassword88',
};

const adminOne = {
	username: 'testadmin',
	email: 'testadmin@example.com',
	password: 'azertyuiop',
	role: 'admin',
};

const setupDataBase = async () => {
	await User.deleteMany(); // supprime tous les utilisateurs de la base de données
};

module.exports = { userOne, userTwo, adminOne, setupDataBase };
