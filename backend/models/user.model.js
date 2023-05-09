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
});

userSchema.pre('save', async (next) => {
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

userSchema.methods.comparePasswords = async (candidatePassword) => {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = () => {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	return token;
};

module.exports = mongoose.model('user', userSchema);
