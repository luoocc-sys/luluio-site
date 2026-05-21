import { useRef, useCallback, useState, useEffect } from 'react';
import { Globe, ArrowRight } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacityRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [videoOpacity, setVideoOpacity] = useState(0);

  // Smooth opacity fade using requestAnimationFrame
  const fadeTo = useCallback((target: number, duration: number) => {
    cancelAnimationFrame(animFrameRef.current);
    const startTime = performance.now();
    const startOpacity = opacityRef.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newOpacity = startOpacity + (target - startOpacity) * progress;
      opacityRef.current = newOpacity;
      setVideoOpacity(newOpacity);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Start playing and fade in
  const handleCanPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // Autoplay may be blocked; ignore
    });
    fadeTo(1, 500);
  }, [fadeTo]);

  // Fade out when near end (0.55s remaining)
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.55 && opacityRef.current > 0.01) {
      fadeTo(0, 500);
    }
  }, [fadeTo]);

  // On ended: reset and replay with fade
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setVideoOpacity(0);
    opacityRef.current = 0;
    setTimeout(() => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      fadeTo(1, 500);
    }, 100);
  }, [fadeTo]);

  // Handle case where video is already loaded before React attaches handlers
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3) {
      handleCanPlay();
    }
  }, [handleCanPlay]);

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col bg-black">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        style={{ opacity: videoOpacity }}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left side: brand + nav links */}
          <div className="flex items-center">
            <Globe size={24} className="text-white" />
            <span className="text-white font-semibold text-lg ml-2">Asme</span>
            <div className="hidden md:flex items-center gap-8 ml-8">
              <a
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                About
              </a>
            </div>
          </div>

          {/* Right side: auth buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-white text-sm font-medium"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ transform: 'translateY(-20%)' }}
      >
        <h1
          className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Know it then <em className="italic">all</em>
        </h1>

        {/* Email input */}
        <div className="liquid-glass rounded-full max-w-xl w-full pl-6 pr-2 py-2 flex items-center gap-3 mt-12">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent border-none outline-none text-white placeholder:text-white/40 flex-1"
          />
          <button
            type="button"
            className="bg-white rounded-full p-3 text-black flex items-center justify-center"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm leading-relaxed px-4 mt-6 max-w-xl">
          Stay updated with the latest news and insights. Subscribe to our
          newsletter today and never miss out on exciting updates.
        </p>

        {/* Manifesto button */}
        <button
          type="button"
          className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-10"
        >
          Read our manifesto
        </button>
      </div>

      {/* Social icons footer */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <button
          type="button"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Instagram"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </button>
        <button
          type="button"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Twitter"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
        </button>
        <button
          type="button"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={20} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
