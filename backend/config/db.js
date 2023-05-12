const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const dbConnection =
			process.env.NODE_ENV === 'test'
				? process.env.TEST_MONGO_URI
				: process.env.MONGO_URI;
		await mongoose.connect(dbConnection);
		console.log(`Succesfully connected to ${dbConnection}`);
	} catch (err) {
		console.error('Error connecting to MongoDB', err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
