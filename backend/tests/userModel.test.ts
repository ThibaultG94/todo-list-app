import * as chai1 from 'chai';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
require('dotenv').config({ path: '.env.test' });

// Use chai's expect function for assertions
const expect = chai1.expect;

// Test suite for User model
describe('User Model', () => {
	// Test case for generateAuthToken function
	describe('generateAuthToken', () => {
		it('should generate a valid JWT for a user', async () => {
			// Create a new user
			const user: any = new UserModel({
				username: 'testuser',
				email: 'test@example.com',
				password: 'Mypassword77',
				role: 'admin',
			});

			// Generate a token for the user
			const token = user.generateAuthToken();

			// Decode the token
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

			// Check that the decoded token contains correct information
			expect(decoded).to.have.property('_id', user._id.toString());
			expect(decoded).to.have.property('username', user.username);
			expect(decoded).to.have.property('email', user.email);
			expect(decoded).to.have.property('role', user.role);
		});
	});
});
