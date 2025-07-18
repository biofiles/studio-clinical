import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studyId, domains, format, includeMetadata, includeDefineXML } = await req.json();

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

    console.log(`Starting CDISC export for study: ${studyId}, format: ${format}`);

    // Fetch study data
    const { data: study, error: studyError } = await supabase
      .from('studies')
      .select('*')
      .eq('id', studyId)
      .single();

    if (studyError || !study) {
      return new Response(
        JSON.stringify({ error: 'Study not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch participants for the study
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .eq('study_id', studyId);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch participants' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch questionnaire responses for participants
    const participantIds = participants?.map(p => p.id) || [];
    const { data: questionnaireResponses, error: responsesError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .in('participant_id', participantIds);

    if (responsesError) {
      console.error('Error fetching questionnaire responses:', responsesError);
    }

    // Generate CDISC export based on format
    let exportData: any = {};

    if (format === 'ODM') {
      // Generate ODM XML structure
      exportData = generateODMExport(study, participants || [], questionnaireResponses || []);
    } else if (format === 'SDTM') {
      // Generate SDTM domains
      exportData = generateSDTMExport(study, participants || [], questionnaireResponses || [], domains || ['DM', 'QS']);
    } else if (format === 'ADaM') {
      // Generate ADaM datasets
      exportData = generateADaMExport(study, participants || [], questionnaireResponses || []);
    }

    // Add metadata if requested
    if (includeMetadata) {
      exportData.metadata = {
        studyId,
        studyName: study.name,
        protocol: study.protocol,
        exportDate: new Date().toISOString(),
        format,
        domains: domains || [],
        participantCount: participants?.length || 0,
        responseCount: questionnaireResponses?.length || 0
      };
    }

    // Add Define.xml if requested and format is SDTM
    if (includeDefineXML && format === 'SDTM') {
      exportData.defineXML = generateDefineXML(study, domains || ['DM', 'QS']);
    }

    console.log(`CDISC export completed for study: ${studyId}`);

    return new Response(
      JSON.stringify(exportData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('CDISC Export Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Generate ODM XML structure
function generateODMExport(study: any, participants: any[], responses: any[]) {
  const odmStudy = {
    ODM: {
      '@_FileOID': `ODM.${study.id}`,
      '@_FileType': 'Snapshot',
      '@_CreationDateTime': new Date().toISOString(),
      '@_ODMVersion': '1.3.2',
      Study: {
        '@_OID': study.id,
        GlobalVariables: {
          StudyName: study.name,
          StudyDescription: study.description || '',
          ProtocolName: study.protocol
        },
        MetaDataVersion: {
          '@_OID': `${study.id}.v1.0`,
          '@_Name': `${study.name} Metadata v1.0`,
          StudyEventDef: [
            {
              '@_OID': 'SE.SCREENING',
              '@_Name': 'Screening',
              '@_Repeating': 'No',
              '@_Type': 'Scheduled',
              FormRef: [
                { '@_FormOID': 'FORM.DM', '@_Mandatory': 'Yes' },
                { '@_FormOID': 'FORM.QS', '@_Mandatory': 'No' }
              ]
            }
          ],
          FormDef: [
            {
              '@_OID': 'FORM.DM',
              '@_Name': 'Demographics',
              '@_Repeating': 'No',
              ItemGroupRef: { '@_ItemGroupOID': 'IG.DM', '@_Mandatory': 'Yes' }
            },
            {
              '@_OID': 'FORM.QS',
              '@_Name': 'Questionnaires',
              '@_Repeating': 'Yes',
              ItemGroupRef: { '@_ItemGroupOID': 'IG.QS', '@_Mandatory': 'Yes' }
            }
          ],
          ItemGroupDef: [
            {
              '@_OID': 'IG.DM',
              '@_Name': 'Demographics',
              '@_Repeating': 'No',
              '@_Domain': 'DM',
              ItemRef: [
                { '@_ItemOID': 'IT.USUBJID', '@_Mandatory': 'Yes', '@_KeySequence': '1' },
                { '@_ItemOID': 'IT.AGE', '@_Mandatory': 'No' },
                { '@_ItemOID': 'IT.SEX', '@_Mandatory': 'No' },
                { '@_ItemOID': 'IT.RACE', '@_Mandatory': 'No' }
              ]
            },
            {
              '@_OID': 'IG.QS',
              '@_Name': 'Questionnaire Responses',
              '@_Repeating': 'Yes',
              '@_Domain': 'QS',
              ItemRef: [
                { '@_ItemOID': 'IT.USUBJID', '@_Mandatory': 'Yes', '@_KeySequence': '1' },
                { '@_ItemOID': 'IT.QSTEST', '@_Mandatory': 'Yes' },
                { '@_ItemOID': 'IT.QSORRES', '@_Mandatory': 'No' }
              ]
            }
          ],
          ItemDef: [
            { '@_OID': 'IT.USUBJID', '@_Name': 'Unique Subject Identifier', '@_DataType': 'text', '@_Length': '50' },
            { '@_OID': 'IT.AGE', '@_Name': 'Age', '@_DataType': 'integer' },
            { '@_OID': 'IT.SEX', '@_Name': 'Sex', '@_DataType': 'text', '@_CodeListRef': 'CL.SEX' },
            { '@_OID': 'IT.RACE', '@_Name': 'Race', '@_DataType': 'text' },
            { '@_OID': 'IT.QSTEST', '@_Name': 'Question Name', '@_DataType': 'text' },
            { '@_OID': 'IT.QSORRES', '@_Name': 'Result or Finding in Original Units', '@_DataType': 'text' }
          ],
          CodeList: [
            {
              '@_OID': 'CL.SEX',
              '@_Name': 'Sex',
              '@_DataType': 'text',
              CodeListItem: [
                { '@_CodedValue': 'M', Decode: 'Male' },
                { '@_CodedValue': 'F', Decode: 'Female' },
                { '@_CodedValue': 'U', Decode: 'Unknown' }
              ]
            }
          ]
        }
      }
    }
  };

  return odmStudy;
}

// Generate SDTM domains
function generateSDTMExport(study: any, participants: any[], responses: any[], requestedDomains: string[]) {
  const domains: any = {};

  // Generate DM (Demographics) domain
  if (requestedDomains.includes('DM')) {
    domains.DM = participants.map(participant => ({
      STUDYID: study.protocol || study.id,
      DOMAIN: 'DM',
      USUBJID: participant.subject_id || participant.id,
      SITEID: '001',
      AGE: participant.date_of_birth ? 
        Math.floor((Date.now() - new Date(participant.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
        null,
      AGEU: participant.date_of_birth ? 'YEARS' : null,
      SEX: participant.gender?.toUpperCase().charAt(0) || 'U',
      RACE: 'NOT REPORTED',
      ETHNIC: 'NOT REPORTED',
      COUNTRY: participant.country || 'USA',
      RFSTDTC: participant.enrollment_date,
      RFENDTC: participant.completion_date
    }));
  }

  // Generate QS (Questionnaire) domain
  if (requestedDomains.includes('QS') && responses.length > 0) {
    const qsRecords: any[] = [];
    
    responses.forEach(response => {
      if (response.answers) {
        Object.entries(response.answers).forEach(([questionId, answer], index) => {
          qsRecords.push({
            STUDYID: study.protocol || study.id,
            DOMAIN: 'QS',
            USUBJID: response.participant_id,
            QSSEQ: index + 1,
            QSCAT: response.title || 'QUESTIONNAIRE',
            QSTEST: questionId,
            QSTESTCD: questionId.toUpperCase().substring(0, 8),
            QSORRES: typeof answer === 'string' ? answer : JSON.stringify(answer),
            QSSTRESC: typeof answer === 'string' ? answer : JSON.stringify(answer),
            QSDTC: response.submitted_at || new Date().toISOString().split('T')[0],
            VISITNUM: 1,
            VISIT: 'SCREENING'
          });
        });
      }
    });
    
    domains.QS = qsRecords;
  }

  // Generate DS (Disposition) domain
  if (requestedDomains.includes('DS')) {
    domains.DS = participants.map((participant, index) => ({
      STUDYID: study.protocol || study.id,
      DOMAIN: 'DS',
      USUBJID: participant.subject_id || participant.id,
      DSSEQ: index + 1,
      DSTERM: participant.status?.toUpperCase() || 'ONGOING',
      DSDECOD: participant.status?.toUpperCase() || 'ONGOING',
      DSCAT: 'DISPOSITION EVENT',
      DSSTDTC: participant.enrollment_date,
      DSENDTC: participant.completion_date
    }));
  }

  return { domains, summary: {
    studyId: study.id,
    totalDomains: Object.keys(domains).length,
    totalRecords: Object.values(domains).reduce((sum: number, domain: any) => sum + domain.length, 0),
    generatedDomains: Object.keys(domains)
  }};
}

// Generate ADaM datasets
function generateADaMExport(study: any, participants: any[], responses: any[]) {
  // Generate ADSL (Subject Level Analysis Dataset)
  const adsl = participants.map(participant => ({
    STUDYID: study.protocol || study.id,
    USUBJID: participant.subject_id || participant.id,
    SUBJID: participant.subject_id || participant.id,
    SITEID: '001',
    AGE: participant.date_of_birth ? 
      Math.floor((Date.now() - new Date(participant.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
      null,
    AGEGR1: null, // Age group to be calculated
    SEX: participant.gender?.toUpperCase().charAt(0) || 'U',
    RACE: 'NOT REPORTED',
    ETHNIC: 'NOT REPORTED',
    COUNTRY: participant.country || 'USA',
    RFSTDTC: participant.enrollment_date,
    RFENDTC: participant.completion_date,
    DTHFL: 'N',
    SAFFL: 'Y',
    ITTFL: 'Y',
    EFFFL: 'Y',
    TRT01P: participant.arm || 'NOT ASSIGNED',
    TRT01A: participant.arm || 'NOT ASSIGNED'
  }));

  return {
    datasets: {
      ADSL: adsl
    },
    summary: {
      studyId: study.id,
      totalDatasets: 1,
      totalSubjects: adsl.length,
      generatedDatasets: ['ADSL']
    }
  };
}

// Generate Define.xml
function generateDefineXML(study: any, domains: string[]) {
  const defineXML = {
    ODM: {
      '@_xmlns': 'http://www.cdisc.org/ns/odm/v1.3',
      '@_xmlns:def': 'http://www.cdisc.org/ns/def/v2.0',
      '@_FileOID': `Define.${study.id}`,
      '@_FileType': 'Snapshot',
      '@_CreationDateTime': new Date().toISOString(),
      '@_ODMVersion': '1.3.2',
      Study: {
        '@_OID': study.id,
        GlobalVariables: {
          StudyName: study.name,
          StudyDescription: study.description || '',
          ProtocolName: study.protocol
        },
        MetaDataVersion: {
          '@_OID': `${study.id}.define.v1.0`,
          '@_Name': `${study.name} Define Metadata v1.0`,
          '@_DefineVersion': '2.0.0',
          ItemGroupDef: domains.map(domain => ({
            '@_OID': `IG.${domain}`,
            '@_Name': getDomainName(domain),
            '@_Repeating': 'Yes',
            '@_Domain': domain,
            '@_Purpose': 'Tabulation',
            '@_def:Structure': 'One record per event',
            '@_def:Class': getDomainClass(domain),
            '@_def:ArchiveLocationID': `IG.${domain}.DATA`,
            ItemRef: getItemRefsForDomain(domain)
          }))
        }
      }
    }
  };

  return defineXML;
}

// Helper functions
function getDomainName(domain: string): string {
  const domainNames: { [key: string]: string } = {
    'DM': 'Demographics',
    'QS': 'Questionnaires',
    'DS': 'Disposition',
    'AE': 'Adverse Events',
    'CM': 'Concomitant Medications',
    'VS': 'Vital Signs',
    'LB': 'Laboratory Test Results'
  };
  return domainNames[domain] || domain;
}

function getDomainClass(domain: string): string {
  const domainClasses: { [key: string]: string } = {
    'DM': 'SPECIAL PURPOSE',
    'QS': 'QUESTIONNAIRES',
    'DS': 'SPECIAL PURPOSE',
    'AE': 'EVENTS',
    'CM': 'INTERVENTIONS',
    'VS': 'FINDINGS',
    'LB': 'FINDINGS'
  };
  return domainClasses[domain] || 'FINDINGS';
}

function getItemRefsForDomain(domain: string): any[] {
  const commonItems = [
    { '@_ItemOID': 'IT.STUDYID', '@_Mandatory': 'Yes', '@_KeySequence': '1' },
    { '@_ItemOID': 'IT.DOMAIN', '@_Mandatory': 'Yes', '@_KeySequence': '2' },
    { '@_ItemOID': 'IT.USUBJID', '@_Mandatory': 'Yes', '@_KeySequence': '3' }
  ];

  const domainSpecificItems: { [key: string]: any[] } = {
    'DM': [
      { '@_ItemOID': 'IT.SITEID', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.AGE', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.AGEU', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.SEX', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.RACE', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.ETHNIC', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.COUNTRY', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.RFSTDTC', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.RFENDTC', '@_Mandatory': 'No' }
    ],
    'QS': [
      { '@_ItemOID': 'IT.QSSEQ', '@_Mandatory': 'Yes', '@_KeySequence': '4' },
      { '@_ItemOID': 'IT.QSCAT', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.QSTEST', '@_Mandatory': 'Yes' },
      { '@_ItemOID': 'IT.QSTESTCD', '@_Mandatory': 'Yes' },
      { '@_ItemOID': 'IT.QSORRES', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.QSSTRESC', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.QSDTC', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.VISITNUM', '@_Mandatory': 'No' },
      { '@_ItemOID': 'IT.VISIT', '@_Mandatory': 'No' }
    ]
  };

  return [...commonItems, ...(domainSpecificItems[domain] || [])];
}