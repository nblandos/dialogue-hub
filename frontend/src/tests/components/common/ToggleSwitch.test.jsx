import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

describe('ToggleSwitch', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    label: 'Test Toggle',
    checked: false,
    onChange: mockOnChange,
    iconMobile: 'Mobile Icon',
    iconDesktop: 'Desktop Icon',
  };

  it('renders with initial unchecked state', () => {
    render(<ToggleSwitch {...defaultProps} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('renders with checked state', () => {
    render(<ToggleSwitch {...defaultProps} checked={true} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked', () => {
    render(<ToggleSwitch {...defaultProps} />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders mobile icon on mobile viewport', () => {
    render(<ToggleSwitch {...defaultProps} />);
    const mobileIcon = screen.getByText('Mobile Icon');
    expect(mobileIcon).toHaveClass('md:hidden');
  });

  it('renders desktop icon on desktop viewport', () => {
    render(<ToggleSwitch {...defaultProps} />);
    const desktopIcon = screen.getByText('Desktop Icon');
    expect(desktopIcon).toHaveClass('hidden md:block');
  });

  it('renders label as screen reader text', () => {
    render(<ToggleSwitch {...defaultProps} />);
    const srLabel = screen.getByText('Test Toggle');
    expect(srLabel).toHaveClass('sr-only');
  });
});
