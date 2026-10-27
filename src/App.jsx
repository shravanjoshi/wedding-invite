import { useEffect, useRef, useState } from 'react';
import EnvelopeIntro from './EnvelopeIntro';
import ScratchCard from './ScratchCard';
import heroBackground from '../hero-bg.mp4';
import ganeshImage from '../ganesh.webp';
import weddingEmblem from '../R_Y-transparent.png';
import haldiCard from '../haldi.webp';
import cocktailCard from '../cocktail.webp';
import baraatCard from '../baraat.webp';
import phereCard from '../phere.webp';
import sufiCard from '../sufi.webp';
import afterPartyCard from '../after-party.webp';
import familiesBackground from '../families-bg.webp';
import storyBackground from '../story-bg.webp';
import scheduleBackground from '../schedule-bg.webp';
import rsvpBackground from '../footer-bg.png';
import backgroundMusic from '../bg-music.mp3';

const STORY_CHAPTERS = [
  {
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
    caption: 'Every journey led us here',
    alt: 'Couple celebrating their love'
  },
  {
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
    caption: 'From craziness to forever',
    alt: 'Couple sharing a joyful moment'
  },
  {
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    caption: 'We wrote our story.',
    alt: 'Couple on their wedding day'
  }
];

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Radha+Resort/@21.8382503,75.6380795,14z/data=!4m10!1m2!2m1!1sRadha+Resort,+ahead+of+Hariyali+Marriage+Garden,+Sanawad+Road,+Khargone!3m6!1s0x3bd887989c8353a9:0xbefafcff39e4ec09!8m2!3d21.8508833!4d75.6501815!15sCkdSYWRoYSBSZXNvcnQsIGFoZWFkIG9mIEhhcml5YWxpIE1hcnJpYWdlIEdhcmRlbiwgU2FuYXdhZCBSb2FkLCBLaGFyZ29uZVpGIkRyYWRoYSByZXNvcnQgYWhlYWQgb2YgaGFyaXlhbGkgbWFycmlhZ2UgZ2FyZGVuIHNhbmF3YWQgcm9hZCBraGFyZ29uZZIBDHJlc29ydF9ob3RlbJoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQyMUZkRlpyWkVKa2JrNXlWbXRvVmxkSWFHcFZWM0JLWXpOT1NtTXpZeEFC4AEA-gEECAAQNA!16s%2Fg%2F11n3cxgwrd?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D';

// --- Assets & Icons (Inline SVGs for portability) ---
const HeartIcon = ({ filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#c47f72' : 'none'} stroke="#c0a062" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const MusicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const MuteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H3v6h3l5 4V5Z"></path>
    <path d="m22 9-6 6"></path>
    <path d="m16 9 6 6"></path>
  </svg>
);

// --- Scroll Animation Wrapper ---
const FadeInSection = ({ children, delay = 0, instant = false }) => {
  const [isVisible, setVisible] = useState(instant);
  const domRef = useRef(null);

  useEffect(() => {
    if (instant) return;
    const element = domRef.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (element) observer.unobserve(element);
        }
      });
    }, { threshold: 0.15 });

    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [instant]);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HeroSection = ({ onScrollDown }) => (
  <section
    className="relative flex min-h-[110vh] flex-col items-center justify-center overflow-hidden bg-[#f7f0e6] bg-cover bg-center px-6 py-16"
  >
    <video
      className="absolute inset-0 z-0 h-full w-full object-cover"
      src={heroBackground}
      autoPlay
      loop    /* 2. ADDED LOOP: Ensures the video restarts only when the file naturally ends */
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
    <div className="absolute inset-0 z-[1] bg-[#fffaf0]/25" aria-hidden="true"></div>
    <div
      className="absolute inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-b from-transparent via-[#f7f0e6]/70 to-[#f7f0e6]"
      aria-hidden="true"
    ></div>

    <FadeInSection instant>
      <div className="relative z-10 flex -translate-y-28 flex-col items-center text-center sm:-translate-y-20">
        <img
          src={ganeshImage}
          alt="Lord Ganesha"
          className="relative -top-8 mb-8 h-auto w-[min(25vw,120px)] object-contain drop-shadow-md sm:-top-16"
        />
        <h1 className="font-cursive text-[clamp(3.5rem,11vw,7.5rem)] leading-none text-[#805408] font-bold drop-shadow-sm">
          <span className="block sm:inline">Raghav</span>{' '}
          <span className="block sm:inline">weds</span>{' '}
          <span className="block sm:inline">Yashashwini</span>
        </h1>
      </div>
    </FadeInSection>
    <button
      type="button"
      onClick={onScrollDown}
      className="absolute bottom-36 z-10 rounded-full border border-[#c0a062] bg-[#f7f0e6]/80 px-4 pt-1 pb-1.5 font-serif text-[8px] tracking-[0.25em] text-[#5b4b3e] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#f7f0e6] focus:outline-none focus:ring-2 focus:ring-[#c0a062] focus:ring-offset-2 focus:ring-offset-[#f7f0e6] sm:bottom-32 sm:px-5 sm:pt-1.5 sm:pb-2 sm:text-[9px]"
      aria-label="Scroll down to the wedding invitation"
    >
      SCROLL DOWN <span className="ml-1 text-sm text-[#c49a4a]" aria-hidden="true">↓</span>
    </button>
  </section>
);

