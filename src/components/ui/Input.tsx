import React, { useState } from 'react';
import { UseFormRegister, Path, FieldError } from 'react-hook-form';

const EyeIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-500">
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5s-8.573-3.007-9.963-7.178Z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    )}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#34C759" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4-5.5Z" clipRule="evenodd" />
  </svg>
);


interface InputProps<TFormValues extends Record<string, any>> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<TFormValues>;
  label?: string;
  register: UseFormRegister<TFormValues>;
  error?: FieldError | undefined;
  rightIcon?: React.ReactNode;
  showSuccessTick?: boolean;
  containerClassName?: string;
}

const Input = <TFormValues extends Record<string, any>>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  rightIcon,
  showSuccessTick,
  className = '',
  containerClassName = '',
  disabled,
  ...props
}: InputProps<TFormValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  const togglePasswordVisibility = () => {
    if (isPasswordType) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-[#2C2C2E] mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name)}
          {...props}
          className={`w-full px-4 py-3 border rounded-lg bg-white text-[#2C2C2E] placeholder-[#8A8A8E] focus:outline-none focus:ring-2 focus:ring-[#FDB813] ${
            error ? 'border-red-500 focus:ring-red-400' : 'border-[#E5E5EA]'
          } ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''} ${className}`}
        />
        {(isPasswordType || rightIcon || (showSuccessTick && !error && !disabled)) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isPasswordType && (
              <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                <EyeIcon isOpen={showPassword} />
              </button>
            )}
            {rightIcon && !isPasswordType && rightIcon}
            {showSuccessTick && !error && !disabled && !isPasswordType && <CheckCircleIcon />}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default Input;