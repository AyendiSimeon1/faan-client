"use client";
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { topupWallet, fetchWalletBalance } from '@/store/slice/wallet';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletTopupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, balance } = useAppSelector((state) => state.wallet);
  const success = !error && !isLoading; // or adjust logic based on your payments state
  const [amount, setAmount] = useState('');

  useEffect(() => {
    dispatch(fetchWalletBalance());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    await dispatch(topupWallet(amount));
  };

  useEffect(() => {
    if (success) {
      toast.success('Your wallet has been topped up successfully!');
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Top Up Wallet</h1>
      <div className="mb-4 text-center">
        <span className="font-semibold">Current Balance:</span>{' '}
        <span className="text-lg text-green-600">{balance !== null ? `₦${balance}` : 'Loading...'}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Amount (NGN)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB813]"
            placeholder="Enter amount"
            required
          />
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={isLoading || !amount}>
          {isLoading ? 'Processing...' : 'Top Up'}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default WalletTopupPage;

// At the root of your app (usually _app.tsx or main entry), ensure <ToastContainer /> is rendered
// import { ToastContainer } from 'react-toastify';
// <ToastContainer position="top-center" autoClose={3000} />