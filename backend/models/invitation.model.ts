import mongoose from 'mongoose';

const workspaceInvitationSchema = new mongoose.Schema(
	{
		inviterId: { type: String, ref: 'User', required: true },
		inviteeId: { type: String, ref: 'User', required: true },
		workspaceId: { type: String, ref: 'Workspace', required: true },
		status: {
			type: String,
			enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
			default: 'PENDING',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('workspaceInvitation', workspaceInvitationSchema);
