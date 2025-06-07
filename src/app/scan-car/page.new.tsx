"use client";
import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AppLayout from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { processCarImage } from '@/store/slice/car';

interface CarDetails {
  plateNumber: string;
  type: string;
}

const ScanCarPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, carDetails } = useAppSelector((state) => state.car);  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => {
              setCameraActive(true);
            })
            .catch((err: Error) => {
              alert(`Error playing video: ${err.message}. Please ensure no other app is using the camera.`);
              stopCamera();
            });
        };
      } else {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      setCameraActive(false);
      let errorMessage = 'Unable to access camera. Please make sure you have granted camera permissions.';

      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera access denied by user. Please enable camera permissions in your browser settings.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on your device. Please ensure a camera is connected and working.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is in use by another application or there was a device error. Please close other apps using the camera.';
            break;
          case 'OverconstrainedError':
            errorMessage = `Camera constraints could not be satisfied. Error: ${err.message}`;
            break;
          case 'AbortError':
            errorMessage = 'Camera access was unexpectedly terminated.';
            break;
          case 'SecurityError':
            errorMessage = 'Camera access denied due to security reasons (e.g., not on HTTPS or localhost).';
            break;
        }
      }
      
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    // Convert canvas to blob and process
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        alert('Failed to capture image. Please try again.');
        return;
      }

      const formData = new FormData();
      formData.append('image', blob, 'car-image.jpg');

      try {
        const result = await dispatch(processCarImage(formData)).unwrap();
        setShowSuccess(true);
        stopCamera();
        
        setTimeout(() => {
          router.push('/parking-session');
        }, 2000);
      } catch (err) {
        // Error will be handled by Redux and shown in the UI
      }
    }, 'image/jpeg', 0.8);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <AppLayout activeTab="Home" onTabChange={(tab) => router.push(`/${tab.toLowerCase()}`)}>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Scan Car</h1>
        
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
            <div
              className={`absolute inset-0 bg-gray-200 flex items-center justify-center transition-opacity duration-300 ${
                cameraActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="text-gray-500 text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>Camera Preview</p>
              </div>
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {!cameraActive ? (
              <Button
                onClick={startCamera}
                variant="primary"
                className="w-full py-3"
                disabled={false}
              >
                Start Camera
              </Button>
            ) : (
              <>
                <Button
                  onClick={captureImage}
                  variant="primary"
                  className="px-6 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Capture'}
                </Button>
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  className="px-4 py-3"
                  disabled={false}
                >
                  Stop
                </Button>
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {error && (
          <div className="w-full max-w-md bg-red-100 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {showSuccess && (
          <div className="w-full max-w-md bg-green-100 text-green-700 p-4 rounded-lg mb-4 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Car details captured successfully! Starting parking session...
            </div>
          </div>
        )}

        {carDetails && (
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 mt-4">
            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Plate Number:</span> {carDetails.plateNumber}</p>
              <p><span className="font-medium">Type:</span> {carDetails.type}</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ScanCarPage;
