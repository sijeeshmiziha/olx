import React, { useState } from 'react';
import './VoiceSearch.css';
import MicIcon from '../../assets/MicIcon';

function VoiceSearch({ onResult, disabled }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice search is not supported in this browser.');
      return;
    }
    setError(null);
    setListening(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && onResult) onResult(transcript.trim());
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      setError('Could not hear clearly. Try again.');
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div className="voiceSearchWrap">
      <button
        type="button"
        className={`voiceSearchBtn ${listening ? 'voiceSearchBtn--listening' : ''}`}
        onClick={startListening}
        disabled={disabled || listening}
        title="Voice search"
        aria-label={listening ? 'Listening…' : 'Search by voice'}
      >
        <span className="voiceSearchBtnIcon">
          <MicIcon size={20} listening={listening} />
        </span>
        <span className="voiceSearchBtnLabel">
          {listening ? 'Listening...' : 'Voice search'}
        </span>
      </button>
      {error && <span className="voiceSearchError">{error}</span>}
    </div>
  );
}

export default VoiceSearch;
