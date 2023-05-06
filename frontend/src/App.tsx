import { useState } from 'react';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { TasksInt } from './components/model';

const App = () => {
	const [taskData, setTaskData] = useState<TasksInt[]>([]);

	return (
		<div className="app" data-testid="app">
			<h1>To-Do List</h1>
			<AddTaskForm taskData={taskData} setTaskData={setTaskData} />
			<TaskList taskData={taskData} setTaskData={setTaskData} />
		</div>
	);
};

export default App;
