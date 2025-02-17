import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Routes, Route } from 'react-router-dom';
import ConfirmationPage, {
  preprocessEmail,
  validateEmail,
  validateFullName,
} from '../../../pages/booking/ConfirmationPage';

const selectedSlots = ['2024-03-18T9', '2024-03-18T10'];

const renderWithRouter = (state = {}) => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: '/confirm',
        state,
      },
    ],
  });
  return {
    history,
    ...render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/success" element={<div>Success Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </Router>
    ),
  };
};

describe('SpeechRecognition events', () => {
  it('sets SpeechRecognition interimResults and maxAlternatives correctly', () => {
    let assignedInterimResults, assignedMaxAlternatives;
    const fakeRecognition = {
      start: vi.fn(),
      set interimResults(value) {
        assignedInterimResults = value;
      },
      get interimResults() {
        return assignedInterimResults;
      },
      set maxAlternatives(value) {
        assignedMaxAlternatives = value;
      },
      get maxAlternatives() {
        return assignedMaxAlternatives;
      },
    };
    window.SpeechRecognition = vi.fn(() => fakeRecognition);

    renderWithRouter({ selectedSlots });
    const micButton = screen.getByTestId('mic-button-name');
    fireEvent.click(micButton);
    expect(assignedInterimResults).toBe(false);
    expect(assignedMaxAlternatives).toBe(1);
  });

  it('handles speech recognition success for email input', async () => {
    const fakeRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null,
      onend: null,
    };
    window.SpeechRecognition = vi.fn(() => fakeRecognition);

    renderWithRouter({ selectedSlots });
    const micButton = screen.getByTestId('mic-button-email');
    fireEvent.click(micButton);
    const transcript = 'test at domain dot com';
    fakeRecognition.onresult({ results: [[{ transcript }]] });
    await waitFor(() => {
      expect(screen.getByDisplayValue('test@domain.com')).toBeInTheDocument();
    });
  });

  it('handles recognition error event', async () => {
    const fakeRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null,
      onend: null,
    };
    window.SpeechRecognition = vi.fn(() => fakeRecognition);
    renderWithRouter({ selectedSlots });
    const micButton = screen.getByTestId('mic-button-name');
    fireEvent.click(micButton);

    fakeRecognition.onerror();
    await waitFor(() => {
      expect(screen.queryByText('Stop')).not.toBeInTheDocument();
    });
  });

  it('handles recognition end event', async () => {
    const fakeRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null,
      onend: null,
    };
    window.SpeechRecognition = vi.fn(() => fakeRecognition);
    renderWithRouter({ selectedSlots });
    const micButton = screen.getByTestId('mic-button-name');
    fireEvent.click(micButton);

    fakeRecognition.onend();
    await waitFor(() => {
      expect(screen.queryByText('Stop')).not.toBeInTheDocument();
    });
  });

  it('handles browsers without SpeechRecognition support', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const originalSpeechRecognition = window.SpeechRecognition;
    const originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;

    renderWithRouter({ selectedSlots });
    const micButton = screen.getByTestId('mic-button-name');
    fireEvent.click(micButton);

    expect(alertSpy).toHaveBeenCalledWith(
      'Speech recognition is not supported in this browser.'
    );

    expect(screen.queryByText('Stop')).not.toBeInTheDocument();

    window.SpeechRecognition = originalSpeechRecognition;
    window.webkitSpeechRecognition = originalWebkitSpeechRecognition;
    alertSpy.mockRestore();
  });
});

