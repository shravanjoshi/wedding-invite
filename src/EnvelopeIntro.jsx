import { useRef, useState } from 'react';
import envelopeVideo from '../envelope.mp4';

export default function EnvelopeIntro({ onDone }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('closed'); // closed | playing | error

  const open = async () => {
    if (phase !== 'closed') return;

    const video = videoRef.current;
    if (!video) return;

    setPhase('playing');
    try {
      await video.play();
    } catch (error) {
      console.error('Unable to play the envelope video.', error);
      setPhase('error');
    }
  };

  const handleVideoEnd = () => {
    onDone?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#19130d]"
      role="dialog"
      aria-label="Open wedding invitation"
    >
      <video
        ref={videoRef}
        src={envelopeVideo}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          phase === 'playing' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={() => setPhase('error')}
        aria-hidden={phase !== 'playing'}
      />

      {phase !== 'playing' && (
        <div className="envelope-content-marquee relative z-10 flex flex-col items-center text-center">
          <p className="font-serif text-8xl tracking-[-0.08em] text-[#e8c879] sm:text-9xl">
            R & Y
          </p>

          <button
            type="button"
            onClick={open}
            disabled={phase === 'error'}
            className="envelope-open-button mt-8 rounded-full border border-[#6e542b] px-14 py-5 font-serif text-sm font-semibold tracking-[0.45em] text-[#f1dfae] transition-colors hover:border-[#c0a062] hover:bg-[#2a2015] focus:outline-none focus:ring-2 focus:ring-[#c0a062] focus:ring-offset-2 focus:ring-offset-[#19130d] motion-reduce:animate-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {phase === 'error' ? 'VIDEO UNAVAILABLE' : 'TAP TO OPEN'}
          </button>

          <span className="mt-7 text-xl text-[#d9c99f]" aria-hidden="true">⌄</span>
        </div>
      )}
    </div>
  );
}
