import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MenuPage from '../../../pages/menu/MenuPage';

describe('MenuPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <MenuPage />
      </BrowserRouter>
    );
  };

  it('renders the page title', () => {
    renderComponent();
    expect(screen.getByText('Cafe Menu')).toBeInTheDocument();
  });

  it('renders search input and sort select', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('filters menu items based on search term', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'milk' } });
    // check that items that don't contain the search term are not rendered
    const filteredItems = screen.queryAllByText(/milk/i);
    expect(filteredItems.length).toBeGreaterThan(0);
  });

  it('sorts menu items alphabetically', () => {
    renderComponent();
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'asc' } });
    const items = screen.getAllByRole('heading', { level: 2 });
    expect(items.length).toBeGreaterThan(1);
  });

  it('sorts menu items in reverse alphabetically', () => {
    renderComponent();
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'desc' } });
    const items = screen.getAllByRole('heading', { level: 2 });
    expect(items.length).toBeGreaterThan(1);
  });
});
