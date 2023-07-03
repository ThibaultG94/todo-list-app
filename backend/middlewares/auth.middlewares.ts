import jwt from 'jsonwebtoken';
import express from 'express';
import { UserPayload } from '../types/types';

// Middleware for checking if a user is authentificated
export const auth = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	// Retrieve the token from an Authorization header
	const token = req.header('Authorization')?.replace('Bearer ', '');

	// If no token is provided, return an error
	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access denied. No token provided.' });
	}

	try {
		// Verify the token using the secret key
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as UserPayload;

		// Assign the decoded payload to req.user, available for subsequent middleware or route handlers
		req.user = decoded;

		// Proceed to the next middleware or route handler
		next();
	} catch (err) {
		// If the token is invalid, return an error
		const result = (err as Error).message;
		res.status(400).json({ message: 'Token invalide.', result });
	}
};
