import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '@/lib/supabase';

// ── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);
const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────
// All prices in INR, inclusive of 18% GST.
const fmt = (n: number) => n.toLocaleString('en-IN');

const paygBundles = [
  { videos: 5,  price: 884,   pricePerVideo: '177' },
  { videos: 15, price: 2359,  pricePerVideo: '157', popular: true },
  { videos: 30, price: 4129,  pricePerVideo: '138' },
  { videos: 60, price: 7079,  pricePerVideo: '118' },
];

const recurringPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    icon: <CalendarIcon />,
    accent: '#6366f1',
    price: 4719,
    period: '/ month',
    videos: 30,
    validity: '30 days',
    description: 'Perfect for consistent creators who need a steady monthly quota.',
    features: [
      '30 video generations per month',
      'Quota resets with new purchase',
      'Download all generated videos',
      'Priority processing queue',
      'Email support',
    ],
    cta: 'Start Monthly Plan',
    highlighted: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    icon: <StarIcon />,
    accent: '#10b981',
    price: 40119,
    period: '/ year',
    videos: 480,
    validity: '365 days',
    badge: 'Best Value — Save 32%',
    description: 'Maximum value for serious professionals committed to social media growth.',
    features: [
      '480 video generations per year',
      "That's 40 videos/month on average",
      'Quota resets with new purchase',
      'Download all generated videos',
      'Priority processing queue',
      'Dedicated email support',
    ],
    cta: 'Start Annual Plan',
    highlighted: true,
  },
];

const comparisonRows = [
  { feature: 'Video generations',   payg: 'Per bundle',    monthly: '30 / month',    annual: '480 / year' },
  { feature: 'Validity period',     payg: 'No expiry',     monthly: '30 days',       annual: '365 days' },
  { feature: 'Quota reset',         payg: 'Top-up only',   monthly: 'On repurchase', annual: 'On repurchase' },
  { feature: 'Stack with PAYG',     payg: '—',             monthly: '✓',             annual: '✓' },
  { feature: 'Download videos',     payg: '✓',             monthly: '✓',             annual: '✓' },
  { feature: 'Priority processing', payg: '—',             monthly: '✓',             annual: '✓' },
  { feature: 'Dedicated support',   payg: '—',             monthly: '—',             annual: '✓' },
];

const faqNotes = [
  {
    icon: <RefreshIcon />,
    title: 'Quota Reset',
    body: "Monthly and Annual quotas reset only when you repurchase. Credits don't auto-renew.",
  },
  {
    icon: <ZapIcon />,
    title: 'Stack Plans',
    body: 'PAYG credits stack on top of any active Monthly or Annual plan. PAYG is consumed first.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Secure Payments',
    body: 'All payments are processed securely via Stripe. We never store your card details.',
  },
  {
    icon: <InfoIcon />,
    title: 'No Auto-Renewal',
    body: 'Plans do not auto-renew. You choose when to repurchase and stay in full control.',
  },
];

// ── Auth initializer (same pattern as Header) ───────────────────────────────
function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { user } = await getCurrentUser();
        if (!mounted) return;
        if (user) setUser(user as any);
      } catch (_) {}
    })();
    return () => { mounted = false; };
  }, [setUser]);
  return null;
}

