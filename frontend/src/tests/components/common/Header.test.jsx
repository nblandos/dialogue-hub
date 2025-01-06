import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/common/Header';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('renders header component', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays the logo text', () => {
    renderHeader();
    expect(screen.getByText('Dialogue Cafe')).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    renderHeader();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('has correct link texts', () => {
    renderHeader();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('has correct routing paths', () => {
    renderHeader();
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/menu');
  });

  it('has correct styling classes', () => {
    renderHeader();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-orange-500');
    expect(nav).toHaveClass('fixed');
  });
});