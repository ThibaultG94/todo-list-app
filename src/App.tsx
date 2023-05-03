import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

const App = () => {
	return (
		<div className="app" data-testid="app">
			<h1>To-Do List</h1>
			<AddTaskForm />
			<TaskList />
		</div>
	);
};

export default App;
