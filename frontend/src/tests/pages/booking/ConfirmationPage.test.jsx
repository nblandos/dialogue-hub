import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ConfirmationPage from '../../../pages/booking/ConfirmationPage';

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
});
