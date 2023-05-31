import request from 'supertest';
import { app } from '../server';
import mongoose, { ConnectOptions } from 'mongoose';
import * as chai3 from 'chai';
const expect = chai3.expect;
import {
	setupDataBase,
	userFour,
	userFive,
	adminFour,
	adminFive,
	superAdminTwo,
} from './testUtils';
let userFourId: number = 0,
	userFiveId: number = 0,
	adminFourId: number = 0,
	adminFiveId: number = 0,
	superAdminTwoId: number = 0;
let userFourToken: string = '',
	userFiveToken: string = '',
	adminFourToken: string = '',
	adminFiveToken: string = '',
	superAdminTwoToken: string = '';

let firstTaskId: number = 0,
	firstAdminTaskId: number = 0,
	firstSuperAdminTaskId: number = 0;

before(async function () {
	this.timeout(10000);
	await setupDataBase();
});

describe('User Registration', () => {
	it('Should register userFour', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(userFour)
			.expect(201);

		await console.log(response.body);
	});
	it('Should register userFive', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(userFive)
			.expect(201);
	});
	it('Should register adminFour', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(adminFour)
			.expect(201);
	});
	it('Should register adminFive', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(adminFive)
			.expect(201);
	});
	it('Should register superadmin', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(superAdminTwo)
			.expect(201);
	});
});

describe('Users login', () => {
	it('Should login existing userFour', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: userFour.email,
				password: userFour.password,
			})
			.expect(200);
		userFourToken = await response.body.token;
		userFourId = await response.body.user.id;
		console.log(response.body);
	});

	it('Should login existing userFive', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: userFive.email,
				password: userFive.password,
			})
			.expect(200);
		userFiveToken = await response.body.token;
		userFiveId = await response.body.user.id;
		console.log(response.body);
	});

	it('Should login existing adminFour', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: adminFour.email,
				password: adminFour.password,
			})
			.expect(200);
		adminFourToken = await response.body.token;
		adminFourId = await response.body.user.id;
		console.log(response.body);
	});

	it('Should login existing adminFive', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: adminFive.email,
				password: adminFive.password,
			})
			.expect(200);
		adminFiveToken = await response.body.token;
		adminFiveId = await response.body.user.id;
		console.log(response.body);
	});

	it('Should login existing superAdminTwo', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: superAdminTwo.email,
				password: superAdminTwo.password,
			})
			.expect(200);
		superAdminTwoToken = await response.body.token;
		superAdminTwoId = await response.body.user.id;
		console.log(response.body);
	});
});

describe('Tasks creations', () => {
	it("Shouldn't register a first task by userFour without token", async () => {
		const response = await request(app)
			.post('/task/')
			.send({
				title: 'Second Task',
				userId: userFourId,
				date: Date.now(),
				description: 'This is the second task',
			})
			.expect(401);
	});

	it('Should create a task from userFour', async () => {
		const response = await request(app)
			.post('/task/')
			.set('Authorization', `Bearer ${userFourToken}`)
			.send({
				title: 'First Task',
				userId: userFourId,
				date: Date.now(),
				description: 'This is the first task',
			})
			.expect(200);

		await console.log(response.body);
		firstTaskId = response.body._id;
	});

	it('Should create a task from an admin', async () => {
		const response = await request(app)
			.post('/task/')
			.set('Authorization', `Bearer ${adminFourToken}`)
			.send({
				title: 'First task admin',
				userId: adminFourId,
				date: Date.now(),
				description: 'This is the first admin task',
			})
			.expect(200);

		firstAdminTaskId = response.body._id;
	});

	it('Should create a task from the superadmin', async () => {
		const response = await request(app)
			.post('/task/')
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.send({
				title: 'First SuperAdmin Task',
				userId: superAdminTwoId,
				date: Date.now(),
				description: 'This is the first superadmin task',
			})
			.expect(200);

		firstSuperAdminTaskId = response.body._id;
	});
});

