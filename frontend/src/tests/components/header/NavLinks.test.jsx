import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavLinks from '../../../components/header/NavLinks';

describe('NavLinks', () => {
  const renderNavLinks = (isMobile = false) => {
    return render(
      <BrowserRouter>
        <NavLinks isMobile={isMobile} />
      </BrowserRouter>
    );
  };

  it('renders all navigation links', () => {
    renderNavLinks();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('has correct link text content', () => {
    renderNavLinks();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('uses correct routing paths', () => {
    renderNavLinks();
    const [homeLink, menuLink] = screen.getAllByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(menuLink).toHaveAttribute('href', '/menu');
  });

  it('applies mobile classes when isMobile is true', () => {
    renderNavLinks(true);
    const [homeLink, menuLink] = screen.getAllByRole('link');
    expect(homeLink.className).toContain('py-2');
    expect(menuLink.className).toContain('py-2');
  });

  it('does not apply mobile classes when isMobile is false', () => {
    renderNavLinks(false);
    const [homeLink, menuLink] = screen.getAllByRole('link');
    expect(homeLink.className).not.toContain('py-2');
    expect(menuLink.className).not.toContain('py-2');
  });
});