// ── Main Component ────────────────────────────────────────────────────────────────────
export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedBundle, setSelectedBundle] = useState(1);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const currentPlan = 'monthly'; // simulate active plan

  // Format trial/expiry date
  const expiryLabel = user?.trial_ends_at
    ? new Date(user.trial_ends_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const handlePurchase = (planId: string) => {
    setPurchasing(planId);
    setTimeout(() => setPurchasing(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* ── Site-wide animated background ── */}
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
      <AuthInitializer />

      {/* ── Local animations ── */}
      <style>{`
        @keyframes _spin   { to { transform: rotate(360deg); } }
        ._spinner          { animation: _spin 0.7s linear infinite; }
        @keyframes _fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        ._fadeUp           { animation: _fadeUp 0.3s ease both; }
      `}</style>

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Header ── */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <VideoIcon /> Video Generation Plans
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Choose your{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                plan
              </span>
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 max-w-xl mx-auto leading-relaxed">
              Purchase video generation credits that suit your workflow.
              Mix and match — PAYG always stacks on top of your active plan.
            </p>
          </div>

          {/* ── Current Plan Banner (signed-in users only) ── */}
          {user && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card/80 backdrop-blur border border-border rounded-2xl px-5 py-4 mb-10 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Your current plan: <strong>Monthly — 30 videos/month</strong>
                </span>
                <span className="text-xs text-foreground/50 bg-background border border-border rounded-full px-3 py-1">
                  {user.credit_balance} credits remaining
                  {expiryLabel ? ` · Trial ends ${expiryLabel}` : ''}
                </span>
              </div>
              <button
                onClick={() => navigate('/studio')}
                className="text-xs font-semibold px-4 py-2 rounded-lg border border-border bg-background hover:bg-card text-foreground transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {/* ════════════════════════════════════
              SECTION 1 — PAY AS YOU GO
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <ZapIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Pay As You Go</h2>
                <p className="text-xs text-foreground/50">One-time bundles · No expiry · Stacks with any active plan</p>
              </div>
            </div>

            {/* Bundle grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {paygBundles.map((b, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedBundle(i)}
                  className={[
                    'relative rounded-2xl border-2 p-4 sm:p-5 text-center transition-all duration-150 cursor-pointer w-full',
                    selectedBundle === i
                      ? 'border-primary shadow-[0_0_0_4px_rgba(99,102,241,0.12)] -translate-y-0.5 bg-card'
                      : b.popular
                      ? 'border-primary/30 bg-card/60 hover:border-primary/60'
                      : 'border-border bg-card/60 hover:border-primary/40',
                  ].join(' ')}
                >
                  {b.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap z-10">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">{b.videos}</span>
                    <span className="text-xs text-foreground/50">videos</span>
                  </div>
                  <div className="text-xl font-bold text-primary mb-0.5">₹{fmt(b.price)}</div>
                  <div className="text-[11px] text-foreground/40">₹{b.pricePerVideo} / video</div>
                  <div className={[
                    'w-5 h-5 rounded-full border-2 mx-auto mt-3 flex items-center justify-center transition-all',
                    selectedBundle === i ? 'bg-primary border-primary text-white' : 'border-border',
                  ].join(' ')}>
                    {selectedBundle === i && <CheckIcon />}
                  </div>
                </button>
              ))}
            </div>

            {/* PAYG action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/80 backdrop-blur border border-border rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground/50">Selected:</span>
                <span className="font-bold text-foreground">
                  {paygBundles[selectedBundle].videos} videos — ₹{fmt(paygBundles[selectedBundle].price)}
                </span>
                <span className="text-xs text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1">
                  Credits added instantly · Never expire
                </span>
              </div>
              <button
                onClick={() => handlePurchase('payg')}
                disabled={!!purchasing}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors disabled:opacity-60 whitespace-nowrap self-start sm:self-auto"
              >
                {purchasing === 'payg' ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full _spinner" /> Processing…</>
                ) : (
                  <><ZapIcon /> Buy {paygBundles[selectedBundle].videos} Videos — ₹{fmt(paygBundles[selectedBundle].price)}</>
                )}
              </button>
            </div>
          </section>

          {/* ════════════════════════════════════
              SECTION 2 — RECURRING PLANS
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <CalendarIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Subscription Plans</h2>
                <p className="text-xs text-foreground/50">
                  Recurring plans with a defined quota · Restart anytime by repurchasing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {recurringPlans.map((plan) => {
                const isActive = currentPlan === plan.id;
                const isBuying = purchasing === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={[
                      'relative rounded-2xl border-2 p-6 sm:p-7 flex flex-col gap-5 bg-card/80 backdrop-blur shadow-sm _fadeUp',
                      plan.highlighted
                        ? 'border-accent/40 shadow-[0_4px_24px_rgba(16,185,129,0.1)]'
                        : isActive
                        ? 'border-primary/40 shadow-[0_4px_24px_rgba(99,102,241,0.1)]'
                        : 'border-border',
                    ].join(' ')}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div
                        className="absolute top-5 right-5 text-white text-[11px] font-bold px-3 py-1 rounded-full"
                        style={{ background: plan.accent }}
                      >
                        {plan.badge}
                      </div>
                    )}
                    {isActive && !plan.badge && (
                      <div className="absolute top-5 right-5 bg-foreground/15 text-foreground text-[11px] font-bold px-3 py-1 rounded-full">
                        Current Plan
                      </div>
                    )}

                    {/* Plan top */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: plan.accent + '20', color: plan.accent }}
                      >
                        {plan.icon}
                      </div>
                      <div>
                        <div className="text-base font-bold text-foreground mb-0.5">{plan.name}</div>
                        <div className="text-xs text-foreground/50 leading-relaxed">{plan.description}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground/60">₹</span>
                        <span className="text-5xl font-bold text-foreground leading-none">{fmt(plan.price)}</span>
                        <span className="text-sm text-foreground/50 ml-1">{plan.period}</span>
                      </div>
                    </div>

                    {/* Quota chip */}
                    <div
                      className="flex items-center rounded-xl px-4 py-2.5 border text-sm font-medium"
                      style={{
                        background: plan.accent + '18',
                        borderColor: plan.accent + '40',
                        color: plan.accent,
                      }}
                    >
                      <strong>{plan.videos}</strong>&nbsp;video generations · Valid {plan.validity}
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-2.5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: plan.accent }}>
                            <CheckIcon />
                          </span>
                          <span className="text-sm text-foreground/75 leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => !isActive && handlePurchase(plan.id)}
                      disabled={isBuying}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
                      style={
                        isActive
                          ? {
                              background: 'transparent',
                              color: 'var(--foreground)',
                              border: '1.5px solid var(--border)',
                              cursor: 'default',
                            }
                          : { background: plan.accent, color: '#fff', border: 'none' }
                      }
                    >
                      {isBuying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full _spinner" />
                          Processing…
                        </>
                      ) : isActive ? (
                        <>
                          <RefreshIcon /> Renew &amp; Reset Quota
                        </>
                      ) : (
                        <>
                          {plan.cta} <ArrowRightIcon />
                        </>
                      )}
                    </button>

                    {isActive && (
                      <p className="text-[11px] text-foreground/40 text-center -mt-3">
                        Renewing restarts your {plan.videos}-video quota from today.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ════════════════════════════════════
              COMPARISON TABLE
          ════════════════════════════════════ */}
          <section className="mb-12">
            <button
              onClick={() => setShowComparison((v) => !v)}
              className="flex items-center gap-2 text-primary text-sm font-semibold mb-4 hover:opacity-75 transition-opacity"
            >
              {showComparison ? 'Hide' : 'Show'} full plan comparison
              <ChevronIcon open={showComparison} />
            </button>

            {showComparison && (
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur overflow-x-auto _fadeUp shadow-sm">
                <table className="w-full border-collapse min-w-[480px]">
                  <thead>
                    <tr>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-foreground/50 uppercase tracking-wider border-b border-border bg-card">
                        Feature
                      </th>
                      <th className="px-5 py-3.5 text-center text-xs font-bold text-foreground/50 uppercase tracking-wider border-b border-border bg-card">
                        Pay As You Go
                      </th>
                      <th className="px-5 py-3.5 text-center text-xs font-bold text-foreground/50 uppercase tracking-wider border-b border-border bg-card">
                        Monthly
                      </th>
                      <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider border-b border-border bg-accent/10 text-accent">
                        Annual
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-card/30' : ''}>
                        <td className="px-5 py-3 text-sm text-foreground/80 border-b border-border/30">{row.feature}</td>
                        <td className="px-5 py-3 text-sm text-foreground/55 text-center border-b border-border/30">{row.payg}</td>
                        <td className="px-5 py-3 text-sm text-foreground/55 text-center border-b border-border/30">{row.monthly}</td>
                        <td className="px-5 py-3 text-sm text-center font-semibold text-accent bg-accent/5 border-b border-border/30">{row.annual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── FAQ Notes ── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {faqNotes.map((item, i) => (
              <div
                key={i}
                className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 flex flex-col gap-2.5 shadow-sm"
              >
                <div className="text-primary">{item.icon}</div>
                <div className="text-sm font-semibold text-foreground">{item.title}</div>
                <div className="text-xs text-foreground/55 leading-relaxed">{item.body}</div>
              </div>
            ))}
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

