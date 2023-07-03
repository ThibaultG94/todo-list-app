import { Request, Response, NextFunction } from 'express';

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
