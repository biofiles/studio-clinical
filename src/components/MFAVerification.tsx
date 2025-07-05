import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ArrowLeft } from "lucide-react";

interface MFAVerificationProps {
  onVerificationComplete: () => void;
  onBack: () => void;
}

const MFAVerification = ({ onVerificationComplete, onBack }: MFAVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>("");

  const verifyMFA = async () => {
    if (verificationCode.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const factor = factors.totp?.[0];
      if (!factor) throw new Error('No MFA factor found');

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factor.id
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factor.id,
        challengeId: challenge.id,
        code: verificationCode
      });

      if (verifyError) throw verifyError;

      onVerificationComplete();
    } catch (error: any) {
      setError(error.message || 'Código de verificación inválido');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-studio-surface border-studio-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-studio-text">
            <Shield className="h-5 w-5 text-studio-accent" />
            Verificación de Dos Factores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-studio-text-muted text-center">
            Ingresa el código de 6 dígitos de tu aplicación autenticadora
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
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
                onClick={verifyMFA}
                disabled={verificationCode.length !== 6 || isVerifying}
                className="flex-1"
              >
                {isVerifying ? "Verificando..." : "Verificar"}
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isVerifying}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFAVerification;