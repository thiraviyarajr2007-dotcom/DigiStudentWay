import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  PlusCircle,
  History,
  LayoutDashboard,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Shield,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../lib/authContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { cn } from '../../lib/utils';
import { useToast } from '../common/Toast';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isGuest, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = Boolean(user || isGuest);

  const navLinks = isLoggedIn
    ? [
        { name: 'New Analysis', path: '/app/new', icon: PlusCircle },
        { name: 'Audit Dashboard', path: '/app/analysis/demo', icon: LayoutDashboard },
        { name: 'History', path: '/app/history', icon: History },
        { name: 'Methodology', path: '/how-it-works', icon: Shield },
      ]
    : [
        { name: 'Home', path: '/', icon: LayoutDashboard },
        { name: 'Sample Demo', path: '/app/analysis/demo', icon: Sparkles },
        { name: 'Methodology', path: '/how-it-works', icon: Shield },
      ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    setUserDropdownOpen(false);
    toast('Signed out successfully.', 'info');
    navigate('/');
  };

  const displayName = profile?.displayName || user?.displayName || (isGuest ? 'Guest Student' : 'Student');
  const displayEmail = profile?.email || user?.email || (isGuest ? 'guest@student.demo' : '');
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(148,163,184,0.15)] bg-[#080D1B]/80 dark:bg-[#080D1B]/80 backdrop-blur-xl transition-colors duration-200 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              to={isLoggedIn ? '/app/new' : '/'}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-xl p-1"
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-soft-sm flex items-center justify-center p-1 shrink-0">
                <img
                  src="/logo.png"
                  alt="DigiStudentWay Logo"
                  className="w-full h-full object-contain"
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                  DigiStudent<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Way</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                  Gap & Dark Spot Detection
                </span>
              </div>
            </Link>

            {/* Feature Pill */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/10 text-[11px] font-medium text-slate-300">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Cross-Source Verification Engine</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                    active
                      ? 'bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-glow-blue'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-slate-400')} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Theme toggle, User Menu / Sign in */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-400 hover:-rotate-12 transition-transform duration-200" />
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors border border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 text-white font-extrabold text-xs flex items-center justify-center border border-white/10">
                    {initials || 'ST'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Menu Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101A2E]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.15)] shadow-soft-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white block truncate">
                        {displayName}
                      </span>
                      {displayEmail && (
                        <span className="text-[11px] text-slate-400 block truncate font-mono">
                          {displayEmail}
                        </span>
                      )}
                    </div>

                    <div className="py-1">
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
                    </div>

                    <div className="pt-1 border-t border-white/10">
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
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">
                    Sign In
                  </Button>
                </Link>
                <Link to="/app/new">
                  <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                    Start Scan
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(148,163,184,0.15)] bg-[#080D1B]/95 backdrop-blur-2xl p-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-glow-blue'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {isLoggedIn ? (
            <>
              <Link
                to="/app/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Settings className="w-5 h-5 text-slate-400" />
                <span>Profile & Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out ({displayName})</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full border-white/20 text-white hover:bg-white/10">
                  Sign In / Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Sign Out"
        description="Are you sure you want to end your session? Local guest audits will be cleared."
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
          Your saved audits on Firestore remain securely stored in your personal account for when you sign back in.
        </p>
      </Modal>
    </header>
  );
};

