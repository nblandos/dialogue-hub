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

  it('renders the component with correct heading', () => {
    renderComponent();
    expect(screen.getByText('Selected Time:')).toBeInTheDocument();
  });

  it('displays the formatted time', () => {
    renderComponent();
    expect(screen.getByText(mockFormattedTime)).toBeInTheDocument();
  });

  it('renders both buttons with correct text', () => {
    renderComponent();
    expect(screen.getByText('Cancel Selection')).toBeInTheDocument();
    expect(screen.getByText('Book Selected Slots')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderComponent();
    const cancelButton = screen.getByText('Cancel Selection');
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onBook when book button is clicked', () => {
    renderComponent();
    const bookButton = screen.getByText('Book Selected Slots');
    fireEvent.click(bookButton);
    expect(mockOnBook).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes for buttons', () => {
    renderComponent();
    const cancelButton = screen.getByText('Cancel Selection');
    const bookButton = screen.getByText('Book Selected Slots');
    
    expect(cancelButton).toHaveClass('bg-gray-200');
    expect(bookButton).toHaveClass('bg-orange-500');
  });

  it('renders in the correct layout structure', () => {
    renderComponent();
    const container = screen.getByText('Selected Time:').closest('div');
    expect(container).toHaveClass('flex-grow');
  });
});