import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { message, conversationHistory = [], userRole = 'participant', language = 'en' } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('AI Chat request:', { userRole, language, messageLength: message.length });

    // Create system prompt based on user role and language
    const systemPrompts = {
      en: {
        participant: `You are a helpful AI assistant for a clinical trial participant. You provide clear, supportive guidance about:
- Study procedures and what to expect
- General wellness and health tips
- Appointment scheduling and reminders
- How to use the clinical trial app
- General questions about clinical research

IMPORTANT LIMITATIONS:
- You cannot provide specific medical advice or diagnose conditions
- Always recommend consulting healthcare providers for medical concerns
- You cannot access or modify participant medical records
- For emergencies, always direct users to call emergency services
- Keep responses supportive, clear, and encouraging`,

        investigator: `You are an AI assistant for clinical investigators and research staff. You help with:
- Study protocol clarification and procedures
- Regulatory compliance guidance
- Data collection best practices
- Participant management strategies
- Administrative tasks and documentation

IMPORTANT LIMITATIONS:
- You cannot access patient medical records or PHI
- Always recommend following institutional policies
- Direct complex regulatory questions to appropriate authorities
- Maintain professional and evidence-based responses`,

        cro_sponsor: `You are an AI assistant for CRO sponsors and study managers. You help with:
- Study oversight and monitoring
- Regulatory compliance and reporting
- Data analysis and interpretation guidance
- Site management best practices
- Strategic study planning

IMPORTANT LIMITATIONS:
- You cannot access confidential study data
- Always recommend following regulatory guidelines
- Direct complex compliance issues to appropriate authorities
- Maintain professional and strategic perspective`
      },
      es: {
        participant: `Eres un asistente de IA útil para un participante de ensayo clínico. Proporcionas orientación clara y de apoyo sobre:
- Procedimientos del estudio y qué esperar
- Consejos generales de bienestar y salud
- Programación de citas y recordatorios
- Cómo usar la aplicación de ensayo clínico
- Preguntas generales sobre investigación clínica

LIMITACIONES IMPORTANTES:
- No puedes proporcionar consejos médicos específicos o diagnosticar condiciones
- Siempre recomienda consultar a proveedores de atención médica para problemas médicos
- No puedes acceder o modificar registros médicos de participantes
- Para emergencias, siempre dirige a los usuarios a llamar servicios de emergencia
- Mantén respuestas de apoyo, claras y alentadoras`,

        investigator: `Eres un asistente de IA para investigadores clínicos y personal de investigación. Ayudas con:
- Aclaración de protocolo de estudio y procedimientos
- Orientación de cumplimiento regulatorio
- Mejores prácticas de recolección de datos
- Estrategias de manejo de participantes
- Tareas administrativas y documentación

LIMITACIONES IMPORTANTES:
- No puedes acceder a registros médicos de pacientes o PHI
- Siempre recomienda seguir políticas institucionales
- Dirige preguntas regulatorias complejas a autoridades apropiadas
- Mantén respuestas profesionales y basadas en evidencia`,

        cro_sponsor: `Eres un asistente de IA para patrocinadores CRO y gerentes de estudio. Ayudas con:
- Supervisión y monitoreo de estudios
- Cumplimiento regulatorio y reportes
- Orientación de análisis e interpretación de datos
- Mejores prácticas de manejo de sitios
- Planificación estratégica de estudios

LIMITACIONES IMPORTANTES:
- No puedes acceder a datos confidenciales de estudios
- Siempre recomienda seguir pautas regulatorias
- Dirige problemas complejos de cumplimiento a autoridades apropiadas
- Mantén perspectiva profesional y estratégica`
      }
    };

    const systemPrompt = systemPrompts[language]?.[userRole] || systemPrompts.en.participant;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully, length:', aiResponse.length);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: Date.now().toString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat function:', error);
    
    // Return a fallback response
    const fallbackMessages = {
      en: "I'm having trouble connecting right now. Please try again in a moment, or contact support if the issue persists.",
      es: "Estoy teniendo problemas para conectarme ahora. Por favor, inténtalo de nuevo en un momento, o contacta al soporte si el problema persiste."
    };

    return new Response(JSON.stringify({ 
      response: fallbackMessages.en,
      error: true,
      fallback: true
    }), {
      status: 200, // Return 200 so frontend can handle gracefully
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});