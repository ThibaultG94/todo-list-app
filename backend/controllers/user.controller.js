const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

module.exports.registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const existingUser = await UserModel.findOne({ email });

		if (existingUser) {
			return res.status(400).json({
				message:
					"L'email est déjà utilisé. Veuillez changer d'adresse email ou vous connecter",
			});
		}

		const newUser = new UserModel({ username, email, password });
		await newUser.save();

		res.status(201).json({ message: 'Compte créé', user: newUser });
	} catch (err) {
		res.status(500).json({
			message: "Erreur dans l'enregistrement du compte",
			err,
		});
	}
};

module.exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });

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
		res.status(500).json({ message: 'Erreur interne du serveur', err });
	}
};

module.exports.updateUser = async (req, res) => {
	try {
		const userIdFromToken = req.user._id;
		const userRoleFromToken = req.user.role;
		const userIdFromParams = req.params.id;

		// Autorise l'utilisateur à mettre à jour ses propres données ou, si l'utilisateur est un admin, à mettre à jour n'importe quelle donnée
		if (
			userIdFromToken !== userIdFromParams &&
			userRoleFromToken !== 'admin'
		) {
			return res.status(403).json({
				message:
					"Vous n'avez pas les droits suffisants pour effectuer cette action",
			});
		}

		// Les données à mettre à jour
		const updates = req.body;

		// Trouver l'utilisateur d'abord

		const user = await UserModel.findById(userIdFromParams);
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
		res.status(500).json({ message: 'Erreur interne du serveur', err });
	}
};

module.exports.deleteUser = async (req, res) => {
	try {
		const userIdFromToken = req.user._id;
		const roleFromToken = req.user.role;
		const userIdFromParams = req.params.id;

		if (userIdFromToken !== userIdFromParams && roleFromToken !== 'admin') {
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
		console.log(err);
		res.status(500).json({ message: 'Erreur interne du serveur', err });
	}
};

module.exports.getUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.user._id).select('-password');
		if (!user) {
			res.status(400).json({ message: 'Utilisateur non trouvé' });
		}
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ message: 'Erreur serveur' });
	}
};
