import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Carlo Mendoza',
      role: 'Senior Software Engineer, BGC',
      quote:
        'Finally a finance app that understands SeaBank, GoTyme, and GCash right out of the box. Voice-logging my Jollibee meals with Lwedge has kept me strictly inside my 30% wants budget.',
      rating: 5,
      avatar: '👨‍💻',
    },
    {
      name: 'Bea Alcantara',
      role: 'Freelance UI/UX Designer & Upwork Top Rated',
      quote:
        'The Google Sheets webhook sync is brilliant. I get offline-first speed on my phone and instant mirror backups in my personal spreadsheet. Zero cloud accounts required.',
      rating: 5,
      avatar: '🎨',
    },
    {
      name: 'Paolo Reyes',
      role: 'Product Manager & Crypto Investor, Makati',
      quote:
        'The Debt Snowball tracker combined with the 50/30/20 salary countdown made paying off my BPI credit card feel like a gamified victory. 10/10 UX.',
      rating: 5,
      avatar: '🚀',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
          Loved by Smart Earners & Tech Builders
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tested by the Philippine Tech Community
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-2xl p-6 glass-card border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-50 border border-white/10 flex items-center justify-center text-xl">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t.name}</h4>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
