import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from '../App';


test('renders a heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent(/fuel calculator/i);
});
