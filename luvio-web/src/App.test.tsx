import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Luvio tagline', () => {
  render(<App />);
  const tagline = screen.getByText(/the wristband that speaks before you do/i);
  expect(tagline).toBeInTheDocument();
});
