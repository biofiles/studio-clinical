import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
  isLoading?: boolean;
}

const AIChatbot = ({ open, onOpenChange }: AIChatbotProps) => {
  const { t, language } = useLanguage();
  const { userRole } = useAuth();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: t('ai.welcome'),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset conversation when dialog opens
  useEffect(() => {
    if (open) {
      setMessages([
        {
          id: 1,
          content: t('ai.welcome'),
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setConversationHistory([]);
    }
  }, [open, t]);

  const commonQuestions = [
    t('ai.question.upcoming.visits'),
    t('ai.question.daily.diary'),
    t('ai.question.side.effects'),
    t('ai.question.blood.draw'),
    t('ai.question.study.duration')
  ];

  // Fallback responses for when AI is unavailable
  const fallbackResponses = {
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

  const getFallbackResponse = (message: string): string => {
    const lowerInput = message.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return t('ai.default.response');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Add loading message
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    // Add to conversation history for context
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: inputMessage }
    ];

    try {
      console.log('Sending message to AI:', { message: inputMessage, userRole, language });
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputMessage,
          conversationHistory: newHistory.slice(-10), // Keep last 10 exchanges
          userRole: userRole || 'participant',
          language: language || 'en'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      const aiResponse = data?.response || getFallbackResponse(inputMessage);
      const isErrorResponse = data?.error || data?.fallback;

      const aiMessage: Message = {
        id: Date.now() + 2,
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        isError: isErrorResponse
      };

      // Update conversation history
      if (!isErrorResponse) {
        setConversationHistory([
          ...newHistory,
          { role: 'assistant', content: aiResponse }
        ]);
      }

      // Remove loading message and add AI response
      setMessages(prev => [
        ...prev.slice(0, -1), // Remove loading message
        aiMessage
      ]);

      if (isErrorResponse && !data?.fallback) {
        toast({
          title: "Connection Issue",
          description: "Using offline responses. AI features may be limited.",
          variant: "default"
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to simple response
      const fallbackResponse = getFallbackResponse(inputMessage);
      const errorMessage: Message = {
        id: Date.now() + 2,
        content: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [
        ...prev.slice(0, -1), // Remove loading message
        errorMessage
      ]);

      toast({
        title: "AI Temporarily Unavailable",
        description: "Using basic responses. Please try again later.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
      setInputMessage("");
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span>{t('ai.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <ScrollArea className="flex-1 max-h-80" ref={scrollRef}>
            <div className="space-y-3 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card className={`max-w-[85%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.isError
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-secondary'
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && !message.isLoading && (
                          message.isError ? (
                            <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                          ) : (
                            <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                          )
                        )}
                        {message.sender === 'user' && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          {message.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <LoadingSpinner size="sm" />
                              <span className="text-sm text-muted-foreground">
                                {t('ai.thinking') || 'Thinking...'}
                              </span>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'user' 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{t('ai.quick.questions')}:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1 px-2"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
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
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
              maxLength={1000}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
            <div className="flex items-start space-x-1">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('ai.note')}:</strong>
                <p className="mt-1">{t('ai.note.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbot;