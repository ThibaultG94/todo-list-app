const chai = require('chai');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
require('dotenv').config({ path: '.env.test' });

const { expect } = chai;

describe('User Model', () => {
	describe('generateAuthToken', () => {
		it('should generate a valid JWT for a user', async () => {
			// Créer un nouvel utilisateur
			const user = new UserModel({
				username: 'testuser',
				email: 'test@example.com',
				password: 'password123',
				role: 'user',
			});

			// Générer un token pour cet utilisateur
			const token = user.generateAuthToken();

			// Vérifier le token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// S'assurer que le token contient les informations correctes

			expect(decoded).to.have.property('_id', user._id.toString());
			expect(decoded).to.have.property('username', user.username);
			expect(decoded).to.have.property('email', user.email);
			expect(decoded).to.have.property('role', user.role);
		});
	});
});
