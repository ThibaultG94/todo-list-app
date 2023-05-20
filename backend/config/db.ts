import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const dbConnection: any =
			process.env.NODE_ENV === 'test'
				? process.env.TEST_MONGO_URI
				: process.env.MONGO_URI;
		const state = process.env.NODE_ENV === 'test' ? 'test' : 'development';
		await mongoose.connect(dbConnection);
		console.log(`Succesfully connected to ${dbConnection}`);
		console.log(`Etat : ${state}`);
	} catch (err) {
		const result = (err as Error).message;
		console.error('Error connecting to MongoDB', result);
		process.exit(1);
	}
};
