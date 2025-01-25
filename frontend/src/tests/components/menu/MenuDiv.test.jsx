import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MenuDiv from '../../../components/menu/MenuDiv';

describe('MenuDiv', () => {
  it('renders the correct number of MenuItem components', () => {
    const mockMenu = [
      { name: 'Item A', price: '£1.00', video: 'https://exampleA.com' },
      { name: 'Item B', price: '£2.00', video: 'https://exampleB.com' },
    ];

    render(<MenuDiv filteredMenu={mockMenu} />);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('(£1.00)')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('(£2.00)')).toBeInTheDocument();
  });

  it('renders no items if filteredMenu is empty', () => {
    render(<MenuDiv filteredMenu={[]} />);
    expect(screen.queryByText(/£/)).toBeNull();
  });
});