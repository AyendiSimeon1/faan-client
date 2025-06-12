import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

interface ReceiptData {
  reference: string;
  amount: number;
  plateNumber?: string;
  date: string;
  time: string;
  duration?: string;
  entryTime?: string;
  parkingLocation?: string;
  paymentMethod?: string;
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData;
  onDownload?: () => void;
  className?: string;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ 
  receiptData, 
  onDownload,
  className = "" 
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number): string => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  const generateReceipt = async () => {
    if (!receiptRef.current) return;

    try {
      // Temporarily show the receipt for capture
      const receiptElement = receiptRef.current;
      receiptElement.style.display = 'block';
      receiptElement.style.position = 'fixed';
      receiptElement.style.top = '-9999px';
      receiptElement.style.left = '-9999px';
      receiptElement.style.zIndex = '-1';

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(receiptElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 600,
      });

      // Hide the receipt again
      receiptElement.style.display = 'none';

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `parking-receipt-${receiptData.reference}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          if (onDownload) {
            onDownload();
          }
        }
      }, 'image/png');

    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <>
      {/* Download Button */}
      <button
        onClick={generateReceipt}
        className={`inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium ${className}`}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        Download Receipt
      </button>

      {/* Hidden Receipt Template */}
      <div
        ref={receiptRef}
        style={{ display: 'none' }}
        className="w-96 bg-white font-mono text-sm"
      >
        <div className="p-6 border-2 border-gray-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              🅿️ ParkEase
            </div>
            <div className="text-lg font-semibold text-gray-700">
              PARKING RECEIPT
            </div>
            <div className="w-full h-px bg-gray-300 mt-3"></div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-semibold text-gray-800 text-xs">
                {receiptData.reference}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold text-gray-800">
                {receiptData.date}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold text-gray-800">
                {receiptData.time}
              </span>
            </div>

            {receiptData.plateNumber && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-semibold text-gray-800">
                  {receiptData.plateNumber}
                </span>
              </div>
            )}

            {receiptData.entryTime && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Entry Time:</span>
                <span className="font-semibold text-gray-800">
                  {receiptData.entryTime}
                </span>
              </div>
            )}

            {receiptData.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-800">
                  {receiptData.duration}
                </span>
              </div>
            )}

            {receiptData.parkingLocation && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold text-gray-800">
                  {receiptData.parkingLocation}
                </span>
              </div>
            )}

            {receiptData.paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment:</span>
                <span className="font-semibold text-gray-800">
                  {receiptData.paymentMethod}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-400 my-4"></div>

          {/* Amount */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-800">TOTAL AMOUNT:</span>
            <span className="text-gray-900">
              {formatCurrency(receiptData.amount)}
            </span>
          </div>

          {/* Status */}
          <div className="text-center mt-4 mb-6">
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              PAID
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <div>Thank you for using ParkEase!</div>
            <div>Keep this receipt for your records</div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              Generated on {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptGenerator;