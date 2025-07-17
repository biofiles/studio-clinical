import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, X, CheckCircle, Upload, AlertCircle, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BarcodeScanner = ({ open, onOpenChange }: BarcodeScannerProps) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanningRef = useRef<boolean>(false);
  const { t } = useLanguage();

  // Check if device supports camera
  const checkCameraSupport = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("Media devices API not supported");
        return false;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log("Available video devices:", videoDevices.length);
      return videoDevices.length > 0;
    } catch (error) {
      console.error("Error checking camera support:", error);
      return false;
    }
  }, []);

  // Initialize camera with better error handling
  const initializeCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setIsScanning(false);

    try {
      console.log("Initializing camera...");
      const hasCamera = await checkCameraSupport();
      if (!hasCamera) {
        throw new Error(t("no_camera_available") || "No camera available");
      }

      const constraints = {
        video: {
          facingMode: "environment", // Use rear camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsLoading(false);
        setIsScanning(true);
        scanningRef.current = true;
        startScanning();
        console.log("Camera initialized successfully");
      }
    } catch (err: any) {
      console.error("Camera initialization error:", err);
      let errorMessage = t("camera_access_error") || "Error accessing camera";
      
      if (err.name === 'NotAllowedError') {
        errorMessage = t("camera_permission_denied") || "Camera permission denied. Please allow camera access.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = t("no_camera_found") || "No camera found on this device.";
      } else if (err.name === 'NotSupportedError') {
        errorMessage = t("camera_not_supported") || "Camera not supported in this browser.";
      }
      
      setError(errorMessage);
      setIsLoading(false);
      setIsScanning(false);
      setActiveTab("upload"); // Switch to upload tab as fallback
      toast.error(errorMessage);
    }
  }, [checkCameraSupport, t]);

  // Scan QR code from video stream
  const startScanning = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scan = () => {
      if (!scanningRef.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code && code.data) {
          console.log("QR Code detected:", code.data);
          setScanResult(code.data);
          setIsScanning(false);
          scanningRef.current = false;
          stopCamera();
          toast.success(t("scan_success") || "Code scanned successfully", {
            description: `${t("result")}: ${code.data}`
          });
          return;
        }
      }
      
      if (scanningRef.current) {
        requestAnimationFrame(scan);
      }
    };

    scan();
  }, [t]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");
    scanningRef.current = false;
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("Track stopped:", track.kind);
      });
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setIsLoading(false);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Processing uploaded file:", file.name);
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setIsLoading(false);
          return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
          setIsLoading(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setIsLoading(false);

        if (code && code.data) {
          console.log("QR Code detected in uploaded image:", code.data);
          setScanResult(code.data);
          toast.success(t("scan_success") || "Code scanned successfully", {
            description: `${t("result")}: ${code.data}`
          });
        } else {
          const errorMsg = t("no_code_found") || "No code found in the image";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      };
      img.onerror = () => {
        setIsLoading(false);
        const errorMsg = t("image_load_error") || "Error loading image";
        setError(errorMsg);
        toast.error(errorMsg);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsLoading(false);
      const errorMsg = t("file_read_error") || "Error reading file";
      setError(errorMsg);
      toast.error(errorMsg);
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleClose = () => {
    stopCamera();
    setScanResult(null);
    setError(null);
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleCopyResult = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast.success(t("copied_to_clipboard") || "Copied to clipboard");
    }
  };

  useEffect(() => {
    if (open && activeTab === "camera") {
      initializeCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open, activeTab, initializeCamera, stopCamera]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>{t("barcode_scanner") || "Barcode Scanner"}</span>
          </DialogTitle>
          <DialogDescription>
            {t("scan_barcode_description") || "Scan a barcode or QR code using your camera or upload an image"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!scanResult && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "camera" | "upload")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera">
                  <Camera className="h-4 w-4 mr-2" />
                  {t("camera") || "Camera"}
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  {t("upload_image") || "Upload Image"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full rounded border"
                    style={{ maxHeight: "300px" }}
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                      <div className="border-2 border-primary w-48 h-48 border-dashed animate-pulse"></div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">{t("initializing_camera") || "Initializing camera..."}</p>
                      </div>
                    </div>
                  )}
                </div>

                {isScanning && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("scanning_instructions") || "Scanning... Position the code within the frame"}
                    </p>
                  </div>
                )}

                {!isScanning && !error && !isLoading && (
                  <Button onClick={initializeCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    {t("start_camera") || "Start Camera"}
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    {t("select_image_instruction") || "Select an image containing a barcode or QR code."}
                  </AlertDescription>
                </Alert>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-muted-foreground">
                        {t("processing_image") || "Processing image..."}
                      </span>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {scanResult && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>{t("scan_success") || "Code scanned successfully:"}</strong>
                </AlertDescription>
              </Alert>

              <div className="p-3 bg-muted rounded border">
                <p className="text-sm font-mono break-all">
                  {scanResult}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleCopyResult}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t("copy_result") || "Copy Result"}
                </Button>
                <Button 
                  onClick={() => {
                    setScanResult(null);
                    setError(null);
                    if (activeTab === "camera") {
                      initializeCamera();
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  {t("scan_another") || "Scan Another"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button onClick={handleClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              {t("close") || "Close"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;