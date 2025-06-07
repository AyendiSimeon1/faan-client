import React from 'react';

// Placeholder Icon - Replace with your actual icon
const BackArrowIcon = () => <svg className="w-6 h-6 text-[#2C2C2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  rightContent,
  className = '',
  titleClassName = '',
}) => {
  return (
    <header className={`flex items-center justify-between px-16 h-[80px] bg-white border-b border-neutral-100 ${className}`}>
      <div className="flex items-center space-x-4 min-w-[100px]">
        {showBackButton && onBack && (
          <button 
            onClick={onBack} 
            className="p-3 hover:bg-neutral-50 rounded-lg transition-colors text-[#2C2C2E] focus:outline-none"
          >
            <BackArrowIcon />
          </button>
        )}
      </div>
      {title && (
        <h1 className={`text-2xl font-semibold text-[#2C2C2E] text-center flex-grow ${titleClassName}`}>
          {title}
        </h1>
      )}
      <div className="flex items-center justify-end space-x-4 min-w-[100px]">
        {rightContent}
      </div>
    </header>
  );
};

export default ScreenHeader;