
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI assistant for study protocol questions. I can help you understand procedures, timelines, and requirements. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const commonQuestions = [
    "What are my upcoming visits?",
    "How do I complete the daily diary?",
    "What side effects should I report?",
    "When is my next blood draw?",
    "How long is the study?"
  ];

  const botResponses = {
    "upcoming visits": "Based on your schedule, you have a site visit on December 15th at 2:00 PM for a blood draw, and a follow-up call on December 22nd at 3:00 PM.",
    "daily diary": "Complete your daily diary by logging into the questionnaires section. Record any symptoms, side effects, or changes in how you feel. It takes about 5 minutes.",
    "side effects": "Report any new or worsening symptoms immediately through the app or call your study coordinator. Serious side effects should be reported within 24 hours.",
    "blood draw": "Your next blood draw is scheduled for December 15th at 2:00 PM. Please fast for 8 hours beforehand and bring your ID.",
    "study duration": "This study runs for approximately 6 months. You're currently 65% complete with about 30 days remaining."
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
    let botResponse = "I understand your question. For specific medical concerns or detailed protocol information, please contact your study coordinator directly. I can help with general study timeline and procedure questions.";
    
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
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>AI Protocol Assistant</span>
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
            <p className="text-xs text-studio-text-muted">Quick questions:</p>
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
              placeholder="Ask about the study protocol..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-studio-text-muted bg-yellow-50 p-2 rounded">
            <strong>Note:</strong> This AI assistant provides general study information only. 
            For medical emergencies or urgent concerns, contact your study coordinator immediately.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbot;
