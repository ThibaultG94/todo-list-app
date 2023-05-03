import { useRef, useState } from 'react';
import { MessagesInt } from './model';

const AddTaskForm = () => {
	const inputMessage = useRef<HTMLInputElement | null>(null);
	const [messData, setMessData] = useState<MessagesInt[]>([]);

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (inputMessage) {
			const mess: MessagesInt = {
				id: Math.round(Math.random() * Date.now()),
				message: inputMessage?.current?.value,
				date: Date.now(),
			};
			setMessData((prevData) => [...prevData, mess]);
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
