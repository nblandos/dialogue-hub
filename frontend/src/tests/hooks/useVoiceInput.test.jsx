// frontend/src/tests/hooks/useVoiceInput.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceInput } from '../../hooks/useVoiceInput';

describe('useVoiceInput', () => {
  const mockOnTranscript = vi.fn();
  const mockPreprocessor = vi.fn((text) => text.toUpperCase());

  const mockStart = vi.fn();
  const mockStop = vi.fn();
  let mockRecognition;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRecognition = {
      start: mockStart,
      stop: mockStop,
      lang: '',
      interimResults: false,
      maxAlternatives: 1,
      onresult: null,
      onerror: null,
      onend: null,
    };

    function MockSpeechRecognition() {
      return mockRecognition;
    }

    MockSpeechRecognition.prototype = Object.create(EventTarget.prototype);
    global.webkitSpeechRecognition = MockSpeechRecognition;
    global.window.webkitSpeechRecognition = MockSpeechRecognition;
    global.window.SpeechRecognition = undefined;
  });

  it('initializes with correct default states', () => {
    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(typeof result.current.startRecording).toBe('function');
    expect(typeof result.current.stopRecording).toBe('function');
  });

  it('starts recording when startRecording is called', () => {
    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
    });

    expect(mockStart).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(true);
    expect(result.current.isProcessing).toBe(true);
  });

  it('handles successful transcription', () => {
    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
      mockRecognition.onresult({
        results: [[{ transcript: 'test transcript' }]],
      });
    });

    expect(mockPreprocessor).toHaveBeenCalledWith('test transcript');
    expect(mockOnTranscript).toHaveBeenCalledWith('TEST TRANSCRIPT');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
  });

  it('handles recognition errors', () => {
    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
      mockRecognition.onerror();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
  });

  it('handles recognition end event', () => {
    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
      mockRecognition.onend();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
  });

  it('stops recording when stopRecording is called', () => {
    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
    });
    expect(result.current.isRecording).toBe(true);
    expect(result.current.isProcessing).toBe(true);

    act(() => {
      result.current.stopRecording();
    });

    expect(mockStop).toHaveBeenCalled();
    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      unmount();
    });

    expect(mockStop).not.toHaveBeenCalled();
  });

  it('alerts when speech recognition is not supported', () => {
    delete global.webkitSpeechRecognition;
    delete global.window.webkitSpeechRecognition;
    delete global.window.SpeechRecognition;

    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
    });

    expect(mockAlert).toHaveBeenCalledWith(
      'Speech recognition is not supported in this browser.'
    );
    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(false);
  });

  it('uses identity function as default preprocessor', () => {
    const { result } = renderHook(() => useVoiceInput(mockOnTranscript));

    act(() => {
      result.current.startRecording();
      mockRecognition.onresult({
        results: [[{ transcript: 'test transcript' }]],
      });
    });

    expect(mockOnTranscript).toHaveBeenCalledWith('test transcript');
  });

  it('falls back to en-GB when navigator.language is undefined', () => {
    Object.defineProperty(navigator, 'language', {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useVoiceInput(mockOnTranscript, mockPreprocessor)
    );

    act(() => {
      result.current.startRecording();
    });

    expect(mockRecognition.lang).toBe('en-GB');
  });
});
