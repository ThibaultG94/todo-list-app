export default function register() {
	const form = document.getElementById('signup-form');
	const inputs = document.querySelectorAll('#signup-form input');
	const progressBar = document.getElementById('progress-bar');
	const sucessRegister = document.querySelector('.success-container');

	let pseudo, email, password, confirmPass;

	const errorDisplay = (tag, message, valid) => {
		const container = document.querySelector('.' + tag + '-container');
		const span = document.querySelector('.' + tag + '-container > span');

		if (!valid) {
			container.classList.remove('success');
			container.classList.add('error');
			span.textContent = message;
		} else {
			container.classList.remove('error');
			container.classList.add('success');
			span.textContent = message;
		}
	};

	const passwordChecker = (value) => {
		setTimeout(() => {
			progressBar.classList = '';

			if (
				!value.match(
					/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
				)
			) {
				errorDisplay(
					'password',
					'Minimum de 8 caractères, une majuscule, un chiffre et un caractère spécial'
				);
				progressBar.classList.add('progressRed');
				password = null;
			} else if (value.length < 12) {
				errorDisplay('password', 'Sécurité moyenne', true);
				progressBar.classList.add('progressBlue');
				password = value;
			} else {
				errorDisplay('password', 'Sécurité forte', true);
				progressBar.classList.add('progressGreen');
				password = value;
			}
			if (confirmPass) confirmChecker(confirmPass);
		}, 1000);
	};

	const confirmChecker = (value) => {
		if (value !== password) {
			errorDisplay('confirm', 'Les mots de passe ne correspondent pas');
			confirmPass = false;
		} else {
			errorDisplay('confirm', '', true);
			confirmPass = true;
		}
	};

	inputs.forEach((input) => {
		input.addEventListener('input', (e) => {
			switch (e.target.id) {
				case 'pseudo':
					pseudo = e.target.value;
					break;
				case 'email':
					email = e.target.value;
					break;
				case 'password':
					passwordChecker(e.target.value);
					break;
				case 'confirm':
					confirmChecker(e.target.value);
					break;
				default:
					null;
			}
		});
	});

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		if (pseudo && email && password && confirmPass) {
			inputs.forEach((input) => (input.value = ''));
			progressBar.classList = '';

			await axios
				.post('http://localhost:5000/users/register', {
					username: pseudo,
					email: email,
					password: password,
					role: 'user',
				})
				.then((res) => {
					console.log(res);
					pseudo = null;
					email = null;
					password = null;
					confirmPass = null;
					document.querySelector(
						'.password-container > span'
					).textContent = '';
					sucessRegister.classList.add('success');
				})
				.catch((err) => console.log(err));
		} else {
			alert('Veuillez remplir correctement les champs');
		}
	});
}
