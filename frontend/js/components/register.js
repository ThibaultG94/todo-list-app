export default function register() {
	const form = document.getElementById('signup-form');

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const username = e.target.elements['username'].value;
		const email = e.target.elements['email'].value;
		const password = e.target.elements['password'].value;
		const passwordConfirm = e.target.elements['passwordConfirm'].value;

		if (password !== passwordConfirm) {
			console.log('Passwords do not match!');
			return;
		}

		axios
			.post('http://localhost:5000/users/register', {
				username: username,
				email: email,
				password: password,
				role: 'user',
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.log(err));
	});
}
