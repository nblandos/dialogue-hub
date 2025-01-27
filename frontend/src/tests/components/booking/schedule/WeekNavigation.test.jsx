import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WeekNavigation from '../../../../components/booking/schedule/WeekNavigation';

describe('WeekNavigation', () => {
  const mockProps = {
    onPrevWeek: vi.fn(),
    onNextWeek: vi.fn(),
    onCurrentWeek: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all navigation buttons', () => {
    render(<WeekNavigation {...mockProps} />);
    expect(screen.getByLabelText('Previous Week')).toBeInTheDocument();
    expect(screen.getByText('Current Week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Week')).toBeInTheDocument();
  });

  it('calls correct handlers when clicking buttons', () => {
    render(<WeekNavigation {...mockProps} />);
    fireEvent.click(screen.getByLabelText('Previous Week'));
    expect(mockProps.onPrevWeek).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Current Week'));
    expect(mockProps.onCurrentWeek).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('Next Week'));
    expect(mockProps.onNextWeek).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility labels', () => {
    render(<WeekNavigation {...mockProps} />);
    expect(screen.getByLabelText('Previous Week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Week')).toBeInTheDocument();
  });

  it('renders navigation icons', () => {
    const { container } = render(<WeekNavigation {...mockProps} />);
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });
});
