import { createClient } from 'redis';
import dotenv from 'dotenv';

// Go to : https://github.com/redis/node-redis#installation

// const client = createClient({
// 	url: process.env.REDIS_URL,
// 	username: process.env.REDIS_USERNAME,
// 	password: process.env.REDIS_PASSWORD,
// 	legacyMode: true,
// });

const client = createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: 'redis-17149.c300.eu-central-1-1.ec2.cloud.redislabs.com',
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