describe('Get Tasks', () => {
	it('Should userFour gets his own tasks', async () => {
		const response = await request(app)
			.get(`/task/${firstTaskId}/`)
			.set('Authorization', `Bearer ${userFourToken}`)
			.expect(200);
	});

	it("Shouldn't userFive gets userFour's task", async () => {
		const response = await request(app)
			.get(`/task/${firstTaskId}`)
			.set('Authorization', `Bearer ${userFiveToken}`)
			.expect(403);
	});

	it("Shouldn't get task without token", async () => {
		const response = await request(app)
			.get(`/task/${firstTaskId}`)
			.expect(401);
	});

	it('Admin should not get user task', async () => {
		const response = await request(app)
			.get(`/task/${firstTaskId}`)
			.set('Authorization', `Bearer ${adminFourToken}`)
			.expect(403);
	});

	it('Superadmin should not get user task', async () => {
		const response = await request(app)
			.get(`/task/${firstTaskId}`)
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.expect(403);
	});

	it("Shouldn't user get admin's task", async () => {
		const response = await request(app)
			.get(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${userFiveToken}`)
			.expect(403);
	});

	it("Shouldn't admin get an other admin's task", async () => {
		const response = await request(app)
			.get(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${adminFiveToken}`)
			.expect(403);
	});

	it("Shouldn't superadmin get an admin's task", async () => {
		const response = await request(app)
			.get(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.expect(403);
	});

	it('Should admin gets his own task', async () => {
		const response = await request(app)
			.get(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${adminFourToken}`)
			.expect(200);
	});

	it("Shouldn't user get superadmin's task", async () => {
		const response = await request(app)
			.get(`/task/${firstSuperAdminTaskId}`)
			.set('Authorization', `Bearer ${userFiveToken}`)
			.expect(403);
	});

	it("Shouldn't admin get superadmin's task", async () => {
		const response = await request(app)
			.get(`/task/${firstSuperAdminTaskId}`)
			.set('Authorization', `Bearer ${adminFiveToken}`)
			.expect(403);
	});

	it('Should superadmin get his own task', async () => {
		const response = await request(app)
			.get(`/task/${firstSuperAdminTaskId}`)
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.expect(200);

		console.log(response.body);
	});
});

describe('Update Task', async () => {
	it('Should user update his own task', async () => {
		const response = await request(app)
			.put(`/task/${firstTaskId}/`)
			.set('Authorization', `Bearer ${userFourToken}`)
			.send({
				title: 'New First Task Title',
				userId: userFourId,
				date: Date.now(),
				description:
					"This is the new description of the first task's user",
				status: 'In Progress',
			})
			.expect(200);

		await console.log(response.body);
	});

	it("Shouldn't user update an other user's task", async () => {
		const response = await request(app)
			.put(`/task/${firstTaskId}`)
			.set('Authorization', `Bearer ${userFiveToken}`)
			.send({
				title: 'Title hacked by an other user',
				userId: userFiveId,
			})
			.expect(403);
	});

	it("Shouldn't admin update an other user's task", async () => {
		const response = await request(app)
			.put(`/task/${firstTaskId}`)
			.set('Authorization', `Bearer ${adminFourToken}`)
			.send({
				title: 'Title hacked by an admin',
				userId: adminFourId,
			})
			.expect(403);
	});

	it("Shouldn't superadmin update an other user's task", async () => {
		const response = await request(app)
			.put(`/task/${firstTaskId}`)
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.send({
				title: 'Title hacked by the superadmin',
				userId: superAdminTwoId,
			})
			.expect(403);
	});

	it('Should admin update his own task', async () => {
		const response = await request(app)
			.put(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${adminFourToken}`)
			.send({
				title: 'The new title of the first Admin task',
				userId: adminFourId,
				status: 'Completed',
			})
			.expect(200);
	});

	it("Shouldn't user update admin's task", async () => {
		const response = await request(app)
			.put(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${userFourToken}`)
			.send({
				title: 'task hacked by a user',
				userId: userFourId,
			})
			.expect(403);
	});

	it("Shouldn't admin update other admin's task", async () => {
		const response = await request(app)
			.put(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${adminFiveToken}`)
			.send({
				title: 'task hacked by an other admin',
				userId: adminFiveId,
			})
			.expect(403);
	});

	it("Shouldn't superadmin update admin's task", async () => {
		const response = await request(app)
			.put(`/task/${firstAdminTaskId}`)
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.send({
				title: 'task hacked by the superadmin',
				userId: superAdminTwoId,
			})
			.expect(403);
	});

	it("Shouldn't user update superadmin's task", async () => {
		const response = await request(app)
			.put(`/task/${firstSuperAdminTaskId}`)
			.set('Authorization', `Bearer ${userFiveToken}`)
			.send({
				title: 'task hacked by a random user',
				userId: userFiveId,
			})
			.expect(403);
	});

	it("Shouldn't admin update superadmin's task", async () => {
		const response = await request(app)
			.put(`/task/${firstSuperAdminTaskId}`)
			.set('Authorization', `Bearer ${adminFiveToken}`)
			.send({
				title: 'task hacked by an admin',
				userId: adminFiveId,
			})
			.expect(403);
	});

	it('Should superadmin update his own task', async () => {
		const response = await request(app)
			.put(`/task/${firstSuperAdminTaskId}`)
			.set('Authorization', `Bearer ${superAdminTwoToken}`)
			.send({
				title: 'The new title of the first SuperAdmin task',
				userId: superAdminTwoId,
				status: 'Archived',
			})
			.expect(200);

		await console.log(response.body);
	});
});

after(async function () {
	await setupDataBase();
});
