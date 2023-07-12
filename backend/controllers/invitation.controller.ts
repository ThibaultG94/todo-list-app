import express from 'express';
import workspaceModel from '../models/workspace.model';
import workspaceInvitationModel from '../models/invitation.model';

// Endpoint to send a workspace invitation
export const sendWorkspaceInvitation = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { workspaceId, inviteeId } = req.body;

		if (!req.user) {
			return res.status(401).json({ message: 'User not authenticated' });
		}

		const workspace = await workspaceModel.findById(workspaceId);
		if (!workspace) {
			return res
				.status(400)
				.json({ message: 'Workspace does not exist' });
		}

		if (
			req.user._id !== workspace.userId &&
			!workspace.members.includes(req.user._id)
		) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to send an invitation for this workspace',
			});
		}

		const invitation = new workspaceInvitationModel({
			inviterId: req.user._id,
			inviteeId,
			workspaceId,
		});

		await invitation.save();

		res.status(200).json(invitation);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};
