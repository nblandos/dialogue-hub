import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FontSizeAdjuster from '../../../components/header/FontSizeAdjuster';

describe('FontSizeAdjuster', () => {
  const mockSetFontSize = vi.fn();

  beforeEach(() => {
    mockSetFontSize.mockClear();
    localStorage.clear();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      fontSize: 16,
      setFontSize: mockSetFontSize,
      minFontSize: 12,
      maxFontSize: 20,
      ...props,
    };
    return render(<FontSizeAdjuster {...defaultProps} />);
  };

  it('displays current font size', () => {
    renderComponent();
    expect(screen.getByText('16px')).toBeInTheDocument();
  });

  it('increases font size when plus button is clicked', () => {
    renderComponent({ fontSize: 16 });
    fireEvent.click(screen.getByText('+'));

    expect(mockSetFontSize).toHaveBeenCalledWith(17);
    expect(localStorage.getItem('fontSize')).toBe('17');
  });

  it('decreases font size when minus button is clicked', () => {
    renderComponent({ fontSize: 16 });
    fireEvent.click(screen.getByText('-'));

    expect(mockSetFontSize).toHaveBeenCalledWith(15);
    expect(localStorage.getItem('fontSize')).toBe('15');
  });

  it('prevents decreasing below minimum font size', () => {
    renderComponent({ fontSize: 12 });
    fireEvent.click(screen.getByText('-'));

    expect(mockSetFontSize).not.toHaveBeenCalled();
  });

  it('prevents increasing above maximum font size', () => {
    renderComponent({ fontSize: 20 });
    fireEvent.click(screen.getByText('+'));

    expect(mockSetFontSize).not.toHaveBeenCalled();
  });

  it('has correct accessibility labels', () => {
    renderComponent();
    expect(screen.getByText('-')).toHaveAttribute(
      'data-screen-reader-text',
      'Decrease Font Size'
    );
    expect(screen.getByText('+')).toHaveAttribute(
      'data-screen-reader-text',
      'Increase Font Size'
    );
  });
});
