import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		user: {
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
	},
	{ timestamps: true }
);

export default mongoose.model('task', taskSchema);
