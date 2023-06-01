import { createClient } from 'redis';

const client = createClient({
	url: process.env.REDIS_URL,
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	legacyMode: true,
});

client.on('connect', () => console.log('Connected to Redis'));

client.on('error', (err) => console.log('Redis Client Error', err));

export default client;
