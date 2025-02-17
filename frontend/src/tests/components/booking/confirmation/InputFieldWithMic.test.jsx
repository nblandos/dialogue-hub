// frontend/src/tests/components/booking/confirmation/InputFieldWithMic.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputFieldWithMic from '../../../../components/booking/confirmation/InputFieldWithMic';

vi.mock('../../../../components/common/VoiceInputButton', () => {
  return {
    default: ({ onTranscript, preprocessor, buttonStyle }) => {
      return (
        <button
          data-testid="voice-button"
          onClick={() =>
            onTranscript(
              preprocessor ? preprocessor('test transcript') : 'test transcript'
            )
          }
        >
          Mic Button {buttonStyle} {preprocessor && 'with preprocessor'}
        </button>
      );
    },
  };
});

describe('InputFieldWithMic', () => {
  const defaultProps = {
    id: 'name',
    label: 'Full Name',
    placeholder: 'Enter your name',
    value: '',
    onChange: vi.fn(),
    preprocessor: (text) => text.toUpperCase(),
    autoComplete: 'on',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders label, input and voice button correctly', () => {
    render(<InputFieldWithMic {...defaultProps} />);
    const label = screen.getByText('Full Name');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveAttribute('data-screen-reader-text', 'Enter your name');
    expect(input).toHaveAttribute('autoComplete', 'on');
    expect(input).toHaveClass('w-full');

    const voiceButton = screen.getByTestId('voice-button');
    expect(voiceButton).toBeInTheDocument();
    expect(voiceButton).toHaveTextContent('Mic Button form with preprocessor');
  });

  it('sets input type to "email" when id is "email"', () => {
    render(
      <InputFieldWithMic
        {...defaultProps}
        id="email"
        label="Email Address"
        placeholder="Enter your email"
      />
    );
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('sets input type to "text" when id is not "email"', () => {
    render(<InputFieldWithMic {...defaultProps} id="name" />);
    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange with processed transcript when voice button is clicked', () => {
    render(<InputFieldWithMic {...defaultProps} />);
    const voiceButton = screen.getByTestId('voice-button');
    fireEvent.click(voiceButton);
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      target: { value: 'TEST TRANSCRIPT' },
    });
  });
});
