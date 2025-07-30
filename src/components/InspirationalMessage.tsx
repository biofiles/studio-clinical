import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";

const InspirationalMessage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const inspirationalMessages = [
    "Tu participación está ayudando a desarrollar tratamientos que cambiarán vidas. ¡Eres un verdadero héroe de la ciencia médica!",
    "Cada dato que proporcionas es una pieza valiosa en el rompecabezas de la medicina. Tu contribución importa enormemente.",
    "Gracias a participantes como tú, miles de pacientes en el futuro tendrán mejores opciones de tratamiento. ¡Eres increíble!",
    "Tu compromiso con la investigación médica está construyendo un futuro más saludable para todos. ¡Sigue brillando!",
    "Eres parte de algo extraordinario: el avance de la medicina moderna. Tu dedicación marca la diferencia.",
    "Tu valentía al participar en este estudio está abriendo puertas a nuevas esperanzas. ¡Gracias por ser inspirador!",
    "Cada consulta, cada cuestionario, cada visita tuya acerca más la ciencia a encontrar mejores soluciones. ¡Eres fundamental!",
    "Tu participación está escribiendo una nueva página en la historia de la medicina. ¡Qué honor tenerte en nuestro equipo!"
  ];

  useEffect(() => {
    // Check if message was dismissed in this session
    const dismissed = sessionStorage.getItem('inspirationalMessageDismissed');
    
    if (!dismissed) {
      // Select a random message
      const randomIndex = Math.floor(Math.random() * inspirationalMessages.length);
      setCurrentMessage(inspirationalMessages[randomIndex]);
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal for this session
    sessionStorage.setItem('inspirationalMessageDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-4 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Heart className="h-5 w-5 text-pink-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800 leading-relaxed">
              {currentMessage}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspirationalMessage;