import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

const receipt = () => screen.getByText(/FUEL CALCULATION RECEIPT/).closest('table')!;

test('renders a heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/fuel calculator/i);
});

test('shows how much fuel to add', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/current fuel load/i), { target: { value: '500' } });
  fireEvent.change(screen.getByLabelText(/desired fuel load/i), { target: { value: '1500' } });

  const table = within(receipt());
  expect(table.getAllByText('ADD')).toHaveLength(2); // total + per wing
  expect(table.getAllByText('1000.0').length).toBeGreaterThan(0);
  expect(table.getAllByText('500.0').length).toBeGreaterThan(0); // per wing
});

test('preset button sets the desired load', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /2000 lbs/i }));
  expect(screen.getByLabelText(/desired fuel load/i)).toHaveValue('2000');
});

test('metric mode shows the temperature in °C without double conversion or a false non-std flag', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Metric' }));

  const table = within(receipt());
  expect(table.getByText('15.0°C')).toBeInTheDocument();
  expect(table.queryByText(/STD/)).not.toBeInTheDocument();
});

test('a non-standard temperature is flagged on the receipt', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/temperature/i), { target: { value: '100' } });
  expect(within(receipt()).getByText(/!STD: 59\.0°F!/)).toBeInTheDocument();
});

test('theme toggle switches and persists the preference', () => {
  const { unmount } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /switch to light theme/i }));
  expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();
  unmount();

  render(<App />);
  expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();
});

test('fuel entries survive a reload', () => {
  const { unmount } = render(<App />);
  fireEvent.change(screen.getByLabelText(/current fuel load/i), { target: { value: '800' } });
  unmount();

  render(<App />);
  expect(screen.getByLabelText(/current fuel load/i)).toHaveValue('800');
});

test('settings dialog opens, accepts a density and closes on Escape', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  const dialog = screen.getByRole('dialog');

  const density = within(dialog).getByLabelText(/default fuel density/i);
  fireEvent.change(density, { target: { value: '4' } }); // below the 5 minimum: not committed
  expect(density).toHaveAttribute('aria-invalid', 'true');
  fireEvent.change(density, { target: { value: '6.8' } });
  expect(density).toHaveAttribute('aria-invalid', 'false');

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
