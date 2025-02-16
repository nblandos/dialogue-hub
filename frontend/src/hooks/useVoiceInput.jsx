import { useState, useRef, useEffect } from 'react';

export const useVoiceInput = (onTranscript, preprocessor = (text) => text) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (
      !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setIsProcessing(true);

    recognition.onresult = (event) => {
      if (recognitionRef.current === recognition) {
        const transcript = event.results[0][0].transcript.trim();
        const processedTranscript = preprocessor(transcript);
        onTranscript(processedTranscript);
        setIsRecording(false);
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      if (recognitionRef.current === recognition) {
        setIsRecording(false);
        setIsProcessing(false);
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setIsRecording(false);
        setIsProcessing(false);
        recognitionRef.current = null;
      }
    };
  };

  const stopRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
};
