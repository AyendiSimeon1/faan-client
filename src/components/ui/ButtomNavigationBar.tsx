import React from 'react';

// Placeholder Icons - Replace with your actual icons
const HomeIcon = ({ active }: { active?: boolean }) => <svg className={`w-6 h-6 ${active ? 'text-[#FDB813]' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const WalletIcon = ({ active }: { active?: boolean }) => <svg className={`w-6 h-6 ${active ? 'text-[#FDB813]' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>;
const HistoryIcon = ({ active }: { active?: boolean }) => <svg className={`w-6 h-6 ${active ? 'text-[#FDB813]' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const ProfileIcon = ({ active }: { active?: boolean }) => <svg className={`w-6 h-6 ${active ? 'text-[#FDB813]' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;

type NavItemKey = 'Home' | 'Wallet' | 'History' | 'Profile';

interface NavItem {
  key: NavItemKey;
  label: string;
  icon: (active?: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  { key: 'Home', label: 'Home', icon: (active) => <HomeIcon active={active} /> },
  { key: 'Wallet', label: 'Wallet', icon: (active) => <WalletIcon active={active} /> },
  { key: 'History', label: 'History', icon: (active) => <HistoryIcon active={active} /> },
  { key: 'Profile', label: 'Profile', icon: (active) => <ProfileIcon active={active} /> },
];

interface BottomNavigationBarProps {
  activeTab: NavItemKey;
  onTabChange: (tabKey: NavItemKey) => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-[70px] max-w-md mx-auto px-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`flex flex-col items-center justify-center p-2 focus:outline-none transition-colors duration-150 ${
              activeTab === item.key ? 'text-[#FDB813]' : 'text-neutral-500 hover:text-[#FDB813]'
            }`}
          >
            {item.icon(activeTab === item.key)}
            <span className={`text-xs mt-1 font-medium ${activeTab === item.key ? 'text-[#FDB813]' : 'text-neutral-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigationBar;