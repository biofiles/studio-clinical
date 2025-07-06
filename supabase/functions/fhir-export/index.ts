import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studyId } = await req.json();
    
    if (!studyId) {
      return new Response(
        JSON.stringify({ error: 'Study ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Exporting FHIR data for study: ${studyId}`);

    // Create FHIR Bundle with mock data (in real implementation, fetch from database)
    const fhirBundle = {
      resourceType: "Bundle",
      id: `export-${studyId}-${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString()
      },
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: [
        // ResearchStudy resource
        {
          fullUrl: `ResearchStudy/${studyId}`,
          resource: {
            resourceType: "ResearchStudy",
            id: studyId,
            identifier: [
              {
                use: "official",
                system: "https://clinical-research.org/study-protocol",
                value: studyId === "1" ? "PARADIGM-CV-001" : 
                       studyId === "2" ? "ATLAS-DM2-002" : 
                       studyId === "3" ? "HORIZON-Onc-003" : "GUARDIAN-Ped-004"
              }
            ],
            status: "active",
            category: [
              {
                coding: [
                  {
                    system: "http://hl7.org/fhir/research-study-phase",
                    code: "phase-2",
                    display: "Phase II"
                  }
                ]
              }
            ],
            title: studyId === "1" ? "PARADIGM-CV: Cardiovascular Outcomes Study" : 
                   studyId === "2" ? "ATLAS-DM2: Diabetes Management Trial" : 
                   studyId === "3" ? "HORIZON-Onc: Advanced Oncology Research" : 
                   "GUARDIAN-Ped: Pediatric Safety and Efficacy Study",
            description: "Clinical research study for therapeutic intervention evaluation",
            period: {
              start: "2024-01-01",
              end: "2025-12-31"
            }
          }
        },
        // Sample Patient resources
        {
          fullUrl: "Patient/S001",
          resource: {
            resourceType: "Patient",
            id: "S001",
            identifier: [
              {
                use: "usual",
                system: "https://clinical-research.org/participant-id",
                value: "S001"
              }
            ],
            active: true,
            name: [
              {
                use: "official",
                family: "González",
                given: ["María", "Elena"]
              }
            ],
            gender: "female",
            birthDate: "1975-06-15"
          }
        },
        {
          fullUrl: "Patient/S002",
          resource: {
            resourceType: "Patient",
            id: "S002",
            identifier: [
              {
                use: "usual",
                system: "https://clinical-research.org/participant-id",
                value: "S002"
              }
            ],
            active: true,
            name: [
              {
                use: "official",
                family: "Rodríguez",
                given: ["Carlos", "Antonio"]
              }
            ],
            gender: "male",
            birthDate: "1968-03-22"
          }
        },
        // ResearchSubject resources
        {
          fullUrl: `ResearchSubject/S001-${studyId}`,
          resource: {
            resourceType: "ResearchSubject",
            id: `S001-${studyId}`,
            identifier: [
              {
                use: "secondary",
                system: "https://clinical-research.org/enrollment-id",
                value: `S001-${studyId}`
              }
            ],
            status: "on-study",
            period: {
              start: "2024-02-15"
            },
            study: {
              reference: `ResearchStudy/${studyId}`
            },
            individual: {
              reference: "Patient/S001"
            },
            assignedArm: "treatment-arm-a"
          }
        },
        {
          fullUrl: `ResearchSubject/S002-${studyId}`,
          resource: {
            resourceType: "ResearchSubject",
            id: `S002-${studyId}`,
            identifier: [
              {
                use: "secondary",
                system: "https://clinical-research.org/enrollment-id",
                value: `S002-${studyId}`
              }
            ],
            status: "on-study",
            period: {
              start: "2024-02-20"
            },
            study: {
              reference: `ResearchStudy/${studyId}`
            },
            individual: {
              reference: "Patient/S002"
            },
            assignedArm: "treatment-arm-b"
          }
        },
        // Sample Observation resources
        {
          fullUrl: "Observation/obs-001",
          resource: {
            resourceType: "Observation",
            id: "obs-001",
            status: "final",
            category: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "vital-signs",
                    display: "Vital Signs"
                  }
                ]
              }
            ],
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "85354-9",
                  display: "Blood pressure panel with all children optional"
                }
              ]
            },
            subject: {
              reference: "Patient/S001"
            },
            effectiveDateTime: "2024-07-01T10:30:00Z",
            component: [
              {
                code: {
                  coding: [
                    {
                      system: "http://loinc.org",
                      code: "8480-6",
                      display: "Systolic blood pressure"
                    }
                  ]
                },
                valueQuantity: {
                  value: 120,
                  unit: "mmHg"
                }
              },
              {
                code: {
                  coding: [
                    {
                      system: "http://loinc.org",
                      code: "8462-4",
                      display: "Diastolic blood pressure"
                    }
                  ]
                },
                valueQuantity: {
                  value: 80,
                  unit: "mmHg"
                }
              }
            ]
          }
        },
        // Sample QuestionnaireResponse
        {
          fullUrl: "QuestionnaireResponse/qr-001",
          resource: {
            resourceType: "QuestionnaireResponse",
            id: "qr-001",
            identifier: {
              use: "official",
              system: "https://clinical-research.org/questionnaire-response",
              value: "qr-001"
            },
            questionnaire: "quality-of-life-questionnaire",
            status: "completed",
            subject: {
              reference: "Patient/S001"
            },
            authored: "2024-07-01T14:00:00Z",
            author: {
              reference: "Patient/S001"
            },
            item: [
              {
                linkId: "1",
                text: "How would you rate your overall health?",
                answer: [
                  {
                    valueString: "Good"
                  }
                ]
              },
              {
                linkId: "2",
                text: "How much pain do you experience?",
                answer: [
                  {
                    valueInteger: 3
                  }
                ]
              }
            ]
          }
        }
      ]
    };

    console.log(`Generated FHIR Bundle with ${fhirBundle.entry.length} resources`);

    return new Response(
      JSON.stringify(fhirBundle),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/fhir+json' 
        } 
      }
    );

  } catch (error) {
    console.error('FHIR Export Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})