import jwt from 'jsonwebtoken';
import express from 'express';

export const auth = (req: any, res: express.Response, next: any) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return res
			.status(401)
			.json({ message: 'Accès refusé. Aucun token fourni.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		req.user = decoded;
		next();
	} catch (err) {
		const result = (err as Error).message;
		res.status(400).json({ message: 'Token invalide.', result });
	}
};
