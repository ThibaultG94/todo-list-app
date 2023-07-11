export default function nav() {
	const homeLink = document.getElementById('home');
	const tasksLink = document.getElementById('tasks');
	const listLink = document.getElementById('list');
	const boardLink = document.getElementById('board');
	const calendarLink = document.getElementById('calendar');

	homeLink.addEventListener('click', () => {
		window.location.href = '/frontend/pages/home.html';
	});

	tasksLink.addEventListener('click', () => {
		window.location.href = '/frontend/pages/taskList.html';
	});

	listLink.addEventListener('click', () => {
		window.location.href = '/frontend/pages/taskList.html';
	});

	boardLink.addEventListener('click', () => {
		window.location.href = '/frontend/pages/taskBoard.html';
	});

	calendarLink.addEventListener('click', () => {
		window.location.href = '/frontend/pages/taskCalendar.html';
	});
}
