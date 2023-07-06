import formChecker from './formChecker.js';

export default function register() {
	const form = document.getElementById('signup-form');
	const inputs = document.querySelectorAll('#signup-form input');

	let pseudo, email, password, confirmPass;
	formChecker(inputs, pseudo, email, password, confirmPass);

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (pseudo && email && password && confirmPass) {
			const data = {
				pseudo,
				email,
				password,
			};
			console.log(data);

			inputs.forEach((input) => (input.value = ''));
			progressBar.classList = '';

			pseudo = null;
			email = null;
			password = null;
			confirmPass = null;
			document.querySelector('.pseudo-container > span').textContent = '';
			document.querySelector('.password-container > span').textContent =
				'';
			alert('Inscription validée !');
		} else {
			alert('Veuillez remplir correctement les champs');
		}

		// axios
		// 	.post('http://localhost:5000/users/register', {
		// 		username: username,
		// 		email: email,
		// 		password: password,
		// 		role: 'user',
		// 	})
		// 	.then((res) => {
		// 		console.log(res);
		// 	})
		// 	.catch((err) => console.log(err));
	});
}
