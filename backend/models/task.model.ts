import mongoose from 'mongoose';
import { registerUser } from '../controllers/user.controller';

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		date: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			enum: ['Pending', 'In Progress', 'Completed', 'Archived'],
			default: 'Pending',
		},
		estimatedTime: {
			type: Number,
			required: false,
		},
		comments: {
			type: String,
			required: false,
		},
		priority: {
			type: 'String',
			required: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('task', taskSchema);
