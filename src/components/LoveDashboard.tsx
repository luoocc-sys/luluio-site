import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion';
import { Heart, Calendar, MapPin } from 'lucide-react';

// ── Adjustable start date ──────────────────────────────────────────
const startDate = new Date('2025-08-15');

// ── Helpers ────────────────────────────────────────────────────────
const calculateDaysTogether = (): number =>
  Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

const calculateDaysUntilAnniversary = (): number => {
  const now = new Date();
  const currentYear = now.getFullYear();

  let next = new Date(currentYear, startDate.getMonth(), startDate.getDate());

  // If this year's anniversary has already passed, use next year
  if (next.getTime() < now.getTime()) {
    next = new Date(currentYear + 1, startDate.getMonth(), startDate.getDate());
  }

  return Math.floor((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

// ── Animated counter sub-component ─────────────────────────────────
const AnimatedCounter = ({
  target,
  trigger,
}: {
  target: number;
  trigger: boolean;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!trigger) return;
    const controls = animate(count, target, {
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1], // ease-out cubic
    });
    return () => controls.stop();
  }, [trigger, target, count]);

  return <motion.span>{rounded}</motion.span>;
};

// ── Card data ──────────────────────────────────────────────────────
interface DashboardCard {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
}

// ── Main component ─────────────────────────────────────────────────
const LoveDashboard = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const daysTogether = calculateDaysTogether();
  const daysUntilAnniversary = calculateDaysUntilAnniversary();
  const placesVisited = 0; // TODO: sync with map data later

  const cards: DashboardCard[] = [
    { icon: Heart, label: 'Days Together', value: daysTogether },
    { icon: Calendar, label: 'Until Anniversary', value: daysUntilAnniversary },
    { icon: MapPin, label: 'Places Together', value: placesVisited },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-black py-28 md:py-40 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative">
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

        {/* ── Section header ──────────────────────────────────── */}
        <motion.div
          className="text-center mb-16 md:mb-20 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">
            Our Love Dashboard
          </h2>
          <p className="mt-4 text-white/40 text-sm md:text-base tracking-wide">
            Every number tells our story
          </p>
        </motion.div>

        {/* ── Cards grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              className="liquid-glass rounded-3xl p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <card.icon size={28} className="text-rose-400" />
              </div>

              {/* Animated number */}
              <div className="text-6xl font-bold text-white mb-3 tabular-nums">
                <AnimatedCounter target={card.value} trigger={isInView} />
              </div>

              {/* Label */}
              <span className="text-white/50 text-sm tracking-widest uppercase">
                {card.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoveDashboard;
