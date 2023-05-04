import { Dispatch, SetStateAction } from 'react';
import { TasksInt } from './model';
import Task from './Task';

type Props = {
	taskData: TasksInt[];
	setTaskData: Dispatch<SetStateAction<TasksInt[]>>;
};

const TaskList = ({ taskData, setTaskData }: Props) => {
	return (
		<div>
			<h2>Liste des tâches</h2>
			<div>
				{taskData?.map((task) => (
					<Task
						task={task}
						taskData={taskData}
						setTaskData={setTaskData}
						key={task.id}
					/>
				))}
			</div>
		</div>
	);
};

export default TaskList;
