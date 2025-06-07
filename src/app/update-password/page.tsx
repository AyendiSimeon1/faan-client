"use client";
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, WatchObserver } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AppLayout from '../../components/layout/AppLayout';
import { GreenCheckCircleIcon, GreyCircleIcon } from '@/components/ui/Icon';

interface UpdatePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const UpdatePasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm<UpdatePasswordFormData>({ mode: 'onChange' });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Profile');

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    letter: false,
    number: false,
  });
  const [passwordStrength, setPasswordStrength] = useState<'Too weak' | 'Okay' | 'Strong'>('Too weak');

  const newPassword = watch('newPassword');

  useEffect(() => {
    const hasLetter = /[a-zA-Z]/.test(newPassword || '');
    const hasNumber = /[0-9]/.test(newPassword || '');
    const hasMinLength = (newPassword || '').length >= 8;

    setPasswordCriteria({
      length: hasMinLength,
      letter: hasLetter,
      number: hasNumber,
    });

    const criteriaMet = [hasMinLength, hasLetter, hasNumber].filter(Boolean).length;
    if (criteriaMet === 3) setPasswordStrength('Strong');
    else if (criteriaMet >= 2) setPasswordStrength('Okay');
    else setPasswordStrength('Too weak');

  }, [newPassword]);

  const onSubmit: SubmitHandler<UpdatePasswordFormData> = (data) => {
    console.log('Password update data:', data);
    alert('Password updated successfully (simulated).');
    router.push('/profile'); // Navigate back to profile or home
  };

  const passwordStrengthColor = () => {
    if (passwordStrength === 'Strong') return 'text-green-500';
    if (passwordStrength === 'Okay') return 'text-yellow-500';
    return 'text-red-500'; // Too weak
  };

  return (
    // <AppLayout
    //   activeTab={activeTab}
    //   onTabChange={setActiveTab}
    //   containerClassName="max-w-3xl w-full mx-auto py-16 px-12"
    // >
      <div className="bg-white p-12 rounded-2xl shadow-2xl flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Update your password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-w-lg">
          <Input<UpdatePasswordFormData>
            name="newPassword"
            label="New password"
            type="password"
            placeholder="Enter new password"
            register={register}
            error={errors.newPassword}
          />
          <div className="space-y-2 text-base">
            <div className="flex justify-between items-center">
              <p className="text-[#8A8A8E]">Your password must include</p>
              {newPassword && <span className={`font-semibold ${passwordStrengthColor()}`}>{passwordStrength}</span>}
            </div>
            <div className="flex items-center space-x-3">
              {passwordCriteria.length ? <GreenCheckCircleIcon /> : <GreyCircleIcon />}
              <span className={passwordCriteria.length ? 'text-green-500' : 'text-[#8A8A8E]'}>At least 8 characters</span>
            </div>
            <div className="flex items-center space-x-3">
              {passwordCriteria.letter ? <GreenCheckCircleIcon /> : <GreyCircleIcon />}
              <span className={passwordCriteria.letter ? 'text-green-500' : 'text-[#8A8A8E]'}>At least one letter</span>
            </div>
            <div className="flex items-center space-x-3">
              {passwordCriteria.number ? <GreenCheckCircleIcon /> : <GreyCircleIcon />}
              <span className={passwordCriteria.number ? 'text-green-500' : 'text-[#8A8A8E]'}>At least one number</span>
            </div>
          </div>
          <Input<UpdatePasswordFormData>
            name="confirmPassword"
            label="Confirm changes"
            type="password"
            placeholder="Confirm new password"
            register={register}
            error={errors.confirmPassword}
          />
          <Button type="submit" variant="primary" className="text-lg py-3" fullWidth>
            Save Changes
          </Button>
        </form>
      </div>
    // </AppLayout>
  );
};

export default UpdatePasswordPage;