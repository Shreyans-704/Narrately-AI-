import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, X, Send, Search, Home, MessageSquare,
  HelpCircle, ChevronDown, ChevronRight, ArrowRight,
} from 'lucide-react';

type ActiveTab = 'home' | 'messages' | 'help';

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
];

const HELP_COLLECTIONS = [
  { label: 'Avatars',            articles: 24, to: '/features' },
  { label: 'Voice',              articles: 5,  to: '/features' },
  { label: 'Translation',        articles: 3,  to: '/features' },
  { label: 'Video',              articles: 32, to: '/features' },
  { label: 'Account & Billing',  articles: 11, to: '/pricing'  },
  { label: 'Templates',          articles: 8,  to: '/features' },
  { label: 'General',            articles: 6,  to: '/features' },
];

// ── Shared: iridescent header used on Home tab ───────────────
function IridescentHeader({
  onClose,
  onSendMessage,
  onHelp,
}: {
  onClose: () => void;
  onSendMessage: () => void;
  onHelp: () => void;
}) {
  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] px-5 pt-5 pb-8 flex-shrink-0">
      {/* Gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -left-8 h-56 w-56 rounded-full blur-2xl opacity-80"
        style={{ background: 'conic-gradient(from 200deg at 40% 60%, #06b6d4, #84cc16, #a855f7, #06b6d4)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-16 h-40 w-40 rounded-full blur-3xl opacity-60"
        style={{ background: 'radial-gradient(circle, #e879f9 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 right-0 h-32 w-32 rounded-full blur-2xl opacity-40"
        style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 shadow-sm">
            <span className="text-[9px] font-black text-white leading-none">N</span>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Narrately AI</span>
        </div>
        <div className="flex items-center -space-x-2">
          {AVATARS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Support agent"
              className="h-8 w-8 rounded-full border-2 border-[#0d0d0d] bg-zinc-700 object-cover"
              style={{ zIndex: AVATARS.length - i }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Greeting */}
      <div className="relative z-10 mt-5">
        <p className="text-lg font-semibold text-white/90 leading-snug">Happy Creating! 👋</p>
        <p className="text-2xl font-bold text-white leading-tight mt-0.5">How can we help?</p>
      </div>
    </div>
  );
}

// ── Plain header used on Messages / Help tabs ────────────────
function PlainHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white flex-shrink-0">
      <span className="text-base font-semibold text-gray-900">{title}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Home Tab ─────────────────────────────────────────────────
function HomeTab({
  onClose,
  onGoMessages,
  onGoHelp,
  onClose: _closeWidget,
}: {
  onClose: () => void;
  onGoMessages: () => void;
  onGoHelp: () => void;
}) {
  return (
    <>
      <IridescentHeader onClose={onClose} onSendMessage={onGoMessages} onHelp={onGoHelp} />
      <div className="flex-1 bg-[#f5f5f5] px-3.5 py-3 space-y-2.5 overflow-y-auto">
        {/* Send a message card */}
        <button
          type="button"
          onClick={onGoMessages}
          className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">Send us a message</p>
            <p className="text-xs text-gray-400 mt-0.5">Typically responds in under seconds</p>
          </div>
          <Send className="h-4 w-4 text-gray-400 flex-shrink-0 ml-3" />
        </button>
        {/* Search / Help card */}
        <button
          type="button"
          onClick={onGoHelp}
          className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <p className="text-sm font-semibold text-gray-900">Search Narrately documentation</p>
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0 ml-3" />
        </button>
      </div>
    </>
  );
}

// ── Messages Tab ─────────────────────────────────────────────
function MessagesTab({ onClose }: { onClose: () => void }) {
  return (
    <>
      <PlainHeader title="Messages" onClose={onClose} />
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <MessageSquare className="h-7 w-7 text-gray-400 stroke-[1.5]" />
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">No messages</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Messages from the team will be shown here
          </p>
        </div>
        {/* CTA */}
        <div className="px-5 pb-5 pt-2 flex-shrink-0">
          <a
            href="mailto:support@narrately.ai"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Send us a message
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  );
}

// ── Help Tab ─────────────────────────────────────────────────
function HelpTab({ onClose, onNavigate }: { onClose: () => void; onNavigate: () => void }) {
  const [query, setQuery] = useState('');
  const filtered = HELP_COLLECTIONS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PlainHeader title="Help" onClose={onClose} />
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Search bar */}
        <div className="px-4 pt-3 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for help"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Collections list */}
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pb-3 text-sm font-semibold text-gray-900">
            {filtered.length} collection{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="divide-y divide-gray-100">
            {filtered.map((col) => (
              <Link
                key={col.label}
                to={col.to}
                onClick={onNavigate}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{col.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{col.articles} articles</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No results found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Bottom Nav ───────────────────────────────────────────────
const NAV_TABS = [
  { id: 'home'     as const, label: 'Home',     Icon: Home         },
  { id: 'messages' as const, label: 'Messages', Icon: MessageSquare },
  { id: 'help'     as const, label: 'Help',     Icon: HelpCircle   },
];

// ── Root Component ───────────────────────────────────────────
export function AIAgentHelper() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleOpen = () => { setOpen(true); setActiveTab('home'); };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden bg-white"
          style={{ height: 480 }}>

          {/* ── Tab panels ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'home' && (
              <HomeTab
                onClose={() => setOpen(false)}
                onGoMessages={() => setActiveTab('messages')}
                onGoHelp={() => setActiveTab('help')}
              />
            )}
            {activeTab === 'messages' && (
              <MessagesTab onClose={() => setOpen(false)} />
            )}
            {activeTab === 'help' && (
              <HelpTab
                onClose={() => setOpen(false)}
                onNavigate={() => setOpen(false)}
              />
            )}
          </div>

          {/* ── Bottom nav ── */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white">
            <div className="flex">
              {NAV_TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                      isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {/* Active icon: filled circle bg */}
                    {isActive ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900">
                        <Icon className="h-4 w-4 text-white stroke-2" />
                      </span>
                    ) : (
                      <Icon className="h-5 w-5 stroke-[1.5]" />
                    )}
                    <span className={isActive ? 'font-bold' : ''}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-[0_20px_40px_rgba(139,92,246,0.4)] transition-transform duration-200 hover:scale-105"
        aria-label="Open AI helper"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
