import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/header/Header';

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

  it('shows mobile menu button on small screens', () => {
    renderHeader();
    expect(screen.getByRole('button')).toHaveClass('md:hidden');
  });

  it('toggles mobile menu when button is clicked', () => {
    renderHeader();
    const menuButton = screen.getByRole('button');
    const mobileMenu = screen.getByTestId('mobile-menu');
    
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass('flex');
    
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass('hidden');
  });

  it('loads and persists high contrast preference', () => {
    localStorage.setItem('highContrast', 'true');
    renderHeader();
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(localStorage.getItem('highContrast')).toBe('false');
  });
});