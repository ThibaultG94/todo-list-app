import UserModel from '../models/user.model';
import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../types/types';

// Enpoint to create a user
export const registerUser = async (
	req: express.Request,
	res: express.Response
) => {
	// Extract username, email, password and role from the request body
	const { username, email, password, role } = req.body;

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
		const userToUpdate = await UserModel.findById(userIdFromParams);

		// Previent qu'un non-superadmin modifie un admin

		if (
			userToUpdate &&
			userToUpdate.role !== 'user' &&
			userRoleFromToken !== 'superadmin' &&
			userIdFromToken !== userIdFromParams
		) {
			return res.status(403).json({
				message:
					"Vous n'avez pas les droits suffisants pour effectuer cette action",
			});
		}

		// Autorise l'utilisateur à mettre à jour ses propres données ou, si l'utilisateur est un admin, à mettre à jour n'importe quelle donnée
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

		// Les données à mettre à jour
		const updates = req.body;

		// Trouver l'utilisateur d'abord

		const user: User = await UserModel.findById(userIdFromParams);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Mettre à jour les champs de l'utilisateur
		Object.keys(updates).forEach((update) => {
			user[update] = updates[update];
		});

		// Sauvegarder l'utilisateur
		const updatedUser = await user.save();

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
		const userIdFromToken = req.user._id;
		const roleFromToken = req.user.role;
		const userIdFromParams = req.params.id;
		const userToDelete = await UserModel.findById(userIdFromParams);

		// Previens qu'un non-superadmin puisse supprimer un admin

		if (
			userToDelete &&
			userToDelete.role !== 'user' &&
			roleFromToken !== 'superadmin' &&
			userIdFromToken !== userIdFromParams
		) {
			return res.status(403).json({
				message:
					"Vous n'avez pas les droits suffisants pour effectuer cette action",
			});
		}

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

		const deletedUser = await UserModel.findByIdAndDelete(userIdFromParams);

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

export const getUser = async (req: any, res: express.Response) => {
	try {
		const userIdFromToken = req.user._id;
		const userRoleFromToken = req.user.role;
		const userIdFromParams = req.params.id;

		// Si l'utilisateur ne demande pas ses propres données ou s'il n'est pas admin ou superadmin, nié la requête
		if (
			userIdFromToken !== userIdFromParams &&
			userRoleFromToken !== 'admin' &&
			userRoleFromToken !== 'superadmin'
		) {
			return res.status(403).json({
				message:
					"Vous n'avez pas les droits suffisants pour effectuer cette action",
			});
		}

		const user: any = await UserModel.findById(userIdFromParams).select(
			'-password'
		);
		if (!user) {
			res.status(400).json({ message: 'User not found' });
		}

		// Si l'utilisateur est admin mais qu'il ne demande pas ses propres données ou que l'utilisateur est superadmin, nié la requête
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

		res.status(200).json({ user });
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Internal server error', result });
	}
};
