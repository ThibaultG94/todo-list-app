import express, { NextFunction, Response } from 'express';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import cors from 'cors';
import './utils/redisClient';
import * as Sentry from '@sentry/node';

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

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Sentry.Integrations.Express({ app }),
		// Automatically instrument Node.js libraries and frameworks
		...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
	],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get('/', function rootHandler(req, res) {
	res.end('Hello world!');
});

Sentry.captureException(new Error('test exception'));

app.get('/debug-centry', function mainHandler(req, res) {
	res.status(500);
	console.log(res);
	console.log(res.status);
	throw new Error('My first Sentry error!');
});

// The error handler must be before any other error middleware and after all controllers
app.use(
	Sentry.Handlers.errorHandler({
		shouldHandleError(error) {
			// Capture all 404 and 500 errors
			if (error.status === 404 || error.status === 500) {
				console.log(error.status);
				return true;
			}
			return false;
		},
	})
);

app.use(function onError(req, res, next) {
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.statusCode = 500;
	res.end(res + '\n');
});

// Lancer le serveur
app.listen(port, () => console.log('Le serveur a démarré au port ' + port));
