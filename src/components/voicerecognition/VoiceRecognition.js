import { useState, useEffect } from 'react';

const VoiceRecognition = ({ onResult, onEnd, isListening }) => {
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    // Initialize recognition object
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    // Event handlers
    recognitionInstance.onresult = (event) => {
      // Get the full transcript from all results
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);
      onResult(currentTranscript);
      console.log("Voice recognized:", currentTranscript);
    };

    recognitionInstance.onend = () => {
      console.log("Voice recognition ended");
      // Pass the final transcript before ending
      if (transcript) {
        onResult(transcript);
      }
      onEnd();
    };

    recognitionInstance.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      onEnd();
    };

    setRecognition(recognitionInstance);

    // Cleanup function
    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onResult, onEnd,transcript]);

  // Start or stop recognition based on isListening prop
  useEffect(() => {
    if (!recognition) return;

    if (isListening) {
      try {
        // Reset transcript when starting new recording
        setTranscript('');
        recognition.start();
        console.log("Voice recognition started");
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    } else {
      try {
        recognition.stop();
        console.log("Voice recognition stopped");
      } catch (error) {
        // Ignore errors when stopping (might not be running)
      }
    }
  }, [isListening, recognition]);

  return null; // This is a non-visual component
};

export default VoiceRecognition;