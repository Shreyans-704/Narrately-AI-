import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { signOut, getCurrentUser, supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";

// ── Custom Hook for Responsiveness ──
const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
  });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: dimensions.width,
    isMobile: dimensions.width < 768,
    isTablet: dimensions.width >= 768 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024,
  };
};

// ── Icons ──────────────────────────────────────────────────
const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const CreditCardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const AvatarPersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const TranslateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5h12M9 3v2M3 12l5 5M15 5l6 14M13 13l4 4" />
    <path d="M5 12c0 2.5 2.5 5 5.5 6" />
  </svg>
);
const ToolsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const ProjectsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const UpgradeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// No mock videos — real data only
const recentVideos: { id: number; title: string; status: string; created: string; duration: string }[] = [];

// ── Subscription Widget Component ──────────────────────────
const SubscriptionWidget = ({ isMobile, creditBalance, trialEndsAt }: { isMobile: boolean; creditBalance: number; trialEndsAt: string | null }) => {
  const [expanded, setExpanded] = useState(!isMobile);
  const totalCredits = 30;
  const usedCredits = Math.max(0, totalCredits - creditBalance);

  const monthlyRemaining = creditBalance;
  const monthlyPercent = (usedCredits / totalCredits) * 100;
  const lowQuotaWarning = monthlyPercent >= 80;

  // Use real trial_ends_at from Supabase; fall back to 1 month from now if null
  const expiryDate = trialEndsAt ? new Date(trialEndsAt) : (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })();
  const expiryStr = expiryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const daysLeft = Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  if (isMobile) {
    return (
      <div style={s.subWidgetMobile}>
        <button style={s.subHeaderMobile} onClick={() => setExpanded(!expanded)}>
          <div style={s.subHeaderLeft}>
            <div style={s.subIconWrap}><CreditCardIcon /></div>
            <div>
              <div style={s.subTitle}>Your Subscription</div>
              <div style={s.subQuickStats}>{monthlyRemaining} of {totalCredits} videos left</div>
            </div>
          </div>
          <div style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
            <ChevronDownIcon />
          </div>
        </button>

        {expanded && (
          <div style={s.subBodyMobile}>
            <div style={s.planBox}>
              <div style={s.planHeader}>
                <div style={s.planName}><CalendarIcon /> Monthly Plan</div>
                <div style={s.planBadge}>Active</div>
              </div>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${monthlyPercent}%`, background: lowQuotaWarning ? "linear-gradient(90deg, #f59e0b, #dc2626)" : "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
              </div>
              <div style={s.quotaSummaryMobile}>
                <div>
                  <div style={s.quotaLabelSmall}>Used</div>
                  <div style={s.quotaValueSmall}>{usedCredits} / {totalCredits}</div>
                </div>
                <div>
                  <div style={s.quotaLabelSmall}>Expires</div>
                  <div style={s.quotaValueSmall}>{daysLeft} days</div>
                </div>
              </div>
              {lowQuotaWarning && (
                <div style={s.warningBox}><AlertCircleIcon /><span>Running low on free videos</span></div>
              )}
            </div>
            <div style={s.subActionsMobile}>
              <Link to="/pricing" style={{ ...s.btnPrimaryMobile, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><PlusIcon /> Upgrade Plan</Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={s.subWidget}>
      <div style={s.subHeader}>
        <div style={s.subHeaderLeft}>
          <div style={s.subIconWrap}><CreditCardIcon /></div>
          <div>
            <div style={s.subTitle}>Your Subscription</div>
            <div style={s.subSubtitle}>Manage your free video quota</div>
          </div>
        </div>
        <button style={s.manageBtn}><CreditCardIcon /> Manage</button>
      </div>

      <div style={s.planBox}>
        <div style={s.planHeader}>
          <div style={s.planName}><CalendarIcon /> Monthly Plan</div>
          <div style={s.planBadge}>Active</div>
        </div>
        <div style={s.quotaRow}>
          <div style={s.quotaLabel}>Videos Used</div>
          <div style={s.quotaValue}>
            <span style={s.quotaUsed}>{usedCredits}</span>
            <span style={s.quotaTotal}>/ {totalCredits}</span>
          </div>
        </div>
        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${monthlyPercent}%`, background: lowQuotaWarning ? "linear-gradient(90deg, #f59e0b, #dc2626)" : "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
        </div>
        <div style={s.quotaSummary}>
          <div style={s.quotaItem}>
            <span style={s.quotaItemLabel}>Remaining</span>
            <span style={{ ...s.quotaItemValue, color: lowQuotaWarning ? "#f59e0b" : "#10b981" }}>{monthlyRemaining} videos</span>
          </div>
          <div style={s.quotaItem}>
            <span style={s.quotaItemLabel}>Expires</span>
            <span style={s.quotaItemValue}>{expiryStr} · {daysLeft} days</span>
          </div>
        </div>
        {lowQuotaWarning && (
          <div style={s.warningBox}>
            <AlertCircleIcon />
            <span>You're running low on free videos. Upgrade your plan to continue generating videos.</span>
          </div>
        )}
      </div>

      <div style={s.subActions}>
        <Link to="/pricing" style={{ ...s.btnPrimary, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><PlusIcon /> Upgrade Plan</Link>
        <Link to="/pricing" style={{ ...s.btnSecondary, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>View All Plans <ArrowRightIcon /></Link>
      </div>
    </div>
  );
};

// ── Sidebar Navigation (Desktop) ─────────────────────────────
const SidebarNav = ({
  user, displayName, avatarChar, avatarUrl, handleLogout, theme, toggle,
}: {
  user: any; displayName: string; avatarChar: string; avatarUrl?: string | null;
  handleLogout: () => void; theme: string; toggle: () => void;
}) => {
  const navItems = [
    { icon: <HomeIcon />, label: "Home", href: "/studio", active: true },
    { icon: <AvatarPersonIcon />, label: "Avatar", href: "/studio" },
    { icon: <ProjectsIcon />, label: "Projects", href: "/studio" },
  ];
  const workspaceName = `${(user.full_name || displayName).split(" ")[0]}'s Works\u2026`;
  return (
    <aside style={s.sidebar}>
      <div style={s.sidebarLogo}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={s.sidebarLogoMark}><span style={s.logoChar}>N</span></div>
          <span style={s.sidebarLogoName}>Narrately</span>
        </Link>
      </div>
      <nav style={s.sidebarNav}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            style={{ ...s.sidebarNavItem, ...(item.active ? s.sidebarNavItemActive : {}) }}
            className="sidebar-nav-link"
          >
            <span style={{ display: "flex", opacity: item.active ? 1 : 0.65 }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={s.sidebarSection}>
        <div style={s.sidebarSectionLabel}>PERSONAL</div>
        <Link to="/studio/profile" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ ...s.sidebarUserRow, cursor: "pointer" } as React.CSSProperties}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={s.sidebarAvatarImg} />
            ) : (
              <div style={s.sidebarAvatarFallback}>{avatarChar}</div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={s.sidebarUserName}>{user.full_name || displayName}</div>
              <div style={s.sidebarUserEmail}>{user.email}</div>
            </div>
          </div>
        </Link>
      </div>
      <div style={s.sidebarSection}>
        <div style={s.sidebarSectionLabel}>WORKSPACE</div>
        <div style={s.sidebarWorkspaceRow}>
          <div style={s.sidebarWorkspaceIcon}>{avatarChar[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.sidebarUserName}>{workspaceName}</div>
            <div style={s.sidebarUserEmail}>&middot; 1 Free</div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", display: "flex" }}><ChevronRightIcon /></span>
        </div>
      </div>
      <div style={s.sidebarBottom}>
        <Link to="/pricing" style={s.sidebarBottomItem} className="sidebar-bottom-item">
          <span style={{ color: "#818cf8", display: "flex" }}><UpgradeIcon /></span>
          Upgrade Plan
        </Link>
        <Link to="/studio/profile" style={s.sidebarBottomItem} className="sidebar-bottom-item">
          <span style={{ display: "flex" }}><SettingsIcon /></span> Settings
        </Link>
        <button
          style={{ ...s.sidebarBottomItem, background: "none", border: "none", cursor: "pointer", width: "100%" } as React.CSSProperties}
          className="sidebar-bottom-item"
          onClick={handleLogout}
        >
          <span style={{ display: "flex" }}><LogOutIcon /></span> Log out
        </button>
        <button
          style={{ ...s.sidebarBottomItem, background: "none", border: "none", cursor: "pointer", width: "100%", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 4, paddingTop: 12 } as React.CSSProperties}
          className="sidebar-bottom-item"
          onClick={toggle}
        >
          <span style={{ display: "flex" }}>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
};

// ── Bottom Navigation (Mobile) ─────────────────────────────
const BottomNav = () => (
  <nav style={s.bottomNav}>
    {[
      { icon: <HomeIcon />, label: "Home", active: true, href: "/studio" },
      { icon: <VideoIcon />, label: "Library", active: false, href: "/studio" },
      { icon: <CreditCardIcon />, label: "Plans", active: false, href: "/pricing" },
      { icon: <UserIcon />, label: "Profile", active: false, href: "/studio/profile" },
    ].map((item, i) => (
      <a key={i} href={item.href} style={{ ...s.bottomNavItem, ...(item.active ? s.bottomNavItemActive : {}) }}>
        <div style={{ color: item.active ? "#6366f1" : "#9ca3af" }}>{item.icon}</div>
        <span style={{ ...s.bottomNavLabel, color: item.active ? "#6366f1" : "#9ca3af" }}>{item.label}</span>
      </a>
    ))}
  </nav>
);

// ── Main Dashboard Component ───────────────────────────────
export default function StudioDashboard() {
  const { isMobile } = useResponsive();
  const [greeting, setGreeting] = useState("Good morning");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // authChecking: true while we verify session with Supabase (handles OAuth redirect)
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    let mounted = true;

    // Detect Supabase OAuth PKCE redirect — URL contains ?code= until Supabase
    // exchanges it for a session. Never navigate away while this is in the URL.
    const isOAuthRedirect =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token=');

    // onAuthStateChange is the single source of truth for all auth transitions:
    //   INITIAL_SESSION – fires immediately on page load (null = not logged in)
    //   SIGNED_IN       – fires when OAuth code exchange completes
    //   TOKEN_REFRESHED – fires on token rotation
    //   SIGNED_OUT      – fires on explicit logout
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        // Authenticated — fetch full profile (auto-creates it for new Google users)
        const { user: freshUser } = await getCurrentUser();
        if (!mounted) return;
        if (freshUser) {
          setUser(freshUser as any);
          setAuthChecking(false);
        } else {
          // Session exists but profile fetch/creation failed — redirect to avoid blank screen
          navigate('/login');
        }
      } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') {
        // INITIAL_SESSION with no session = definitely not logged in.
        // But if this is an OAuth redirect, the SIGNED_IN event will arrive shortly —
        // do NOT redirect yet.
        if (!isOAuthRedirect) {
          navigate('/login');
        }
      }
    });

    // If the user is already in the Zustand store (e.g. came from Login page),
    // clear the spinner immediately and silently refresh the profile in the background.
    if (user) {
      setAuthChecking(false);
      getCurrentUser().then(({ user: freshUser }) => {
        if (mounted && freshUser) setUser(freshUser as any);
      });
    }

    // Safety net: if nothing has resolved after 10 s, give up and send to login.
    const timeout = setTimeout(() => {
      if (mounted) {
        setAuthChecking((prev) => {
          if (prev) navigate('/login');
          return false;
        });
      }
    }, 10000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      authListener.unsubscribe();
    };
  }, []);

  // Realtime subscription — set up only once the user id is known
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`profile-credits-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          if (payload.new) setUser(payload.new as any);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate("/login");
  };

  if (authChecking || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f4" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #e5e7eb", borderTopColor: "#6366f1", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Inactive users cannot access the dashboard — show a pending approval screen
  if ((user as any).status === 'inactive') {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#080808", padding: "24px" }}>
        <style>{`@keyframes pulse-ring { 0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.15;transform:scale(1.08)} }`}</style>
        {/* Glow */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,194,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Icon ring */}
        <div style={{ position: "relative", marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid rgba(0,194,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,194,255,0.08)", animation: "pulse-ring 2.4s ease-in-out infinite" }}>
            <svg width="32" height="32" fill="none" stroke="#00C2FF" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
        {/* Text */}
        <img src="/narrately-logo.svg" alt="Narrately" style={{ width: 36, height: 36, marginBottom: 16, opacity: 0.9 }} />
        <h1 style={{ color: "#ffffff", fontSize: 22, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Account Pending Approval</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, maxWidth: 380, textAlign: "center", lineHeight: 1.6, marginBottom: 32 }}>
          Your account has been created and is awaiting activation by our team. You'll get access once an admin assigns your avatar ID and activates your account.
        </p>
        {/* Info card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", maxWidth: 380, width: "100%", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#00C2FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {(user.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{user.full_name || "—"}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "10px 14px" }}>
            <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>Status: Awaiting admin activation</span>
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <a href="mailto:support@narrately.ai" style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(0,194,255,0.12)", border: "1px solid rgba(0,194,255,0.25)", color: "#00C2FF", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Contact Support
          </a>
          <button onClick={() => { signOut(); logout(); navigate('/login'); }} style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Active users who haven't completed onboarding yet → redirect first.
  // Only redirect when explicitly false — undefined means DB column not yet present (treat as done).
  if ((user as any).onboarding_completed === false) {
    return <Navigate to="/onboarding" replace />;
  }

  const displayName = user.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";
  const avatarChar = (user.full_name?.[0] || user.email?.[0] || "U").toUpperCase();
  const avatarUrl = (user as any).avatar_url as string | null | undefined;
  const creditBalance = user.credit_balance ?? 30;
  const totalViews = (user as any).total_views as number ?? 0;

  const formatViews = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  const stats = [
    { label: "Free Videos Remaining", value: String(creditBalance), change: "of 30", trend: "up", icon: <VideoIcon /> },
    { label: "This Month", value: String(Math.max(0, 30 - creditBalance)), change: "videos made", trend: "up", icon: <CalendarIcon /> },
    { label: "Total Views", value: formatViews(totalViews), change: "all time", trend: "up", icon: <TrendingUpIcon /> },
  ];

  return (
    <div style={s.root} className={`narrately-db${theme === "dark" ? " dark-db" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .narrately-db {
          --db-bg: #f8f7f4; --db-surface: #ffffff;
          --db-bc: #e5e7eb; --db-bc-sm: #f3f4f6; --db-bc-xs: #f9fafb;
          --db-t1: #111827; --db-t2: #374151; --db-t3: #6b7280; --db-t4: #9ca3af;
          --db-subtle: #f3f4f6;
        }
        .narrately-db.dark-db {
          --db-bg: #0f1117; --db-surface: #1a1d27;
          --db-bc: #2a2f45; --db-bc-sm: #22263a; --db-bc-xs: #1e2235;
          --db-t1: #f1f5f9; --db-t2: #cbd5e1; --db-t3: #94a3b8; --db-t4: #64748b;
          --db-subtle: #1e2235;
        }
        .narrately-db .nav-link-hover:hover { background: #f0f0ff !important; color: #6366f1 !important; }
        .narrately-db.dark-db .nav-link-hover:hover { background: #1e1b4b !important; color: #818cf8 !important; }
        .narrately-db .quick-action-btn:hover { border-color: #6366f1 !important; background: #fafafe !important; }
        .narrately-db.dark-db .quick-action-btn:hover { border-color: #6366f1 !important; background: #1e1b4b !important; }
        .narrately-db .download-btn:hover { background: #f3f4f6 !important; }
        .narrately-db.dark-db .download-btn:hover { background: #22263a !important; }
        .narrately-db .sidebar-nav-link:hover { background: rgba(255,255,255,0.1) !important; color: #ffffff !important; }
        .narrately-db .sidebar-bottom-item:hover { background: rgba(255,255,255,0.1) !important; color: #ffffff !important; }
      `}</style>

      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <SidebarNav
          user={user}
          displayName={displayName}
          avatarChar={avatarChar}
          avatarUrl={avatarUrl}
          handleLogout={handleLogout}
          theme={theme}
          toggle={toggle}
        />
      )}

      {/* ── Main Content Area ── */}
      <div style={!isMobile ? { marginLeft: 240 } : {}}>

      {/* ── Top Nav (Mobile Only) ── */}
      {isMobile && (
      <header style={s.topNav}>
        <div style={s.navLogo}>
          {isMobile && (
            <button style={s.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MenuIcon />
            </button>
          )}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={s.logoMark}><span style={s.logoChar}>N</span></div>
            <span style={s.logoName}>Narrately</span>
          </Link>
        </div>
        {!isMobile && (
          <nav style={s.navLinks}>
            <a href="/studio" style={{ ...s.navLink, ...s.navLinkActive }}>Dashboard</a>
            <a href="/pricing" style={s.navLink} className="nav-link-hover">Subscription</a>
            <a href="/studio/profile" style={s.navLink} className="nav-link-hover">Profile</a>
          </nav>
        )}
        <div style={s.navRight}>
          {!isMobile && (
            <>
              <button
                style={s.themeToggleBtn}
                onClick={toggle}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
              <button style={s.logoutBtn} onClick={handleLogout}>
                <LogOutIcon /> Sign out
              </button>
            </>
          )}
          <button
            style={s.navAvatarBtn}
            onClick={() => navigate("/studio/profile")}
            title="View profile"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={s.navAvatarImg} />
            ) : (
              <div style={s.navAvatar}>{avatarChar}</div>
            )}
          </button>
        </div>
      </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div style={s.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div style={s.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={s.mobileMenuUser}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} style={{ ...s.mobileMenuAvatar, objectFit: "cover" } as React.CSSProperties} />
              ) : (
                <div style={s.mobileMenuAvatar}>{avatarChar}</div>
              )}
              <div>
                <div style={s.mobileMenuName}>{user.full_name || displayName}</div>
                <div style={s.mobileMenuEmail}>{user.email}</div>
              </div>
            </div>
            {[
              { label: "Dashboard", href: "/studio" },
              { label: "Subscription", href: "/pricing" },
              { label: "Profile", href: "/studio/profile" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={s.mobileMenuItem}>{item.label}</a>
            ))}
            <button style={s.mobileMenuLogout} onClick={handleLogout}>
              <LogOutIcon /> Sign out
            </button>
            <button
              style={{ ...s.mobileMenuLogout, color: "#6366f1", background: "#f0f0ff", border: "1px solid #e0e0ff", marginTop: 8 } as React.CSSProperties}
              onClick={toggle}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}

      <div style={{ ...s.page, paddingBottom: isMobile ? 80 : 40 }}>

        {/* ── Page Header ── */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={{ ...s.pageTitle, fontSize: isMobile ? 24 : 32 }}>
              {greeting}, {displayName}
            </h1>
            <p style={s.pageSubtitle}>Here's what's happening with your content today</p>
          </div>
          {!isMobile && (
            <button style={s.newVideoBtn} onClick={() => navigate("/studio")}>
              <PlusIcon /> Generate Video
            </button>
          )}
        </div>

        {/* Mobile: Generate Video button */}
        {isMobile && (
          <button style={s.newVideoBtnMobile} onClick={() => navigate("/studio")}>
            <PlusIcon /> Generate New Video
          </button>
        )}

        {/* ── Stats Row ── */}
        <div style={isMobile ? s.statsRowMobile : s.statsRow}>
          {stats.map((stat, i) => (
            <div key={i} style={{ ...s.statCard, animationDelay: `${i * 0.1}s` }}>
              <div style={s.statIcon}>{stat.icon}</div>
              <div style={s.statContent}>
                <div style={s.statLabel}>{stat.label}</div>
                <div style={s.statValue}>{stat.value}</div>
                <div style={{ ...s.statChange, color: stat.trend === "up" ? "#10b981" : "#ef4444" }}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Subscription Widget at Top */}
        {isMobile && <SubscriptionWidget isMobile={isMobile} creditBalance={creditBalance} trialEndsAt={user.trial_ends_at} />}

        <div style={isMobile ? s.mainGridMobile : s.mainGrid}>

          {/* ── Left Column ── */}
          <div style={s.leftCol}>

            {/* Recent Videos */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div>
                  <div style={s.cardTitle}>Recent Videos</div>
                  <div style={s.cardSubtitle}>Your latest generated content</div>
                </div>
                {!isMobile && (
                  <a href="/studio" style={s.viewAllLink}>View All <ArrowRightIcon /></a>
                )}
              </div>

              <div style={s.videoList}>
                {recentVideos.length === 0 ? (
                  <div style={s.emptyState}>
                    <div style={s.emptyStateIcon}><VideoIcon /></div>
                    <div style={s.emptyStateTitle}>No videos yet</div>
                    <div style={s.emptyStateText}>Generate your first AI video to see it here</div>
                  </div>
                ) : recentVideos.slice(0, isMobile ? 3 : 5).map((video, i) => (
                  <div key={video.id} style={{ ...s.videoItem, animationDelay: `${i * 0.05}s` }}>
                    <div style={s.videoThumb}>
                      <div style={s.videoPlayBtn}><PlayIcon /></div>
                    </div>
                    <div style={s.videoInfo}>
                      <div style={s.videoTitle}>{video.title}</div>
                      <div style={s.videoMeta}>
                        <span style={s.videoMetaItem}>
                          <ClockIcon /> {video.created}
                        </span>
                        {!isMobile && video.duration !== "—" && (
                          <span style={s.videoMetaItem}>{video.duration}</span>
                        )}
                      </div>
                    </div>
                    <div style={s.videoActions}>
                      {video.status === "completed" && (
                        <>
                          <div style={s.statusBadgeCompleted}>
                            <CheckCircleIcon /> {!isMobile && "Completed"}
                          </div>
                          {!isMobile && (
                            <button style={s.downloadBtn} className="download-btn" title="Download">
                              <DownloadIcon />
                            </button>
                          )}
                        </>
                      )}
                      {video.status === "processing" && (
                        <div style={s.statusBadgeProcessing}>
                          <div style={s.processingSpinner} />
                          {!isMobile && "Processing"}
                        </div>
                      )}
                      {video.status === "failed" && (
                        <div style={s.statusBadgeFailed}>
                          <AlertCircleIcon /> {!isMobile && "Failed"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isMobile && (
                <div style={s.viewAllLinkMobile}>
                  <a href="/studio" style={s.viewAllLinkMobileText}>View All Videos <ArrowRightIcon /></a>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!isMobile && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Quick Actions</div>
                </div>
                <div style={s.quickActions}>
                  {[
                    { label: "Generate New Video", icon: <VideoIcon />, color: "#6366f1", href: "/studio" },
                    { label: "Browse Video Library", icon: <PlayIcon />, color: "#10b981", href: "/studio" },
                    { label: "Upgrade Plan", icon: <ZapIcon />, color: "#f59e0b", href: "/pricing" },
                  ].map((action, i) => (
                    <button key={i} style={s.quickActionBtn} className="quick-action-btn" onClick={() => navigate(action.href)}>
                      <div style={{ ...s.quickActionIcon, background: `${action.color}15`, color: action.color }}>
                        {action.icon}
                      </div>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── Right Column (Desktop Only) ── */}
          {!isMobile && (
            <div style={s.rightCol}>
              <SubscriptionWidget isMobile={false} creditBalance={creditBalance} trialEndsAt={user.trial_ends_at} />
            </div>
          )}

        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && <BottomNav />}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "var(--db-bg)", fontFamily: "'DM Sans', sans-serif" },

  // Nav
  topNav: {
    height: 60, background: "var(--db-surface)",
    borderBottom: "1px solid var(--db-bc)",
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  hamburger: {
    width: 40, height: 40,
    background: "none", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "var(--db-t2)",
  },
  logoMark: {
    width: 32, height: 32, borderRadius: 8,
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoChar: { color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: "'Playfair Display', serif" },
  logoName: { fontSize: 17, fontWeight: 600, color: "var(--db-t1)" },
  navLinks: { display: "flex", gap: 4 },
  navLink: {
    padding: "6px 14px", borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: "var(--db-t3)",
    textDecoration: "none", transition: "all 0.15s",
  },
  navLinkActive: { background: "#f0f0ff", color: "#6366f1" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: 8,
    border: "1px solid var(--db-bc)", background: "var(--db-surface)",
    fontSize: 13, fontWeight: 500, color: "var(--db-t3)",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  themeToggleBtn: {
    width: 34, height: 34, borderRadius: 8,
    border: "1px solid var(--db-bc)", background: "var(--db-surface)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "var(--db-t3)",
    transition: "all 0.15s",
  },
  navAvatarBtn: {
    background: "none", border: "none",
    padding: 0, cursor: "pointer",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  navAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14, fontWeight: 700,
  },
  navAvatarImg: {
    width: 34, height: 34, borderRadius: "50%",
    objectFit: "cover",
  },

  // Mobile Menu
  mobileMenuOverlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 200,
    display: "flex",
  },
  mobileMenu: {
    width: 280,
    background: "var(--db-surface)",
    height: "100%",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
  },
  mobileMenuUser: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "16px 20px 20px",
    borderBottom: "1px solid var(--db-bc-sm)",
    marginBottom: 8,
  },
  mobileMenuAvatar: {
    width: 44, height: 44, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 18, fontWeight: 700, flexShrink: 0,
  },
  mobileMenuName: { fontSize: 15, fontWeight: 700, color: "var(--db-t1)" },
  mobileMenuEmail: { fontSize: 12, color: "var(--db-t4)", marginTop: 2 },
  mobileMenuItem: {
    padding: "13px 20px",
    fontSize: 15, fontWeight: 500, color: "var(--db-t2)",
    textDecoration: "none", display: "block",
    borderBottom: "1px solid var(--db-bc-xs)",
  },
  mobileMenuLogout: {
    display: "flex", alignItems: "center", gap: 8,
    margin: "16px 20px 0",
    padding: "12px 16px", borderRadius: 10,
    border: "1px solid #fee2e2", background: "#fff5f5",
    fontSize: 14, fontWeight: 600, color: "#dc2626",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },

  // Page
  page: { maxWidth: 1200, margin: "0 auto", padding: "20px 16px 80px" },

  // Page header
  pageHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 20, flexWrap: "wrap", gap: 16,
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 800, color: "var(--db-t1)",
    marginBottom: 4, letterSpacing: "-0.5px",
  },
  pageSubtitle: { fontSize: 14, color: "var(--db-t4)" },
  newVideoBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "11px 20px", borderRadius: 10,
    background: "#6366f1", color: "#fff",
    border: "none", cursor: "pointer",
    fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
    transition: "all 0.15s",
    minHeight: 44,
  },
  newVideoBtnMobile: {
    width: "100%",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "14px 20px", borderRadius: 12,
    background: "#6366f1", color: "#fff",
    border: "none", cursor: "pointer",
    fontSize: 15, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
    marginBottom: 16,
    minHeight: 48,
  },

  // Stats row
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16, marginBottom: 28,
  },
  statsRowMobile: {
    display: "flex", flexDirection: "column", gap: 12, marginBottom: 20,
  },
  statCard: {
    background: "var(--db-surface)", border: "1px solid var(--db-bc)",
    borderRadius: 14, padding: "16px",
    display: "flex", gap: 14, alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    animation: "fadeUp 0.4s ease both",
  },
  statIcon: {
    width: 42, height: 42, borderRadius: 12,
    background: "#f0f0ff", color: "#6366f1",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  statContent: { flex: 1 },
  statLabel: { fontSize: 12, color: "var(--db-t4)", marginBottom: 4, fontWeight: 500 },
  statValue: { fontSize: 26, fontWeight: 800, color: "var(--db-t1)", fontFamily: "'Playfair Display', serif", marginBottom: 2 },
  statChange: { fontSize: 12, fontWeight: 600 },

  // Main grid
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 },
  mainGridMobile: { display: "flex", flexDirection: "column", gap: 16 },
  leftCol: { display: "flex", flexDirection: "column", gap: 20 },
  rightCol: { display: "flex", flexDirection: "column", gap: 24 },

  // Card
  card: {
    background: "var(--db-surface)", border: "1px solid var(--db-bc)",
    borderRadius: 16, overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    animation: "fadeUp 0.4s ease both",
  },
  cardHeader: {
    padding: "16px 20px", borderBottom: "1px solid var(--db-bc-sm)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "var(--db-t1)" },
  cardSubtitle: { fontSize: 12, color: "var(--db-t4)", marginTop: 2 },
  viewAllLink: {
    fontSize: 13, color: "#6366f1", fontWeight: 600,
    textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
  },
  viewAllLinkMobile: {
    borderTop: "1px solid var(--db-bc-sm)",
    padding: "12px 20px",
    textAlign: "center",
  },
  viewAllLinkMobileText: {
    fontSize: 14, color: "#6366f1", fontWeight: 600,
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
  },

  // Video list
  videoList: { display: "flex", flexDirection: "column" },
  videoItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 20px",
    borderBottom: "1px solid var(--db-bc-xs)",
    animation: "slideIn 0.3s ease both",
  },
  videoThumb: {
    width: 64, height: 48, borderRadius: 8,
    background: "linear-gradient(135deg, var(--db-bc-sm), var(--db-bc))",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden", flexShrink: 0,
  },
  videoPlayBtn: {
    width: 24, height: 24, borderRadius: "50%",
    background: "rgba(255,255,255,0.9)", color: "#6366f1",
    display: "flex", alignItems: "center", justifyContent: "center",
    paddingLeft: 2,
  },
  videoInfo: { flex: 1, minWidth: 0 },
  videoTitle: { fontSize: 14, fontWeight: 600, color: "var(--db-t1)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  videoMeta: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  videoMetaItem: { fontSize: 12, color: "var(--db-t4)", display: "flex", alignItems: "center", gap: 4 },
  videoActions: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },

  // Status badges
  statusBadgeCompleted: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 600, color: "#059669",
    background: "#ecfdf5", border: "1px solid #a7f3d0",
    padding: "4px 10px", borderRadius: 8,
  },
  statusBadgeProcessing: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, fontWeight: 600, color: "#d97706",
    background: "#fffbeb", border: "1px solid #fde68a",
    padding: "4px 10px", borderRadius: 8,
  },
  statusBadgeFailed: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 600, color: "#dc2626",
    background: "#fef2f2", border: "1px solid #fecaca",
    padding: "4px 10px", borderRadius: 8,
  },
  processingSpinner: {
    width: 12, height: 12,
    border: "2px solid #fde68a",
    borderTopColor: "#d97706",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  downloadBtn: {
    width: 30, height: 30, borderRadius: 8,
    border: "1px solid var(--db-bc)", background: "var(--db-surface)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "var(--db-t3)",
  },

  // Quick actions
  quickActions: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12, padding: "20px 24px",
  },
  quickActionBtn: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    padding: "16px 12px", borderRadius: 12,
    border: "1.5px solid var(--db-bc)", background: "var(--db-surface)",
    cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--db-t2)",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },
  quickActionIcon: {
    width: 38, height: 38, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Subscription widget (Desktop)
  subWidget: {
    background: "var(--db-surface)", border: "1px solid var(--db-bc)",
    borderRadius: 16, overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    animation: "fadeUp 0.4s ease both",
    animationDelay: "0.2s",
  },
  subHeader: {
    padding: "20px 24px", borderBottom: "1px solid var(--db-bc-sm)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 12, flexWrap: "wrap",
  },
  subHeaderLeft: { display: "flex", alignItems: "center", gap: 12 },
  subIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    background: "#f0f0ff", color: "#6366f1",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  subTitle: { fontSize: 15, fontWeight: 700, color: "var(--db-t1)" },
  subSubtitle: { fontSize: 12, color: "var(--db-t4)", marginTop: 2 },
  manageBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 12px", borderRadius: 8,
    border: "1px solid var(--db-bc)", background: "var(--db-surface)",
    fontSize: 12, fontWeight: 600, color: "var(--db-t2)",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },

  // Subscription widget (Mobile)
  subWidgetMobile: {
    background: "var(--db-surface)", border: "1px solid var(--db-bc)",
    borderRadius: 14, overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    marginBottom: 20,
  },
  subHeaderMobile: {
    width: "100%",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px",
    background: "none", border: "none",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  subQuickStats: { fontSize: 12, color: "var(--db-t4)", marginTop: 2 },
  subBodyMobile: {
    borderTop: "1px solid var(--db-bc-sm)",
    animation: "fadeUp 0.2s ease",
  },
  paygBoxMobile: { padding: "16px 20px", borderTop: "1px solid var(--db-bc-sm)" },
  subActionsMobile: {
    padding: "16px 20px",
    borderTop: "1px solid var(--db-bc-sm)",
  },
  btnPrimaryMobile: {
    width: "100%",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "12px 18px", borderRadius: 10,
    background: "#6366f1", color: "#fff",
    border: "none", cursor: "pointer",
    fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    minHeight: 48,
  },

  // Plan box
  planBox: { padding: "16px 20px", borderBottom: "1px solid var(--db-bc-sm)" },
  planHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 16,
  },
  planName: {
    fontSize: 14, fontWeight: 600, color: "var(--db-t1)",
    display: "flex", alignItems: "center", gap: 8,
  },
  planBadge: {
    fontSize: 11, fontWeight: 700, color: "#059669",
    background: "#ecfdf5", border: "1px solid #a7f3d0",
    padding: "3px 10px", borderRadius: 8,
  },
  quotaRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 10,
  },
  quotaLabel: { fontSize: 13, color: "var(--db-t3)" },
  quotaValue: { display: "flex", alignItems: "baseline", gap: 2 },
  quotaUsed: { fontSize: 20, fontWeight: 800, color: "var(--db-t1)", fontFamily: "'Playfair Display', serif" },
  quotaTotal: { fontSize: 14, color: "var(--db-t4)", fontWeight: 600 },

  // Progress bar
  progressBar: {
    width: "100%", height: 8, borderRadius: 10,
    background: "var(--db-subtle)", overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: "100%", borderRadius: 10,
    transition: "width 0.4s ease",
  },

  // Quota summary
  quotaSummary: { display: "flex", justifyContent: "space-between" },
  quotaItem: { display: "flex", flexDirection: "column", gap: 4 },
  quotaItemLabel: { fontSize: 11, color: "var(--db-t4)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 },
  quotaItemValue: { fontSize: 13, fontWeight: 600, color: "var(--db-t2)" },
  quotaSummaryMobile: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 12, marginBottom: 12,
  },
  quotaLabelSmall: { fontSize: 11, color: "var(--db-t4)", marginBottom: 4 },
  quotaValueSmall: { fontSize: 14, fontWeight: 700, color: "var(--db-t1)" },

  // Warning box
  warningBox: {
    display: "flex", alignItems: "flex-start", gap: 8,
    background: "#fffbeb", border: "1px solid #fde68a",
    borderRadius: 10, padding: "12px",
    fontSize: 12, color: "#92400e", lineHeight: 1.6,
    marginTop: 14,
  },

  // PAYG box
  paygBox: { padding: "20px 24px", borderBottom: "1px solid var(--db-bc-sm)" },
  paygHeader: { marginBottom: 16 },
  paygName: {
    fontSize: 14, fontWeight: 600, color: "var(--db-t1)",
    display: "flex", alignItems: "center", gap: 8,
  },
  paygNote: { fontSize: 12, color: "var(--db-t4)", marginTop: 8 },

  // Actions
  subActions: {
    display: "flex", flexDirection: "column", gap: 10,
    padding: "20px 24px",
  },
  btnPrimary: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 18px", borderRadius: 10,
    background: "#6366f1", color: "#fff",
    border: "none", cursor: "pointer",
    fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },
  btnSecondary: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 18px", borderRadius: 10,
    background: "var(--db-surface)", color: "#6366f1",
    border: "1.5px solid var(--db-bc)", cursor: "pointer",
    fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },

  // Bottom Navigation
  bottomNav: {
    position: "fixed",
    bottom: 0, left: 0, right: 0,
    height: 64, background: "var(--db-surface)",
    borderTop: "1px solid var(--db-bc)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "0 8px",
    zIndex: 100,
    boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
  },
  bottomNavItem: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 4, padding: "8px 12px",
    textDecoration: "none",
    minWidth: 60, minHeight: 48,
    borderRadius: 8, transition: "all 0.15s",
  },
  bottomNavItemActive: { background: "#f0f0ff" },
  bottomNavLabel: { fontSize: 11, fontWeight: 600 },

  // ── Sidebar
  sidebar: {
    position: "fixed", left: 0, top: 0, width: 240, height: "100vh",
    background: "#0c0d14",
    display: "flex", flexDirection: "column",
    zIndex: 50, overflowY: "auto",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },
  sidebarLogo: { padding: "20px 16px 16px", flexShrink: 0 },
  sidebarLogoMark: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  sidebarLogoName: { fontSize: 17, fontWeight: 700, color: "#ffffff", fontFamily: "'DM Sans', sans-serif" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: 1, padding: "0 8px 8px" },
  sidebarNavItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 12px", borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)",
    textDecoration: "none", transition: "all 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebarNavItemActive: { background: "rgba(99,102,241,0.18)", color: "#ffffff" },
  sidebarSection: {
    padding: "8px 16px 12px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
  },
  sidebarSectionLabel: {
    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)",
    letterSpacing: "0.8px", marginBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebarUserRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px", borderRadius: 8,
    background: "rgba(255,255,255,0.06)",
  },
  sidebarAvatarImg: {
    width: 34, height: 34, borderRadius: "50%",
    objectFit: "cover" as const, flexShrink: 0,
  },
  sidebarAvatarFallback: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  sidebarUserName: {
    fontSize: 13, fontWeight: 600, color: "#ffffff",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  sidebarUserEmail: {
    fontSize: 11, color: "rgba(255,255,255,0.4)",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    marginTop: 1,
  },
  sidebarWorkspaceRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px", borderRadius: 8,
    background: "rgba(255,255,255,0.06)", cursor: "pointer",
  },
  sidebarWorkspaceIcon: {
    width: 34, height: 34, borderRadius: 8,
    background: "#6366f1",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  sidebarBottom: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "10px 8px 20px",
    display: "flex", flexDirection: "column", gap: 1,
    flexShrink: 0,
  },
  sidebarBottomItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "9px 12px", borderRadius: 8,
    fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)",
    textDecoration: "none", transition: "all 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },

  // ── Empty State
  emptyState: {
    padding: "48px 24px",
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, textAlign: "center" as const,
  },
  emptyStateIcon: {
    width: 56, height: 56, borderRadius: 14,
    background: "var(--db-subtle)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--db-t4)",
  },
  emptyStateTitle: { fontSize: 16, fontWeight: 700, color: "var(--db-t1)" },
  emptyStateText: { fontSize: 13, color: "var(--db-t4)", maxWidth: 240, lineHeight: 1.6 },
};
