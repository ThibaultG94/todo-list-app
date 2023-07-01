import { Request } from 'express';
import { Document } from 'mongoose';

export interface Task extends Document {
	title: string;
	userId: string;
	date: number;
	description?: string;
	status: string;
	estimatedTime?: number;
	comments?: string;
	priority?: string;
}

interface UserBase {
	[key: string]: any;
	username: string;
	email: string;
	password: string;
	role: string;
}

export interface User extends UserBase, Document {
	comparePasswords(candidatePassword: string): Promise<boolean>;
	generateAuthToken(): string;
}

export interface UserDocument extends UserBase, mongoose.Document {
	comparePasswords(candidatePassword: string): Promise<boolean>;
	generateAuthToken(): string;
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			_id: string;
			role: string;
		};
	}
}
