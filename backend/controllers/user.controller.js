const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

module.exports.registerUser = async (req, res) => {
	const user = await UserModel.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	});

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

		res.status(201).json({ message: 'Compte créé', user });
	} catch (err) {
		res.status(500).json({
			message: "Erreur dans l'enregistremet du compte",
			err,
		});
	}
};

module.exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await UserModel.findOne({ email });

		if (!user) {
			return res
				.status(404)
				.json({ message: "L'utilisateur n'existe pas" });
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
			});
		} else {
			res.status(400).json({ message: 'Identifiants incorrects' });
		}

		res.status(200).json({
			message: 'Connexion réussie',
			// token, // Retournez le token si nécessaire
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (err) {
		res.status(500).json({ message: 'Connexion échouée', err });
	}
};
