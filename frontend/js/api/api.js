import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3000/api',
	timeout: 1000,
});

api.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		const originalRequest = err.config;

		if (err.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshToken = localStorage.getItem('refreshToken');

			try {
				const response = await api.post('/auth/refreshToken', {
					refreshToken,
				});
				localStorage.setItem('token', response.data.token);

				return api(originalRequest);
			} catch (err) {
				console.error(err);
			}
		}

		return Promise.reject(err);
	}
);

// import api from './api';

// api.get('/someEndpoint').then(response => {
//   console.log(response.data);
// });
