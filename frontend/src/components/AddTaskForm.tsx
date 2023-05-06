import { Dispatch, SetStateAction, useRef } from 'react';
import { TasksInt } from './model';

type Props = {
	taskData: TasksInt[];
	setTaskData: Dispatch<SetStateAction<TasksInt[]>>;
};

const AddTaskForm = ({ taskData, setTaskData }: Props) => {
	const inputMessage = useRef<HTMLInputElement | null>(null);

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (inputMessage) {
			const mess: TasksInt = {
				id: Math.round(Math.random() * Date.now()),
				name: inputMessage?.current?.value,
				date: Date.now(),
			};
			setTaskData((prevData: any) => [...prevData, mess]);
		}

		(document.getElementById('newTask') as HTMLInputElement).value = '';
	};

	return (
		<div>
			<form onSubmit={(e) => handleSubmit(e)}>
				<input
					type="text"
					placeholder="Nouvelle tâche"
					id="newTask"
					ref={inputMessage}
				/>
				<input type="submit" value="Ajouter" />
			</form>
		</div>
	);
};

export default AddTaskForm;
