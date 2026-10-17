import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { apiService } from './services/api';

const impact = {
  totalPledgedPence: 4200,
  currency: 'GBP' as const,
  eligibleBandsSold: 42,
  lastUpdated: '2026-10-17T12:00:00.000Z',
  donations: [],
};

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState({}, '', '/');
});

test('renders the Luvio tagline and live homepage pledge', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockResolvedValue(impact);
  render(<App />);
  const tagline = screen.getByText(/the wristband that speaks before you do/i);
  expect(tagline).toBeInTheDocument();
  expect(await screen.findByText(/£42 pledged so far/i)).toBeInTheDocument();
});

test('renders the dedicated charity route', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockResolvedValue(impact);
  window.history.replaceState({}, '', '/charity');

  render(<App />);

  expect(screen.getByRole('heading', { name: /making a difference together/i })).toBeInTheDocument();
  expect(await screen.findByText(/£42 pledged so far/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /official mind website/i })).toHaveAttribute(
    'href',
    'https://www.mind.org.uk/'
  );
});

test('shows a neutral fallback when the charity API is unavailable', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockRejectedValue(new Error('offline'));
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/live total temporarily unavailable/i)).toBeInTheDocument();
  });
});
