import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ZoomIn } from 'lucide-react';

const avatars = [
  {
    id: 1,
    name: 'Alex — Executive',
    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&fit=crop&crop=face',
    preview: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=90&fit=crop&crop=top',
  },
  {
    id: 2,
    name: 'Dr. Sara — Podcast',
    src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&fit=crop&crop=face',
    preview: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=90&fit=crop&crop=top',
  },
  {
    id: 3,
    name: 'Marcus — Speaker',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&fit=crop&crop=face',
    preview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=90&fit=crop&crop=top',
  },
  {
    id: 4,
    name: 'Priya — Student',
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80&fit=crop&crop=face',
    preview: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=90&fit=crop&crop=top',
  },
];

export function AIStudio() {
  const [selectedId, setSelectedId] = useState(4);
  const [script, setScript] = useState('');
  const [enlarged, setEnlarged] = useState(false);
  const maxChars = 200;

  const selected = avatars.find((a) => a.id === selectedId) ?? avatars[3];

  return (
    <>
      {/* Enlarged overlay */}
      <AnimatePresence>
        {enlarged && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlarged(false)}
          >
            <motion.div
              className="relative max-h-[90vh] max-w-[90vw] rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.preview}
                alt={selected.name}
                className="max-h-[85vh] w-auto object-cover"
              />
              <button
                className="absolute top-4 right-4 bg-white/20 backdrop-blur p-2 rounded-full hover:bg-white/40 transition-colors"
                onClick={() => setEnlarged(false)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/80 mb-1">AI Studio</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Narrately AI Studio</h2>
          </div>

          {/* Main card */}
          <div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-border/60 shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-0">

              {/* ── Left Column (40%) ── */}
              <div className="lg:w-[42%] p-8 sm:p-10 flex flex-col gap-8 border-b lg:border-b-0 lg:border-r border-border/40">

                {/* Avatar picker */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-foreground mb-4">
                    Pick an avatar
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setSelectedId(avatar.id)}
                        className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none ${
                          selectedId === avatar.id
                            ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-white dark:ring-offset-background scale-105'
                            : 'hover:scale-105 hover:ring-2 hover:ring-cyan-300 ring-offset-2 ring-offset-white dark:ring-offset-background'
                        }`}
                      >
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Script input */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center mb-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-foreground">
                      Type your script
                    </h3>
                  </div>

                  <div className="relative flex-1">
                    <textarea
                      value={script}
                      onChange={(e) => setScript(e.target.value.slice(0, maxChars))}
                      placeholder="e.g. Explainer video for our new project management software…"
                      rows={6}
                      className="w-full h-full min-h-[140px] resize-none rounded-2xl bg-gray-50 dark:bg-white/5 border border-border/40 px-4 py-3 text-sm text-gray-800 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition-all"
                    />
                    <span className="absolute bottom-3 right-4 text-xs text-gray-400 dark:text-foreground/30 select-none">
                      {script.length}/{maxChars} characters
                    </span>
                  </div>
                </div>

                {/* Generate button */}
                <div className="flex justify-end">
                  <button className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-cyan-100/70 dark:bg-cyan-400/10 hover:bg-cyan-200/80 dark:hover:bg-cyan-400/20 border border-cyan-200/60 dark:border-cyan-400/20 transition-all duration-200 font-semibold text-gray-800 dark:text-cyan-300 text-sm">
                    Generate video
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Right Column (60%) ── */}
              <div className="lg:w-[58%] relative min-h-[420px] lg:min-h-0 overflow-hidden group cursor-zoom-in" onClick={() => setEnlarged(true)}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selected.id}
                    src={selected.preview}
                    alt={selected.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  />
                </AnimatePresence>

                {/* Zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-start justify-end p-4">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Lip sync badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-white/15 backdrop-blur-md shadow-lg border border-white/30 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Lip sync applied after generation
                  </motion.div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
