"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { LiveChatIcon, FaqIcon } from '@/components/ui/Icon';


const faqs = [
  { id: 'faq1', question: "Can't find QR?" },
  { id: 'faq2', question: "How to pay?" },
  { id: 'faq3', question: "No App?" },
];

const SupportPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Profile'); // Assuming it's part of profile flow

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerProps={{ onBack: () => router.back(), showBackButton: true }}
      containerClassName="max-w-2xl mx-auto"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2C2E] mb-1">Need Assistance?</h1>
        <p className="text-sm sm:text-base text-[#8A8A8E]">We're here to help you with parking issues.</p>
      </div>

      {/* Support & Help Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Support & Help</p>
        <button 
          onClick={() => alert("Live Chat Clicked")}
          className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center">
            <LiveChatIcon />
            <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-[#2C2C2E]">Live chats</span>
          </div>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span> {/* Status indicator */}
        </button>
         <p className="text-xs text-[#8A8A8E] pl-10">Tap to open in-app live chat</p>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <p className="text-xs sm:text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center">
            <FaqIcon /><span className="ml-2">FAQs</span>
        </p>
        <div className="space-y-2">
          {faqs.map(faq => (
            <button 
              key={faq.id}
              onClick={() => alert(`FAQ: ${faq.question} clicked`)}
              className="w-full text-left p-3 sm:p-4 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm sm:text-base font-medium text-[#2C2C2E]"
            >
              {faq.question}
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SupportPage;