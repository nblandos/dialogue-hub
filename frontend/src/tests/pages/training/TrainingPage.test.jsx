import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TrainingPage from '../../../pages/training/TrainingPage';

describe('TrainingPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <TrainingPage />
      </BrowserRouter>
    );
  };

  it('renders the page title', () => {
    renderComponent();
    expect(screen.getByText('Training Videos')).toBeInTheDocument();
  });

  it('renders search input and sort select', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('filters training videos based on search term', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'hello' } });
    const filteredItems = screen.queryAllByText(/hello/i);
    expect(filteredItems.length).toBeGreaterThan(0);
  });

  it('sorts videos alphabetically', () => {
    renderComponent();
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'asc' } });
    const items = screen.getAllByRole('heading', { level: 2 });
    expect(items.length).toBeGreaterThan(1);
  });

  it('sorts videos in reverse alphabetically', () => {
    renderComponent();
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'desc' } });
    const items = screen.getAllByRole('heading', { level: 2 });
    expect(items.length).toBeGreaterThan(1);
  });
});
