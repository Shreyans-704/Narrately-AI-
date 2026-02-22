import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-black">N</span>
            </div>
            <div>
              <p className="text-base font-bold text-foreground">Narrately</p>
              <p className="text-sm text-foreground/70">AI video creation for modern creators</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/80">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-xs text-foreground/60">
          <p>© 2026 Narrately. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
