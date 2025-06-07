import React from 'react';

// Placeholder Icons - Replace as needed
const ChevronRightIcon = () => <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
const RadioUncheckedIcon = () => <div className="w-5 h-5 border-2 border-neutral-300 rounded-full"></div>;
const RadioCheckedIcon = () => <div className="w-5 h-5 border-2 border-[#FDB813] rounded-full flex items-center justify-center"><div className="w-2.5 h-2.5 bg-[#FDB813] rounded-full"></div></div>;

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightContent?: 'arrow' | 'radio' | React.ReactNode;
  isSelected?: boolean; // For radio type
  onClick?: () => void;
  className?: string;
  showBorderBottom?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightContent,
  isSelected,
  onClick,
  className = '',
  showBorderBottom = true,
}) => {
  let actualRightContent: React.ReactNode = null;
  if (rightContent === 'arrow') {
    actualRightContent = <ChevronRightIcon />;
  } else if (rightContent === 'radio') {
    actualRightContent = isSelected ? <RadioCheckedIcon /> : <RadioUncheckedIcon />;
  } else {
    actualRightContent = rightContent;
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 bg-white ${onClick ? 'cursor-pointer hover:bg-neutral-50' : ''} ${
        showBorderBottom ? 'border-b border-neutral-200' : ''
      } ${className}`}
    >
      {leftIcon && <div className="mr-3">{leftIcon}</div>}
      <div className="flex-grow">
        <p className="text-base text-[#2C2C2E] font-medium">{title}</p>
        {subtitle && <p className="text-sm text-[#8A8A8E]">{subtitle}</p>}
      </div>
      {actualRightContent && <div className="ml-3 flex-shrink-0">{actualRightContent}</div>}
    </div>
  );
};

export default ListItem;