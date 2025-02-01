import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationActions from '../../../../components/booking/confirmation/ConfirmationActions';

describe('ConfirmationActions', () => {
  const defaultProps = {
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
    loading: false,
    apiError: '',
    errors: { name: false, email: false },
  };

  it('renders action buttons', () => {
    render(<ConfirmationActions {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ConfirmationActions {...defaultProps} loading={true} />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('displays API error message', () => {
    render(
      <ConfirmationActions {...defaultProps} apiError="An error occurred" />
    );
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('displays full name validation error', () => {
    render(
      <ConfirmationActions
        {...defaultProps}
        errors={{ name: true, email: false }}
      />
    );
    expect(
      screen.getByText('Please enter a valid full name.')
    ).toBeInTheDocument();
  });

  it('displays email validation error', () => {
    render(
      <ConfirmationActions
        {...defaultProps}
        errors={{ name: false, email: true }}
      />
    );
    expect(
      screen.getByText('Please enter a valid email address.')
    ).toBeInTheDocument();
  });

  it('calls handlers on button clicks', () => {
    render(<ConfirmationActions {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
