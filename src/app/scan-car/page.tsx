"use client";
import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AppLayout from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { processCarImage } from '@/store/slice/car';
import { startSession } from '@/store/slice/parking';

const ScanCarPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading: carLoading, error: carError, carDetails } = useAppSelector((state) => state.car);
  const { isLoading: parkingLoading, error: parkingError } = useAppSelector((state) => state.parking);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  console.log('i am car details', carDetails);
    const state = useAppSelector(state => (state));
    console.log('i am the whole app state', state);

  const startCamera = async () => {
    console.log('--- startCamera function called ---');
    setLocalError(null);
    
    try {
      // Request camera access with specific facingMode and ideal resolutions
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer the rear camera
          width: { ideal: 1920 },    // Request ideal width
          height: { ideal: 1080 }   // Request ideal height
        }
      });

      console.log('getUserMedia successful. MediaStream obtained:', mediaStream);
      setStream(mediaStream); // Store the stream for cleanup

      if (videoRef.current) {
        console.log('Assigning mediaStream to videoRef.current.srcObject');
        videoRef.current.srcObject = mediaStream;

        // Add a listener to ensure video metadata is loaded before trying to play
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded. Attempting to play video...');
          videoRef.current?.play()
            .then(() => {
              console.log('Video playback started successfully!');
              setCameraActive(true); // Set camera active state
            })
            .catch((playErr: Error) => {
              console.error('Error playing video after loadedmetadata:', playErr);
              setLocalError(`Error playing video: ${playErr.message || 'Unknown error'}. Please ensure no other app is using the camera.`);
              stopCamera(); // Stop camera on play error
            });
        };

        // Also handle if metadata is already loaded
        if (videoRef.current.readyState >= 1) {
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started successfully!');
              setCameraActive(true);
            })
            .catch((playErr: Error) => {
              console.error('Error playing video:', playErr);
              setLocalError(`Error playing video: ${playErr.message || 'Unknown error'}.`);
              stopCamera();
            });
        }
      } else {
        console.warn('videoRef.current is null when trying to assign srcObject.');
        mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        setLocalError('Video element not available. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error accessing camera (getUserMedia failed):', error);
      setCameraActive(false);
      let errorMessage = 'Unable to access camera. Please make sure you have granted camera permissions.';

      // Provide more specific error messages based on DOMException names
      if (error instanceof Error) {
        switch (error.name) {
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
            errorMessage = `Camera constraints could not be satisfied. Error: ${error.message}`;
            break;
          case 'AbortError':
            errorMessage = 'Camera access was unexpectedly terminated.';
            break;
          case 'SecurityError':
            errorMessage = 'Camera access denied due to security reasons (e.g., not on HTTPS or localhost).';
            break;
        }
      }

      setLocalError(errorMessage);
    }
    console.log('--- end of startCamera function ---');
  };

  const stopCamera = () => {
    console.log('--- stopCamera function called ---');
    if (stream) {
      console.log('Stopping all media stream tracks.');
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
        console.log(`Track stopped: ${track.kind}`);
      });
      setStream(null);
    } else {
      console.log('No active stream to stop.');
    }
    setCameraActive(false);
    setLocalError(null);
    console.log('--- end of stopCamera function ---');
  };

  const captureImage = async () => {
    console.log('--- captureImage function called ---');
    setLocalLoading(true);
    setLocalError(null);

    if (videoRef.current && canvasRef.current) {
      console.log('videoRef.current and canvasRef.current are available.');
      const context = canvasRef.current.getContext('2d');
      if (context) {
        console.log('Canvas context obtained.');
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        console.log(`Canvas dimensions set to: ${canvasRef.current.width}x${canvasRef.current.height}`);

        // Draw the current video frame to canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log('Video frame drawn to canvas.');

        // Convert canvas to blob and process
        canvasRef.current.toBlob(async (blob: Blob | null) => {
          if (blob) {
            console.log(`Canvas converted to Blob: ${blob.type}, size: ${blob.size} bytes`);
            const formData = new FormData();
            formData.append('image', blob, 'car-image.jpg');
            console.log('FormData created with image blob.');

            console.log('Dispatching processCarImage thunk...');
            try {
              const result = await dispatch(processCarImage(formData));
              console.log('processCarImage dispatch complete. Result:', result);              if (processCarImage.fulfilled.match(result)) {
                console.log('Car image processed successfully! Payload:', result.payload);
                setShowSuccess(true);
                stopCamera(); // Stop camera after successful capture and processing

                // Start parking session with the detected car details
                try {
                  const parkingResult = await dispatch(startSession({
                    plateNumber: result.payload.data.plateNumber,
                    vehicleType: result.payload.data.carDetails.type
                  })).unwrap();

                  console.log('Parking session started:', parkingResult);

                  // Add a slight delay before redirecting
                  setTimeout(() => {
                    router.push('/parking-session');
                  }, 1000);
                } catch (parkingError) {
                  console.error('Failed to start parking session:', parkingError);
                  setLocalError('Failed to start parking session. Please try again.');
                  setShowSuccess(false);
                }
              } else if (processCarImage.rejected && processCarImage.rejected.match(result)) {
                console.error('Car image processing failed. Error:', result.payload);
                const errorMsg = typeof result.payload === 'string' ? result.payload : 'Failed to process car image';
                setLocalError(errorMsg);
              }
            } catch (error) {
              console.error('Error processing car image:', error);
              setLocalError('An error occurred while processing the car image. Please try again.');
            } finally {
              setLocalLoading(false);
            }
          } else {
            console.error('Failed to create blob from canvas');
            setLocalError('Failed to capture image. Please try again.');
            setLocalLoading(false);
          }
        }, 'image/jpeg', 0.8);
      } else {
        console.error('Failed to get canvas context');
        setLocalError('Failed to initialize camera capture. Please try again.');
        setLocalLoading(false);
      }
    } else {
      console.error('Video or canvas reference not available');
      setLocalError('Camera is not properly initialized. Please try again.');
      setLocalLoading(false);
    }
  };


  // Cleanup on component unmount
  useEffect(() => {
    console.log('--- useEffect cleanup function setup ---');
    return () => {
      console.log('--- Component unmounting. Running cleanup. ---');
      if (stream) {
        console.log('Stopping stream tracks during cleanup.');
        stream.getTracks().forEach(track => track.stop());
      }
      console.log('--- Cleanup complete ---');
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Log state changes (optional, but very helpful for debugging)
  useEffect(() => {
    console.log('State updated: cameraActive =', cameraActive, 'isLoading =', carLoading || parkingLoading || localLoading, 'error =', carError || parkingError || localError, 'carDetails =', carDetails ? 'present' : 'null');  }, [cameraActive, carLoading, parkingLoading, localLoading, carError, parkingError, localError, carDetails]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setLocalLoading(true);
    setLocalError(null);
    setShowSuccess(false);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLocalError('Please upload an image file');
      setLocalLoading(false);
      return;
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setLocalError('Image size should be less than 10MB');
      setLocalLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);      const result = await dispatch(processCarImage(formData));

      if (processCarImage.fulfilled.match(result)) {
        console.log('Car image processed successfully! Payload:', result.payload);
        setShowSuccess(true);

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Start parking session with the detected car details
        try {
          const parkingResult = await dispatch(startSession({
            plateNumber: result.payload.data.plateNumber,
            vehicleType: result.payload.data.carDetails.type
          })).unwrap();

          console.log('Parking session started:', parkingResult);

          // Add a slight delay before redirecting
          setTimeout(() => {
            router.push('/parking-session');
          }, 1000);
        } catch (parkingError) {
          console.error('Failed to start parking session:', parkingError);
          setLocalError('Failed to start parking session. Please try again.');
          setShowSuccess(false);
        }
      } else if (processCarImage.rejected && processCarImage.rejected.match(result)) {
        const errorMsg = typeof result.payload === 'string' ? result.payload : 'Failed to process car image';
        setLocalError(errorMsg);
      }
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      setLocalError('An error occurred while processing the image. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const currentError = carError || parkingError || localError;
  const currentLoading = carLoading || parkingLoading || localLoading;

  return (
    <AppLayout activeTab="Home" onTabChange={(tab) => router.push(`/${tab.toLowerCase()}`)}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Scan Your Car</h1>
        
        {currentError && !currentLoading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md text-center">
            {currentError}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 max-w-md text-center">
            Car details captured successfully! Redirecting...
          </div>
        )}
        <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden mb-4">
          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="opacity-50">Camera Preview</p>
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-4 items-center w-full max-w-md">
          <div className="flex gap-4 w-full">
            {!cameraActive ? (
              <Button
                onClick={startCamera}
                variant="primary"
                className="w-full"
                disabled={currentLoading}
              >
                {currentLoading ? 'Starting...' : 'Start Camera'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  className="w-1/2"
                  disabled={currentLoading}
                >
                  Stop Camera
                </Button>
                <Button
                  onClick={captureImage}
                  variant="primary"
                  className="w-1/2"
                  disabled={currentLoading}
                >
                  {currentLoading ? 'Processing...' : 'Capture'}
                </Button>
              </>
            )}
          </div>

          <div className="w-full text-center">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                disabled={currentLoading}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                className="w-full"
                disabled={currentLoading || cameraActive}
              >
                {currentLoading ? 'Processing...' : 'Upload Image'}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Or upload an image of your car (max 10MB)
              </p>
            </div>
          </div>
        </div>

        {carDetails && (
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 mt-4">
            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Plate Number:</span> {carDetails.data.plateNumber}</p>
              <p><span className="font-medium">Type:</span> {carDetails.data.carDetails.type}</p>
              <p><span className="font-medium">Make:</span> {carDetails.data.carDetails.make}</p>
              {/* <p><span className="font-medium">Plate Number:</span> {carDetails.data.color}</p> */}
              <p><span className="font-medium">Model:</span> {carDetails.data.carDetails.model}</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ScanCarPage;