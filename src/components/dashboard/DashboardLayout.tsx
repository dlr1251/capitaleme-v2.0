import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import {
  HomeIcon,
  DocumentTextIcon,
  BookOpenIcon,
  NewspaperIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function DashboardLayout({ children, currentPage = 'dashboard' }: DashboardLayoutProps) {
  console.log('[DashboardLayout] ========== DASHBOARD LAYOUT RENDERING ==========');
  console.log('[DashboardLayout] DashboardLayout component rendering');
  console.log('[DashboardLayout] Children type:', typeof children);
  console.log('[DashboardLayout] Children:', children);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  console.log('[DashboardLayout] Rendering with user:', user?.email);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: HomeIcon },
    { name: 'Visas', href: '/dashboard/visas', icon: DocumentTextIcon },
    { name: 'Guides', href: '/dashboard/guides', icon: BookOpenIcon },
    { name: 'CLKR', href: '/dashboard/clkr', icon: DocumentTextIcon },
    { name: 'Blog', href: '/dashboard/blog', icon: NewspaperIcon },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16345F' }}>
                <span className="text-sm font-bold text-white">CM</span>
              </div>
              <h1 className="ml-3 text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = currentPage === item.name.toLowerCase() || 
                (item.href === '/dashboard/admin' && currentPage === 'dashboard');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  style={isActive ? { backgroundColor: '#16345F' } : {}}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* User section */}
          <div className="px-3 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3 px-3 py-2">
              <div className="h-10 w-10 rounded-full flex items-center justify-center ring-2" style={{ backgroundColor: '#E6F7F3', borderColor: '#00AA81' }}>
                <span className="text-sm font-semibold" style={{ color: '#00AA81' }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </header>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {console.log('[DashboardLayout] Rendering children inside main content')}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
