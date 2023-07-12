import mongoose from 'mongoose';

// Defines the Task schema for MongoDB
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
		workspace: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Workspace',
			required: true,
		},
	},
	// Add creation and update timestamps to each document
	{ timestamps: true }
);

// Indexing userId for  query efficiency
taskSchema.index({ userId: 1 });

export default mongoose.model('task', taskSchema);
