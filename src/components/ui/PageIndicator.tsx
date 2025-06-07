import React from 'react';

interface PageIndicatorProps {
  count: number;
  activeIndex: number;
  className?: string;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({ count, activeIndex, className = '' }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === activeIndex ? 'bg-[#FDB813] w-6' : 'bg-neutral-300'
          }`}
        />
      ))}
    </div>
  );
};

export default PageIndicator;