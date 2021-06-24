import React from 'react';

/**
 * Professional microphone icon for voice search.
 * @param {Object} props
 * @param {number} [props.size=24] - Icon size in pixels
 * @param {boolean} [props.listening=false] - When true, shows animated sound waves
 * @param {string} [props.className] - Optional CSS class for the SVG
 */
export default function MicIcon({ size = 24, listening = false, className = '' }) {
  const viewBox = '0 0 24 24';

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Mic head — pill shape */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"
      />
      {/* Mic stem + base */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 16c2.76 0 5-2.24 5-5H19c0 3.53-2.61 6.43-6 6.92V22h-2v-4.08C7.61 17.43 5 14.53 5 11h2c0 2.76 2.24 5 5 5z"
      />
      {/* Sound waves — curved arcs, visible when listening */}
      {listening && (
        <g className="mic-waves">
          <path
            className="mic-wave mic-wave-1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            d="M17.5 10.2 Q18.8 12 17.5 13.8"
          />
          <path
            className="mic-wave mic-wave-2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            d="M19.2 8 Q21 12 19.2 16"
          />
          <path
            className="mic-wave mic-wave-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            d="M21 6 Q23 12 21 18"
          />
          <path
            className="mic-wave mic-wave-4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            d="M6.5 10.2 Q5.2 12 6.5 13.8"
          />
          <path
            className="mic-wave mic-wave-5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            d="M4.8 8 Q3 12 4.8 16"
          />
          <path
            className="mic-wave mic-wave-6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            d="M3 6 Q1 12 3 18"
          />
        </g>
      )}
    </svg>
  );
}
