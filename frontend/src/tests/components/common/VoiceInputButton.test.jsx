import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceInputButton from '../../../components/common/VoiceInputButton';
import { useVoiceInput } from '../../../hooks/useVoiceInput';

vi.mock('../../../hooks/useVoiceInput');

describe('VoiceInputButton', () => {
  const mockOnTranscript = vi.fn();
  const defaultProps = {
    onTranscript: mockOnTranscript,
    preprocessor: (text) => text,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useVoiceInput.mockImplementation(() => ({
      isRecording: false,
      isProcessing: false,
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
    }));
  });

  it('renders voice input button with correct accessibility attributes', () => {
    render(<VoiceInputButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Voice input');
  });

  it('starts recording when clicked while not recording', () => {
    const mockStartRecording = vi.fn();
    useVoiceInput.mockImplementation(() => ({
      isRecording: false,
      isProcessing: false,
      startRecording: mockStartRecording,
      stopRecording: vi.fn(),
    }));

    render(<VoiceInputButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockStartRecording).toHaveBeenCalled();
  });

  it('stops recording when clicked while recording', () => {
    const mockStopRecording = vi.fn();
    useVoiceInput.mockImplementation(() => ({
      isRecording: true,
      isProcessing: false,
      startRecording: vi.fn(),
      stopRecording: mockStopRecording,
    }));

    render(<VoiceInputButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockStopRecording).toHaveBeenCalled();
  });

  it('initializes useVoiceInput hook with correct props', () => {
    const preprocessor = (text) => text.toUpperCase();
    render(
      <VoiceInputButton
        onTranscript={mockOnTranscript}
        preprocessor={preprocessor}
      />
    );
    expect(useVoiceInput).toHaveBeenCalledWith(mockOnTranscript, preprocessor);
  });
});
