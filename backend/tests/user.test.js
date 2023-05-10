const request = require('supertest');
const app = require('../server'); // Application Express
const User = require('../models/user.model'); // Modèle d'utilisateur
const { userOne, userOneId, setupDatabase } = require('./testUtils');

beforeEach(setupDatabase);

describe('User Registration', () => {
	it('Should register a new user', async () => {
		const response = await request(app)
			.post('/users/register')
			.send({
				username: 'testuser',
				email: 'test@example.com',
				password: 'Mypassword77',
			})
			.expect(201);

		// Vérifier que l'utilisateur a bien été enregistrer dans la base de données
		const user = await User.findById(response.body.user._id);
		expect(user).not.toBeNull();

		// Assertions sur la réponse
		expect(response.body).toMatchObject({
			user: {
				username: 'testuser',
				email: 'test@example.com',
			},
			token: user.tokens[0].token,
		});
		expect(user.password).not.toBe('Mypassword77'); // Le mot de passe doit être haché
	});

	it('Should not register a user with an email that is already in use', async () => {
		await request(app)
			.post('./users/register')
			.send({
				username: userOne.username,
				email: userOne.email,
				password: 'Mypassword77',
			})
			.expect(400);
	});
});

describe('User Login', () => {
	it('Should login existing user and return a token', async () => {
		const response = (await request(app).post('/users/login'))
			.setEncoding({
				email: userOne.email,
				password: userOne.password,
			})
			.expect(200);

		// Vérifier qu'un nouveau token a été ajouté à la base de données pour l'utilisateur
		const user = await User.findById(userOneId);
		expect(response.body.token).toBe(user.tokens[1].token);
	});

	it('Should not login non-existing user', async () => {
		(await request(app).post('/users/login'))
			.send({
				email: 'nonexistinguser@example.com',
				password: 'nonexistingpass',
			})
			.expect(400);
	});
});