describe('ConfirmationPage', () => {
  const selectedSlots = ['2024-03-18T9', '2024-03-18T10'];

  const renderWithRouter = (state = {}) => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: '/confirm',
          state,
        },
      ],
    });
    return {
      history,
      ...render(
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/confirm" element={<ConfirmationPage />} />
            <Route path="/success" element={<div>Success Page</div>} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </Router>
      ),
    };
  };

  beforeEach(() => {
    vi.spyOn(window, 'fetch');
  });

  afterEach(() => {
    window.fetch.mockRestore();
    cleanup();
  });

  it('renders the confirmation page with header, booking details and input fields', () => {
    renderWithRouter({ selectedSlots });
    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your full name')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your email address')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not attempt booking if inputs are invalid', () => {
    renderWithRouter({ selectedSlots });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('navigates to success page on successful confirmation', async () => {
    const mockResponse = { ok: true, json: async () => ({}) };
    window.fetch.mockResolvedValueOnce(mockResponse);
    const { history } = renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/success');
    });
  });

  it('navigates to booking page when cancel button is clicked', () => {
    const { history } = renderWithRouter({ selectedSlots });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(history.location.pathname).toBe('/book');
  });

  it('displays default booking details when no slots selected', () => {
    renderWithRouter({ selectedSlots: [] });
    expect(screen.getByText('Confirm Your Booking')).toBeInTheDocument();
    expect(screen.getByText('No date selected')).toBeInTheDocument();
    expect(screen.getByText('No time selected')).toBeInTheDocument();
  });

  it('formats booking details correctly when slots are provided', () => {
    renderWithRouter({ selectedSlots });
    expect(screen.getByText('Monday, 18 Mar 2024')).toBeInTheDocument();
    expect(screen.getByText('9:00 - 11:00')).toBeInTheDocument();
  });

  it('handles speech recognition success for name input', async () => {
    const fakeRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null,
      onend: null,
    };
    window.SpeechRecognition = vi.fn(() => fakeRecognition);
    renderWithRouter({ selectedSlots });
    const micButton = screen.getByTestId('mic-button-name');
    fireEvent.click(micButton);
    const transcript = 'Test User Two';
    fakeRecognition.onresult({ results: [[{ transcript }]] });
    await waitFor(() => {
      expect(screen.getByDisplayValue(transcript)).toBeInTheDocument();
    });
  });

  it('displays error when API returns INVALID_REQUEST error', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({ code: 'INVALID_REQUEST' }),
    };
    window.fetch.mockResolvedValueOnce(errorResponse);
    renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(
        screen.getByText('Missing booking data. Please fill in all fields.')
      ).toBeInTheDocument();
    });
  });

  it('displays API error message from server response', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({ code: 'INVALID_DATA', message: 'Test error.' }),
    };
    window.fetch.mockResolvedValueOnce(errorResponse);
    renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(screen.getByText('Test error.')).toBeInTheDocument();
    });
  });

  it('prevents confirmation when full name is invalid', () => {
    renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('preprocesses email transcript correctly', () => {
    expect(preprocessEmail('test at gmail dot com')).toBe('test@gmail.com');
    expect(preprocessEmail('test AT GMAIL DOT COM')).toBe('test@gmail.com');
    expect(preprocessEmail('test at gmail dot com dot uk')).toBe(
      'test@gmail.com.uk'
    );
  });

  it('validates email addresses correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@domain')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('validates full names correctly', () => {
    expect(validateFullName('John Doe')).toBe(true);
    expect(validateFullName('J')).toBe(false);
    expect(validateFullName('John')).toBe(false);
    expect(validateFullName('a'.repeat(101))).toBe(false);
    expect(validateFullName('   ')).toBe(false);
  });

  it('handles EMAIL_ERROR response from API', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({ code: 'EMAIL_ERROR' }),
    };
    window.fetch.mockResolvedValueOnce(errorResponse);
    renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(
        screen.getByText('Booking created but email confirmation failed.')
      ).toBeInTheDocument();
    });
  });

  it('handles SERVER_ERROR response from API', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({ code: 'SERVER_ERROR' }),
    };
    window.fetch.mockResolvedValueOnce(errorResponse);
    renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(
        screen.getByText('A server error occurred. Please try again later.')
      ).toBeInTheDocument();
    });
  });

  it('handles unknown error codes from API', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({
        code: 'UNKNOWN_ERROR',
        message: 'Unknown error occurred',
      }),
    };
    window.fetch.mockResolvedValueOnce(errorResponse);
    renderWithRouter({ selectedSlots });
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
    });
  });

  it('toggles recording state when mic button is clicked', () => {
    renderWithRouter({ selectedSlots });
    const emailMicButton = screen.getByTestId('mic-button-email');

    fireEvent.click(emailMicButton);
    expect(screen.getByText('Stop')).toBeInTheDocument();

    fireEvent.click(emailMicButton);
    expect(screen.queryByText('Stop')).not.toBeInTheDocument();
  });
});
