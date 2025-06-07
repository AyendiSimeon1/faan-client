import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'icon';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-[#FDB813] text-[#2C2C2E] hover:bg-[#E0A00A] focus:ring-[#FDB813]';
      break;
    case 'secondary':
      variantStyles = 'bg-white text-[#2C2C2E] border border-[#E5E5EA] hover:bg-neutral-50 focus:ring-[#FDB813]';
      break;
    case 'tertiary':
      variantStyles = 'bg-neutral-100 text-[#2C2C2E] hover:bg-neutral-200 focus:ring-neutral-300';
      break;
    case 'link':
      variantStyles = 'text-[#34C759] hover:text-[#2C9F47] p-0 font-medium';
      break;
    case 'icon':
      variantStyles = 'bg-black text-white rounded-full p-3 hover:bg-neutral-800 focus:ring-neutral-500 w-14 h-14 aspect-square';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {leftIcon}
      {children && <span>{children}</span>}
      {rightIcon}
    </button>
  );
};

export default Button;