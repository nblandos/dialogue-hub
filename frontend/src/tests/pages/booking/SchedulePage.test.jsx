import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SchedulePage from '../../../pages/booking/SchedulePage';

vi.mock('../../../components/booking/WeeklyTimetable', () => ({
  default: () => <div data-testid="mock-weekly-timetable">Weekly Timetable</div>
}));

describe('SchedulePage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <SchedulePage />
      </BrowserRouter>
    );
  };

  it('renders the page title', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Schedule a Cafe Visit');
  });

  it('displays booking instructions', () => {
    renderComponent();
    expect(screen.getByText(/Select available time slots/)).toBeInTheDocument();
    expect(screen.getByText(/consecutive time slots/)).toBeInTheDocument();
  });

  it('includes the WeeklyTimetable component', () => {
    renderComponent();
    expect(screen.getByTestId('mock-weekly-timetable')).toBeInTheDocument();
  });
});