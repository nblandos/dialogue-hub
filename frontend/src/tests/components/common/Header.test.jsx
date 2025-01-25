import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/common/Header';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('renders navigation bar', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays logo text', () => {
    renderHeader();
    expect(screen.getByText('Dialogue Cafe')).toBeInTheDocument();
  });

  it('contains all navigation links', () => {
    renderHeader();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('has correct navigation text content', () => {
    renderHeader();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('uses correct routing paths', () => {
    renderHeader();
    const [homeLink, menuLink] = screen.getAllByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(menuLink).toHaveAttribute('href', '/menu');
  });

  it('renders high contrast toggle switch', () => {
    renderHeader();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders high contrast icon', () => {
    renderHeader();
    expect(screen.getByTestId('high-contrast-icon')).toBeInTheDocument();
  });

  it('toggles high contrast mode when switch is clicked', () => {
    renderHeader();
    const toggle = screen.getByRole('switch');
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });

  it('persists high contrast preference in localStorage', () => {
    renderHeader();
    const toggle = screen.getByRole('switch');
    
    fireEvent.click(toggle);
    expect(localStorage.getItem('highContrast')).toBe('true');
    
    fireEvent.click(toggle);
    expect(localStorage.getItem('highContrast')).toBe('false');
  });

  it('loads high contrast preference from localStorage', () => {
    localStorage.setItem('highContrast', 'true');
    renderHeader();
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});