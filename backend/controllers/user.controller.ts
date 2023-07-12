import UserModel from '../models/user.model';
import express from 'express';
import bcrypt from 'bcryptjs';
import { User, UserBase, UserToken } from '../types/types';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt, { Jwt, Secret, JwtPayload } from 'jsonwebtoken';
import refreshTokenModel from '../models/refreshToken.model';
import workspaceModel from '../models/workspace.model';

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

		// After the user is saved, create a new workspace for them
		const workspace = new workspaceModel({
			title: 'Default Workspace',
			userId: newUser._id,
			description: 'This is your default workspace',
			members: [newUser._id],
			isDefault: true,
		});

		await workspace.save();

		res.status(201).json({
			message:
				'User successfully registered and default workspace created',
		});
	} catch (err) {
		const result = (err as Error).message;
		console.log(result);
		res.status(500).json({
			message: 'Internal server error',
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
			const refreshToken = user.generateRefreshToken();

			// Store the refresh token in the database
			const newRefreshToken = new refreshTokenModel({
				token: refreshToken,
				userId: user._id,
			});
			await newRefreshToken.save();

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				// Use "secure: true" if you use https
				secure: process.env.NODE_ENV !== 'development',
				// sameSite option can be 'strict', 'lax', 'none', or undefined.
				// 'strict' will prevent the cookie from being sent by the browser to the target
				// site in all cross-site browsing context, even when following a regular link.
				sameSite: 'strict',
				// path: specifies the URL path that must exist in the requested URL in order to send the Cookie header
				path: '/users/token',
			});

			res.status(200).json({
				message: 'Authentication successful',
				token,
				refreshToken,
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
		console.log(result);
		res.status(500).json({ message: 'Internal server error' });
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
		console.log(result);
		res.status(500).json({ message: 'Internal server error' });
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
		res.status(500).json({ message: 'Internal server error' });
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
		console.log(result);

		res.status(500).json({ message: 'Internal server error' });
	}
};

export const forgotPassword = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		// configure nodemailer SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp-relay.gmail.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'username@example.com',
				pass: 'yourpassword',
			},
		});
		// Retrieve email address from request body
		const { email } = req.body;

		// Check if a user with this email address exists
		const user = await UserModel.findOne({ email });

		const getRandomString = (length: number) => {
			return crypto.randomBytes(length).toString('hex');
		};

		if (!user) {
			return res
				.status(404)
				.json({ message: 'No account with that email address exists' });
		}

		// Generate a reset token
		const token = getRandomString(10);

		// Define token and expiration
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

		await user.save();

		// Send an email to the user with the token
		let mailOptions = {
			to: user.email,
			from: 'passwordreset@example.com',
			subject: 'Node.js Password Reset',
			text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
						Please click on the following link, or paste this into your browser to complete the process:
						http://${req.headers.host}/reset/${token}
						If you did not request this, please ignore this email and your password will remain unchanged.`,
		};

		transporter.sendMail(mailOptions, function (err) {
			if (err) {
				return res.status(500).json({ message: 'Error sending email' });
			}
			res.status(200).json({
				message:
					'An e-mail has been sent to ' +
					user.email +
					' with further instructions.',
			});
		});

		res.status(200).json({
			message:
				'An email has been sent to your account with further instructions.',
			username: user.username,
		});
	} catch (err) {
		const result = (err as Error).message;
		console.log(result);

		res.status(500).json({ message: 'Internal server error' });
	}
};

export const getRefreshToken = (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.sendStatus(401);
		}

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET as Secret,
			(
				err: Error | null,
				decoded: string | JwtPayload | Jwt | undefined
			) => {
				if (err) {
					return res.sendStatus(403);
				}

				const user = decoded as UserToken;

				const accessToken = jwt.sign(
					{ id: user._id, email: user.email },
					process.env.JWT_SECRET,
					{ expiresIn: process.env.JWT_EXPIRES_IN }
				);

				res.json({
					accessToken,
				});
			}
		);
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const logoutUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		res.clearCookie('refreshToken');

		const { refreshToken } = req.cookies;

		await refreshTokenModel.deleteOne({ token: refreshToken });

		res.status(200).json({ message: 'User logged out successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};
