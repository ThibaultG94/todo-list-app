import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		date: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

// module.exports = mongoose.model('task', taskSchema);
export default mongoose.model('task', taskSchema);
