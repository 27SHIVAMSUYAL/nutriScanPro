import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Camera, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          html5QrCode.stop().then(() => {
            setLocation(`/product/${decodedText}`);
          });
        },
        () => {
          // Error callback for scan failures (can be ignored)
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setHasCamera(false);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = () => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().then(() => {
        setIsScanning(false);
        setLocation("/");
      });
    } else {
      setLocation("/");
    }
  };

  useEffect(() => {
    startScanner();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={stopScanner}
          className="bg-black/50 text-white hover:bg-black/70 rounded-full"
          data-testid="button-close-scanner"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="bg-black/50 px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">
            Align barcode in center
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Scanner */}
      <div
        id="qr-reader"
        className="w-full h-full"
        data-testid="scanner-viewfinder"
      />

      {/* Camera Error */}
      {!hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-6">
          <div className="bg-white rounded-lg p-8 text-center max-w-md space-y-4">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
            <h2 className="text-xl font-semibold">Camera Access Required</h2>
            <p className="text-gray-600">
              Please allow camera access to scan product barcodes. Check your browser settings
              and reload the page.
            </p>
            <Button 
              onClick={() => setLocation("/")} 
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-go-back"
            >
              Go Back to Home
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex justify-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
            {isScanning ? "Scanning for barcode..." : "Starting camera..."}
          </div>
        </div>
      </div>
    </div>
  );
}
