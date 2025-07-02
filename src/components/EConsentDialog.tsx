
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Pause, Square, Search, Download, FileText, Signature, CheckCircle, SkipBack, SkipForward, Clock } from "lucide-react";

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
  const [duration, setDuration] = useState(180); // 3 minutes sample
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [icfVersion, setIcfVersion] = useState("v2.1");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const consentText = t('econsent.document.title') === 'Informed Consent Form' ? `
    INFORMED CONSENT FORM - Version 2.1
    Last Updated: December 1, 2024
    
    Study Title: Phase II Clinical Trial of Investigational Drug XYZ-123
    Principal Investigator: Dr. Sarah Johnson, MD
    Institution: Metro General Hospital
    Protocol Number: PROTO-2024-001
    
    INTRODUCTION
    You are being invited to participate in a research study. Before you agree to participate, it is important that you read and understand the following information. This consent form will give you information about the study to help you decide whether you want to participate. Please take your time to make your decision. Discuss it with your family and friends if you wish. If you have any questions, please ask the study team.
    
    PURPOSE OF THE STUDY
    The purpose of this study is to test the safety and effectiveness of an investigational drug called XYZ-123 in treating patients with your medical condition. This drug has shown promising results in laboratory studies and earlier phases of clinical trials. The study aims to evaluate whether this treatment is more effective than current standard treatments.
    
    STUDY PROCEDURES
    If you agree to participate in this study, you will be asked to:
    - Visit the clinic 8 times over a 6-month period
    - Take the study medication or placebo as directed by the study team
    - Complete questionnaires about your symptoms and quality of life
    - Have blood tests and physical examinations at scheduled visits
    - Keep a daily diary of your symptoms and any side effects
    - Attend follow-up appointments as scheduled
    
    RISKS AND DISCOMFORTS
    As with any medication, there may be side effects. Based on previous studies, possible side effects may include:
    - Nausea and vomiting (common - occurs in 30% of patients)
    - Headache (common - occurs in 25% of patients)
    - Fatigue (common - occurs in 20% of patients)
    - Dizziness (uncommon - occurs in 10% of patients)
    - Allergic reactions (rare - occurs in less than 1% of patients)
    
    There may be other unknown risks associated with this experimental treatment. If new safety information becomes available during the study, you will be informed immediately.
    
    BENEFITS
    You may or may not benefit from participating in this study. The study medication may help improve your condition, but this cannot be guaranteed. The information gained from this study may help other patients with your condition in the future and contribute to medical knowledge.
    
    CONFIDENTIALITY
    Your identity and all information collected about you will be kept strictly confidential in accordance with applicable privacy laws. You will be assigned a unique participant number, and your name will not appear on any study documents except this consent form. Only authorized study personnel will have access to your medical information.
    
    VOLUNTARY PARTICIPATION
    Your participation in this study is entirely voluntary. You may withdraw from the study at any time without penalty or loss of benefits to which you are otherwise entitled. Your decision to participate or not participate will not affect your regular medical care.
    
    COMPENSATION
    You will receive reasonable compensation for time and travel expenses related to study visits. Details of compensation will be provided separately.
    
    CONTACT INFORMATION
    If you have questions about this study, please contact:
    Principal Investigator: Dr. Sarah Johnson at (555) 123-4567
    Study Coordinator: Jane Smith at (555) 123-4568
    
    For questions about your rights as a research participant, contact:
    Institutional Review Board at (555) 123-4569
    
    CONSENT
    By signing this form, you indicate that:
    - You have read and understood this information
    - All your questions have been answered to your satisfaction
    - You understand that participation is voluntary
    - You understand that you may withdraw at any time
    - You agree to participate in this study
    
    Version History:
    v2.1 (Dec 1, 2024): Updated safety information and compensation details
    v2.0 (Nov 1, 2024): Added new risk information and contact details
    v1.0 (Oct 1, 2024): Initial version
  ` : `
    FORMULARIO DE CONSENTIMIENTO INFORMADO - Versión 2.1
    Última Actualización: 1 de Diciembre, 2024
    
    Título del Estudio: Ensayo Clínico Fase II del Medicamento Investigacional XYZ-123
    Investigador Principal: Dra. Sarah Johnson, MD
    Institución: Hospital General Metro
    Número de Protocolo: PROTO-2024-001
    
    INTRODUCCIÓN
    Se le invita a participar en un estudio de investigación. Antes de aceptar participar, es importante que lea y comprenda la siguiente información. Este formulario de consentimiento le proporcionará información sobre el estudio para ayudarle a decidir si desea participar. Tómese su tiempo para tomar su decisión. Discútalo con su familia y amigos si lo desea. Si tiene alguna pregunta, consulte al equipo del estudio.
    
    PROPÓSITO DEL ESTUDIO
    El propósito de este estudio es probar la seguridad y efectividad de un medicamento investigacional llamado XYZ-123 en el tratamiento de pacientes con su condición médica. Este medicamento ha mostrado resultados prometedores en estudios de laboratorio y fases anteriores de ensayos clínicos. El estudio tiene como objetivo evaluar si este tratamiento es más efectivo que los tratamientos estándar actuales.
    
    PROCEDIMIENTOS DEL ESTUDIO
    Si acepta participar en este estudio, se le pedirá que:
    - Visite la clínica 8 veces durante un período de 6 meses
    - Tome el medicamento del estudio o placebo según las indicaciones del equipo del estudio
    - Complete cuestionarios sobre sus síntomas y calidad de vida
    - Se someta a análisis de sangre y exámenes físicos en visitas programadas
    - Mantenga un diario diario de sus síntomas y cualquier efecto secundario
    - Asista a citas de seguimiento según lo programado
    
    RIESGOS E INCOMODIDADES
    Como con cualquier medicamento, puede haber efectos secundarios. Basado en estudios previos, los posibles efectos secundarios pueden incluir:
    - Náuseas y vómitos (común - ocurre en 30% de los pacientes)
    - Dolor de cabeza (común - ocurre en 25% de los pacientes)
    - Fatiga (común - ocurre en 20% de los pacientes)
    - Mareos (poco común - ocurre en 10% de los pacientes)
    - Reacciones alérgicas (raro - ocurre en menos del 1% de los pacientes)
    
    Puede haber otros riesgos desconocidos asociados con este tratamiento experimental. Si nueva información de seguridad se vuelve disponible durante el estudio, será informado inmediatamente.
    
    BENEFICIOS
    Puede o no beneficiarse de participar en este estudio. El medicamento del estudio puede ayudar a mejorar su condición, pero esto no puede ser garantizado. La información obtenida de este estudio puede ayudar a otros pacientes con su condición en el futuro y contribuir al conocimiento médico.
    
    CONFIDENCIALIDAD
    Su identidad y toda la información recopilada sobre usted se mantendrá estrictamente confidencial de acuerdo con las leyes de privacidad aplicables. Se le asignará un número único de participante, y su nombre no aparecerá en ningún documento del estudio excepto este formulario de consentimiento. Solo el personal autorizado del estudio tendrá acceso a su información médica.
    
    PARTICIPACIÓN VOLUNTARIA
    Su participación en este estudio es completamente voluntaria. Puede retirarse del estudio en cualquier momento sin penalización o pérdida de beneficios a los que tiene derecho. Su decisión de participar o no participar no afectará su atención médica regular.
    
    COMPENSACIÓN
    Recibirá compensación razonable por tiempo y gastos de viaje relacionados con las visitas del estudio. Los detalles de compensación se proporcionarán por separado.
    
    INFORMACIÓN DE CONTACTO
    Si tiene preguntas sobre este estudio, póngase en contacto con:
    Investigador Principal: Dra. Sarah Johnson al (555) 123-4567
    Coordinadora del Estudio: Jane Smith al (555) 123-4568
    
    Para preguntas sobre sus derechos como participante de investigación, contacte:
    Junta de Revisión Institucional al (555) 123-4569
    
    CONSENTIMIENTO
    Al firmar este formulario, usted indica que:
    - Ha leído y comprendido esta información
    - Todas sus preguntas han sido respondidas a su satisfacción
    - Entiende que la participación es voluntaria
    - Entiende que puede retirarse en cualquier momento
    - Acepta participar en este estudio
    
    Historial de Versiones:
    v2.1 (1 Dic 2024): Información de seguridad actualizada y detalles de compensación
    v2.0 (1 Nov 2024): Agregada nueva información de riesgos y detalles de contacto
    v1.0 (1 Oct 2024): Versión inicial
  `;

  const highlightSearchTerms = (text: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 font-semibold">$1</mark>');
  };

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
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual audio playback
  };

  const handleAudioStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    setCurrentTime(newTime);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(parseFloat(speed));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate audio progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, duration]);

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
          <div className="flex items-center space-x-2 text-xs text-studio-text-muted">
            <span>Version: {icfVersion}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Last Updated: December 1, 2024</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Audio Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audio Playback Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipBackward}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
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
                  onClick={handleSkipForward}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAudioStop}
                >
                  <Square className="h-4 w-4" />
                  {t('econsent.audio.stop')}
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-studio-text-muted" />
                  <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentTime]}
                  onValueChange={(value) => setCurrentTime(value[0])}
                  max={duration}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-studio-text-muted">Speed:</span>
                <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
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

          {/* Document Content with Highlighting */}
          <Card>
            <CardHeader>
              <CardTitle>{t('econsent.document.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none text-sm whitespace-pre-line bg-gray-50 p-4 rounded border max-h-60 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: highlightSearchTerms(consentText) }}
              />
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
                    {t('econsent.signature.agree')} - ICF Version {icfVersion}
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
                <p className="text-xs text-green-600 mt-1">
                  ICF Version: {icfVersion} | Document ID: ICF-{Date.now()}
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
