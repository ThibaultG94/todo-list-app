import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders the main app component', () => {
	render(<App />);
	const appElement = screen.getByTestId('app');
	expect(appElement).toBeInTheDocument();
});
