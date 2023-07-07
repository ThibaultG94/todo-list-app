import UserModel from '../models/user.model';
import express from 'express';
import bcrypt from 'bcryptjs';
import { User, UserBase, UserDocument } from '../types/types';

// Enpoint to create a user
export const registerUser = async (
	req: express.Request,
	res: express.Response
) => {
	// Extract username, email, password and role from the request body
	const { username, email, password, role } = req.body;

	if (
		(typeof username && typeof email && typeof password && typeof role) !==
		'string'
	) {
		return res.status(422).send('Invalid input');
	}

	try {
		// Attempt to find an existing user with the provided email
		const existingUser = await UserModel.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				message:
					'Email already in use. Please change email address or login.',
			});
		}

		// If no user with the provided email exists, create a new user
		// with the provided details and save them to the database
		const newUser = new UserModel({ username, email, password, role });
		await newUser.save();

		res.status(201).json({ message: 'Account created', user: newUser });
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({
			message: "Erreur dans l'enregistrement du compte",
			result,
		});
	}
};

// Endpoint to login a user
export const loginUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Extract email and password from the request body
		const { email, password } = req.body;

		if ((typeof email && typeof password) !== 'string') {
			return res.status(422).send('Invalid input');
		}

		// Attempt to find a user with the provided email
		const user: User = await UserModel.findOne({ email });

		// If no user with the provided email exists, return a 404 status
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// If a user with the provided email exists, validate the provided password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		// If the password is not valid, return a 401 status
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid password' });
		}

		// If the user exists and the password is valid,
		// generate an authentication token for the user
		if (user && isPasswordValid) {
			const token = user.generateAuthToken();

			res.status(200).json({
				message: 'Authentication successful',
				token,
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
				},
			});
		} else {
			// If the user does not exist or the password is not valid, return a 400 status
			res.status(400).json({ message: 'Identifiants incorrects' });
		}
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Internal server error', result });
	}
};

// Endpoint to edit a user
export const updateUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Extract ID and Role from Token
		const userIdFromToken = await req.user._id;
		const userRoleFromToken = await req.user.role;

		const userIdFromParams = req.params.id;

		// Fetch the user to be updated
		const userToUpdate = await UserModel.findById(userIdFromParams);

		// Check if a non-superadmin is trying to edit an admin, prevent if so
		if (
			userToUpdate &&
			userToUpdate.role !== 'user' &&
			userRoleFromToken !== 'superadmin' &&
			userIdFromToken !== userIdFromParams
		) {
			return res.status(403).json({
				message:
					'You do not have the permissions necessary to perform this action',
			});
		}

		// Allow user to update their own data or, if user is an admin, to update any data
		if (
			userIdFromToken !== userIdFromParams &&
			userRoleFromToken !== 'admin' &&
			userRoleFromToken !== 'superadmin'
		) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		// Data to be updated
		const updates = req.body;

		// Check if the user exists
		if (!userToUpdate) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Update the user fields
		if (updates.username !== undefined) {
			userToUpdate.username = updates.username;
		}
		if (updates.email !== undefined) {
			userToUpdate.email = updates.email;
		}
		if (updates.password !== undefined) {
			userToUpdate.password = updates.password;
		}
		if (updates.role !== undefined) {
			userToUpdate.role = updates.role;
		}

		// Save the user
		const updatedUser = await userToUpdate.save();

		res.status(200).json({
			message: 'User updated',
			user: updatedUser,
		});
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Internal server error', result });
	}
};

// Endpoint to delete a user
export const deleteUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// Extract the user ID and role from the token
		const userIdFromToken = req.user._id;
		const roleFromToken = req.user.role;
		const userIdFromParams = req.params.id;

		// Fetch the user to be deleted
		const userToDelete = await UserModel.findById(userIdFromParams);

		// Prevent a non-superadmin from deleting an admin
		if (
			userToDelete &&
			userToDelete.role !== 'user' &&
			roleFromToken !== 'superadmin' &&
			userIdFromToken !== userIdFromParams
		) {
			return res.status(403).json({
				message:
					'You do not have the permissions necessary to perform this action',
			});
		}

		// Allow a user to delete their own account ir, if the user is an admin or a superadmin, to delete any user account
		if (
			userIdFromToken !== userIdFromParams &&
			roleFromToken !== 'admin' &&
			roleFromToken !== 'superadmin'
		) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		// Delete the user
		const deletedUser = await UserModel.findByIdAndDelete(userIdFromParams);

		// Check if the user was actually deleted
		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json({
			message: 'User deleted',
			user: deletedUser,
		});
	} catch (err) {
		const result = (err as Error).message;
		console.log(result);
		res.status(500).json({ message: 'Internal server error', result });
	}
};

// Enpoint to get a user
export const getUser = async (req: express.Request, res: express.Response) => {
	try {
		// Extract the user ID and role from the token
		const userIdFromToken = req.user._id;
		const userRoleFromToken = req.user.role;
		const userIdFromParams = req.params.id;

		// Deny the request if a user asks for data of another user and the requester is not an admin or a superadmin
		if (
			userIdFromToken !== userIdFromParams &&
			userRoleFromToken !== 'admin' &&
			userRoleFromToken !== 'superadmin'
		) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		// Fetch the user from the database, omitting the password field
		const user: UserBase = await UserModel.findById(
			userIdFromParams
		).select('-password');
		if (!user) {
			res.status(400).json({ message: 'User not found' });
		}

		// Deny the request if an admin user asks for data of another admin or superadmin and the requester is not a superadmin
		if (
			user.role !== 'user' &&
			userRoleFromToken !== 'superadmin' &&
			userIdFromToken !== userIdFromParams
		) {
			return res.status(403).json({
				message:
					'You do not have sufficient rights to perform this action',
			});
		}

		// Send the user data back in the response
		res.status(200).json({ user });
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Internal server error', result });
	}
};
