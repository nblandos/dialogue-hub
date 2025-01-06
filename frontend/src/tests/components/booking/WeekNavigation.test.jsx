import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WeekNavigation from '../../../components/booking/WeekNavigation';

describe('WeekNavigation', () => {
  const mockProps = {
    onPrevWeek: vi.fn(),
    onNextWeek: vi.fn(),
    onCurrentWeek: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all three navigation buttons', () => {
    render(<WeekNavigation {...mockProps} />);
    expect(screen.getByLabelText('Previous Week')).toBeInTheDocument();
    expect(screen.getByText('Current Week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Week')).toBeInTheDocument();
  });

  it('calls onPrevWeek when clicking previous week button', () => {
    render(<WeekNavigation {...mockProps} />);
    const prevButton = screen.getByLabelText('Previous Week');
    fireEvent.click(prevButton);
    expect(mockProps.onPrevWeek).toHaveBeenCalledTimes(1);
  });

  it('calls onNextWeek when clicking next week button', () => {
    render(<WeekNavigation {...mockProps} />);
    const nextButton = screen.getByLabelText('Next Week');
    fireEvent.click(nextButton);
    expect(mockProps.onNextWeek).toHaveBeenCalledTimes(1);
  });

  it('calls onCurrentWeek when clicking current week button', () => {
    render(<WeekNavigation {...mockProps} />);
    const currentButton = screen.getByText('Current Week');
    fireEvent.click(currentButton);
    expect(mockProps.onCurrentWeek).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes for navigation buttons', () => {
    render(<WeekNavigation {...mockProps} />);
    
    const prevButton = screen.getByLabelText('Previous Week');
    const currentButton = screen.getByText('Current Week');
    const nextButton = screen.getByLabelText('Next Week');

    expect(prevButton).toHaveClass('bg-gray-200');
    expect(currentButton).toHaveClass('bg-orange-500');
    expect(nextButton).toHaveClass('bg-gray-200');
  });

  it('has correct aria-labels for accessibility', () => {
    render(<WeekNavigation {...mockProps} />);
    expect(screen.getByLabelText('Previous Week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Week')).toBeInTheDocument();
  });

  it('renders icons in navigation buttons', () => {
    const { container } = render(<WeekNavigation {...mockProps} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('has correct layout structure', () => {
    const { container } = render(<WeekNavigation {...mockProps} />);
    const navigationContainer = container.firstChild;
    expect(navigationContainer).toHaveClass('flex', 'gap-2');
  });
});