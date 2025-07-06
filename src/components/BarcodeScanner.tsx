import { useState, useRef, useEffect, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import jsQR from "jsqr";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, X, CheckCircle, Upload, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BarcodeScanner = ({ open, onOpenChange }: BarcodeScannerProps) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Check if device supports camera
  const checkCameraSupport = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices.length > 0;
    } catch (error) {
      console.error("Error checking camera support:", error);
      return false;
    }
  }, []);

  // Initialize camera with better error handling
  const initializeCamera = useCallback(async () => {
    setError(null);
    setIsScanning(true);

    try {
      const hasCamera = await checkCameraSupport();
      if (!hasCamera) {
        throw new Error("No se encontró cámara disponible");
      }

      const constraints = {
        video: {
          facingMode: "environment", // Use rear camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startScanning();
      }
    } catch (err: any) {
      console.error("Camera initialization error:", err);
      let errorMessage = "Error al acceder a la cámara";
      
      if (err.name === 'NotAllowedError') {
        errorMessage = "Permisos de cámara denegados. Por favor, permite el acceso a la cámara.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No se encontró cámara disponible en este dispositivo.";
      } else if (err.name === 'NotSupportedError') {
        errorMessage = "Cámara no soportada en este navegador.";
      }
      
      setError(errorMessage);
      setIsScanning(false);
      setActiveTab("upload"); // Switch to upload tab as fallback
      toast.error(errorMessage);
    }
  }, []);

  // Scan QR code from video stream
  const startScanning = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setScanResult(code.data);
          setIsScanning(false);
          stopCamera();
          toast.success("Código escaneado exitosamente", {
            description: `Resultado: ${code.data}`
          });
          return;
        }
      }
      
      if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    scan();
  }, [isScanning]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScanResult(code.data);
          toast.success("Código escaneado exitosamente", {
            description: `Resultado: ${code.data}`
          });
        } else {
          toast.error("No se encontró ningún código en la imagen");
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClose = () => {
    stopCamera();
    setScanResult(null);
    setError(null);
    onOpenChange(false);
  };

  const handleCopyResult = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast.success("Resultado copiado al portapapeles");
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
  }, [open, activeTab, initializeCamera]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-studio-surface border-studio-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-studio-text">
            <Camera className="h-5 w-5" />
            <span>Escáner de Código de Barras</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!scanResult && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "camera" | "upload")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera">
                  <Camera className="h-4 w-4 mr-2" />
                  Cámara
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Imagen
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
                    className="w-full rounded border border-studio-border"
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
                </div>

                {isScanning && (
                  <div className="text-center">
                    <p className="text-sm text-studio-text-muted">
                      Escaneando... Posiciona el código dentro del marco
                    </p>
                  </div>
                )}

                {!isScanning && !error && (
                  <Button onClick={initializeCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Iniciar Cámara
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Selecciona una imagen que contenga un código de barras o QR.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {scanResult && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4 text-progress-success" />
                <AlertDescription>
                  <strong>Código escaneado exitosamente:</strong>
                </AlertDescription>
              </Alert>

              <div className="p-3 bg-studio-bg rounded border border-studio-border">
                <p className="text-sm font-mono text-studio-text break-all">
                  {scanResult}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleCopyResult}
                  variant="outline"
                  className="flex-1"
                >
                  Copiar Resultado
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
                  Escanear Otro
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button onClick={handleClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;