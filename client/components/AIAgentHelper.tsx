import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const primaryLinks = [
  {
    label: 'Talk to support',
    href: 'mailto:support@narrately.ai',
  },
  {
    label: 'How usage works?',
    to: '/pricing',
  },
  {
    label: 'Copyright Claim',
    href: 'mailto:copyright@narrately.ai?subject=Copyright%20Claim',
  },
  {
    label: 'Help and FAQs',
    to: '/features',
  },
];

const legalLinks = [
  {
    label: 'Terms of service',
    href: 'mailto:legal@narrately.ai?subject=Terms%20of%20Service',
  },
  {
    label: 'Privacy Policy',
    href: 'mailto:legal@narrately.ai?subject=Privacy%20Policy',
  },
];

export function AIAgentHelper() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {open && (
        <div className="w-72 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="px-5 py-4">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/80">
              Helper Bot
            </p>
            <p className="text-sm font-semibold text-foreground">
              How can we help?
            </p>
          </div>
          <div className="px-3 pb-3">
            <div className="space-y-1">
              {primaryLinks.map((item) => (
                <MenuItem key={item.label} {...item} onSelect={() => setOpen(false)} />
              ))}
            </div>
            <div className="mt-3 border-t border-border/60 pt-3 space-y-1">
              {legalLinks.map((item) => (
                <MenuItem key={item.label} {...item} subtle onSelect={() => setOpen(false)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_20px_40px_rgba(37,99,235,0.35)] transition-transform duration-200 hover:scale-105"
        aria-label="Open AI helper"
        aria-expanded={open}
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
}

type MenuItemProps = {
  label: string;
  to?: string;
  href?: string;
  subtle?: boolean;
  onSelect?: () => void;
};

function MenuItem({ label, to, href, subtle, onSelect }: MenuItemProps) {
  const baseClasses =
    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors';
  const styleClasses = subtle
    ? 'text-foreground/85 hover:text-foreground hover:bg-card/70'
    : 'text-foreground hover:bg-card/70';

  if (to) {
    return (
      <Link
        to={to}
        onClick={onSelect}
        className={`${baseClasses} ${styleClasses}`}
      >
        <span>{label}</span>
        <span className="text-xs text-foreground/40">Open</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={onSelect}
        className={`${baseClasses} ${styleClasses}`}
        target="_blank"
        rel="noreferrer"
      >
        <span>{label}</span>
        <span className="text-xs text-foreground/40">Email</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${baseClasses} ${styleClasses}`}
    >
      <span>{label}</span>
    </button>
  );
}
