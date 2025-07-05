import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

interface MFASetupProps {
  onSetupComplete: () => void;
  onSkip: () => void;
}

const MFASetup = ({ onSetupComplete, onSkip }: MFASetupProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>("");
  const [secretCopied, setSecretCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    enrollMFA();
  }, []);

  const enrollMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      const { totp } = data;
      setSecret(totp.secret);
      
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(totp.qr_code);
      setQrCode(qrCodeUrl);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to setup MFA');
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;

      const factor = factors.data.totp?.[0];
      if (!factor) throw new Error('No TOTP factor found');

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factor.id
      });
      if (challengeError) throw challengeError;

      const { error } = await supabase.auth.mfa.verify({
        factorId: factor.id,
        challengeId: challenge.id,
        code: verificationCode
      });

      if (error) throw error;

      onSetupComplete();
    } catch (error: any) {
      setError(error.message || 'Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = async () => {
    await navigator.clipboard.writeText(secret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Setting up MFA...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-studio-surface border-studio-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-studio-text">
            <Shield className="h-5 w-5 text-studio-accent" />
            Configurar Autenticación de Dos Factores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-studio-text-muted">
              Escanea este código QR con tu aplicación autenticadora (Google Authenticator, Authy, etc.)
            </p>
            
            {qrCode && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-studio-text-muted">
                O ingresa manualmente esta clave secreta:
              </p>
              <div className="flex items-center gap-2 p-2 bg-studio-bg rounded border">
                <code className="text-xs font-mono text-studio-text flex-1 break-all">
                  {secret}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copySecret}
                  className="h-8 w-8"
                >
                  {secretCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-studio-text">
                Código de verificación
              </label>
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={verifyAndEnable}
                disabled={verificationCode.length !== 6 || isVerifying}
                className="flex-1"
              >
                {isVerifying ? "Verificando..." : "Activar MFA"}
              </Button>
              <Button
                variant="outline"
                onClick={onSkip}
                disabled={isVerifying}
              >
                Omitir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFASetup;