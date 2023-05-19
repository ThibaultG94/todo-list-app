import mongoose, { ConnectOptions } from 'mongoose';
const User = require('../models/user.model');
// const jwt = require('jsonwebtoken');

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

const userThree = {
	username: 'testuserthree',
	email: 'testthree@example.com',
	password: 'Mythirdpassword99',
};

const adminOne = {
	username: 'testadmin',
	email: 'testadmin@example.com',
	password: 'azertyuiop',
	role: 'admin',
};

const adminTwo = {
	username: 'testadmintwo',
	email: 'testadmintwo@example.com',
	password: 'wxcvbn',
	role: 'admin',
};

const adminThree = {
	username: 'testadminthree',
	email: 'testadminthree@example.com',
	password: 'qsdfghjklm',
	role: 'admin',
};

const superAdmin = {
	username: 'superAdmin',
	email: 'superadmin@example.com',
	password: 'therealsuperadminpassword',
	role: 'superadmin',
};

const setupDataBase = async () => {
	await User.deleteMany(); // supprime tous les utilisateurs de la base de données
};

module.exports = {
	userOne,
	userTwo,
	userThree,
	adminOne,
	adminTwo,
	adminThree,
	superAdmin,
	setupDataBase,
};
