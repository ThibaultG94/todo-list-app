const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
	const mongooseOpts = {
		autoReconnect: true,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 1000,
	};

	mongoose.connect(mongoUri, mongooseOpts);

	mongoose.connection.on('error', (e) => {
		if (e.message.code === 'ETIMEDOUT') {
			console.log(e);
			mongoose.connect(mongoUri, mongooseOpts);
		}
		console.log(e);
	});

	mongoose.connection.once('open', () => {
		console.log(`MongoDB successfully connect to ${mongoUri}`);
	});
});

after(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});
