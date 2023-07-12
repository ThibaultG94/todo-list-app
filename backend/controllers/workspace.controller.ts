import workspaceModel from '../models/workspace.model';
import express from 'express';
import client from '../utils/redisClient';
import userModel from '../models/user.model';
import { Workspace } from '../types/types';

// Endpoint to get a workspace by id
export const getWorkspace = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const workspace: Workspace = await workspaceModel.findById(
			req.params.id
		);

		if (!req.user) {
			return res.status(401).json({ message: 'User not authenticated' });
		}

		if (!workspace) {
			return res
				.status(400)
				.json({ message: 'This workspace does not exist' });
		}

		if (workspace !== null && req.user._id !== workspace.userId) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		res.status(200).json(workspace);
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to get workspaces of a specific user
export const getUserWorkspaces = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const userId = req.params.id;

		if (req.user._id !== userId) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		const workspaces = await workspaceModel.find({ userId });

		res.status(200).json(workspaces);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to create a new Workpace
export const createWorkspace = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!req.body.title) {
			return res.status(400).json({ message: 'Please add a title' });
		}

		const userId = req.user._id;

		const userExists = await userModel.exists({ _id: userId });

		if (!userExists) {
			return res
				.status(404)
				.json({ message: 'The specified user does not exist' });
		}

		const workspace = await workspaceModel.create({
			title: req.body.title,
			userId: req.body.userId,
			description: req.body.description,
			members: req.body.members,
		});

		res.status(200).json(workspace);
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to edit a workspace
export const editWorkspace = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const updates = req.body;
		const workspace = await workspaceModel.findById(req.params.id);

		// Check if the workspace exists
		if (!workspace) {
			return res
				.status(400)
				.json({ message: 'This workspace does not exist' });
		}

		// Check if the user making the request is the owner of the workspace
		if (workspace && req.user._id !== workspace.userId) {
			return res.status(403).json({
				message:
					'You do not have sufficients rights to perform this action',
			});
		}

		// Updates the fields of the workspace
		if (updates.title !== undefined) {
			workspace.title = updates.title;
		}
		if (updates.userId !== undefined) {
			workspace.userId = updates.userId;
		}
		if (updates.description !== undefined) {
			workspace.description = updates.description;
		}
		if (updates.members !== undefined) {
			workspace.members = updates.members;
		}

		const updatedWorkspace = await workspace.save();

		res.status(200).json({
			message: 'Workspace updated',
			workspace: updatedWorkspace,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Endpoint to delete a workspace
export const deleteWorkspace = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Attempt to find and delete the workspace by the provided id
		const workspace = await workspaceModel.findByIdAndDelete(req.params.id);

		// If no workspace is found, return a 400 status
		if (!workspace) {
			return res
				.status(400)
				.json({ message: 'This workspace does not exist' });
		}

		// If a workspace is found, check if the user making the request is the same as the one who created the workspace
		if (workspace && req.user._id !== workspace.userId) {
			return res.status(403).json({
				message: 'You do not have the right to modify this workspace',
			});
		}

		// If the workspace is found and the user has sufficients rights, delete the workspace
		if (workspace) {
			await workspace.deleteOne();
			res.status(200).json('Workspace deleted ' + req.params.id);
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};
