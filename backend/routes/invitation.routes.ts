import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
import {
	acceptWorkspaceInvitation,
	listUserInvitations,
	rejectWorkspaceInvitation,
	sendWorkspaceInvitation,
} from '../controllers/invitation.controller';
import { validateInvitationId } from '../middlewares/validation.middlewares';

const router = express.Router();

// Route to send a workspace invitation
router.post(
	'/:workspaceId/send-invitation',
	auth,
	validateInvitationId,
	sendWorkspaceInvitation
);

// Route to accept a workspace invitation
router.post(
	'/:invitationId/accept',
	auth,
	validateInvitationId,
	acceptWorkspaceInvitation
);

// Route to reject a workspace invitation
router.post(
	'/:invitationId/reject',
	auth,
	validateInvitationId,
	rejectWorkspaceInvitation
);

// Route to get the list of the user's invitations
router.get('/list', auth, listUserInvitations);

export default router;
