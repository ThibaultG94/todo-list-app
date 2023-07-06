export default function modalRegister() {
	const modal = document.getElementById('signup-modal');
	const link = document.getElementById('signup-link');
	const closeButton = document.getElementById('close-button');

	link.addEventListener('click', () => {
		modal.style.display = 'block';
	});

	closeButton.addEventListener('click', () => {
		modal.style.display = 'none';
	});

	window.addEventListener('click', (e) => {
		if (e.target == modal) {
			modal.style.display = 'none';
		}
	});
}
