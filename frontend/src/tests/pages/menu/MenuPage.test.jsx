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
    fireEvent.change(searchInput, { target: { value: 'latte' } });
    // check that items that don't contain the search term are not rendered
    const filteredItems = screen.queryAllByText(/latte/i);
    expect(filteredItems.length).toBeGreaterThan(0);
  });

  it('sorts menu items by name', () => {
    renderComponent();
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    const items = screen.getAllByRole('heading', { level: 2 });
    expect(items.length).toBeGreaterThan(1);
  });

  it('sorts menu items by price', () => {
    renderComponent();
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'price' } });
    const prices = screen.getAllByText(/£/);

    // check that prices are in ascending order, remove parentheses and £ sign
    for (let i = 0; i < prices.length - 1; i++) {
      const current = parseFloat(
        prices[i].textContent.replace('(', '').replace(')', '').replace('£', '')
      );
      const next = parseFloat(
        prices[i + 1].textContent
          .replace('(', '')
          .replace(')', '')
          .replace('£', '')
      );
      expect(current).toBeLessThanOrEqual(next);
    }
  });
});
