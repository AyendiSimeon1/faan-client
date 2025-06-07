"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { CloseIcon, CameraIcon, UploadIcon } from '@/components/ui/Icon';

const ScanQrPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Home' | 'Wallet' | 'History' | 'Profile'>('Home');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const mockQRData = "PARKING_TERMINAL_2_SPOT_A123";
      setScanResult(mockQRData);
      setIsScanning(false);
      
      // Process successful scan
      setTimeout(() => {
        router.push('/parking/session-details?qrData=' + encodeURIComponent(mockQRData));
      }, 1500);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        const mockQRData = "UPLOADED_QR_PARKING_SPOT_B456";
        setScanResult(mockQRData);
        setIsScanning(false);
        setTimeout(() => {
          router.push('/parking/session-details?qrData=' + encodeURIComponent(mockQRData));
        }, 1500);
      }, 1500);
    }
  };

  const ScanQrHeader = () => (
    <header className="bg-white border-b border-neutral-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-800">Scan QR Code</h1>
          <p className="text-sm text-neutral-600">Scan the QR code at your parking spot</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <CloseIcon  />
        </button>
      </div>
    </header>
  );

  if (scanResult) {
    return (
      <AppLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        customHeader={<ScanQrHeader />}
      >
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-neutral-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-3">QR Code Scanned Successfully!</h2>
            <p className="text-neutral-600 mb-6">Processing your parking session...</p>
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-neutral-500 mb-1">Scanned Code:</p>
              <p className="font-mono text-sm text-neutral-800 break-all">{scanResult}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-neutral-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FDB813] border-t-transparent"></div>
              <span className="text-sm">Redirecting...</span>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      customHeader={<ScanQrHeader />}
    >
      <div className="max-w-4xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Scanner Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">QR Code Scanner</h2>
              <p className="text-neutral-600">Position the QR code within the frame to scan</p>
            </div>

            {/* Scanner Area */}
            <div className="relative w-full max-w-md mx-auto aspect-square bg-neutral-900 rounded-2xl overflow-hidden shadow-inner mb-8">
              {isScanning ? (
                <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FDB813] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Scanning...</p>
                    <p className="text-sm opacity-75">Hold steady</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-neutral-400">
                    <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Camera Preview</p>
                    <p className="text-sm">Ready to scan</p>
                  </div>
                </div>
              )}

              {/* Corner Guides */}
              {[
                "top-6 left-6 border-t-4 border-l-4",
                "top-6 right-6 border-t-4 border-r-4",
                "bottom-6 left-6 border-b-4 border-l-4",
                "bottom-6 right-6 border-b-4 border-r-4",
              ].map((pos, idx) => (
                <div
                  key={idx}
                  className={`absolute w-16 h-16 border-[#FDB813] rounded-lg ${pos} ${
                    isScanning ? 'animate-pulse' : ''
                  }`}
                />
              ))}

              {/* Scanning Line */}
              {isScanning && (
                <div className="absolute inset-x-6 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-[#FDB813] to-transparent animate-pulse" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleScan}
                disabled={isScanning}
                className="w-full text-lg py-4 bg-[#FDB813] hover:bg-[#E5A712] text-black font-semibold disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-3"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <CameraIcon className="w-5 h-5 mr-3" />
                    Start Camera Scan
                  </>
                )}
              </Button>

              {/* File Upload Option */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isScanning}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <Button 
                  variant="tertiary"
                  className="w-full text-lg py-4 border-2 border-dashed border-neutral-300 hover:border-[#FDB813] hover:bg-[#FDB813] hover:bg-opacity-10 disabled:opacity-50"
                  disabled={isScanning}
                >
                  <UploadIcon className="w-5 h-5 mr-3" />
                  Upload QR Image
                </Button>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <p>Find the QR code at your parking spot</p>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <p>Click "Start Camera Scan" or upload an image</p>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <p>Your parking session will begin automatically</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Tips for Better Scanning</h3>
              <ul className="space-y-2 text-yellow-700 text-sm">
                <li>• Ensure good lighting when scanning</li>
                <li>• Hold your device steady</li>
                <li>• Keep the QR code within the frame</li>
                <li>• Clean your camera lens if needed</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Secure & Fast</h3>
              <p className="text-green-700 text-sm mb-3">
                Your parking session data is encrypted and processed securely. 
                Scanning typically takes just 1-2 seconds.
              </p>
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium">Encrypted & Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-neutral-50 rounded-xl p-8 border border-neutral-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-neutral-800 mb-3">Need Help?</h3>
            <p className="text-neutral-600 mb-6">
              Can't find the QR code or having trouble scanning? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="tertiary" className="px-6">
                View Help Guide
              </Button>
              <Button className="px-6">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanQrPage;