import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, Globe, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import { createAuthenticatedFHIRClient } from "@/lib/fhir-client";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FHIRExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FHIRExportDialog = ({ open, onOpenChange }: FHIRExportDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"export" | "import" | "server">("export");
  const [resourceTypes, setResourceTypes] = useState({
    Patient: true,
    ResearchStudy: true,
    ResearchSubject: true,
    Observation: true,
    QuestionnaireResponse: true
  });
  const [fhirServerUrl, setFhirServerUrl] = useState("");
  const [fhirBundle, setFhirBundle] = useState("");
  const { selectedStudy } = useStudy();

  // Create authenticated FHIR client
  const getFHIRClient = () => {
    const getAuthHeaders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token ? {
        'Authorization': `Bearer ${session.access_token}`
      } : {};
    };
    return createAuthenticatedFHIRClient(getAuthHeaders);
  };

  const handleExport = async () => {
    if (!selectedStudy) {
      toast.error("No hay estudio seleccionado");
      return;
    }

    setIsExporting(true);
    try {
      const fhirClient = getFHIRClient();
      const bundle = await fhirClient.exportToFHIRBundle(selectedStudy.id);
      const jsonString = JSON.stringify(bundle, null, 2);
      setExportResult(jsonString);
      
      // Download file
      const blob = new Blob([jsonString], { type: 'application/fhir+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fhir-export-${selectedStudy.protocol}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Exportación FHIR completada exitosamente");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error al exportar datos FHIR");
    }
    setIsExporting(false);
  };

  const handleImport = async () => {
    if (!fhirBundle.trim()) {
      toast.error("Por favor ingresa un bundle FHIR válido");
      return;
    }

    setIsImporting(true);
    try {
      const bundle = JSON.parse(fhirBundle);
      const fhirClient = getFHIRClient();
      await fhirClient.importFHIRBundle(bundle);
      toast.success("Importación FHIR completada exitosamente");
      setFhirBundle("");
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Error al importar datos FHIR. Verifica que el formato sea válido.");
    }
    setIsImporting(false);
  };

  const handleSendToServer = async () => {
    if (!fhirServerUrl.trim()) {
      toast.error("Por favor ingresa una URL de servidor FHIR válida");
      return;
    }

    if (!selectedStudy) {
      toast.error("No hay estudio seleccionado");
      return;
    }

    setIsExporting(true);
    try {
      const fhirClient = getFHIRClient();
      const bundle = await fhirClient.exportToFHIRBundle(selectedStudy.id);
      await fhirClient.sendToFHIRServer(fhirServerUrl, bundle);
      toast.success("Datos enviados al servidor FHIR exitosamente");
    } catch (error) {
      console.error("Server send error:", error);
      toast.error("Error al enviar datos al servidor FHIR");
    }
    setIsExporting(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFhirBundle(content);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-studio-surface border-studio-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-studio-text">
            <Globe className="h-5 w-5" />
            <span>Interoperabilidad FHIR/HL7</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "export" | "import" | "server")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Exportar FHIR
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Importar FHIR
            </TabsTrigger>
            <TabsTrigger value="server">
              <Globe className="h-4 w-4 mr-2" />
              Servidor FHIR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Exporta los datos del estudio como un Bundle FHIR R4 estándar para interoperabilidad con sistemas hospitalarios y de investigación.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label className="text-studio-text font-medium">Tipos de recursos a exportar:</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(resourceTypes).map(([type, checked]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={checked}
                      onCheckedChange={(checked) => 
                        setResourceTypes(prev => ({ ...prev, [type]: checked as boolean }))
                      }
                    />
                    <Label htmlFor={type} className="text-sm text-studio-text">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exportando..." : "Exportar como FHIR Bundle"}
              </Button>
            </div>

            {exportResult && (
              <div className="space-y-2">
                <Alert>
                  <CheckCircle className="h-4 w-4 text-progress-success" />
                  <AlertDescription>
                    <strong>Exportación completada exitosamente.</strong> El archivo se ha descargado automáticamente.
                  </AlertDescription>
                </Alert>
                <div className="max-h-40 overflow-auto bg-studio-bg rounded border border-studio-border p-3">
                  <pre className="text-xs text-studio-text">
                    {exportResult.substring(0, 500)}...
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Importa datos desde un Bundle FHIR R4. Los datos deben estar en formato JSON válido y seguir los estándares FHIR.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="fhir-file" className="text-studio-text font-medium">
                Cargar archivo FHIR Bundle (JSON):
              </Label>
              <Input
                id="fhir-file"
                type="file"
                accept=".json,application/fhir+json"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fhir-bundle" className="text-studio-text font-medium">
                O pega el contenido del Bundle FHIR:
              </Label>
              <Textarea
                id="fhir-bundle"
                placeholder="Pega aquí el contenido JSON del Bundle FHIR..."
                value={fhirBundle}
                onChange={(e) => setFhirBundle(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handleImport} 
              disabled={isImporting || !fhirBundle.trim()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importando..." : "Importar Bundle FHIR"}
            </Button>
          </TabsContent>

          <TabsContent value="server" className="space-y-4">
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                Conecta con servidores FHIR externos para intercambio de datos en tiempo real con sistemas hospitalarios y de investigación.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="fhir-server-url" className="text-studio-text font-medium">
                URL del Servidor FHIR:
              </Label>
              <Input
                id="fhir-server-url"
                type="url"
                placeholder="https://fhir.example.com/R4"
                value={fhirServerUrl}
                onChange={(e) => setFhirServerUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleSendToServer} 
                disabled={isExporting || !fhirServerUrl.trim()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Enviar Datos
              </Button>
              <Button 
                onClick={() => {
                  if (fhirServerUrl.trim()) {
                    const fhirClient = getFHIRClient();
                    fhirClient.queryFHIRServer(fhirServerUrl + "/Patient")
                      .then(() => toast.success("Conexión exitosa"))
                      .catch(() => toast.error("Error de conexión"));
                  }
                }}
                disabled={!fhirServerUrl.trim()}
                variant="outline"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Probar Conexión
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> Asegúrate de que el servidor FHIR soporte CORS y tenga las credenciales de autenticación correctas configuradas.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FHIRExportDialog;