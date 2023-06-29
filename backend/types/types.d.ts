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

export interface RequestWithUser extends Request {
	user: {
		_id: string;
	};
}
