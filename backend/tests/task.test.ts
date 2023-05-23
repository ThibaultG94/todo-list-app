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

after(async function () {
	await setupDataBase();
});
