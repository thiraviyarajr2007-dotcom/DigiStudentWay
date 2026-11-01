import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Sparkles,
  History,
  Settings,
  BookOpen,
  Search,
  Sun,
  Moon,
  LogOut,
  LogIn,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../lib/authContext';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

export const AppLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isGuest, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userDropdownRef = useRef<HTMLDivElement>(null);

  const isDemoPath = location.pathname.includes('demo');
  const isGuestSession = !user && (isGuest || isDemoPath);

  const displayName = profile?.displayName || user?.displayName || (isGuestSession ? 'Guest Student' : 'Student');
  const displayEmail = profile?.email || user?.email || (isGuestSession ? 'guest@student.demo' : '');
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { name: 'New Analysis', path: '/app/new', icon: Sparkles },
    { name: 'Audit Dashboard', path: '/app/analysis/demo', icon: LayoutDashboard },
    { name: 'History', path: '/app/history', icon: History },
    { name: 'Settings', path: '/app/settings', icon: Settings },
    { name: 'How it works', path: '/how-it-works', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/app/new' && location.pathname === '/app/new') return true;
    if (path === '/app/analysis/demo' && location.pathname.startsWith('/app/analysis/')) return true;
    if (path === '/app/history' && location.pathname.startsWith('/app/history')) return true;
    if (path === '/app/settings' && location.pathname.startsWith('/app/settings')) return true;
    if (path === '/how-it-works' && location.pathname.startsWith('/how-it-works')) return true;
    return false;
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    setUserDropdownOpen(false);
    toast('Signed out successfully.', 'info');
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app/new');
  };

  return (
    <div className="min-h-screen bg-[#080D1B] text-slate-100 bg-radial-glow flex flex-col md:flex-row overflow-x-hidden">
      {/* =========================================================================
          DESKTOP SIDEBAR (>= 768px)
         ========================================================================= */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 bg-[#080D1B]/90 backdrop-blur-2xl border-r border-[rgba(148,163,184,0.15)] select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-[rgba(148,163,184,0.15)]">
          <Link
            to="/app/new"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-xl p-1"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md p-1 shadow-soft-sm flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="DigiStudentWay Logo"
                className="w-full h-full object-contain"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                DigiStudent<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Way</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide truncate">
                Gap & Dark Spot Detection
              </span>
            </div>
          </Link>
        </div>

        {/* Primary Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-glow-blue'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-white' : 'text-slate-400')} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Guest Session Banner or User Profile */}
        <div className="p-3 border-t border-[rgba(148,163,184,0.15)]">
          {isGuestSession ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Guest Mode Active</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                Audits saved locally. Sign in with Google, Facebook, or Email to sync with cloud.
              </p>
              <Link
                to="/auth"
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors shadow-soft-sm"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In to Save</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 text-white font-extrabold text-xs flex items-center justify-center shrink-0 border border-white/10">
                  {initials || 'ST'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate font-mono">
                    {displayEmail}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors shrink-0 ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================================
          MAIN APPLICATION AREA (Top bar, Mobile Drawer, Outlet)
         ========================================================================= */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar for /app area */}
        <header className="sticky top-0 z-20 w-full h-16 bg-[#080D1B]/80 backdrop-blur-xl border-b border-[rgba(148,163,184,0.15)] px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
          {/* Mobile Left: Brand Logo & Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle navigation drawer"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/app/new" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md p-1 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="DigiStudentWay Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-extrabold text-sm tracking-tight text-white">
                DigiStudent<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Way</span>
              </span>
            </Link>
          </div>

          {/* Search Shortcut Input (Desktop & Tablet) */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search or ask inquiry..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-900/60 border border-[rgba(148,163,184,0.15)] text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-400 border border-white/10 transition-colors"
              title="Navigate to New Scan"
            >
              Scan
            </button>
          </form>

          {/* Right Action Cluster: Mobile Search Button, Theme Toggle, User Avatar Menu */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Mobile Search Quick Action */}
            <button
              type="button"
              onClick={() => navigate('/app/new')}
              className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="New Analysis"
              title="Start New Scan"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-400 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* User Avatar Menu Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-white/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {isGuestSession ? 'GD' : initials || 'ST'}
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate hidden sm:inline-block">
                  {isGuestSession ? 'Guest Demo' : displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101A2E]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.15)] shadow-soft-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white block truncate">
                      {isGuestSession ? 'Guest Demo Session' : displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate font-mono">
                      {isGuestSession ? 'Local Storage Only' : displayEmail}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/app/new"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>New Analysis</span>
                    </Link>
                    <Link
                      to="/app/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      <span>Past Audits</span>
                    </Link>
                    <Link
                      to="/app/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>
                    <Link
                      to="/how-it-works"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>Methodology</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    {isGuestSession ? (
                      <Link
                        to="/auth"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-accent hover:bg-white/5 text-left"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Save Cloud Audits</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Drawer (< 768px down to 360px) */}
        {mobileDrawerOpen && (
          <div className="md:hidden border-b border-[rgba(148,163,184,0.15)] bg-[#080D1B]/95 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 z-20">
            {/* Mobile Search input shortcut */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search or ask inquiry..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary"
              />
            </form>

            {/* Mobile Nav Items */}
            <div className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-glow-blue'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Guest / Account actions in drawer */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {isGuestSession ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Guest Demo Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Audits saved locally. Sign in to sync with cloud.
                  </p>
                  <Link
                    to="/auth"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold shadow-glow-blue"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In / Register</span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({displayName})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Guest Session Advisory Banner */}
        {isGuestSession && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 sm:px-6 py-2 text-xs font-medium text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2 max-w-2xl">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-amber-300">Guest Demo Mode:</strong> Exploring with local memory. Sign in to save audits to the cloud.
              </span>
            </div>
            <Link
              to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 ml-3"
            >
              Sign In to Save
            </Link>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Sign Out"
        description="Are you sure you want to end your session?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmLogout}>
              Yes, Sign Out
            </Button>
          </div>
        }
      >
        <p className="text-xs text-slate-400">
          {isGuestSession
            ? 'Guest demo audits in local memory will be cleared.'
            : 'Your saved audits in Firestore remain securely stored in your personal account.'}
        </p>
      </Modal>
    </div>
  );
};
