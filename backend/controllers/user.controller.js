const userModel = require('../models/user.model');
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
		const userId = req.user._id;
		const updates = req.body;
		const updatedUser = await User.findByIdAndUpdate(userId, updates, {
			new: true,
		});

		if (!updatedUser) {
			return res.status(404).json({ message: 'Utilisateur introuvable' });
		}

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
		const userId = req.user._id;
		const deletedUser = await User.findByIdAndRemove(userId);

		if (!deletedUser) {
			return res.status(404).json({ message: 'Utilisateur introuvable' });
		}

		res.status(200).json({
			message: 'Utilisateur supprimé',
			user: deletedUser,
		});
	} catch (err) {
		res.status(500).json({ message: 'Erreur interne du serveur', err });
	}
};

module.exports.getUser = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id).select('-password');
		if (!user) {
			res.status(400).json({ message: 'Utilisateur non trouvé' });
		}
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ message: 'Erreur serveur' });
	}
};
