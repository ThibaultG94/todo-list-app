import mongoose, { ConnectOptions } from 'mongoose';
import User from '../models/user.model';

export const userOne = {
	username: 'testuser',
	email: 'test@example.com',
	password: 'Mypassword77',
};

export const userTwo = {
	username: 'testusertwo',
	email: 'testtwo@example.com',
	password: 'Mysecondpassword88',
};

export const userThree = {
	username: 'testuserthree',
	email: 'testthree@example.com',
	password: 'Mythirdpassword99',
};

export const adminOne = {
	username: 'testadmin',
	email: 'testadmin@example.com',
	password: 'azertyuiop',
	role: 'admin',
};

export const adminTwo = {
	username: 'testadmintwo',
	email: 'testadmintwo@example.com',
	password: 'wxcvbn',
	role: 'admin',
};

export const adminThree = {
	username: 'testadminthree',
	email: 'testadminthree@example.com',
	password: 'qsdfghjklm',
	role: 'admin',
};

export const superAdmin = {
	username: 'superAdmin',
	email: 'superadmin@example.com',
	password: 'therealsuperadminpassword',
	role: 'superadmin',
};

export const setupDataBase = async () => {
	await User.deleteMany(); // supprime tous les utilisateurs de la base de données
};
