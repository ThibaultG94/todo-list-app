import { Request } from 'express';
import { Document } from 'mongoose';

export interface Task extends Document {
	// [key: string]: any;
	title: string;
	userId: string;
	date: number;
	description?: string;
	status: string;
	estimatedTime?: number;
	comments?: string;
	priority?: string;
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			_id: string;
		};
	}
}
