const request = require('supertest');
const app = require('../server'); // Application Express
const User = require('../models/user.model'); // Modèle d'utilisateur
const { userOne, userOneId, setupDataBase } = require('./testUtils');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

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
	it('Should login existing user and return a token', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: userOne.email,
				password: userOne.password,
			})
			.expect(200);

		// Vérifier qu'un nouveau token a été ajouté à la base de données pour l'utilisateur
		const user = await User.findById(userOneId);
		expect(response.body.token).to.equal(user.tokens[1].token);
	});

	it('Should not login non-existing user', async () => {
		await request(app)
			.post('/users/login')
			.send({
				email: 'nonexistinguser@example.com',
				password: 'nonexistingpass',
			})
			.expect(400);
	});
});

after(async () => {
	await setupDataBase();
});
