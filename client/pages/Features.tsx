import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, User, Mic, Puzzle, Clipboard, Bot, Globe, Zap, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Features() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [activeVoiceTone, setActiveVoiceTone] = useState('Calm');
  
  const fullPrompt = 'UGC style ad for my clothing brand';
  const languages = ['English', 'French', 'Spanish'];
  const voiceTones = ['Casual', 'Energetic', 'Serious', 'Sarcastic', 'Calm'];

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullPrompt.length) {
        setTypedText(fullPrompt.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          currentIndex = 0;
          setTypedText('');
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  // Language cycling effect
  useEffect(() => {
    const languageInterval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % languages.length);
    }, 2000);

    return () => clearInterval(languageInterval);
  }, []);

  const smallFeatures = [
    {
      icon: Sparkles,
      title: 'Custom Avatars',
      gradient: 'from-purple-500 to-pink-500',
      description: 'AI-generated realistic avatars',
    },
    {
      icon: User,
      title: 'Voice Synthesis',
      gradient: 'from-blue-500 to-cyan-500',
      description: '175+ natural voices',
    },
    {
      icon: Mic,
      title: 'Avatar Groups',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Manage multiple avatars',
    },
    {
      icon: Puzzle,
      title: 'Rich Templates',
      gradient: 'from-orange-500 to-red-500',
      description: 'Professional video layouts',
    },
    {
      icon: Clipboard,
      title: 'AI Script Generation',
      gradient: 'from-indigo-500 to-purple-500',
      description: 'Auto-generate scripts',
    },
    {
      icon: Bot,
      title: 'Smart Editing',
      gradient: 'from-pink-500 to-rose-500',
      description: 'Automated video editing',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Site-wide N background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/ai-bg.svg" alt="" className="w-full h-full object-cover opacity-50" />
        <div className="floating-logos" aria-hidden>
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--large" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--med" alt="" />
          <img src="/narrately-logo.svg" className="floating-logo floating-logo--small" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      </div>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 min-h-[60vh] flex items-center relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Powerful AI Video Creation Tools</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6"
          >
            Everything you need{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              to create incredible videos
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-foreground/90 max-w-2xl mx-auto mb-8"
          >
            Comprehensive suite of AI-powered tools designed to make professional video creation accessible to everyone.
          </motion.p>
        </div>
      </section>

      {/* Bento Box Features Grid */}
      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Core Features
            </h2>
            <p className="text-lg text-foreground/85">
              Discover the powerful capabilities that make Narrately the best choice for AI video creation
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Feature 1: Text to Video - Large Card (Spans 2 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-[2rem] bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border border-border overflow-hidden relative min-h-[500px]"
            >
              <div className="p-8 lg:p-12 h-full flex flex-col lg:flex-row gap-8 items-center">
                {/* Text Content */}
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-lg border border-white/20">
                    <Video className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">AI-Powered</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
                    Turn text into video with AI
                  </h3>
                  <p className="text-foreground/90 text-lg">
                    Produce complete videos with just a script and <span className="font-semibold text-pink-600 dark:text-pink-400">text to video AI</span>. Our AI video generator automates and edits the entire process and saves hours of production time. Generate a high-quality video (1080p or 4K) with a voiceover, visuals, and AI avatar.
                  </p>
                  <Button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                    Get started for free
                  </Button>
                </div>

                {/* Video Preview Container */}
                <div className="flex-1 relative">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl"
                  >
                    {/* Podcast-style video preview */}
                    <div className="aspect-[9/16] bg-gradient-to-br from-purple-400 to-pink-400">
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                      >
                        <source
                          src="https://cdn.coverr.co/videos/coverr-woman-talking-in-the-studio-8770/1080p.mp4"
                          type="video/mp4"
                        />
                      </video>
                    </div>

                    {/* Floating Input Box with Typing Animation */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%]"
                    >
                      <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-[1.5rem] px-6 py-4 border border-white/20 shadow-xl">
                        <p className="text-sm text-foreground/90 font-mono">
                          {typedText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-primary ml-1"
                          />
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: AI Video Translator - Tall Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-[2rem] bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 overflow-hidden relative min-h-[500px]"
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-20 -left-16 w-48 h-48 rounded-full bg-white/25 blur-3xl" />
                  <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-emerald-900/30 blur-3xl" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">
                    Speak any language with an AI video translator
                  </h3>
                  <p className="text-white/90 text-sm">
                    Speak 175+ languages and dialects with a click. Upload a video and HeyGen's AI video translator will translate into another language with natural lip-sync and subtitles.
                  </p>
                </div>

                {/* Language Selector — inline between text and image */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 bg-white/90 backdrop-blur-lg rounded-[1.5rem] p-4 border border-white/30 shadow-[0_12px_35px_rgba(0,0,0,0.15)] w-fit"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Globe className="w-4 h-4" />
                    <span className="font-semibold">Voice</span>
                  </div>
                  {languages.map((lang, idx) => (
                    <motion.div
                      key={lang}
                      animate={{
                        backgroundColor: activeLanguage === idx ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        {['GB', 'FR', 'ES'][idx]}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{lang}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Podcast image preview */}
                <div className="relative mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-[1.75rem] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/10"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-emerald-800 to-green-900">
                      <img
                        src="/woman-podcaster-recording-an-audio-podcast-in-a-radio-station-or-podcast-studio-with-a-focus-on-her-face-ai-generated-photo.webp"
                        alt="Podcast host recording"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Feature 3: Voice Cloning & Lip-Sync - Large Card (Spans 2 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 rounded-[2rem] bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border border-border overflow-hidden relative min-h-[400px]"
            >
              <div className="p-8 lg:p-12 h-full flex flex-col lg:flex-row gap-8 items-center">
                {/* Video Preview */}
                <div className="flex-1 relative">
                  <motion.div
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl"
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="relative">
                        <div className="text-8xl">👩‍💼</div>
                        <div className="absolute -right-4 -bottom-4 text-4xl">🎙️</div>
                      </div>
                    </div>

                    {/* Voice Tone Control Panel */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="absolute right-6 top-6 bg-white/95 dark:bg-white/10 backdrop-blur-lg rounded-[1.5rem] p-5 border border-white/20 shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 mb-4">
                          <Zap className="w-4 h-4" />
                          Voice Tone
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {voiceTones.map((tone) => (
                            <motion.button
                              key={tone}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                tone === activeVoiceTone
                                  ? 'bg-green-500 text-white shadow-lg'
                                  : 'bg-white/60 dark:bg-white/5 text-foreground/90 hover:bg-white dark:hover:bg-white/10'
                              }`}
                              onClick={() => setActiveVoiceTone(tone)}
                            >
                              {tone}
                            </motion.button>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 rounded-full bg-white/60 dark:bg-white/5 text-foreground/90 hover:bg-white dark:hover:bg-white/10 flex items-center justify-center text-lg"
                          >
                            +
                          </motion.button>
                        </div>
                        {activeVoiceTone === 'Calm' && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 px-4 py-3 bg-green-100 dark:bg-green-900/30 rounded-xl"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Calm</span>
                            </div>
                            <p className="text-sm font-mono text-green-800 dark:text-green-300">
                              "Slowly breathe in and out"
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
                    Voice cloning and lip-sync
                  </h3>
                  <p className="text-foreground/90 text-lg">
                    Keep your voice consistent across languages with voice cloning and lip-sync.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-sm text-foreground/85 cursor-pointer hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-medium">Learn more</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Feature Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
              {smallFeatures.slice(0, 2).map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="rounded-[2rem] bg-background border border-border overflow-hidden p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-foreground/85">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Third Row - Small Feature Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {smallFeatures.slice(2).map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="rounded-[2rem] bg-background border border-border overflow-hidden p-6 hover:shadow-xl transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-foreground/85">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to create amazing videos?
            </h2>
            <p className="text-lg text-foreground/85 mb-8">
              Get started for free and explore all these features without any commitment.
            </p>
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold mx-auto"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
