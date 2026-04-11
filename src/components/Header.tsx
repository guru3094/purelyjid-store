'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
      router.push('/homepage');
      router.refresh();
    } catch {}
  };

  const isAdmin =
    user?.user_metadata?.role === 'admin' ||
    user?.app_metadata?.role === 'admin';

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Account';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF6F0]/90 backdrop-blur-xl py-3 shadow-sm border-b border-[rgba(196,120,90,0.12)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-between">
        
        {/* Logo (LEFT) */}
        <Link href="/homepage" className="flex items-center gap-2 group">
          <AppLogo size={40} />
        </Link>

        {/* Nav Links (CENTERED EXACTLY) */}
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {[
            { label: 'Our Story', href: '/homepage#story' },
          ]?.map((item) => (
            <Link
              key={item?.label}
              href={item?.href}
              className="text-[11px] uppercase tracking-[0.3em] font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {item?.label}
            </Link>
          ))}
        </nav>

        {/* User Menu (RIGHT) */}
        {!loading && user && (
          <div className="relative hidden sm:block" data-user-menu>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 h-9 px-4 rounded-full border border-[rgba(196,120,90,0.2)] hover:border-primary transition-colors"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="UserIcon" size={12} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                {displayName}
              </span>
              <Icon name="ChevronDownIcon" size={12} className="text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-[rgba(196,120,90,0.12)] shadow-lg py-2 z-50">
                <Link
                  href="/order-history"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-[#FAF6F0] transition-colors"
                >
                  <Icon name="ClipboardDocumentListIcon" size={15} className="text-muted-foreground" />
                  Order History
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-[#FAF6F0] transition-colors"
                  >
                    <Icon name="Cog6ToothIcon" size={15} className="text-muted-foreground" />
                    Admin Panel
                  </Link>
                )}

                <div className="my-1 border-t border-[rgba(196,120,90,0.1)]" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={15} className="text-red-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}