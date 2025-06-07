import React, { useState } from 'react';
import ScreenHeader from '../ui/ScreenHeader'; 

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: 'Home' | 'Wallet' | 'History' | 'Profile';
  onTabChange: (tabKey: 'Home' | 'Wallet' | 'History' | 'Profile') => void;
  headerProps?: any;
  customHeader?: React.ReactNode;
  hideHeader?: boolean;
  containerClassName?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  headerProps,
  customHeader,
  hideHeader = false,
  containerClassName = '',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    { key: 'Home', label: 'Dashboard', icon: '🏠' },
    { key: 'Wallet', label: 'Wallet', icon: '💳' },
    { key: 'History', label: 'History', icon: '📊' },
    { key: 'Profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-50 selection:bg-[#FDB813] selection:text-black">
      {/* Sidebar Navigation */}
      <aside className={`${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 bg-white border-r border-neutral-200 shadow-sm flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-neutral-800">FAAN</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => onTabChange(item.key as 'Home' | 'Wallet' | 'History' | 'Profile')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                    activeTab === item.key
                      ? 'bg-[#FDB813] text-black font-medium shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 text-center">
              © 2024 Your App
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        {!hideHeader && (
          <header className="bg-white border-b border-neutral-200 shadow-sm">
            {customHeader ? customHeader : (headerProps && <ScreenHeader {...headerProps} />)}
          </header>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${containerClassName}`}>
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;