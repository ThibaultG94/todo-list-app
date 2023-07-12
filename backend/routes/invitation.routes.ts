import express from 'express';
import { auth } from '../middlewares/auth.middlewares';
import {
	acceptWorkspaceInvitation,
	listUserInvitations,
	rejectWorkspaceInvitation,
	sendWorkspaceInvitation,
} from '../controllers/invitation.controller';

const router = express.Router();

// Route to send a workspace invitation
router.post('/:workspaceId/send-invitation', auth, sendWorkspaceInvitation);

// Route to accept a workspace invitation
router.post('/:invitationId/accept', auth, acceptWorkspaceInvitation);

// Route to reject a workspace invitation
router.post('/:invitationId/reject', auth, rejectWorkspaceInvitation);

// Route to get the list of the user's invitations
router.get('/list', auth, listUserInvitations);

export default router;
