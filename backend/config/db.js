const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const dbConnection =
			process.env.NODE_ENV === 'test'
				? process.env.TEST_MONGO_URI
				: process.env.MONGO_URI;
		const state = process.env.NODE_ENV === 'test' ? 'test' : 'development';
		await mongoose.connect(dbConnection);
		console.log(`Succesfully connected to ${dbConnection}`);
		console.log(`Etat : ${state}`);
	} catch (err) {
		console.error('Error connecting to MongoDB', err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
