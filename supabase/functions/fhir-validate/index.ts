import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Basic FHIR R4 validation rules
const FHIR_RESOURCE_TYPES = [
  'Patient', 'ResearchStudy', 'ResearchSubject', 'Observation', 
  'QuestionnaireResponse', 'Bundle', 'Organization', 'Practitioner'
];

const REQUIRED_FIELDS = {
  Patient: ['resourceType'],
  ResearchStudy: ['resourceType', 'status'],
  ResearchSubject: ['resourceType', 'status', 'study', 'individual'],
  Observation: ['resourceType', 'status', 'code', 'subject'],
  QuestionnaireResponse: ['resourceType', 'status'],
  Bundle: ['resourceType', 'type']
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resource } = await req.json();
    
    if (!resource) {
      return new Response(
        JSON.stringify({ error: 'Resource is required for validation' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Validating FHIR resource: ${resource.resourceType}`);

    const validationResult = {
      valid: true,
      errors: [] as string[],
      warnings: [] as string[],
      resourceType: resource.resourceType,
      resourceId: resource.id
    };

    // Basic resource type validation
    if (!resource.resourceType) {
      validationResult.valid = false;
      validationResult.errors.push('Resource must have a resourceType field');
    } else if (!FHIR_RESOURCE_TYPES.includes(resource.resourceType)) {
      validationResult.valid = false;
      validationResult.errors.push(`Unsupported resource type: ${resource.resourceType}`);
    }

    // Required fields validation
    if (resource.resourceType && REQUIRED_FIELDS[resource.resourceType]) {
      const requiredFields = REQUIRED_FIELDS[resource.resourceType];
      for (const field of requiredFields) {
        if (field.includes('.')) {
          // Handle nested fields
          const parts = field.split('.');
          let current = resource;
          for (const part of parts) {
            if (!current || !current[part]) {
              validationResult.valid = false;
              validationResult.errors.push(`Required field missing: ${field}`);
              break;
            }
            current = current[part];
          }
        } else {
          // Handle top-level fields
          if (!resource[field]) {
            validationResult.valid = false;
            validationResult.errors.push(`Required field missing: ${field}`);
          }
        }
      }
    }

    // Resource-specific validation
    switch (resource.resourceType) {
      case 'Patient':
        validatePatient(resource, validationResult);
        break;
      case 'ResearchStudy':
        validateResearchStudy(resource, validationResult);
        break;
      case 'ResearchSubject':
        validateResearchSubject(resource, validationResult);
        break;
      case 'Observation':
        validateObservation(resource, validationResult);
        break;
      case 'QuestionnaireResponse':
        validateQuestionnaireResponse(resource, validationResult);
        break;
      case 'Bundle':
        validateBundle(resource, validationResult);
        break;
    }

    console.log(`Validation completed: ${validationResult.valid ? 'VALID' : 'INVALID'}`);
    if (validationResult.errors.length > 0) {
      console.log(`Errors: ${validationResult.errors.join(', ')}`);
    }

    return new Response(
      JSON.stringify(validationResult),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('FHIR Validation Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function validatePatient(resource: any, result: any) {
  // Gender validation
  if (resource.gender && !['male', 'female', 'other', 'unknown'].includes(resource.gender)) {
    result.errors.push('Patient.gender must be one of: male, female, other, unknown');
    result.valid = false;
  }

  // Birth date format validation
  if (resource.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(resource.birthDate)) {
    result.errors.push('Patient.birthDate must be in YYYY-MM-DD format');
    result.valid = false;
  }

  // Name validation
  if (resource.name) {
    if (!Array.isArray(resource.name)) {
      result.errors.push('Patient.name must be an array');
      result.valid = false;
    }
  }
}

function validateResearchStudy(resource: any, result: any) {
  const validStatuses = [
    'active', 'administratively-completed', 'approved', 'closed-to-accrual',
    'closed-to-accrual-and-intervention', 'completed', 'disapproved', 'in-review',
    'temporarily-closed-to-accrual', 'temporarily-closed-to-accrual-and-intervention', 'withdrawn'
  ];

  if (!validStatuses.includes(resource.status)) {
    result.errors.push(`ResearchStudy.status must be one of: ${validStatuses.join(', ')}`);
    result.valid = false;
  }
}

function validateResearchSubject(resource: any, result: any) {
  const validStatuses = [
    'candidate', 'eligible', 'follow-up', 'ineligible', 'not-registered',
    'off-study', 'on-study', 'on-study-intervention', 'on-study-observation',
    'pending-on-study', 'potential-candidate', 'screening', 'withdrawn'
  ];

  if (!validStatuses.includes(resource.status)) {
    result.errors.push(`ResearchSubject.status must be one of: ${validStatuses.join(', ')}`);
    result.valid = false;
  }

  // Reference validation
  if (!resource.study?.reference) {
    result.errors.push('ResearchSubject.study.reference is required');
    result.valid = false;
  }

  if (!resource.individual?.reference) {
    result.errors.push('ResearchSubject.individual.reference is required');
    result.valid = false;
  }
}

function validateObservation(resource: any, result: any) {
  const validStatuses = [
    'registered', 'preliminary', 'final', 'amended', 'corrected',
    'cancelled', 'entered-in-error', 'unknown'
  ];

  if (!validStatuses.includes(resource.status)) {
    result.errors.push(`Observation.status must be one of: ${validStatuses.join(', ')}`);
    result.valid = false;
  }

  // Subject reference validation
  if (!resource.subject?.reference) {
    result.errors.push('Observation.subject.reference is required');
    result.valid = false;
  }
}

function validateQuestionnaireResponse(resource: any, result: any) {
  const validStatuses = ['in-progress', 'completed', 'amended', 'entered-in-error', 'stopped'];

  if (!validStatuses.includes(resource.status)) {
    result.errors.push(`QuestionnaireResponse.status must be one of: ${validStatuses.join(', ')}`);
    result.valid = false;
  }
}

function validateBundle(resource: any, result: any) {
  const validTypes = [
    'document', 'message', 'transaction', 'transaction-response',
    'batch', 'batch-response', 'history', 'searchset', 'collection'
  ];

  if (!validTypes.includes(resource.type)) {
    result.errors.push(`Bundle.type must be one of: ${validTypes.join(', ')}`);
    result.valid = false;
  }

  // Entry validation
  if (resource.entry && !Array.isArray(resource.entry)) {
    result.errors.push('Bundle.entry must be an array');
    result.valid = false;
  }
}