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
    const { bundle } = await req.json();
    
    if (!bundle || bundle.resourceType !== 'Bundle') {
      return new Response(
        JSON.stringify({ error: 'Valid FHIR Bundle is required' }),
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

    console.log(`Importing FHIR Bundle with ${bundle.entry?.length || 0} entries`);

    // Process each resource in the bundle
    const processedResources = [];
    const errors = [];

    if (bundle.entry) {
      for (const entry of bundle.entry) {
        try {
          const resource = entry.resource;
          
          if (!resource) {
            console.warn('Entry without resource found, skipping');
            continue;
          }

          // Validate and process different resource types
          switch (resource.resourceType) {
            case 'Patient':
              processedResources.push({
                type: 'Patient',
                id: resource.id,
                data: resource,
                status: 'processed'
              });
              console.log(`Processed Patient: ${resource.id}`);
              break;
              
            case 'ResearchStudy':
              processedResources.push({
                type: 'ResearchStudy',
                id: resource.id,
                data: resource,
                status: 'processed'
              });
              console.log(`Processed ResearchStudy: ${resource.id}`);
              break;
              
            case 'ResearchSubject':
              processedResources.push({
                type: 'ResearchSubject',
                id: resource.id,
                data: resource,
                status: 'processed'
              });
              console.log(`Processed ResearchSubject: ${resource.id}`);
              break;
              
            case 'Observation':
              processedResources.push({
                type: 'Observation',
                id: resource.id,
                data: resource,
                status: 'processed'
              });
              console.log(`Processed Observation: ${resource.id}`);
              break;
              
            case 'QuestionnaireResponse':
              processedResources.push({
                type: 'QuestionnaireResponse',
                id: resource.id,
                data: resource,
                status: 'processed'
              });
              console.log(`Processed QuestionnaireResponse: ${resource.id}`);
              break;
              
            default:
              console.warn(`Unsupported resource type: ${resource.resourceType}`);
              errors.push({
                resource: resource.resourceType,
                id: resource.id,
                error: 'Unsupported resource type'
              });
          }
        } catch (resourceError) {
          console.error(`Error processing resource:`, resourceError);
          errors.push({
            resource: entry.resource?.resourceType || 'Unknown',
            id: entry.resource?.id || 'Unknown',
            error: resourceError.message
          });
        }
      }
    }

    // Create import log entry (in a real implementation, you'd save to database)
    const importResult = {
      importId: `import-${Date.now()}`,
      timestamp: new Date().toISOString(),
      bundleId: bundle.id,
      totalEntries: bundle.entry?.length || 0,
      processedResources: processedResources.length,
      errors: errors.length,
      resources: processedResources,
      errors: errors
    };

    console.log(`Import completed: ${processedResources.length} resources processed, ${errors.length} errors`);

    return new Response(
      JSON.stringify(importResult),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('FHIR Import Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})