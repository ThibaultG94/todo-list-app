import { Request, Response, NextFunction } from 'express';

export const validateUserID = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = await req.params.id;
	await console.log(userId);
	if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
		return res.status(400).send({ error: 'Invalid user ID' });
	} else {
		next();
	}
};

export const validatePageAndLimit = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { page, limit } = await req.query;
	await console.log(req.query);
	if (page && (!Number.isInteger(+page) || +page <= 0)) {
		return res.status(400).send({ error: 'Invalid page number' });
	}

	if (limit && (!Number.isInteger(+limit) || +limit <= 0)) {
		return res.status(400).send({ error: 'Invalit limit number' });
	}

	next();
};
