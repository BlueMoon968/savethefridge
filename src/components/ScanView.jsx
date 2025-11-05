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
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Cleanup on unmount or view change
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        const videoElement = document.querySelector('#reader video');
        if (videoElement && videoElement.srcObject) {
          const tracks = videoElement.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []);

  const startScanner = async () => {
    if (isScanning) return;
    
    setError(null);
    setIsScanning(true);

    try {
      // First, request camera permission explicitly
      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });

      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      
      if (devices && devices.length > 0) {
        // Prefer back camera, fallback to first available
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        const cameraId = backCamera ? backCamera.id : devices[0].id;
        
        await html5QrCode.start(
          cameraId,
          { 
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
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
      
      let errorMsg = "Unable to access camera. ";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg += "Please allow camera permissions in your browser settings.";
      } else if (err.name === 'NotFoundError' || err.message.includes('No cameras')) {
        errorMsg += "No camera detected on your device.";
      } else if (err.name === 'NotReadableError') {
        errorMsg += "Camera is already in use by another app.";
      } else {
        errorMsg += "Please try manual entry or check browser permissions.";
      }
      
      setError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
    setIsScanning(false);
    
    // Force release all media tracks
    const videoElement = document.querySelector('#reader video');
    if (videoElement && videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
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
                  {error.includes('permissions') && (
                    <div className="mt-2 text-xs text-red-600">
                      <p className="font-semibold mb-1">How to enable camera:</p>
                      <ul className="list-disc ml-4 space-y-1">
                        <li><strong>Chrome/Edge:</strong> Click the 🔒 or 🎥 icon in the address bar</li>
                        <li><strong>Safari:</strong> Go to Settings → Safari → Camera</li>
                        <li><strong>Firefox:</strong> Click the 🛈 icon in address bar → Permissions</li>
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
