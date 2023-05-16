const request = require('supertest');
const app = require('../server'); // Application Express
const User = require('../models/user.model'); // Modèle d'utilisateur
const { userOne, userTwo, adminOne, setupDataBase } = require('./testUtils');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
let userOneId;
let userTwoId;
let adminOneId;
let userOneToken;
let userTwoToken;
let adminOneToken;

before(async function () {
	this.timeout(10000);
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

	it('Should register a second new user', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(userTwo)
			.expect(201);
	});

	it('Should not register a user with an email that is already in use', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(userOne)
			.expect(400);
		await console.log(response.body);
	});
});

describe('Admin Registration', () => {
	it('Should register an admin user', async () => {
		const response = await request(app)
			.post('/users/register')
			.send(adminOne)
			.expect(201);
	});
});

describe('User Login', () => {
	it('Should login existing userOne', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: userOne.email,
				password: userOne.password,
			})
			.expect(200);
		userOneToken = await response.body.token;
		userOneId = await response.body.user.id;
		console.log(response.body);
	});

	it('Should login existing userTwo', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: userTwo.email,
				password: userTwo.password,
			})
			.expect(200);
		userTwoToken = await response.body.token;
		userTwoId = await response.body.user.id;
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

describe('Admin login', async () => {
	it('Should login admin user', async () => {
		const response = await request(app)
			.post('/users/login')
			.send({
				email: adminOne.email,
				password: adminOne.password,
			})
			.expect(200);
		adminOneId = await response.body.user.id;
		adminOneToken = await response.body.token;
		await console.log(response.body);
	});
});

describe('User update', () => {
	it("Should update user's data", async () => {
		const response = await request(app)
			.put(`/users/${userOneId}/update`)
			.set('Authorization', `Bearer ${userOneToken}`)
			.send({ username: 'newUserName', email: 'newmail@test.com' })
			.expect(200);
		console.log(response.body);
	});

	it("Should not update user's data without token", async () => {
		const response = await request(app)
			.put(`/users/${userOneId}/update`)
			.send({ username: 'newUserName', email: 'newmail@test.com' })
			.expect(401);
		console.log(response.body);
	});

	it("Should not update user's data from an other user", async () => {
		const response = await request(app)
			.put(`/users/${userOneId}/update`)
			.set('Authorization', `Bearer ${userTwoToken}`)
			.send({ password: 'accounthacked' })
			.expect(403);

		console.log(response.body);
	});

	it("Should update user's data from an admin", async () => {
		const response = await request(app)
			.put(`/users/${userOneId}/update`)
			.set('Authorization', `Bearer ${adminOneToken}`)
			.send({ password: 'adminchangethepassword' })
			.expect(200);
		await console.log(response.body);
	});

	it("Should not update admin's data from a user", async () => {
		const response = await request(app)
			.put(`/users/${adminOneId}/update`)
			.set('Authorization', `Bearer ${userTwoToken}`)
			.send({ password: 'userhackedanadmin' })
			.expect(403);
	});

	it("Should update admin's account from himself", async () => {
		const response = await request(app)
			.put(`/users/${adminOneId}/update`)
			.set('Authorization', `Bearer ${adminOneToken}`)
			.send({ password: 'wxcvbn' })
			.expect(200);
	});
});

describe('User get data', () => {
	it("Should get user's data", async () => {
		const response = await request(app)
			.get(`/users/${userOneId}/account`)
			.set('Authorization', `Bearer ${userOneToken}`)
			.expect(200);

		console.log(response.body);
	});

	it("Should not get user's data without token", async () => {
		const response = await request(app)
			.get(`/users/${userOneId}/account`)
			.expect(401);
	});

	it("Should not get user's data from an other user", async () => {
		const response = await request(app)
			.get(`/users/${userTwoId}/account`)
			.set('Authorization', `Bearer ${userOneToken}`)
			.expect(403);
	});

	it("Should get user's data from an admin", async () => {
		const response = await request(app)
			.get(`/users/${userOneId}/account`)
			.set('Authorization', `Bearer ${adminOneToken}`)
			.expect(200);
	});

	it("Should not get admin's data from a user", async () => {
		const response = await request(app)
			.get(`/users/${adminOneId}/account`)
			.set('Authorization', `Bearer ${userTwoToken}`)
			.expect(403);
	});

	it("Should get admin's account from himself", async () => {
		const response = await request(app)
			.get(`/users/${adminOneId}/account`)
			.set('Authorization', `Bearer ${adminOneToken}`)
			.expect(200);
	});
});

describe('Users delete account', () => {
	it("Should not delete user's account without token", async () => {
		const response = await request(app)
			.delete(`/users/${userOneId}/delete`)
			.expect(401);
		await console.log(response.body);
	});

	it("Should not delete user's account from an other user", async () => {
		const response = await request(app)
			.delete(`/users/${userOneId}/delete`)
			.set('Authorization', `Bearer ${userTwoToken}`)
			.expect(403);
		console.log(response.body);
	});

	it("Should delete user's account", async () => {
		const response = await request(app)
			.delete(`/users/${userOneId}/delete`)
			.set('Authorization', `Bearer ${userOneToken}`)
			.expect(200);
	});

	it("Should not delete admin's account from a user", async () => {
		const response = await request(app)
			.delete(`/users/${adminOneId}/delete`)
			.set('Authorization', `Bearer ${userOneToken}`)
			.expect(403);
	});

	it('Should delete user account from an admin', async () => {
		const response = await request(app)
			.delete(`/users/${userTwoId}/delete`)
			.set('Authorization', `Bearer ${adminOneToken}`)
			.expect(200);
	});

	it("Should delete admin's account from himself", async () => {
		const response = await request(app)
			.delete(`/users/${adminOneId}/delete`)
			.set('Authorization', `Bearer ${adminOneToken}`)
			.expect(200);
	});
});

after(async () => {
	await setupDataBase();
});
