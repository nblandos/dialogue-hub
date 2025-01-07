import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeekHeader from '../../../components/booking/WeekHeader';

describe('WeekHeader', () => {
  const mockDate = new Date(2024, 0, 1);
  const mockProps = {
    weekStart: mockDate,
    onPrevWeek: vi.fn(),
    onNextWeek: vi.fn(),
    onCurrentWeek: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct initial week date', () => {
    render(<WeekHeader {...mockProps} />);
    expect(screen.getByText('Week of 01 Jan 2024')).toBeInTheDocument();
  });

  it('renders navigation controls', () => {
    render(<WeekHeader {...mockProps} />);
    expect(screen.getByLabelText('Previous Week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Week')).toBeInTheDocument();
  });

  it('displays different dates correctly', () => {
    const testDates = [
      { date: new Date(2024, 5, 15), expected: 'Week of 15 Jun 2024' },
      { date: new Date(2024, 11, 25), expected: 'Week of 25 Dec 2024' }
    ];

    testDates.forEach(({ date, expected }) => {
      const { rerender } = render(<WeekHeader {...mockProps} weekStart={date} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<WeekHeader {...mockProps} weekStart={mockDate} />);
    });
  });
});