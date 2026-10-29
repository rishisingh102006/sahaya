import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { RequestTrackingPage } from './pages/RequestTrackingPage';
import { SchemeFinderPage } from './pages/SchemeFinderPage';
import { SeniorDashboard } from './pages/SeniorDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AuthPage } from './pages/AuthPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { FeedbackPage } from './pages/FeedbackPage';

const AppContent: React.FC = () => {
  const { activeTab, currentUser, textSize } = useApp();

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'senior':
        return <SeniorDashboard />;
      case 'ngo':
        return <NgoDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
      case 'guest':
      default:
        return <AuthPage />;
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'schemes':
        return <SchemeFinderPage />;
      case 'track':
        return <RequestTrackingPage />;
      case 'create-request':
        return <CreateRequestPage />;
      case 'dashboard':
        return renderDashboard();
      case 'auth':
        return <AuthPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'feedback':
        return <FeedbackPage />;
      default:
        return <LandingPage />;
    }
  };

  const textSizeClass = {
    normal: '',
    large: 'text-[17px] leading-relaxed',
    extralarge: 'text-[19px] leading-loose',
  }[textSize];

  return (
    <div className={`min-h-screen flex flex-col bg-stone-50/40 text-stone-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900 ${textSizeClass}`}>
      <Navbar />
      <main className="flex-1">
        {renderActiveTab()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
