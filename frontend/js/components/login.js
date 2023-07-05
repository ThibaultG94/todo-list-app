export default function login() {
	const form = document.getElementById('login-form');

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const email = e.target.elements['email'].value;
		const password = e.target.elements['password'].value;
		console.log(`Email: ${email} Password: ${password}`);

		axios
			.post('http://localhost:5000/users/login', {
				email: email,
				password: password,
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.log(err));
	});
}
