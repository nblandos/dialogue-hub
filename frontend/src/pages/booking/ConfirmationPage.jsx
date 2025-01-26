import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import BookingDetails from "../../components/confirmation/BookingDetails";
import InputFieldWithMic from "../../components/confirmation/InputFieldWithMic";
import ConfirmationActions from "../../components/confirmation/ConfirmationActions";

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSlots } = location.state || { selectedSlots: [] };

  // Format booking details
  let formattedDate = "No date selected";
  let formattedTime = "No time selected";

  if (selectedSlots.length) {
    const [dateStr] = selectedSlots[0].split("T");
    const times = selectedSlots
      .map((slot) => parseInt(slot.split("T")[1]))
      .sort((a, b) => a - b);

    const startTime = `${times[0]}:00`;
    const endTime = `${times[times.length - 1] + 1}:00`;

    formattedDate = format(parseISO(dateStr), "EEEE, dd MMM yyyy");
    formattedTime = `${startTime} - ${endTime}`;
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);

  const [recordingField, setRecordingField] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = React.useRef(null);

  const preprocessEmail = (transcript) => {
    return transcript
      .replace(/\bat\b/gi, "@")
      .replace(/\bdot\b/gi, ".")
      .replace(/\s+/g, "");
  };

  const startRecording = (field) => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    recognition.start();
    setRecordingField(field);
    setIsProcessing(true);

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.trim();

      if (field === "email") {
        transcript = preprocessEmail(transcript);
      }

      if (field === "name") {
        setName(transcript);
      } else if (field === "email") {
        setEmail(transcript);
      }

      setRecordingField("");
      setIsProcessing(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecordingField("");
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setRecordingField("");
      setIsProcessing(false);
    };
  };

  const stopRecording = () => {
    if (recordingField && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setRecordingField("");
      setIsProcessing(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirm = () => {
    stopRecording();
    if (!validateEmail(email)) {
      setShowEmailError(true);
    } else {
      setShowEmailError(false);
      console.log("Confirm booking logic should be implemented.");
    }
  };

  const handleCancel = () => {
    stopRecording();
    navigate("/");
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-36 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Confirm Your Booking</h1>
      <BookingDetails date={formattedDate} time={formattedTime} />
      <div className="w-full max-w-md">
        <InputFieldWithMic
          id="name"
          label="Name and Surname"
          placeholder="Enter your name and surname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onMicClick={() =>
            recordingField === "name" ? stopRecording() : startRecording("name")
          }
          recordingField={recordingField}
          isProcessing={isProcessing}
        />
        <InputFieldWithMic
          id="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onMicClick={() =>
            recordingField === "email" ? stopRecording() : startRecording("email")
          }
          recordingField={recordingField}
          isProcessing={isProcessing}
        />
      </div>
      <ConfirmationActions
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        showEmailError={showEmailError}
      />
    </div>
  );
}

export default ConfirmationPage;
