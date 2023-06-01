import { createClient } from 'redis';

const client = createClient();

client.on('connect', () => console.log('Connected to Redis'));

client.on('error', (err) => console.log('Redis Client Error', err));

export default client;
