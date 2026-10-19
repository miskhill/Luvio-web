import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

beforeEach(() => {
  window.scrollTo = jest.fn();
});

test('renders the Luvio tagline and live homepage pledge', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockResolvedValue(impact);
  render(<App />);
  const tagline = screen.getByText(/the wristband that speaks before you do/i);
  expect(tagline).toBeInTheDocument();
  expect(await screen.findByText(/£42/i)).toHaveTextContent('£42 pledged so far');
  expect(screen.getByRole('button', { name: /shop bands/i })).toBeInTheDocument();
  expect(screen.getByText(/wait for my signal/i)).toBeInTheDocument();
});

test('renders the dedicated charity route', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockResolvedValue(impact);
  window.history.replaceState({}, '', '/charity');

  render(<App />);

  expect(screen.getByRole('heading', { name: /making a difference together/i })).toBeInTheDocument();
  expect(await screen.findByText(/£42/i)).toHaveTextContent('£42 pledged so far');
  expect(screen.getByRole('link', { name: /official mind website/i })).toHaveAttribute(
    'href',
    'https://www.mind.org.uk/'
  );
});

test('navigates to the event enquiry and keeps every enquiry field available', () => {
  jest.spyOn(apiService, 'getCharityImpact').mockResolvedValue(impact);
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /bring luvio to an event/i }));

  expect(screen.getByRole('heading', { name: /bring luvio to your next event/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/event name/i)).toBeRequired();
  expect(screen.getByLabelText(/event date and time/i)).toBeRequired();
  expect(screen.getByLabelText(/event location/i)).toBeRequired();
  expect(screen.getByLabelText(/your email/i)).toBeRequired();
  expect(screen.getByLabelText(/we need wristbands supplied/i)).toBeInTheDocument();
});

test('loads live catalog prices and adds a product to the cart', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockResolvedValue(impact);
  jest.spyOn(apiService, 'getCatalog').mockResolvedValue({
    pricingSource: 'stripe',
    checkoutEnabled: true,
    checkoutDisabledReason: null,
    shippingOptions: [{ id: 'standard', displayName: 'Postage', amount: 1.5, currency: 'gbp' }],
    products: [{
      id: 'yellow-band',
      name: 'Yellow Luvio Band',
      color: '#f1c40f',
      imageUrl: null,
      description: 'Legacy description',
      price: 2.5,
      currency: 'gbp',
    }],
  });
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /^shop$/i }));
  expect(await screen.findByRole('heading', { name: /yellow luvio band/i })).toBeInTheDocument();
  expect(screen.getByText('£2.50')).toBeInTheDocument();
  expect(screen.getByText(/wait for my signal/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  expect(screen.getByText(/1 items/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /review checkout/i })).toBeEnabled();
});

test('shows a neutral fallback when the charity API is unavailable', async () => {
  jest.spyOn(apiService, 'getCharityImpact').mockRejectedValue(new Error('offline'));
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/live total temporarily unavailable/i)).toBeInTheDocument();
  });
});
