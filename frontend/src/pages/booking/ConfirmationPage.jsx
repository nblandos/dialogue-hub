import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import BookingDetails from '../../components/booking/confirmation/BookingDetails';
import InputFieldWithMic from '../../components/booking/confirmation/InputFieldWithMic';
import ConfirmationActions from '../../components/booking/confirmation/ConfirmationActions';

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots } = location.state || { selectedSlots: [] };

  // Format booking details
  let formattedDate = 'No date selected';
  let formattedTime = 'No time selected';

  if (selectedSlots.length) {
    const [dateStr] = selectedSlots[0].split('T');
    const times = selectedSlots
      .map((slot) => parseInt(slot.split('T')[1]))
      .sort((a, b) => a - b);

    const startTime = `${times[0]}:00`;
    const endTime = `${times[times.length - 1] + 1}:00`;

    formattedDate = format(parseISO(dateStr), 'EEEE, dd MMM yyyy');
    formattedTime = `${startTime} - ${endTime}`;
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
  });

  const [recordingField, setRecordingField] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = React.useRef(null);

  const preprocessEmail = (transcript) => {
    return transcript
      .replace(/\bat\b/gi, '@')
      .replace(/\bdot\b/gi, '.')
      .replace(/\s+/g, '');
  };

  const startRecording = (field) => {
    stopRecording();

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
    setRecordingField(field);
    setIsProcessing(true);

    recognition.onresult = (event) => {
      if (recognitionRef.current === recognition) {
        let transcript = event.results[0][0].transcript.trim();
        if (field === 'email') transcript = preprocessEmail(transcript);
        if (field === 'name') setName(transcript);
        if (field === 'email') setEmail(transcript);
        setRecordingField('');
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      if (recognitionRef.current === recognition) {
        setRecordingField('');
        setIsProcessing(false);
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setRecordingField('');
        setIsProcessing(false);
        recognitionRef.current = null;
      }
    };
  };

  const stopRecording = () => {
    if (recordingField && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setRecordingField('');
      setIsProcessing(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFullName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return false;
    if (trimmedName.length > 100) return false;
    return trimmedName.split(' ').length >= 2;
  };

  const handleConfirm = async () => {
    stopRecording();
    setApiError('');
    setErrors({ name: false, email: false });

    const isEmailValid = validateEmail(email);
    const isNameValid = validateFullName(name);

    if (!isEmailValid || !isNameValid) {
      setErrors({
        email: !isEmailValid,
        name: !isNameValid,
      });
      return;
    }

    setLoading(true);

    try {
      const formattedSlots = selectedSlots.map((slot) => {
        const [date, time] = slot.split('T');
        return {
          start_time: `${date}T${time.padStart(2, '0')}:00:00+00:00`,
        };
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-booking`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: {
              email: email.trim(),
              full_name: name.trim(),
            },
            timeslots: formattedSlots,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        switch (data.code) {
          case 'INVALID_REQUEST':
            throw new Error('Missing booking data. Please fill in all fields.');
          case 'INVALID_DATA':
            throw new Error(data.message || 'Booking data is invalid.');
          case 'EMAIL_ERROR':
            throw new Error('Booking created but email confirmation failed.');
          case 'SERVER_ERROR':
            throw new Error('A server error occurred. Please try again later.');
          default:
            throw new Error(data.message || 'Failed to create booking.');
        }
      }
      // redirect to success page
      navigate('/success');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    stopRecording();
    navigate('/');
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6 pt-36">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Confirm Your Booking
      </h1>

      <BookingDetails
        details={[
          { label: 'Date', value: formattedDate },
          { label: 'Time', value: formattedTime },
        ]}
      />

      <div className="w-full max-w-md">
        <InputFieldWithMic
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onMicClick={() =>
            recordingField === 'name' ? stopRecording() : startRecording('name')
          }
          recordingField={recordingField}
          isProcessing={isProcessing}
          autoComplete="name"
        />

        <InputFieldWithMic
          id="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onMicClick={() =>
            recordingField === 'email'
              ? stopRecording()
              : startRecording('email')
          }
          recordingField={recordingField}
          isProcessing={isProcessing}
          autoComplete="email"
        />
      </div>

      <ConfirmationActions
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        loading={loading}
        apiError={apiError}
        errors={errors}
      />
    </div>
  );
}

export default ConfirmationPage;
