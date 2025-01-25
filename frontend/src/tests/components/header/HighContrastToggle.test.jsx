import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HighContrastToggle from '../../../components/header/HighContrastToggle';

describe('HighContrastToggle', () => {
  it('renders high contrast icons', () => {
    render(<HighContrastToggle isHighContrast={false} setIsHighContrast={() => {}} />);
    expect(screen.getByTestId('high-contrast-icon-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('high-contrast-icon-desktop')).toBeInTheDocument();
  });

  it('renders switch component', () => {
    render(<HighContrastToggle isHighContrast={false} setIsHighContrast={() => {}} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('reflects high contrast state in switch', () => {
    render(<HighContrastToggle isHighContrast={true} setIsHighContrast={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls setIsHighContrast when switch is clicked', () => {
    const setIsHighContrast = vi.fn();
    render(<HighContrastToggle isHighContrast={false} setIsHighContrast={setIsHighContrast} />);
    
    fireEvent.click(screen.getByRole('switch'));
    expect(setIsHighContrast).toHaveBeenCalledWith(true);
  });
});