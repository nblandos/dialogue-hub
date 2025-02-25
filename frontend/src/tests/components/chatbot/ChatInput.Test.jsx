import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import ChatInput from '../../../components/chatbot/ChatInput';

vi.mock('../../../components/common/VoiceInputButton', () => {
  return {
    default: (props) => {
      return (
        <button
          data-testid="voice-button"
          onClick={() => props.onTranscript('Hello Voice')}
        >
          Voice Input
        </button>
      );
    },
  };
});

describe('ChatInput', () => {
  let mockOnSubmit;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
  });

  it('renders the input field and voice button', () => {
    render(<ChatInput onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');
    const voiceButton = screen.getByTestId('voice-button');

    expect(input).toBeInTheDocument();
    expect(voiceButton).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<ChatInput onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');

    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input.value).toBe('Test message');
  });

  it('submits message when form is submitted and then clears input', () => {
    render(<ChatInput onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');
    const submitButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Hello Chat' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Hello Chat');
    expect(input.value).toBe('');
  });

  it('does not submit when input is empty', () => {
    render(<ChatInput onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: /send message/i });

    expect(submitButton).toBeDisabled();
  });

  it('updates input value when voice transcript is received, and then submits correctly', () => {
    render(<ChatInput onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText('Ask D-Bot');
    const voiceButton = screen.getByTestId('voice-button');
    const submitButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.click(voiceButton);
    expect(input.value).toBe('Hello Voice');

    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledWith('Hello Voice');
    expect(input.value).toBe('');
  });
});
