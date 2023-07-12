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

// Endpoint to accept a workspace invitation
export const acceptWorkspaceInvitation = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const invitationId = req.params.id;
		const invitation = await workspaceInvitationModel.findById(
			invitationId
		);

		if (!invitation || invitation.status !== 'PENDING') {
			return res.status(400).json({
				message: 'Invitation does not exist or is not pending',
			});
		}

		if (!req.user || req.user._id !== invitation.inviteeId) {
			return res.status(403).json({
				message:
					'You do not have sufficients rights to accept this invitation',
			});
		}

		invitation.status = 'ACCEPTED';
		await invitation.save();

		const workspace = await workspaceModel.findById(invitation.workspaceId);
		workspace.members.push(req.user._id);
		await workspace.save();

		res.status(200).json({
			message: 'Invitation accepted and user added to workspace',
		});
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to reject a workspace invitation
export const rejectWorkspaceInvitation = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const invitationId = req.params.id;
		const invitation = await workspaceInvitationModel.findById(
			invitationId
		);

		if (!invitation || invitation.status !== 'PENDING') {
			return res.status(400).json({
				message: 'Invitation does not exist or is not pending',
			});
		}

		if (!req.user || req.user._id !== invitation.inviteeId) {
			return res.status(403).json({
				message:
					'You do not have sufficients rights to accept this invitation',
			});
		}

		invitation.status = 'REJECTED';
		await invitation.save();

		res.status(200).json({ message: 'Invitation rejected' });
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to list all pending invitations for a user
export const listUserInvitations = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'User not authenticated' });
		}

		const invitations = await workspaceInvitationModel.find({
			inviteeId: req.user._id,
			status: 'PENDING',
		});

		res.status(200).json(invitations);
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};
