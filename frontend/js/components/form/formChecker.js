export default function formChecker(
	inputs,
	pseudo,
	email,
	password,
	confirmPass
) {
	const progressBar = document.getElementById('progress-bar');

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

	const pseudoChecker = (value) => {
		if (value.length === 0) {
			errorDisplay('pseudo', '');
		} else if (
			value.length > 0 &&
			(value.length < 3 || value.length > 20)
		) {
			errorDisplay(
				'pseudo',
				'Le pseudo doit faire entre 3 et 20 caractères'
			);
			pseudo = null;
		} else if (!value.match(/^[a-zA-Z0-9_.-]*$/)) {
			errorDisplay(
				'pseudo',
				'Le pseudo ne doit pas contenir de caractères spéciaux'
			);
			pseudo = null;
		} else {
			errorDisplay('pseudo', '', true);
			setTimeout(() => {
				errorDisplay('pseudo', 'Pseudo valide', true);
			}, 1000);
			pseudo = value;
		}
	};

	const emailChecker = (value) => {
		if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
			errorDisplay('email', "Le mail n'est pas valide");
			email = null;
		} else {
			errorDisplay('email', '', true);
			email = value;
		}
	};

	const passwordChecker = (value) => {
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
			password = null;
		} else {
			errorDisplay('password', 'Sécurité forte', true);
			progressBar.classList.add('progressGreen');
			password = value;
		}
		if (confirmPass) confirmChecker(confirmPass);
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
			console.log(e.target.id);
			switch (e.target.id) {
				case 'pseudo':
					pseudoChecker(e.target.value);
					break;
				case 'email':
					emailChecker(e.target.value);
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
}
