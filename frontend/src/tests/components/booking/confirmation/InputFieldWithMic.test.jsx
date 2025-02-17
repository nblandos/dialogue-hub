import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import InputFieldWithMic from '../../../../components/booking/confirmation/InputFieldWithMic';

describe('InputFieldWithMic', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    value: '',
    onChange: vi.fn(),
    onMicClick: vi.fn(),
    recordingField: '',
    isProcessing: false,
    autoComplete: 'off',
  };

  beforeEach(() => {
    cleanup();
  });

  it('renders email input type when id is email', () => {
    render(<InputFieldWithMic {...defaultProps} id="email" />);
    expect(screen.getByLabelText('Test Label')).toHaveAttribute(
      'type',
      'email'
    );
  });

  it('renders text input type when id is not email', () => {
    render(<InputFieldWithMic {...defaultProps} id="name" />);
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'text');
  });

  it('renders input field with label', () => {
    render(<InputFieldWithMic {...defaultProps} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<InputFieldWithMic {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Test Label'), {
      target: { value: 'test' },
    });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
