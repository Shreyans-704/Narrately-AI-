import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_STEPS = 3;

const goals = [
  'Social Media',
  'Ads',
  'Education & Training Videos',
  'Product Demos',
  'Internal Communications',
  'Video Translations',
  'Podcasts',
  'Other',
];

const roles = [
  'Marketing',
  'Sales',
  'Education & Training',
  'Business Owner',
  'Content Creator',
  'Other',
];

const personas = [
  {
    title: 'I run my own business or work independently',
    sub: 'Freelancer, solopreneur, or founder',
  },
  {
    title: 'I work at a company or as part of a team',
    sub: 'Employee, agency, or enterprise team member',
  },
  {
    title: "I'm just trying things out for fun or learning",
    sub: 'Student, hobbyist, or curious creator',
  },
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [goal, setGoal] = useState('Social Media');
  const [role, setRole] = useState('Marketing');
  const [persona, setPersona] = useState(0);

  const progress = (step / TOTAL_STEPS) * 100;

  const next = () => {
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };
  const submit = () => navigate('/studio');

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C2FF] to-purple-500 flex items-center justify-center">
          <span className="text-white font-black text-lg">N</span>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Narrately</span>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-2xl bg-[#0b0c0e] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 w-full bg-white/10">
          <motion.div
            className="h-full bg-[#00C2FF]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        <div className="px-8 py-12 min-h-[480px] flex flex-col">
          <AnimatePresence mode="wait" custom={dir}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col flex-1"
              >
                <h1 className="text-2xl font-bold text-white text-center mb-8">
                  What do you want to create?
                </h1>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {goals.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`px-5 py-4 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${
                        goal === g
                          ? 'bg-[#00C2FF] border-[#00C2FF] text-black font-semibold'
                          : 'border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={next}
                    className="px-10 py-3 rounded-full bg-[#00C2FF] text-black font-semibold text-sm hover:bg-[#00aadd] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col flex-1"
              >
                <h1 className="text-2xl font-bold text-white text-center mb-8">
                  What is your role?
                </h1>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-5 py-4 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${
                        role === r
                          ? 'bg-[#00C2FF] border-[#00C2FF] text-black font-semibold'
                          : 'border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={back}
                    className="px-8 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={next}
                    className="px-10 py-3 rounded-full bg-[#00C2FF] text-black font-semibold text-sm hover:bg-[#00aadd] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col flex-1"
              >
                <h1 className="text-2xl font-bold text-white text-center mb-8">
                  Which best describes you as a creator?
                </h1>
                <div className="flex flex-col gap-3 flex-1">
                  {personas.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPersona(i)}
                      className={`w-full px-6 py-5 rounded-2xl border text-left transition-all duration-200 ${
                        persona === i
                          ? 'bg-[#00C2FF] border-[#00C2FF]'
                          : 'border-white/10 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <p
                        className={`font-semibold text-sm leading-snug ${
                          persona === i ? 'text-black' : 'text-white'
                        }`}
                      >
                        {p.title}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          persona === i ? 'text-black/70' : 'text-white/50'
                        }`}
                      >
                        {p.sub}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={back}
                    className="px-8 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={submit}
                    className="px-10 py-3 rounded-full bg-[#00C2FF] text-black font-semibold text-sm hover:bg-[#00aadd] transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Step counter */}
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs">
        Step {step} of {TOTAL_STEPS}
      </p>
    </div>
  );
}
