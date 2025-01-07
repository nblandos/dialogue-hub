import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WeeklyTimetable from '../../../components/booking/WeeklyTimetable';

vi.mock('../../../components/booking/TimeSlotGrid', () => ({
  default: ({ onSlotClick }) => (
    <div data-testid="time-slot-grid">
      <button onClick={() => onSlotClick('2024-03-18', 9)}>Select 9:00 (Mon)</button>
      <button onClick={() => onSlotClick('2024-03-18', 10)}>Select 10:00 (Mon)</button>
      <button onClick={() => onSlotClick('2024-03-18', 11)}>Select 11:00 (Mon)</button>
      <button onClick={() => onSlotClick('2024-03-19', 9)}>Select 9:00 (Tue)</button>
    </div>
  ),
}));

vi.mock('../../../components/booking/WeekHeader', () => ({
  default: ({ onPrevWeek, onNextWeek, onCurrentWeek }) => (
    <div data-testid="week-header">
      <button onClick={onPrevWeek}>Previous Week</button>
      <button onClick={onCurrentWeek}>Current Week</button>
      <button onClick={onNextWeek}>Next Week</button>
    </div>
  ),
}));

vi.mock('../../../components/booking/SelectedTimeDisplay', () => ({
  default: ({ formattedTime, onCancel, onBook }) => (
    <div data-testid="selected-time-display">
      <span>{formattedTime}</span>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onBook}>Book</button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('WeeklyTimetable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-18'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <WeeklyTimetable />
      </BrowserRouter>
    );
  };

  it('renders all core subcomponents initially', () => {
    renderComponent();
    expect(screen.getByTestId('week-header')).toBeInTheDocument();
    expect(screen.getByTestId('time-slot-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('selected-time-display')).not.toBeInTheDocument();
  });

  it('handles week navigation', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Next Week'));
    fireEvent.click(screen.getByText('Previous Week'));
    fireEvent.click(screen.getByText('Current Week'));
    expect(screen.getByTestId('time-slot-grid')).toBeInTheDocument();
  });

  it('adds a new slot if nothing was selected previously', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    expect(screen.getByTestId('selected-time-display')).toBeInTheDocument();
    expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
  });

  it('removes a previously selected slot if clicked again', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    expect(screen.getByTestId('selected-time-display')).toHaveTextContent('09:00 - 10:00');
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    expect(screen.queryByTestId('selected-time-display')).not.toBeInTheDocument();
  });

  it('allows selecting consecutive slots', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    fireEvent.click(screen.getByText('Select 10:00 (Mon)'));
    expect(screen.getByTestId('selected-time-display')).toHaveTextContent('09:00 - 11:00');
  });

  it('resets selection if a slot is chosen for a different day', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    fireEvent.click(screen.getByText('Select 9:00 (Tue)'));
    expect(screen.getByTestId('selected-time-display')).toHaveTextContent('09:00 - 10:00');
    expect(screen.getByTestId('selected-time-display')).not.toHaveTextContent('Mon');
  });

  it('removes a middle slot if it is clicked again', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    fireEvent.click(screen.getByText('Select 10:00 (Mon)'));
    fireEvent.click(screen.getByText('Select 11:00 (Mon)'));
    expect(screen.getByText(/09:00 - 12:00/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Select 10:00 (Mon)'));
    expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
    expect(screen.queryByText(/09:00 - 12:00/)).not.toBeInTheDocument();
  });

  it('cancels selection', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('selected-time-display')).not.toBeInTheDocument();
  });

  it('navigates to confirmation page on booking', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Select 9:00 (Mon)'));
    fireEvent.click(screen.getByText('Book'));
    expect(mockNavigate).toHaveBeenCalledWith('/confirmation', {
      state: { selectedSlots: ['2024-03-18T9'] }
    });
  });
});