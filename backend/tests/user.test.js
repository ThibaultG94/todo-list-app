const request = require('supertest');
const app = require('../server'); // Application Express
const User = require('../models/user.model'); // Modèle d'utilisateur
const { userOne, setupDataBase } = require('./testUtils');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
let userOneId;
let token;

before(async function () {
	this.timeout(2000);
	await setupDataBase();
});

describe('User Registration', () => {
	it('Should register a new user', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(userOne)
			.expect(201);

		await console.log(response.body);
	});

	it('Should not register a user with an email that is already in use', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(userOne)
			.expect(400);
		await console.log(response.body);
	});
});

describe('User Login', () => {
	it('Should login existing user', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: userOne.email,
				password: userOne.password,
			})
			.expect(200);
		token = response.body.token;
		userOneId = response.body.id;
		console.log(response.body);
	});

	it('Should not login non-existing user', async () => {
		await request(app)
			.post('/users/login')
			.send({
				email: 'nonexistinguser@example.com',
				password: 'nonexistingpass',
			})
			.expect(404);
	});
});

describe('User update', () => {
	it("Should update user's data", async () => {
		const response = await request(app)
			.put(`/users/${userOneId}/update`)
			.set('Authorization', `Bearer ${token}`)
			.send({ username: 'newUserName', email: 'newmail@test.com' })
			.expect(200);
		console.log(response.body);
	});
});

after(async () => {
	await setupDataBase();
});
