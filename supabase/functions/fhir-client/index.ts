import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { endpoint, resource, params, headers = {}, method = 'GET' } = await req.json();
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Endpoint URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`FHIR Client: ${method} ${endpoint}`);

    // Prepare request URL
    let requestUrl = endpoint;
    if (method === 'GET' && params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      requestUrl += `?${searchParams.toString()}`;
    }

    // Prepare request headers
    const requestHeaders = {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json',
      ...headers
    };

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders
    };

    // Add body for POST/PUT requests
    if ((method === 'POST' || method === 'PUT') && resource) {
      requestOptions.body = JSON.stringify(resource);
    }

    console.log(`Making ${method} request to: ${requestUrl}`);

    // Make the actual request to the FHIR server
    const response = await fetch(requestUrl, requestOptions);
    
    // Parse response
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Handle FHIR server errors
    if (!response.ok) {
      console.error(`FHIR Server Error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: 'FHIR server error',
          status: response.status,
          statusText: response.statusText,
          details: responseData
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`FHIR request successful: ${response.status}`);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        status: response.status,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('FHIR Client Error:', error);
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new Response(
        JSON.stringify({ 
          error: 'Network error - could not connect to FHIR server',
          details: error.message 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})