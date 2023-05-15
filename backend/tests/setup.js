const mongoose = require('mongoose');

mongoose.Promise = Promise;
const mongoUri = 'mongodb://localhost:27017/tests/';

// const mongooseOpts = {
// 	autoReconnect: true,
// 	reconnectTries: Number.MAX_VALUE,
// 	reconnectInterval: 1000,
// };

mongoose.connect(
	mongoUri
	// mongooseOpts
);

mongoose.connection.on('error', (e) => {
	if (e.message.code === 'ETIMEDOUT') {
		console.log(e);
		mongoose.connect(mongoUri, mongooseOpts);
	}
	console.log(e);
});

mongoose.connection.once('open', () => {
	console.log(`MongoDB successfully connected to ${mongoUri}`);
});

// after(async () => {
// 	await mongoose.disconnect();
// });

module.exports = mongoose;