export default function WeddingInvitation() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicRef = useRef(null);
  const storyCarouselRef = useRef(null);
  const mainContentRef = useRef(null);
  const storyIndexRef = useRef(1);
  const [storyIndex, setStoryIndex] = useState(1);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: '00', hrs: '00', mins: '00', secs: '00' });
  const [intro, setIntro] = useState('closed'); // closed | revealing | done


  useEffect(() => {
    // Inject Fonts
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
      
      .font-serif { font-family: 'Playfair Display', serif; }
      .font-countdown { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }
      .font-sans { font-family: 'Montserrat', sans-serif; }
      .font-cursive { font-family: 'Great Vibes', cursive; }
      .footer-script { font-family: 'Great Vibes', cursive; font-weight: 400; }
      .footer-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; font-weight: 400; }
      .footer-serif strong { font-weight: 600; }
      .footer-button { font-family: 'Montserrat', sans-serif; font-weight: 400; }
      
      .wax-seal {
        background: radial-gradient(circle, #d4af37 0%, #aa7c11 100%);
        box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.4);
      }
      
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    const targetDate = new Date('December 2, 2026 09:30:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hrs: hrs.toString().padStart(2, '0'),
        mins: mins.toString().padStart(2, '0'),
        secs: secs.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startMusic = async () => {
    if (!musicRef.current) return;

    try {
      await musicRef.current.play();
      setIsMusicPlaying(true);
    } catch (error) {
      console.error('Background music could not start:', error);
      setIsMusicPlaying(false);
    }
  };

  useEffect(() => {
    if (intro === 'done') startMusic();
  }, [intro]);

  useEffect(() => {
    if (intro !== 'revealing') return;

    const transitionEnd = window.setTimeout(() => {
      setIntro('done');
    }, 700);

    return () => window.clearTimeout(transitionEnd);
  }, [intro]);

  useEffect(() => {
    if (intro !== 'done' || !mainContentRef.current) return;

    mainContentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [intro]);

  const toggleMusic = async () => {
    if (!musicRef.current) return;

    if (musicRef.current.paused) {
      try {
        await musicRef.current.play();
        setIsMusicPlaying(true);
      } catch (error) {
        console.error('Background music could not start:', error);
        setIsMusicPlaying(false);
      }
      return;
    }

    musicRef.current.pause();
    setIsMusicPlaying(false);
  };

  const scrollDownFromHero = () => {
    mainContentRef.current?.scrollTo({
      top: mainContentRef.current.clientHeight,
      behavior: 'smooth',
    });
  };

  const scrollToStory = (index, behavior = 'smooth') => {
    const carousel = storyCarouselRef.current;
    const card = carousel?.children[index];
    if (!carousel || !card) return;

    const left = card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
    carousel.scrollTo({ left, behavior });
    storyIndexRef.current = index;
    setStoryIndex(index);
  };

  useEffect(() => {
    const carousel = storyCarouselRef.current;
    if (!carousel || intro !== 'done') return;

    scrollToStory(STORY_CHAPTERS.length, 'auto');
    const autoplay = window.setInterval(() => {
      const nextIndex = storyIndexRef.current + 1;
      scrollToStory(nextIndex);

      if (nextIndex === STORY_CHAPTERS.length * 2) {
        window.setTimeout(() => {
          if (storyIndexRef.current === STORY_CHAPTERS.length * 2) {
            scrollToStory(STORY_CHAPTERS.length, 'auto');
          }
        }, 700);
      }
    }, 4000);

    return () => window.clearInterval(autoplay);
  }, [intro]);


  return (
    // Outer Desktop Background Container
    <div className="bg-[#1f2f29] min-h-screen w-full text-[#333333] font-serif overflow-x-hidden selection:bg-[#c0a062] selection:text-white">

      {/* Mobile-first Wrapper */}
      <div ref={mainContentRef} className={`main-content-scroll relative h-[100dvh] w-full min-h-screen bg-[#f4f1eb] overflow-x-hidden hide-scrollbar ${intro === 'done' ? 'overflow-y-auto' : 'overflow-y-hidden'
        }`}>
        {intro !== 'done' && (
          <EnvelopeIntro
            onDone={() => {
              setIntro('revealing');
            }}
          >
            <HeroSection />
          </EnvelopeIntro>
        )}


        {/* --- MAIN CONTENT (Revealed after envelope opens) --- */}
        <div
          className={`relative w-full transition-opacity duration-700 ease-out ${
            intro === 'closed' ? 'opacity-0' : 'opacity-100'
          }`}
        >

          {/* --- 2. HERO SECTION --- */}
          <HeroSection onScrollDown={scrollDownFromHero} />



          {/* --- 3. SAVE THE DATE & REVEAL --- */}
          <section className="px-6 py-12 flex flex-col items-center text-center">
            <FadeInSection>
              <div className="text-[#c0a062] text-4xl mb-4">ॐ</div> {/* Elegant Om symbol substituting Ganesha */}
              <h1 className="font-cursive text-[clamp(2.8rem,10vw,3.75rem)] leading-tight text-[#805408] font-semibold mb-6">Raghav <span className="text-2xl sm:text-3xl mx-1 sm:mx-2">&</span> Yashashwini</h1>

              <p className="font-countdown text-xs font-bold tracking-[0.45em] text-[#a67c2e]  uppercase mb-2">We are getting married</p>
              <div className="flex items-center justify-center gap-4 my-6 text-[#a67c2e]">
                <div className="h-px w-12 bg-[#c0a062]"></div>
                <span className="font-countdown text-xs font-bold tracking-[0.45em]  uppercase">Save the Date</span>
                <div className="h-px w-12 bg-[#c0a062]"></div>
              </div>
            </FadeInSection>
            {/* Interactive Reveal Card */}
            <FadeInSection delay={200}>
              <div className="mt-4 mb-10">
                <ScratchCard />
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <h3 className="font-countdown text-sm font-bold tracking-[0.3em] text-[#b67f21] uppercase mb-4">Radha Resort, Khargone</h3>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-[#c0a062] text-[#c0a062] text-xs font-sans tracking-widest uppercase hover:bg-[#c0a062] hover:text-white transition-colors"
              >
                <MapPinIcon /> Get Directions
              </a>
              {/* <div className="mt-8 w-full max-w-[600px] overflow-hidden rounded-lg border border-[#c0a062]/30 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29627.998155544934!2d75.63807950463702!3d21.83825031491372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd887989c8353a9%3A0xbefafcff39e4ec09!2sRadha%20Resort!5e0!3m2!1sen!2sin!4v1793013090569!5m2!1sen!2sin"
                  title="Radha Resort map"
                  className="block h-[300px] w-full sm:h-[450px]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div> */}
            </FadeInSection>
          </section>

          {/* --- 4. COUNTDOWN --- */}
          <section className="py-32 px-6 bg-[#efeadd] mt-8 flex flex-col items-center border-y border-[#c0a062]/20">
            <FadeInSection>
              <h2 className="font-countdown text-base sm:text-lg tracking-[0.45em] uppercase text-[#a67c2e] mb-16 flex items-center gap-5">
                <span className="h-px w-16 bg-[#a67c2e]/50"></span>
                The Countdown Begins
                <span className="h-px w-16 bg-[#a67c2e]/50"></span>
              </h2>

              <div className="flex w-full gap-6 sm:gap-14 justify-center text-center">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <span className="font-countdown font-semibold text-6xl sm:text-8xl text-[#a67c2e] mb-4">{value}</span>
                    <span className="font-countdown text-sm sm:text-base tracking-[0.35em] uppercase text-[#806f5d]">{unit}</span>
                  </div>
                ))}
              </div>
              <p className="font-countdown italic text-4xl sm:text-5xl text-center mt-16 text-[#806f5d]">❧ Until our forever begins ❧</p>
            </FadeInSection>
          </section>

          {/* --- 5. FAMILIES --- */}
          <section
            className="relative overflow-hidden bg-[#f7f1e7] py-24 px-8 text-center"
          >
            <div
              className="pointer-events-none absolute inset-[-8px] z-0 bg-cover bg-center blur-[3px]"
              style={{ backgroundImage: `linear-gradient(rgba(247, 241, 231, 0.3), rgba(247, 241, 231, 0.3)), url(${familiesBackground})` }}
              aria-hidden="true"
            ></div>

            <div className="relative z-10">
              <FadeInSection>
                <div className="mb-5 font-countdown text-2xl tracking-[0.35em] text-[#c0a062]" aria-hidden="true">
                  ⤙ ❦ ⤚
                </div>
                <p className="font-cursive text-5xl sm:text-6xl text-[#a67c2e] mb-10">With immense joy and gratitude,</p>
                <div className="mx-auto mb-8 h-px w-32 bg-[#c0a062]/30"></div>
                <h2 className="font-countdown text-3xl sm:text-4xl tracking-[0.25em] font-medium text-[#40362e] mb-10 uppercase">
                  The Parsai Family
                </h2>
                <div className="mx-auto mb-12 h-px w-32 bg-[#c0a062]/30"></div>
                <p className="mx-auto max-w-3xl font-countdown text-2xl sm:text-3xl text-[#806c57] mb-10" style={{ lineHeight: 2 }}>
                  cordially invites you to celebrate the wedding of their beloved son <span className="font-semibold not-italic">Raghav</span> with <span className="font-semibold not-italic">Yashashwini</span> as they begin their beautiful journey of love and lifelong companionship.
                </p>
                <p
                  className="mx-auto max-w-3xl font-countdown text-2xl sm:text-3xl italic text-[#806c57] mb-12"
                  style={{ lineHeight: 1.5 }}
                >
                  Your gracious presence and blessings will make this occasion even more special.
                </p>

                <div className="flex items-center justify-center gap-4 mb-12 opacity-50">
                  <div className="h-px w-16 bg-[#c0a062] "></div>
                  <HeartIcon filled />
                  <div className="h-px w-16 bg-[#c0a062]"></div>
                </div>

                <p className="font-cursive text-4xl sm:text-5xl text-[#a67c2e] mb-5">Two families. One promise.</p>
                <div className="mb-5 font-countdown text-lg tracking-[0.4em] text-[#c0a062]" aria-hidden="true">
                  ❧ ♥ ❧
                </div>
                <h3 className="font-countdown text-3xl sm:text-4xl tracking-[0.25em] uppercase mb-5 text-[#5b4b3e] drop-shadow-[0_1px_1px_rgba(91,75,62,0.18)]">
                  Introducing the Families
                </h3>
                <div className="mb-16 font-countdown text-lg tracking-[0.4em] text-[#c0a062]" aria-hidden="true">
                  ⤙ ❦ ⤚
                </div>
              </FadeInSection>

              <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
                <FadeInSection delay={100}>
                  <div className="text-center">
                  <h4 className="font-cursive font-bold text-5xl text-[#a67c2e] mb-5">Raghav</h4>
                  <div className="mb-4 text-[#c0a062]" aria-hidden="true">✦</div>
                  <p className="font-countdown text-xs tracking-[0.3em] text-[#a67c2e] uppercase mb-3">The Groom</p>
                  <p className="font-countdown font-bold text-lg leading-relaxed text-[#6f6256]">Son of Shri Rajesh Ji Parsai</p>
                  <p className="mt-5 font-countdown text-xs tracking-[0.25em] text-[#a67c2e] uppercase mb-3">Family</p>
                  <p className="font-countdown font-bold text-lg text-[#6f6256]">The Parsai family</p>
                </div>
              </FadeInSection>

              <FadeInSection delay={150}>
                <div className="mx-auto w-[min(42vw,190px)]">
                  <img
                    src={weddingEmblem}
                    alt="Raghav and Yashashwini emblem"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={200}>
                <div className="text-center">
                  <h4 className="font-cursive font-bold text-5xl text-[#a67c2e] mb-5">Yashashwini</h4>
                  <div className="mb-4 text-[#c0a062]" aria-hidden="true">✦</div>
                  <p className="font-countdown text-xs tracking-[0.3em] text-[#a67c2e] uppercase mb-3">The Bride</p>
                  <p className="font-countdown font-bold text-lg leading-relaxed text-[#6f6256]">Daughter of Shri Lokesh Ji Devray</p>
                  <p className="mt-5 font-countdown text-xs tracking-[0.25em] text-[#a67c2e] uppercase mb-3">Family</p>
                  <p className="font-countdown font-bold text-lg text-[#6f6256]">The Devray family</p>
                </div>
              </FadeInSection>
            </div>

            <FadeInSection delay={300}>
              <p className="mx-auto mt-20 max-w-md font-countdown text-2xl sm:text-3xl italic leading-[1.8] text-[#806f5d]">
                Raised with love,<br />
                united by destiny,<br />
                together forever
              </p>
              <div className="mt-8 text-xl text-[#c47f72]" aria-hidden="true">♥</div>
            </FadeInSection>
            </div>
          </section>

          {/* --- 6. OUR STORY --- */}
          <section
            className="relative overflow-hidden bg-[#f7f3eb] bg-cover bg-center px-4 py-16 text-[#3d342d] sm:py-20"
            style={{ backgroundImage: `linear-gradient(rgba(247, 243, 235, 0.38), rgba(247, 243, 235, 0.38)), url(${storyBackground})` }}
          >
            <FadeInSection>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif text-3xl uppercase tracking-[0.25em] text-[#312a25] sm:text-4xl">Our Story</h2>
                <div className="my-2 text-sm tracking-[0.4em] text-[#c49a4a]" aria-hidden="true">❦</div>
                <p className="font-serif text-lg italic text-[#75685d] sm:text-xl">Some chapters are written by destiny.</p>
              </div>
            </FadeInSection>

            <div
              ref={storyCarouselRef}
              onScroll={() => {
                const carousel = storyCarouselRef.current;
                if (!carousel) return;
                const cards = Array.from(carousel.children);
                const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
                const nearestIndex = cards.reduce((nearest, card, index) =>
                  Math.abs(card.offsetLeft + card.offsetWidth / 2 - carouselCenter) <
                    Math.abs(cards[nearest].offsetLeft + cards[nearest].offsetWidth / 2 - carouselCenter)
                    ? index
                    : nearest, 0);
                storyIndexRef.current = nearestIndex;
                setStoryIndex(nearestIndex);
                if (nearestIndex < STORY_CHAPTERS.length) {
                  window.setTimeout(() => scrollToStory(nearestIndex + STORY_CHAPTERS.length, 'auto'), 500);
                } else if (nearestIndex >= STORY_CHAPTERS.length * 2) {
                  window.setTimeout(() => scrollToStory(nearestIndex - STORY_CHAPTERS.length, 'auto'), 500);
                }
              }}
              className="mx-auto mt-8 flex w-full max-w-5xl snap-x snap-mandatory gap-6 overflow-x-auto px-[calc(50%-min(42vw,168px))] pb-2 hide-scrollbar sm:px-[calc(50%-190px)]"
            >
              {[...STORY_CHAPTERS, ...STORY_CHAPTERS, ...STORY_CHAPTERS].map((chapter, index) => (
                <article key={`${chapter.image}-${index}`} className="w-[min(84vw,336px)] shrink-0 snap-center sm:w-[380px]">
                  <div className="rounded-md border border-[#c0a062]/55 bg-[#fffdf8] p-1 shadow-[0_8px_24px_rgba(80,61,35,0.12)]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-[#c0a062]/45">
                      <img src={chapter.image} alt={chapter.alt} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-12 text-center">
                        <p className="font-serif text-sm italic text-white">{chapter.caption}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2" aria-label="Story chapters">
              {STORY_CHAPTERS.map((chapter, index) => (
                <button
                  key={chapter.image}
                  type="button"
                  aria-label={`Go to story chapter ${index + 1}`}
                  onClick={() => scrollToStory(index + STORY_CHAPTERS.length)}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${storyIndex % STORY_CHAPTERS.length === index ? 'bg-[#c49a4a]' : 'bg-[#c49a4a]/35'}`}
                />
              ))}
            </div>

            <FadeInSection>
              <div className="mx-auto mt-7 max-w-md px-8 text-center">
                <p className="font-serif text-2xl italic leading-relaxed text-[#b48a3d] sm:text-3xl">"From that first conversation to a<br className="hidden sm:block" /> lifetime of adventures"</p>
                <div className="mt-5 flex justify-center text-[#c47f72]"><HeartIcon filled /></div>
              </div>
            </FadeInSection>
          </section>

          {/* --- 7. SCHEDULE OF EVENTS --- */}
          <section
            className="relative min-h-[calc(100vh+20rem)] overflow-hidden bg-[#f7f3eb] bg-cover bg-center px-4 pb-96 pt-20 sm:px-8 sm:pb-[32rem] sm:pt-24"
            style={{ backgroundImage: `linear-gradient(rgba(247, 243, 235, 0.34), rgba(247, 243, 235, 0.34)), url(${scheduleBackground})` }}
          >
            <FadeInSection>
              <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
                <div className="mb-2 font-countdown text-sm text-[#c49a4a]" aria-hidden="true">❦</div>
                <h2 className="font-countdown text-3xl uppercase tracking-[0.2em] text-[#352d27] sm:text-5xl">
                  Schedule of Events
                </h2>
                <div className="mt-2 text-sm text-[#c47f72]" aria-hidden="true">♥</div>
                <p className="mt-4 font-countdown text-xs font-semibold uppercase tracking-[0.35em] text-[#b48a3d] sm:text-sm">
                  A Celebration of Tradition, Love & Family
                </p>
              </div>
            </FadeInSection>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {[
                [haldiCard, 'Phoolon Wali Haldi'],
                [cocktailCard, 'Cocktail Night'],
                [baraatCard, 'Baraat on Wheels'],
                [phereCard, 'Phere'],
                [sufiCard, 'Sufi Night'],
                [afterPartyCard, 'After Party']
              ].map(([image, title]) => (
                <FadeInSection key={title} delay={100}>
                  <article className="overflow-hidden rounded-[4px] bg-black p-1 shadow-[0_8px_14px_rgba(47,35,20,0.28)] transition-transform duration-300 hover:-translate-y-1">
                    <img
                      src={image}
                      alt={`${title} wedding event invitation`}
                      className="block h-auto w-full"
                    />
                  </article>
                </FadeInSection>
              ))}
            </div>

            <div className="hidden mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

              {/* Event 1 */}
              <FadeInSection delay={100}>
                <div className="h-full rounded-[3px] border-[7px] border-[#171512] bg-[#eee5d2] p-2 shadow-[0_8px_14px_rgba(47,35,20,0.22)]">
                  <div className="flex h-full flex-col items-center border border-[#c8b99a] bg-[#f4eddd] px-4 py-5 text-center sm:px-5">
                    <p className="font-countdown text-xs tracking-[0.12em] text-[#30495b] sm:text-sm">29TH NOVEMBER, 2026</p>
                    <div className="my-3 text-xs text-[#b48a3d]" aria-hidden="true">── ❦ ──</div>
                    <div className="mb-5 aspect-square w-full max-w-[230px] overflow-hidden border border-[#d6c6a9] shadow-sm">
                      <img src="https://images.unsplash.com/photo-1587316441710-859424c529d1?auto=format&fit=crop&w=600&q=80" alt="Ganesh Pujan" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-cursive text-4xl leading-none text-[#19364b] sm:text-5xl">Shri Ganesh Pujan</h3>
                    <div className="my-4 flex items-center justify-center gap-2 text-[#b48a3d]" aria-hidden="true">
                      <span>❧</span><span className="text-xs">♡</span><span>❧</span>
                    </div>
                    <p className="font-countdown text-sm tracking-[0.12em] text-[#4c4034]">5:00 PM · Our Residence</p>
                    <div className="mt-4 border border-[#b48a3d]/40 bg-[#e8ddc6] px-3 py-2 text-xs font-countdown italic text-[#4c4034]">
                      An auspicious beginning to the wedding celebrations.
                    </div>
                  </div>
                </div>
              </FadeInSection>

              {/* Event 2 */}
              <FadeInSection delay={100}>
                <div className="h-full rounded-[3px] border-[7px] border-[#171512] bg-[#eee5d2] p-2 shadow-[0_8px_14px_rgba(47,35,20,0.22)]">
                  <div className="flex h-full flex-col items-center border border-[#c8b99a] bg-[#f4eddd] px-4 py-5 text-center sm:px-5">
                    <p className="font-countdown text-xs tracking-[0.12em] text-[#30495b] sm:text-sm">1ST DECEMBER, 2026</p>
                    <div className="my-3 text-xs text-[#b48a3d]" aria-hidden="true">── ❦ ──</div>
                    <div className="mb-5 aspect-square w-full max-w-[230px] overflow-hidden border border-[#d6c6a9] shadow-sm">
                      <img src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80" alt="Mata Pujan and Mandap" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-cursive text-4xl leading-none text-[#19364b] sm:text-5xl">Mata Pujan & Mandap</h3>
                    <div className="my-4 flex items-center justify-center gap-2 text-[#b48a3d]" aria-hidden="true">
                      <span>❧</span><span className="text-xs">♡</span><span>❧</span>
                    </div>
                    <p className="font-countdown text-sm tracking-[0.12em] text-[#4c4034]">10:00 AM · Our Residence</p>
                    <p className="mt-4 font-countdown text-[10px] uppercase tracking-[0.25em] text-[#b48a3d]">Ceremony</p>
                    <p className="font-countdown text-sm text-[#4c4034]">Mata Pujan, Mandap & Grih Shanti</p>
                  </div>
                </div>
              </FadeInSection>

              {/* Event 3 */}
              <FadeInSection delay={100}>
                <div className="h-full rounded-[3px] border-[7px] border-[#171512] bg-[#eee5d2] p-2 shadow-[0_8px_14px_rgba(47,35,20,0.22)]">
                  <div className="flex h-full flex-col items-center border border-[#c8b99a] bg-[#f4eddd] px-4 py-5 text-center sm:px-5">
                    <p className="font-countdown text-xs tracking-[0.12em] text-[#30495b] sm:text-sm">1ST DECEMBER, 2026</p>
                    <div className="my-3 text-xs text-[#b48a3d]" aria-hidden="true">── ❦ ──</div>
                    <div className="mb-5 aspect-square w-full max-w-[230px] overflow-hidden border border-[#d6c6a9] shadow-sm">
                      <img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80" alt="Mahila Sangeet" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-cursive text-4xl leading-none text-[#19364b] sm:text-5xl">Mahila Sangeet</h3>
                    <div className="my-4 flex items-center justify-center gap-2 text-[#b48a3d]" aria-hidden="true">
                      <span>❧</span><span className="text-xs">♡</span><span>❧</span>
                    </div>
                    <p className="font-countdown text-sm tracking-[0.12em] text-[#4c4034]">7:30 PM onwards</p>
                  </div>
                </div>
              </FadeInSection>

              {/* Event 4 */}
              <FadeInSection delay={100}>
                <div className="h-full rounded-[3px] border-[7px] border-[#171512] bg-[#eee5d2] p-2 shadow-[0_8px_14px_rgba(47,35,20,0.22)]">
                  <div className="flex h-full flex-col items-center border border-[#c8b99a] bg-[#f4eddd] px-4 py-5 text-center sm:px-5">
                    <p className="font-countdown text-xs tracking-[0.12em] text-[#30495b] sm:text-sm">2ND DECEMBER, 2026</p>
                    <div className="my-3 text-xs text-[#b48a3d]" aria-hidden="true">── ❦ ──</div>
                    <div className="mb-5 aspect-square w-full max-w-[230px] overflow-hidden border border-[#d6c6a9] shadow-sm">
                      <img src="https://images.unsplash.com/photo-1557128928-66170d10b78c?auto=format&fit=crop&w=600&q=80" alt="Shubh Lagna" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-cursive text-4xl leading-none text-[#19364b] sm:text-5xl">Shubh Lagna</h3>
                    <div className="my-4 flex items-center justify-center gap-2 text-[#b48a3d]" aria-hidden="true">
                      <span>❧</span><span className="text-xs">♡</span><span>❧</span>
                    </div>
                    <p className="font-countdown text-sm tracking-[0.12em] text-[#4c4034]">9:30 AM</p>
                  </div>
                </div>
              </FadeInSection>

              {/* Event 5 */}
              <FadeInSection delay={100}>
                <div className="h-full rounded-[3px] border-[7px] border-[#171512] bg-[#eee5d2] p-2 shadow-[0_8px_14px_rgba(47,35,20,0.22)]">
                  <div className="flex h-full flex-col items-center border border-[#c8b99a] bg-[#f4eddd] px-4 py-5 text-center sm:px-5">
                    <p className="font-countdown text-xs tracking-[0.12em] text-[#30495b] sm:text-sm">2ND DECEMBER, 2026</p>
                    <div className="my-3 text-xs text-[#b48a3d]" aria-hidden="true">── ❦ ──</div>
                    <div className="mb-5 aspect-square w-full max-w-[230px] overflow-hidden border border-[#d6c6a9] shadow-sm">
                      <img src="https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=600&q=80" alt="Ashirwad Samaroh" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-cursive text-4xl leading-none text-[#19364b] sm:text-5xl">Ashirwad Samaroh</h3>
                    <div className="my-4 flex items-center justify-center gap-2 text-[#b48a3d]" aria-hidden="true">
                      <span>❧</span><span className="text-xs">♡</span><span>❧</span>
                    </div>
                    <p className="font-countdown text-sm tracking-[0.12em] text-[#4c4034]">7:00 PM onwards</p>
                    <p className="mt-4 font-countdown text-[10px] uppercase tracking-[0.25em] text-[#b48a3d]">Venue</p>
                    <p className="font-countdown text-sm text-[#4c4034]">Radha Resort,  ahead of Hariyali Marriage Garden, Sanawad Road, Khargone</p>
                  </div>
                </div>
              </FadeInSection>

            </div>
          </section>

          {/* --- 8. FOOTER / BLESSINGS --- */}
          <section
            className="relative bg-[#f7f1e7] pb-80 text-center  text-[#403329]"
          >
            <div
              className="pointer-events-none absolute inset-[-12px] z-0 translate-y-16 scale-[1.03] bg-cover bg-bottom blur-[4px]"
              style={{ backgroundImage: `linear-gradient(rgba(247, 241, 231, 0.35), rgba(247, 241, 231, 0.35)), url(${rsvpBackground})` }}
              aria-hidden="true"
            ></div>

            <FadeInSection>
              <div className="flex min-h-[214px] flex-col items-center justify-center  px-6 py-12">
                <h2 className="font-['Great_Vibes',_cursive] font-medium text-4xl text-[#93631f] sm:text-5xl">
                  Your Presence is Our Present
                </h2>
                <p className="font-['Cormorant_Garamond',_serif] font-medium mt-2 text-base tracking-wide text-[#4f4033] sm:text-lg">
                  No Gifts, only blessings!
                </p>
                <div className="mt-5 text-[10px] text-[#b85f55]" aria-hidden="true">♥</div>
              </div>

              <div className="relative overflow-hidden  px-6 py-24 sm:py-28">
                <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#dfe5df]/25 blur-3xl" aria-hidden="true"></div>
                <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#e6ded2]/45 blur-3xl" aria-hidden="true"></div>

                <div className="relative mx-auto max-w-md">
                  <p className="font-['Great_Vibes',_cursive] font-medium text-4xl text-[#93631f] sm:text-5xl">
                    Celebrate this new chapter with us.
                  </p>
                  <div className="my-4 text-[10px] text-[#b85f55]" aria-hidden="true">♥</div>

                  <p className="font-['Cormorant_Garamond',_serif] font-medium text-base leading-relaxed text-[#4f4033] sm:text-lg">
                    Your presence and blessings will make the wedding celebrations of{' '}
                    <strong className="font-semibold text-[#2f2118]">Raghav & Yashashwini</strong> truly special.
                  </p>

                  <div className="my-5 text-[10px] text-[#b85f55]" aria-hidden="true">♥</div>

                  <p className="font-['Cormorant_Garamond',_serif] font-medium text-base leading-relaxed text-[#4f4033] sm:text-lg">
                    <span className="block mb-1">Awaiting your presence</span>
                    <strong className="font-semibold text-[#2f2118]">
                      Shri Rajesh Ji Parsai<br />
                      Shri Lokesh Ji Devray<br />
                      The Parsai & Devray families
                    </strong>
                  </p>

                  <div className="my-5 text-[10px] text-[#b85f55]" aria-hidden="true">♥</div>

                  <p className="font-['Cormorant_Garamond',_serif] font-medium text-sm leading-relaxed text-[#4f4033] sm:text-base">
                    With the love and blessings of the Joshi family and all relatives and special guests
                  </p>

                  <div className="my-5 text-[10px] text-[#b85f55]" aria-hidden="true">♥</div>

                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mx-auto mt-6 flex w-fit items-center justify-center gap-2 rounded-full border border-[#b27d2d] px-7 py-3 font-['Cormorant_Garamond',_serif] text-xs font-semibold uppercase tracking-[0.25em] text-[#4f4033] transition-colors hover:bg-[#b27d2d] hover:text-white"
                  >
                    <span className="text-[#b85f55]"><MapPinIcon size={14} /></span> Get Directions
                  </a>
                </div>
              </div>
            </FadeInSection>
          </section>

        </div>

        {/* --- 9. MUSIC CONTROLS (Fixed to Mobile Wrapper) --- */}
        <audio ref={musicRef} src={backgroundMusic} loop preload="auto" aria-hidden="true" />
        <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
          <button
            onClick={toggleMusic}
            className={`w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-[#c0a062] flex items-center justify-center text-[#c0a062] shadow-xl hover:scale-110 transition-transform ${isMusicPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
          >
            {isMusicPlaying ? <MusicIcon /> : <MuteIcon />}
          </button>
        </div>

      </div>
    </div>
  );
}