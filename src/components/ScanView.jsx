import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Search, Camera, Lightbulb } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { fetchProductInfo } from '../utils/productUtils';

export default function ScanView() {
  const { setScannedProduct, setCurrentView } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const videoStreamRef = useRef(null);

  // Cleanup function to completely stop camera
  const cleanupCamera = async () => {
    try {
      // Stop html5-qrcode scanner
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        if (scanner.isScanning) {
          await scanner.stop();
        }
        await scanner.clear();
        html5QrCodeRef.current = null;
      }

      // Force stop all video tracks
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        videoStreamRef.current = null;
      }

      // Clear video element
      const videoElement = document.querySelector('#reader video');
      if (videoElement) {
        if (videoElement.srcObject) {
          const tracks = videoElement.srcObject.getTracks();
          tracks.forEach(track => {
            track.stop();
            track.enabled = false;
          });
          videoElement.srcObject = null;
        }
        videoElement.load();
      }

      // Clear the reader div
      const readerDiv = document.getElementById('reader');
      if (readerDiv) {
        readerDiv.innerHTML = '';
      }
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  };

  // Cleanup on unmount or when leaving scan view
  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, []);

  const startScanner = async () => {
    if (isScanning) return;
    
    setError(null);
    setIsScanning(true);

    try {
      // Request camera permission first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      videoStreamRef.current = stream;

      // Small delay to ensure camera is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      
      if (devices && devices.length > 0) {
        // Find back camera
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        const cameraId = backCamera ? backCamera.id : devices[devices.length - 1].id;
        
        await html5QrCode.start(
          cameraId,
          { 
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          async (decodedText) => {
            await stopScanner();
            await handleBarcodeScanned(decodedText);
          }
        );
      } else {
        throw new Error("No cameras found on device");
      }
    } catch (err) {
      console.error("Scanner error:", err);
      await cleanupCamera();
      
      let errorMsg = "Unable to access camera. ";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg += "Please allow camera permissions in your browser settings.";
      } else if (err.name === 'NotFoundError' || err.message.includes('No cameras')) {
        errorMsg += "No camera detected on your device.";
      } else if (err.name === 'NotReadableError' || err.message.includes('in use')) {
        errorMsg += "Please close all other apps using the camera and try again.";
      } else {
        errorMsg += "Please try manual entry or restart your browser.";
      }
      
      setError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    await cleanupCamera();
    setIsScanning(false);
  };

  const handleBarcodeScanned = async (barcode) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const productInfo = await fetchProductInfo(barcode);
      
      if (productInfo) {
        setScannedProduct(productInfo);
        setCurrentView('add');
      } else {
        setError('Product not found in database. Try entering the barcode manually.');
      }
    } catch (err) {
      setError('Error fetching product information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = async () => {
    const barcode = manualBarcode.trim();
    if (!barcode) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const productInfo = await fetchProductInfo(barcode);
      
      if (productInfo) {
        setScannedProduct(productInfo);
        setManualBarcode('');
        setCurrentView('add');
      } else {
        setError('Product not found. Check the barcode and try again.');
      }
    } catch (err) {
      setError('Error fetching product information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualSearch();
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Scanner Card */}
      <div className="card overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Scan Barcode
          </h2>
          
          {!isScanning ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
                <Camera className="w-full h-full" />
              </div>
              <p className="text-gray-600 mb-6">
                Point your camera at a product barcode
              </p>
              <button
                onClick={startScanner}
                disabled={isLoading}
                className="btn btn-primary"
              >
                <Camera className="w-5 h-5" />
                <span>Start Camera</span>
              </button>
            </div>
          ) : (
            <div>
              <div id="reader" className="mb-4"></div>
              <button
                onClick={stopScanner}
                className="btn btn-danger w-full"
              >
                <X className="w-5 h-5" />
                <span>Stop Scanning</span>
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Camera Access Issue</p>
                  <p className="text-sm text-red-700">{error}</p>
                  {error.includes('in use') && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-600">
                      <p className="font-semibold mb-1">Try this:</p>
                      <ul className="list-disc ml-4 space-y-1">
                        <li>Close all other apps and browser tabs</li>
                        <li>Restart your browser</li>
                        <li>If issue persists, restart your device</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Entry Card */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Enter Barcode Manually
          </h2>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter barcode number"
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleManualSearch}
              disabled={isLoading || !manualBarcode.trim()}
              className="btn btn-primary"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
            <div>
              <span className="font-medium">Try:</span>{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                3017620422003
              </code>
              {' '}(Nutella)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}