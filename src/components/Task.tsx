import { Dispatch, SetStateAction } from 'react';
import { TasksInt } from './model';

type Props = {
	task: TasksInt;
	taskData: TasksInt[];
	setTaskData: Dispatch<SetStateAction<TasksInt[]>>;
};

const Task = ({ task, taskData, setTaskData }: Props) => {
	const dateFormater = (date: number) => {
		return new Date(date).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
		});
	};

	const handleDelete = () => {
		setTaskData(taskData.filter((el) => el.id !== task.id));
	};

	return (
		<div className="task-container">
			<p>{task.name}</p>
			<h5>{dateFormater(task.date)}</h5>
			<span id="delete" onClick={() => handleDelete()}>
				&#10008;
			</span>
		</div>
	);
};

export default Task;
