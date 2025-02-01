import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DyslexicFontToggle from '../../../components/header/DyslexicFontToggle';

describe('DyslexicFontToggle', () => {
  const renderToggle = () => {
    return render(
      <DyslexicFontToggle isDyslexicFont={false} setIsDyslexicFont={() => {}} />
    );
  };

  it('renders mobile and desktop icons', () => {
    renderToggle();
    expect(screen.getByTestId('dyslexic-font-icon-mobile')).toBeInTheDocument();
    expect(
      screen.getByTestId('dyslexic-font-icon-desktop')
    ).toBeInTheDocument();
  });

  it('has correct accessibility label', () => {
    renderToggle();
    expect(screen.getByRole('switch')).toHaveAttribute(
      'aria-label',
      'Toggle dyslexic font mode'
    );
  });
});
