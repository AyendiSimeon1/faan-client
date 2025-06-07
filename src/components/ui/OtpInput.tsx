import React, { useState, useRef } from 'react';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ 
  length, 
  value = '', // Add default value
  onChange, 
  disabled, 
  name 
}) => {
  // Fix the initialization with proper null checking
  const [otp, setOtp] = useState<string[]>(() => {
    const safeValue = value || '';
    return safeValue
      .split('')
      .slice(0, length)
      .concat(new Array(Math.max(0, length - safeValue.length)).fill(''))
      .slice(0, length);
  });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const inputValue = element.value;
    if (/[^0-9]/.test(inputValue)) return; 

    const newOtp = [...otp];
    newOtp[index] = inputValue.slice(-1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (inputValue && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2" data-testid={name}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          name={`${name}-char${index}`}
          className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-semibold border border-[#E5E5EA] rounded-lg bg-neutral-100 focus:bg-white focus:border-[#FDB813] focus:ring-1 focus:ring-[#FDB813] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          ref={(el) => { inputRefs.current[index] = el }}
        />
      ))}
    </div>
  );
};

export default OtpInput;