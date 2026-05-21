import { motion } from 'framer-motion';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';

const PhilosophySection = () => {
  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Love{' '}
          <span className="italic font-['Instrument_Serif'] text-rose-400/50">
            ×
          </span>{' '}
          Forever
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Video */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <video
              className="w-full h-full object-cover"
              src={VIDEO_URL}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          {/* Right: Text blocks */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Block 1 */}
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                The first hello
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                It all started with a simple hello. Two strangers, one
                moment in time, and a spark that neither of us saw
                coming. That moment changed everything—it was the
                beginning of our forever.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-8" />

            {/* Block 2 */}
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Our forever
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                We believe that true love grows in the quiet
                moments—the shared smiles, the gentle touches, the
                unspoken understanding. Every day with you is a new
                page in the most beautiful story I've ever known.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
