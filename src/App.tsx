import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { AuthProvider } from './lib/authContext';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { TransparencyPage } from './pages/TransparencyPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { StatusPage } from './pages/StatusPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-brand-navy-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/how-it-works" element={<TransparencyPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/status" element={<StatusPage />} />

                  {/* Protected Application Routes */}
                  <Route path="/app" element={<ProtectedRoute />}>
                    <Route index element={<Navigate to="/app/new" replace />} />
                    <Route path="new" element={<NewAnalysisPage />} />
                    <Route path="analysis/:id" element={<DashboardPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="settings" element={<ProfilePage />} />
                  </Route>

                  {/* Backwards-compatibility convenience redirects */}
                  <Route path="/dashboard" element={<Navigate to="/app/analysis/demo" replace />} />
                  <Route path="/new" element={<Navigate to="/app/new" replace />} />
                  <Route path="/history" element={<Navigate to="/app/history" replace />} />
                  <Route path="/profile" element={<Navigate to="/app/settings" replace />} />
                  <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
                  <Route path="/transparency" element={<Navigate to="/how-it-works" replace />} />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
