import { Link, useLocation } from "wouter";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
}

export function MobileHeader({ title, showBack = true }: MobileHeaderProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
      {showBack && !isHome && (
        <Link href="/">
          <a className="flex items-center justify-center size-10 rounded-full bg-soft-peach/50 hover:bg-soft-peach transition-colors" data-testid="button-back-dashboard">
            <span className="material-symbols-outlined text-text-dark">arrow_back</span>
          </a>
        </Link>
      )}
      <div className="flex items-center gap-3">
        <Link href="/">
          <a className="bg-gradient-to-br from-soft-peach to-muted-teal flex items-center justify-center rounded-full size-8 text-white font-bold text-sm" data-testid="link-mobile-logo">
            L
          </a>
        </Link>
        <h1 className="text-xl font-bold text-text-dark">{title}</h1>
      </div>
    </div>
  );
}
