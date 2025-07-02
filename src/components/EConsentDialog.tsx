
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Pause, Square, Search, Download, FileText, Signature, CheckCircle } from "lucide-react";

interface EConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EConsentDialog = ({ open, onOpenChange }: EConsentDialogProps) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const consentText = t('econsent.document.title') === 'Informed Consent Form' ? `
    INFORMED CONSENT FORM
    
    Study Title: Phase II Clinical Trial of Investigational Drug XYZ-123
    Principal Investigator: Dr. Sarah Johnson, MD
    Institution: Metro General Hospital
    
    INTRODUCTION
    You are being invited to participate in a research study. Before you agree to participate, it is important that you read and understand the following information. This consent form will give you information about the study to help you decide whether you want to participate. Please take your time to make your decision. Discuss it with your family and friends if you wish. If you have any questions, please ask the study team.
    
    PURPOSE OF THE STUDY
    The purpose of this study is to test the safety and effectiveness of an investigational drug called XYZ-123 in treating patients with your medical condition. This drug has shown promising results in laboratory studies and earlier phases of clinical trials.
    
    STUDY PROCEDURES
    If you agree to participate in this study, you will be asked to:
    - Visit the clinic 8 times over a 6-month period
    - Take the study medication or placebo as directed
    - Complete questionnaires about your symptoms and quality of life
    - Have blood tests and physical examinations
    - Keep a daily diary of your symptoms
    
    RISKS AND DISCOMFORTS
    As with any medication, there may be side effects. Based on previous studies, possible side effects may include:
    - Nausea and vomiting (common)
    - Headache (common)
    - Fatigue (common)
    - Dizziness (uncommon)
    - Allergic reactions (rare)
    
    BENEFITS
    You may or may not benefit from participating in this study. The information gained from this study may help other patients with your condition in the future.
    
    CONFIDENTIALITY
    Your identity and all information collected about you will be kept strictly confidential. You will be assigned a unique participant number, and your name will not appear on any study documents except this consent form.
    
    VOLUNTARY PARTICIPATION
    Your participation in this study is entirely voluntary. You may withdraw from the study at any time without penalty or loss of benefits to which you are otherwise entitled.
    
    CONTACT INFORMATION
    If you have questions about this study, please contact:
    Dr. Sarah Johnson at (555) 123-4567
    Study Coordinator: Jane Smith at (555) 123-4568
    
    CONSENT
    By signing this form, you indicate that:
    - You have read and understood this information
    - All your questions have been answered
    - You understand that participation is voluntary
    - You agree to participate in this study
  ` : `
    FORMULARIO DE CONSENTIMIENTO INFORMADO
    
    Título del Estudio: Ensayo Clínico Fase II del Medicamento Investigacional XYZ-123
    Investigador Principal: Dra. Sarah Johnson, MD
    Institución: Hospital General Metro
    
    INTRODUCCIÓN
    Se le invita a participar en un estudio de investigación. Antes de aceptar participar, es importante que lea y comprenda la siguiente información. Este formulario de consentimiento le proporcionará información sobre el estudio para ayudarle a decidir si desea participar. Tómese su tiempo para tomar su decisión. Discútalo con su familia y amigos si lo desea. Si tiene alguna pregunta, consulte al equipo del estudio.
    
    PROPÓSITO DEL ESTUDIO
    El propósito de este estudio es probar la seguridad y efectividad de un medicamento investigacional llamado XYZ-123 en el tratamiento de pacientes con su condición médica. Este medicamento ha mostrado resultados prometedores en estudios de laboratorio y fases anteriores de ensayos clínicos.
    
    PROCEDIMIENTOS DEL ESTUDIO
    Si acepta participar en este estudio, se le pedirá que:
    - Visite la clínica 8 veces durante un período de 6 meses
    - Tome el medicamento del estudio o placebo según las indicaciones
    - Complete cuestionarios sobre sus síntomas y calidad de vida
    - Se someta a análisis de sangre y exámenes físicos
    - Mantenga un diario diario de sus síntomas
    
    RIESGOS E INCOMODIDADES
    Como con cualquier medicamento, puede haber efectos secundarios. Basado en estudios previos, los posibles efectos secundarios pueden incluir:
    - Náuseas y vómitos (común)
    - Dolor de cabeza (común)
    - Fatiga (común)
    - Mareos (poco común)
    - Reacciones alérgicas (raro)
    
    BENEFICIOS
    Puede o no beneficiarse de participar en este estudio. La información obtenida de este estudio puede ayudar a otros pacientes con su condición en el futuro.
    
    CONFIDENCIALIDAD
    Su identidad y toda la información recopilada sobre usted se mantendrá estrictamente confidencial. Se le asignará un número único de participante, y su nombre no aparecerá en ningún documento del estudio excepto este formulario de consentimiento.
    
    PARTICIPACIÓN VOLUNTARIA
    Su participación en este estudio es completamente voluntaria. Puede retirarse del estudio en cualquier momento sin penalización o pérdida de beneficios a los que tiene derecho.
    
    INFORMACIÓN DE CONTACTO
    Si tiene preguntas sobre este estudio, póngase en contacto con:
    Dra. Sarah Johnson al (555) 123-4567
    Coordinadora del Estudio: Jane Smith al (555) 123-4568
    
    CONSENTIMIENTO
    Al firmar este formulario, usted indica que:
    - Ha leído y comprendido esta información
    - Todas sus preguntas han sido respondidas
    - Entiende que la participación es voluntaria
    - Acepta participar en este estudio
  `;

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const words = consentText.toLowerCase().split(/\s+/);
    const results: number[] = [];
    
    words.forEach((word, index) => {
      if (word.includes(searchTerm.toLowerCase())) {
        results.push(index);
      }
    });
    
    setSearchResults(results);
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignature("");
  };

  const handleSign = () => {
    if (fullName && agreed && canvasRef.current) {
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      setSignature(signatureData);
      setIsSigned(true);
    }
  };

  const handleDownloadPDF = () => {
    alert(t('econsent.download.pdf') + " - " + t('common.loading'));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{t('econsent.title')}</span>
          </DialogTitle>
          <p className="text-sm text-studio-text-muted">{t('econsent.subtitle')}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audio Playback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAudioPlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? t('econsent.audio.pause') : t('econsent.audio.play')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAudioStop}
                >
                  <Square className="h-4 w-4" />
                  {t('econsent.audio.stop')}
                </Button>
                <audio
                  ref={audioRef}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src="/api/placeholder-audio" type="audio/mpeg" />
                </audio>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Document Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-studio-text-muted" />
                <Input
                  placeholder={t('econsent.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              {searchResults.length > 0 && (
                <p className="text-sm text-studio-text-muted mt-2">
                  {searchResults.length} {t('econsent.search.results').toLowerCase()}
                </p>
              )}
              {searchTerm && searchResults.length === 0 && (
                <p className="text-sm text-studio-text-muted mt-2">
                  {t('econsent.search.no.results')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Document Content */}
          <Card>
            <CardHeader>
              <CardTitle>{t('econsent.document.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-sm whitespace-pre-line bg-gray-50 p-4 rounded border max-h-60 overflow-y-auto">
                {consentText}
              </div>
            </CardContent>
          </Card>

          {/* Electronic Signature */}
          {!isSigned ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Signature className="h-5 w-5" />
                  <span>{t('econsent.signature.required')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{t('econsent.signature.full.name')}</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('econsent.signature.date')}</label>
                    <Input
                      value={new Date().toLocaleDateString()}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Electronic Signature</label>
                  <div className="border-2 border-dashed border-gray-300 rounded p-2">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="w-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="mt-2"
                  >
                    {t('econsent.signature.clear')}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label htmlFor="agree" className="text-sm">
                    {t('econsent.signature.agree')}
                  </label>
                </div>

                <Button
                  onClick={handleSign}
                  disabled={!fullName || !agreed}
                  className="w-full"
                >
                  <Signature className="h-4 w-4 mr-2" />
                  {t('econsent.signature.sign')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{t('econsent.signature.complete')}</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Signed by: {fullName} on {new Date().toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('econsent.download.pdf')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSigned(false)}
                  >
                    {t('econsent.view.signed')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EConsentDialog;
