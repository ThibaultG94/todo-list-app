import UserModel from '../models/user.model';
import express from 'express';
import bcrypt from 'bcryptjs';

export const registerUser = async (
	req: express.Request,
	res: express.Response
) => {
	const { username, email, password, role } = req.body;

	try {
		const existingUser = await UserModel.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				message:
					"L'email est déjà utilisé. Veuillez changer d'adresse email ou vous connecter",
			});
		}

		const newUser = new UserModel({ username, email, password, role });
		await newUser.save();

		res.status(201).json({ message: 'Compte créé', user: newUser });
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({
			message: "Erreur dans l'enregistrement du compte",
			result,
		});
	}
};

export const loginUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email, password } = req.body;
		const user: any = await UserModel.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'Identifiants incorrects' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Mot de passe invalide' });
		}

		if (user && isPasswordValid) {
			const token = user.generateAuthToken();
			res.status(200).json({
				message: 'Authentification réussie',
				token,
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
				},
			});
		} else {
			res.status(400).json({ message: 'Identifiants incorrects' });
		}
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Erreur interne du serveur', result });
	}
};

export const updateUser = async (req: any, res: express.Response) => {
	try {
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
					"Vous n'avez pas les droits suffisants pour effectuer cette action",
			});
		}

		// Les données à mettre à jour
		const updates = req.body;

		// Trouver l'utilisateur d'abord

		const user: any = await UserModel.findById(userIdFromParams);
		if (!user) {
			return res.status(404).json({ message: 'Utilisateur introuvable' });
		}

		// Mettre à jour les champs de l'utilisateur
		Object.keys(updates).forEach((update) => {
			user[update] = updates[update];
		});

		// Sauvegarder l'utilisateur
		const updatedUser = await user.save();

		res.status(200).json({
			message: 'Utilisateur mis à jour',
			user: updatedUser,
		});
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Erreur interne du serveur', result });
	}
};

export const deleteUser = async (req: any, res: express.Response) => {
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
					"Vous n'avez pas les droits suffisants pour effectuer cette action.",
			});
		}

		const deletedUser = await UserModel.findByIdAndDelete(userIdFromParams);

		if (!deletedUser) {
			return res.status(404).json({ message: 'Utilisateur introuvable' });
		}

		res.status(200).json({
			message: 'Utilisateur supprimé',
			user: deletedUser,
		});
	} catch (err) {
		const result = (err as Error).message;
		console.log(result);
		res.status(500).json({ message: 'Erreur interne du serveur', result });
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
			res.status(400).json({ message: 'Utilisateur non trouvé' });
		}

		// Si l'utilisateur est admin mais qu'il ne demande pas ses propres données ou que l'utilisateur est superadmin, nié la requête
		if (
			user.role !== 'user' &&
			userRoleFromToken !== 'superadmin' &&
			userIdFromToken !== userIdFromParams
		) {
			return res.status(403).json({
				message:
					"Vous n'avez pas les droits suffisants pour effectuer cette action",
			});
		}

		res.status(200).json({ user });
	} catch (err) {
		const result = (err as Error).message;
		res.status(500).json({ message: 'Erreur serveur', result });
	}
};
