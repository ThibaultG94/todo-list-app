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

describe('Tasks creations', () => {});

after(async function () {
	await setupDataBase();
});
