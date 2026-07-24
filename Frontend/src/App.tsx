import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ResearchProvider } from './context/ResearchContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import PaperDetailPage from './pages/PaperDetailPage';
import UploadPage from './pages/UploadPage';
import AIChatPage from './pages/AIChatPage';
import ComparePage from './pages/ComparePage';
import LiteratureReviewPage from './pages/LiteratureReviewPage';
import CollectionsPage from './pages/CollectionsPage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  const themeClass = useMemo(() => (theme === 'dark' ? 'theme-dark' : 'theme-light'), [theme]);

  return (
    <div className={themeClass}>
      <ResearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/login" element={<AuthPage theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/signup" element={<AuthPage theme={theme} toggleTheme={toggleTheme} />} />
            <Route
              path="/*"
              element={
                <AppShell theme={theme} toggleTheme={toggleTheme}>
                  <Routes>
                    <Route path="dashboard" element={<HomePage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="library/:id" element={<PaperDetailPage />} />
                    <Route path="upload" element={<UploadPage />} />
                    <Route path="chat" element={<AIChatPage />} />
                    <Route path="compare" element={<ComparePage />} />
                    <Route path="review" element={<LiteratureReviewPage />} />
                    <Route path="search" element={<CollectionsPage />} />
                    <Route path="collections" element={<Navigate to="/search" replace />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AppShell>
              }
            />
          </Routes>
        </BrowserRouter>
      </ResearchProvider>
    </div>
  );
};

export default App;
