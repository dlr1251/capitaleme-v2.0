import React from 'react';
import { AuthProvider } from '../../hooks/useAuth.js';
import AuthGuard from './AuthGuard.js';
import DashboardLayout from './DashboardLayout.js';
// Import all list components so they're proper React components
import VisasList from './VisasList.js';
import CLKRList from './CLKRList.js';
import GuidesList from './GuidesList.js';
import BlogList from './BlogList.js';
import DashboardStats from './DashboardStats.js';

interface DashboardWrapperProps {
  children?: React.ReactNode;
  currentPage?: string;
}

export default function DashboardWrapper({ children, currentPage = 'dashboard' }: DashboardWrapperProps) {
  console.log('[DashboardWrapper] ========== DASHBOARD WRAPPER RENDERING ==========');
  console.log('[DashboardWrapper] DashboardWrapper component rendering');
  console.log('[DashboardWrapper] currentPage:', currentPage);
  console.log('[DashboardWrapper] Has children:', !!children);
  
  // If children are provided, render them (for edit/new pages)
  // Otherwise, render the appropriate list component based on currentPage
  const renderPageContent = () => {
    // If children are provided, use them (for special pages like edit/new)
    if (children) {
      console.log('[DashboardWrapper] Rendering provided children');
      console.log('[DashboardWrapper] Children type:', typeof children);
      console.log('[DashboardWrapper] Children is valid element:', React.isValidElement(children));
      // Ensure children are properly rendered as React elements
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return child;
        }
        return child;
      }) || children;
    }
    
    // Otherwise, render the appropriate list component
    switch (currentPage) {
      case 'visas':
        console.log('[DashboardWrapper] Rendering VisasList component');
        return <VisasList />;
      case 'clkr':
        console.log('[DashboardWrapper] Rendering CLKRList component');
        return <CLKRList />;
      case 'guides':
        console.log('[DashboardWrapper] Rendering GuidesList component');
        return <GuidesList />;
      case 'blog':
        console.log('[DashboardWrapper] Rendering BlogList component');
        return <BlogList />;
      case 'dashboard':
      default:
        console.log('[DashboardWrapper] Rendering DashboardStats component');
        return <DashboardStats />;
    }
  };
  
  return (
    <AuthProvider>
      <AuthGuard>
        <DashboardLayout currentPage={currentPage}>
          {renderPageContent()}
        </DashboardLayout>
      </AuthGuard>
    </AuthProvider>
  );
}

