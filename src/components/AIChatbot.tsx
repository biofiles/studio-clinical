
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatbot = ({ open, onOpenChange }: AIChatbotProps) => {
  const { t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: t('ai.welcome'),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const commonQuestions = [
    t('ai.question.upcoming.visits'),
    t('ai.question.daily.diary'),
    t('ai.question.side.effects'),
    t('ai.question.blood.draw'),
    t('ai.question.study.duration')
  ];

  const botResponses = {
    "upcoming visits": t('ai.response.upcoming.visits'),
    "daily diary": t('ai.response.daily.diary'),
    "side effects": t('ai.response.side.effects'),
    "blood draw": t('ai.response.blood.draw'),
    "study duration": t('ai.response.study.duration'),
    "próximas visitas": t('ai.response.upcoming.visits'),
    "diario diario": t('ai.response.daily.diary'),
    "efectos secundarios": t('ai.response.side.effects'),
    "extracción de sangre": t('ai.response.blood.draw'),
    "duración del estudio": t('ai.response.study.duration'),
    "dura el estudio": t('ai.response.study.duration')
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Simple response matching
    let botResponse = t('ai.default.response');
    
    const lowerInput = inputMessage.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerInput.includes(key)) {
        botResponse = response;
        break;
      }
    }

    const aiMessage: Message = {
      id: messages.length + 2,
      content: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInputMessage("");
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">{/* Increased width */}
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>{t('ai.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-studio-surface border-studio-border'
                }`}>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-studio-text-muted'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-xs text-studio-text-muted">{t('ai.quick.questions')}:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('ai.input.placeholder')}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-studio-text-muted bg-yellow-50 p-2 rounded leading-relaxed">
            <strong>{t('ai.note')}:</strong> <span className="break-words">{t('ai.note.description')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbot;
