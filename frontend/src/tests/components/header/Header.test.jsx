import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/header/Header';

describe('Header', () => {
  let mockSpeechSynthesis;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = '';
    document.documentElement.classList.remove('high-contrast', 'dyslexic-font');

    mockSpeechSynthesis = { cancel: vi.fn(), speak: vi.fn() };
    window.speechSynthesis = mockSpeechSynthesis;
    global.SpeechSynthesisUtterance = vi.fn();

    global.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = '';
    document.documentElement.classList.remove('high-contrast', 'dyslexic-font');
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('renders navigation and brand elements', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Dialogue Cafe')).toBeInTheDocument();
  });

  it('loads stored preferences from localStorage', () => {
    localStorage.setItem('highContrast', 'true');
    localStorage.setItem('dyslexicFont', 'true');
    localStorage.setItem('fontSize', '18');

    renderHeader();

    expect(document.documentElement.classList.contains('high-contrast')).toBe(
      true
    );
    expect(document.documentElement.classList.contains('dyslexic-font')).toBe(
      true
    );
    expect(document.documentElement.style.fontSize).toBe('18px');
  });

  it('toggles mobile accessibility menu state', () => {
    renderHeader();
    const menuButton = screen.getByLabelText(/Open accessibility menu/i);

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(menuButton).toHaveAttribute(
      'data-screen-reader-text',
      'Close accessibility menu'
    );

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute(
      'data-screen-reader-text',
      'Open accessibility menu'
    );
  });

  it('toggles chatbot open state when chatbot button is clicked', () => {
    renderHeader();
    const chatbotButton = screen.getByRole('button', {
      name: /open ai assistant/i,
    });

    expect(chatbotButton).toHaveAttribute('aria-label', 'Open AI Assistant');

    fireEvent.click(chatbotButton);
    expect(chatbotButton).toHaveAttribute('aria-label', 'Close AI Assistant');

    fireEvent.click(chatbotButton);
    expect(chatbotButton).toHaveAttribute('aria-label', 'Open AI Assistant');
  });
});
