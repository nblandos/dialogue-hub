import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedTimeDisplay from '../../../components/booking/SelectedTimeDisplay';

describe('SelectedTimeDisplay', () => {
  const mockFormattedTime = '2:00 PM - 3:00 PM';
  const mockOnCancel = vi.fn();
  const mockOnBook = vi.fn();

  const renderComponent = () => {
    return render(
      <SelectedTimeDisplay
        formattedTime={mockFormattedTime}
        onCancel={mockOnCancel}
        onBook={mockOnBook}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with selected time information', () => {
    renderComponent();
    expect(screen.getByText('Selected Time:')).toBeInTheDocument();
    expect(screen.getByText(mockFormattedTime)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderComponent();
    expect(screen.getByText('Cancel Selection')).toBeInTheDocument();
    expect(screen.getByText('Book Selected Slots')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Cancel Selection'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onBook when book button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Book Selected Slots'));
    expect(mockOnBook).toHaveBeenCalledTimes(1);
  });
});
