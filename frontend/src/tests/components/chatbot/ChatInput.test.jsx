import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '../../../components/chatbot/ChatInput';

// Mock the VoiceInputButton component
vi.mock('../../../components/common/VoiceInputButton', () => ({
  default: ({ onTranscript }) => (
    <button
      data-testid="voice-button"
      onClick={() => onTranscript('Voice transcript')}
    >
      Voice Input
    </button>
  ),
}));

describe('ChatInput', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input field, voice button and submit button', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByPlaceholderText('Ask D-Bot')).toBeInTheDocument();
    expect(screen.getByTestId('voice-button')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send message' })
    ).toBeInTheDocument();
  });

  it('updates message when typing in the input field', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');

    fireEvent.change(input, { target: { value: 'Hello world' } });
    expect(input.value).toBe('Hello world');
  });

  it('calls onSubmit with message when form is submitted', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith('Hello world');
    expect(input.value).toBe(''); // Input should be cleared
  });

  it('disables submit button when isLoading is true', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={true} />);
    const submitButton = screen.getByRole('button', { name: 'Send message' });

    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when message is empty', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);
    const submitButton = screen.getByRole('button', { name: 'Send message' });

    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when message has content and not loading', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');
    const submitButton = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(input, { target: { value: 'Hello world' } });
    expect(submitButton).not.toBeDisabled();
  });

  it('updates message when voice input is received', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);
    const voiceButton = screen.getByTestId('voice-button');

    fireEvent.click(voiceButton);
    const input = screen.getByPlaceholderText('Ask D-Bot');

    expect(input.value).toBe('Voice transcript');
  });

  it('does not submit form when message contains only whitespace', () => {
    render(<ChatInput onSubmit={mockOnSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
