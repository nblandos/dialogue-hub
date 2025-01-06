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

  it('renders the component with correct week date', () => {
    render(<WeekHeader {...mockProps} />);
    expect(screen.getByText('Week of 01 Jan 2024')).toBeInTheDocument();
  });

  it('passes correct props to WeekNavigation component', () => {
    const { container } = render(<WeekHeader {...mockProps} />);
    const navigationElement = container.querySelector('.flex.items-center.justify-between');
    expect(navigationElement).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(<WeekHeader {...mockProps} />);
    const headerContainer = container.firstChild;
    expect(headerContainer).toHaveClass('mb-4', 'flex', 'items-center', 'justify-between');
  });

  it('displays date in correct format', () => {
    const testDate = new Date(2024, 5, 15);
    render(<WeekHeader {...mockProps} weekStart={testDate} />);
    expect(screen.getByText('Week of 15 Jun 2024')).toBeInTheDocument();
  });

  it('renders with different date', () => {
    const differentDate = new Date(2024, 11, 25);
    render(<WeekHeader {...mockProps} weekStart={differentDate} />);
    expect(screen.getByText('Week of 25 Dec 2024')).toBeInTheDocument();
  });

  it('has correct text styling', () => {
    render(<WeekHeader {...mockProps} />);
    const dateText = screen.getByText(/Week of/).closest('div');
    expect(dateText).toHaveClass('text-m', 'font-medium');
  });
});