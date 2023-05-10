const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'superadmin'],
		default: 'user',
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

userSchema.methods.comparePasswords = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
	const user = this;
	const token = jwt.sign(
		{
			_id: user._id.toHexString(),
			username: user.username,
			email: user.email,
			role: user.role,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);
	return token;
};

module.exports = mongoose.model('user', userSchema);
