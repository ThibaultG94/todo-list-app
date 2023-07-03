import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Define the schema for User model
const userSchema = new mongoose.Schema({
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

// Before saving a user, hash the password
userSchema.pre('save', async function (next) {
	// Check if password field is modified
	if (!this.isModified('password')) {
		return next();
	}

	try {
		// Generate a salt and hash the password
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		const result = err as Error;
		next(result);
	}
});

// Add a method to compare passwords
userSchema.methods.comparePasswords = async function (
	candidatePassword: string
) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Add a method to generate auth tokens
userSchema.methods.generateAuthToken = function () {
	const user = this;
	const token = jwt.sign(
		{
			_id: user._id.toHexString(),
			username: user.username,
			email: user.email,
			role: user.role,
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);
	return token;
};

export default mongoose.model('user', userSchema);
