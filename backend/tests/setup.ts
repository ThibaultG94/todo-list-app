const mongoose = require('mongoose');

mongoose.Promise = Promise;
const mongoUri = 'mongodb://localhost:27017/tests/';

mongoose.connect(mongoUri);

mongoose.connection.on('error', (e: any) => {
	if (e.message.code === 'ETIMEDOUT') {
		console.log(e);
		mongoose.connect(mongoUri);
	}
	console.log(e);
});

mongoose.connection.once('open', () => {
	console.log(`MongoDB successfully connected to ${mongoUri}`);
});

module.exports = mongoose;
