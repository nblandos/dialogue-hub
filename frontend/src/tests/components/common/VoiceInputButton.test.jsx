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

  it('renders with correct accessibility attributes', () => {
    render(<VoiceInputButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Voice input');
    expect(button).toHaveAttribute('data-screen-reader-text', 'Voice input');
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

  describe('click behavior', () => {
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
  });

  describe('microphone icon states', () => {
    it('shows pulsing animation when processing', () => {
      useVoiceInput.mockImplementation(() => ({
        isRecording: false,
        isProcessing: true,
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
      }));

      render(<VoiceInputButton {...defaultProps} />);
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).toHaveClass('animate-pulse');
    });

    it('shows a static icon when not processing', () => {
      useVoiceInput.mockImplementation(() => ({
        isRecording: false,
        isProcessing: false,
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
      }));

      render(<VoiceInputButton {...defaultProps} />);
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).not.toHaveClass('animate-pulse');
    });
  });

  describe('form style button', () => {
    it('applies correct styles when not recording', () => {
      useVoiceInput.mockImplementation(() => ({
        isRecording: false,
        isProcessing: false,
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
      }));

      render(<VoiceInputButton {...defaultProps} buttonStyle="form" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-400', 'text-white');
    });

    it('applies correct styles when recording', () => {
      useVoiceInput.mockImplementation(() => ({
        isRecording: true,
        isProcessing: false,
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
      }));

      render(<VoiceInputButton {...defaultProps} buttonStyle="form" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-500', 'text-white');
    });
  });
});
