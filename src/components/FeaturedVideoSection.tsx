import { motion } from "framer-motion";

const FeaturedVideoSection = () => {
  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="rounded-3xl overflow-hidden aspect-video relative"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <video
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Bottom overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              {/* Left card */}
              <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
                <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
                  Our Philosophy
                </p>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  We believe that love is not just a feeling—it's a choice we make every single day. Through laughter, tears, and everything in between, we choose each other, again and again.
                </p>
              </div>

              {/* Right button */}
              <motion.button
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(255,100,140,0.15)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See our memories
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedVideoSection;
