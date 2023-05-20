// import chai from 'chai';
import * as chai1 from 'chai';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
require('dotenv').config({ path: '.env.test' });

const expect = chai1.expect;

describe('User Model', () => {
	describe('generateAuthToken', () => {
		it('should generate a valid JWT for a user', async () => {
			// Créer un nouvel utilisateur
			const user: any = new UserModel({
				username: 'testuser',
				email: 'test@example.com',
				password: 'Mypassword77',
				role: 'admin',
			});

			// Générer un token pour cet utilisateur
			const token = user.generateAuthToken();

			// Vérifier le token
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

			// S'assurer que le token contient les informations correctes

			// expect(decoded).to.have.property('_id', user._id.toString());
			// expect(decoded).to.have.property('username', user.username);
			// expect(decoded).to.have.property('email', user.email);
			// expect(decoded).to.have.property('role', user.role);
		});
	});
});
