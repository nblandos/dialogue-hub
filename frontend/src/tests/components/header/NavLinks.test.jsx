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
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('has correct link text content', () => {
    renderNavLinks();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Training Videos')).toBeInTheDocument();
  });

  it('uses correct routing paths', () => {
    renderNavLinks();
    const [homeLink, menuLink, trainingLink] = screen.getAllByRole('link');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(menuLink).toHaveAttribute('href', '/menu');
    expect(trainingLink).toHaveAttribute('href', '/training');
  });

  it('applies mobile classes when isMobile is true', () => {
    renderNavLinks(true);
    const [homeLink, menuLink, trainingLink] = screen.getAllByRole('link');
    expect(homeLink.className).toContain('py-2');
    expect(menuLink.className).toContain('py-2');
    expect(trainingLink.className).toContain('py-2');
  });
});
