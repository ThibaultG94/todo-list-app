import { Request, Response, NextFunction } from 'express';

export const validateUserID = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.params.userID;
	if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
		return res.status(400).send('Invalid user ID');
	}
	next();
};

export const validatePageAndLimit = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { page, limit } = req.query;
	if (page && (!Number.isInteger(+page) || +page <= 0)) {
		return res.status(400).send('Invalid page number');
	}

	if (limit && (!Number.isInteger(+limit) || +limit <= 0)) {
		return res.status(400).send('Invalit limit number');
	}

	next();
};
