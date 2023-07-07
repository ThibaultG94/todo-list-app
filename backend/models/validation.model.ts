import Joi from 'joi';

export const registerSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
	role: Joi.string().valid('user', 'admin', 'superadmin').required(),
});
