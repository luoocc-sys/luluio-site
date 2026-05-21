import { useRef, useCallback, useState, useEffect } from 'react';
import { Heart, ArrowRight, MessageCircle, Calendar } from 'lucide-react';

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
      {/* Rose radial glow overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,100,140,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

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
            <Heart size={24} className="text-rose-400" />
            <span className="text-white font-semibold text-lg ml-2">
              LULU <span className="text-rose-400">❤️</span>
            </span>
            <div className="hidden md:flex items-center gap-8 ml-8">
              <a
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Our Story
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Moments
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Letters
              </a>
            </div>
          </div>

          {/* Right side: song button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium"
            >
              Our Song ♪
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
          Every day with <em className="italic text-rose-400/70">you</em>
        </h1>

        {/* Love note input */}
        <div className="liquid-glass rounded-full max-w-xl w-full pl-6 pr-2 py-2 flex items-center gap-3 mt-12">
          <input
            type="text"
            placeholder="Write a love note..."
            className="bg-transparent border-none outline-none text-white placeholder:text-white/40 flex-1"
          />
          <button
            type="button"
            className="bg-rose-400 rounded-full p-3 text-white flex items-center justify-center"
          >
            <Heart size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm leading-relaxed px-4 mt-6 max-w-xl">
          Every love story is beautiful, but ours is my favorite. Here, we
          capture the little moments that make our journey unforgettable.
        </p>

        {/* Manifesto button */}
        <button
          type="button"
          className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-10"
        >
          Read our love story
        </button>
      </div>

      {/* Social icons footer */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <button
          type="button"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Love"
        >
          <Heart size={20} />
        </button>
        <button
          type="button"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Letters"
        >
          <MessageCircle size={20} />
        </button>
        <button
          type="button"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Timeline"
        >
          <Calendar size={20} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
