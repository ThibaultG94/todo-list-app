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
	});
});
