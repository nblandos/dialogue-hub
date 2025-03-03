import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ConfirmationPage, {
  preprocessEmail,
  validateEmail,
  validateFullName,
} from '../../../pages/booking/ConfirmationPage';

const renderWithRouter = (locationState) => {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/confirm', state: locationState }]}
    >
      <Routes>
        <Route path="/confirm" element={<ConfirmationPage />} />
        <Route path="/success" element={<div>Success Page</div>} />
        <Route path="/book" element={<div>Book Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ConfirmationPage', () => {
  const validSlots = ['2024-03-18T9'];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default booking details when no selectedSlots provided', () => {
    renderWithRouter({});
    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();
    expect(screen.getByText('No date selected')).toBeInTheDocument();
    expect(screen.getByText('No time selected')).toBeInTheDocument();
  });

  it('renders formatted booking details when selectedSlots provided', () => {
    renderWithRouter({ selectedSlots: validSlots });
    expect(screen.getByText(/Mon/i)).toBeInTheDocument();
  });

  it('handles undefined location state gracefully', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/confirm' }]}>
        <Routes>
          <Route path="/confirm" element={<ConfirmationPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();
    expect(screen.getByText('No date selected')).toBeInTheDocument();
    expect(screen.getByText('No time selected')).toBeInTheDocument();
    // No errors should be thrown
  });

  it('navigates to /success on successful booking creation', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'booking created' }),
    });

    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(screen.getByText('Success Page')).toBeInTheDocument();
    });
  });

  it('displays API error when booking creation fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'EMAIL_ERROR' }),
    });

    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    const errorMessage = await screen.findByText(
      'Booking created but email confirmation failed.'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to /book on cancel click', async () => {
    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.getByText('Book Page')).toBeInTheDocument();
    });
  });

  describe('utility functions', () => {
    describe('preprocessEmail', () => {
      it('converts spoken email format to proper email format', () => {
        expect(preprocessEmail('test at example dot com')).toBe(
          'test@example.com'
        );
        expect(preprocessEmail('john DOT smith AT gmail DOT com')).toBe(
          'john.smith@gmail.com'
        );
        expect(preprocessEmail('user at domain dot co dot uk')).toBe(
          'user@domain.co.uk'
        );
        expect(preprocessEmail('email with spaces')).toBe('emailwithspaces');
      });
    });

    describe('validateEmail', () => {
      it('validates correct email formats', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@domain.co.uk')).toBe(true);
        expect(validateEmail('user@sub.domain.com')).toBe(true);
      });

      it('rejects incorrect email formats', () => {
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('test@domain')).toBe(false);
        expect(validateEmail('testdomain.com')).toBe(false);
        expect(validateEmail('')).toBe(false);
        expect(validateEmail('test@domain.')).toBe(false);
      });
    });

    describe('validateFullName', () => {
      it('validates correct full names', () => {
        expect(validateFullName('John Smith')).toBe(true);
        expect(validateFullName('Jane M. Doe')).toBe(true);
        expect(validateFullName('Robert John Williams III')).toBe(true);
      });

      it('rejects names that are too short', () => {
        expect(validateFullName('')).toBe(false);
        expect(validateFullName('J')).toBe(false);
      });

      it('rejects names without at least two parts', () => {
        expect(validateFullName('John')).toBe(false);
      });

      it('rejects names that are too long', () => {
        expect(validateFullName('A'.repeat(101))).toBe(false);
      });
    });
  });

  it('shows validation errors for invalid name', async () => {
    renderWithRouter({ selectedSlots: validSlots });

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John' }, // Single word name
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }, // Valid email
    });

    fireEvent.click(screen.getByText('Confirm'));

    await screen.findByText('Please enter a valid full name.');
  });

  it('shows validation errors for invalid email', async () => {
    renderWithRouter({ selectedSlots: validSlots });

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Smith' }, // Valid name
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' }, // Invalid email
    });

    fireEvent.click(screen.getByText('Confirm'));

    await screen.findByText('Please enter a valid email address.');
  });

  it('handles INVALID_REQUEST error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'INVALID_REQUEST' }),
    });

    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    await screen.findByText('Missing booking data. Please fill in all fields.');
  });

  it('handles INVALID_DATA error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        code: 'INVALID_DATA',
        message: 'Custom error message',
      }),
    });

    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    await screen.findByText('Custom error message');
  });

  it('handles SERVER_ERROR', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'SERVER_ERROR' }),
    });

    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    await screen.findByText('A server error occurred. Please try again later.');
  });

  it('handles unknown error codes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'UNKNOWN_CODE', message: 'Unknown error' }),
    });

    renderWithRouter({ selectedSlots: validSlots });
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    await screen.findByText('Unknown error');
  });

  it('formats time range correctly with multiple time slots', () => {
    renderWithRouter({
      selectedSlots: ['2024-03-18T9', '2024-03-18T10', '2024-03-18T11'],
    });
    expect(screen.getByText('9:00 - 12:00')).toBeInTheDocument();
  });
});
