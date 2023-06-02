import mongoose from 'mongoose';
import { registerUser } from '../controllers/user.controller';
import * as yup from 'yup';

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

export const taskValidationSchema = yup.object().shape({
	title: yup.string().required(),
	userId: yup.string().required(),
	date: yup.number().required(),
	description: yup.string(),
	status: yup
		.string()
		.oneOf(['Pending', 'In Progress', 'Completed', 'Archived']),
	estimedTime: yup.number(),
	comments: yup.string(),
	priority: yup.string(),
});

taskSchema.index({ userId: 1 });

export default mongoose.model('task', taskSchema);
