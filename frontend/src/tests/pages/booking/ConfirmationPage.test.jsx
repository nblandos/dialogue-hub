import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConfirmationPage from '../../../pages/booking/ConfirmationPage';

describe('ConfirmationPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ConfirmationPage />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Confirmation Page')).toBeInTheDocument();
  });

  it('renders a heading', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});