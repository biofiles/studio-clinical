import { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, X, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BarcodeScanner = ({ open, onOpenChange }: BarcodeScannerProps) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { t } = useLanguage();

  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
    disableFlip: false,
  };

  const startScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);
    }

    scannerRef.current.render(
      (decodedText: string) => {
        setScanResult(decodedText);
        setIsScanning(false);
        toast.success("Código escaneado exitosamente", {
          description: `Resultado: ${decodedText}`
        });
        stopScanner();
      },
      (error: string) => {
        // Handle scan error - usually camera access or no QR code found
        console.log("Scan error:", error);
      }
    );
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error("Error clearing scanner:", error);
      });
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanner();
    setScanResult(null);
    onOpenChange(false);
  };

  const handleCopyResult = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast.success("Resultado copiado al portapapeles");
    }
  };

  useEffect(() => {
    if (open) {
      startScanner();
    } else {
      stopScanner();
      setScanResult(null);
    }

    return () => {
      stopScanner();
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-studio-surface border-studio-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-studio-text">
            <Camera className="h-5 w-5" />
            <span>Escáner de Código de Barras</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!scanResult && (
            <div className="space-y-4">
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Posiciona el código de barras o QR dentro del marco para escanearlo.
                </AlertDescription>
              </Alert>

              <div 
                id="qr-reader" 
                className="w-full"
                style={{ minHeight: "300px" }}
              />

              {isScanning && (
                <div className="text-center">
                  <p className="text-sm text-studio-text-muted">
                    Escaneando... Posiciona el código en el marco
                  </p>
                </div>
              )}
            </div>
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
                    startScanner();
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