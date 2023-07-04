import mongoose, { ConnectOptions } from 'mongoose';
import User from '../models/user.model';
import Task from '../models/task.model';

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

export const userFour = {
	username: 'testuserfour',
	email: 'testfour@example.com',
	password: 'MyFourthpassword99',
};

export const userFive = {
	username: 'testuserfive',
	email: 'testfive@example.com',
	password: 'MyFifthpassword99',
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

export const adminFour = {
	username: 'testadminfour',
	email: 'testadminfour@example.com',
	password: 'qsdfghjklm',
	role: 'admin',
};

export const adminFive = {
	username: 'testadminfive',
	email: 'testadminfive@example.com',
	password: 'qsdfghjklm',
	role: 'admin',
};

export const superAdmin = {
	username: 'superAdmin',
	email: 'superadmin@example.com',
	password: 'therealsuperadminpassword',
	role: 'superadmin',
};

export const superAdminTwo = {
	username: 'superAdminTwo',
	email: 'superadmintwo@example.com',
	password: 'therealsuperadminpassword',
	role: 'superadmin',
};

// Function for configuring the database in the test environment
export const setupDataBase = async () => {
	try {
		await User.deleteMany(); // Attempt to delete all User documents in the database
		await Task.deleteMany(); // Attempt to delete all Task documents in the database
	} catch (err) {
		const result = (err as Error).message;
		console.log(result);
	}
};
