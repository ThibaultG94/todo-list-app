import express from 'express';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';
import './utils/redisClient';

const port: number = 5000;

dotenv.config();

// connexion à la DB
connectDB();

export const app = express();

// Authorisation CORS
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

// Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/task', require('./routes/task.routes'));
app.use('/users', require('./routes/user.routes'));

// Lancer le serveur
app.listen(port, () => console.log('Le serveur a démarré au port ' + port));
