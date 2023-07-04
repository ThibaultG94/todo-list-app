import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: 17149,
	},
	legacyMode: true,
});

const connectClient = async () => {
	await client.connect();
};

connectClient();

client.on('connect', async () => await console.log('Connected to Redis'));

client.on('error', async (err) => await console.log('Redis Client Error', err));

export default client;
