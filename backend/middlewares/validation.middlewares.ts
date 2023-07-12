import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema, property: 'body' | 'params') => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req[property]);
		const valid = error == null;

		if (valid) {
			next();
		} else {
			const { details } = error;
			const message = details.map((i) => i.message).join(',');

			console.log('error', message);
			res.status(422).json({ error: message });
		}
	};
};

// Middleware to validate user ID
export const validateUserID = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get user ID from request params
	const userId = req.params.id;

	// Check if user ID is a valid Mongo ObectID
	if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
		return res.status(400).send({ error: 'Invalid user ID' });
	} else {
		next();
	}
};

// Middleware to validate pagination parameters
export const validatePageAndLimit = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get page and limit from request query
	const { page, limit } = req.query;

	// Check if page number is a positive integer
	if (page && (!Number.isInteger(+page) || +page <= 0)) {
		return res.status(400).send({ error: 'Invalid page number' });
	}

	// Check if limit number is a positive integer
	if (limit && (!Number.isInteger(+limit) || +limit <= 0)) {
		return res.status(400).send({ error: 'Invalit limit number' });
	}

	next();
};

// Middleware to validate invitation ID
export const validateInvitationId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get invitation ID from request params
	const invitationId = req.params.invitationId;

	// Check if invitation ID is a valid Mongo ObjectID
	if (!/^[0-9a-fA-F]{24}$/.test(invitationId)) {
		return res.status(400).send({ error: 'Invalid invitation ID' });
	} else {
		next();
	}
};
