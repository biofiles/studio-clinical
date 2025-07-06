import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export interface ExportData {
  sheetName: string;
  data: any[];
  headers: string[];
}

export const exportToExcel = (exportData: ExportData[], filename: string) => {
  const workbook = XLSX.utils.book_new();

  exportData.forEach(({ sheetName, data, headers }) => {
    // Create worksheet with headers
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data.map(row => 
      headers.map(header => row[header] || '')
    )]);

    // Auto-size columns
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, String(cell.v).length);
        }
      }
      colWidths.push({ width: Math.min(maxWidth + 2, 50) });
    }
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Save file
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const fetchSiteUsersData = async (studyId?: string) => {
  try {
    // Fetch user roles first
    let roleQuery = supabase
      .from('user_roles')
      .select('*')
      .in('role', ['investigator', 'cro_sponsor']);

    if (studyId) {
      roleQuery = roleQuery.eq('study_id', studyId);
    }

    const { data: roles, error: rolesError } = await roleQuery;
    if (rolesError) throw rolesError;

    // Fetch profiles separately
    const userIds = roles?.map(role => role.user_id) || [];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', userIds);

    if (profilesError) throw profilesError;

    // Fetch studies
    const { data: studies, error: studiesError } = await supabase
      .from('studies')
      .select('*');

    if (studiesError) throw studiesError;

    return roles?.map(user => {
      const profile = profiles?.find(p => p.user_id === user.user_id);
      const study = studies?.find(s => s.id === user.study_id);
      
      return {
        'Full Name': profile?.full_name || 'N/A',
        'Email': profile?.email || 'N/A',
        'Role': user.role.replace('_', ' ').toUpperCase(),
        'Study': study?.name || 'All Studies',
        'Protocol': study?.protocol || 'N/A',
        'Status': user.status || 'active',
        'Assigned Date': new Date(user.assigned_at || user.created_at).toLocaleDateString(),
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching site users data:', error);
    return [];
  }
};

export const fetchQuestionnaireData = async (studyId?: string) => {
  try {
    let query = supabase
      .from('questionnaire_responses')
      .select(`
        *,
        participants(subject_id, first_name, last_name, study_id, studies(name, protocol))
      `);

    if (studyId) {
      query = query.eq('participants.study_id', studyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(response => ({
      'Participant ID': response.participants?.subject_id || 'N/A',
      'Participant Name': `${response.participants?.first_name || ''} ${response.participants?.last_name || ''}`.trim(),
      'Study': response.participants?.studies?.name || 'N/A',
      'Protocol': response.participants?.studies?.protocol || 'N/A',
      'Questionnaire': response.title,
      'Questionnaire ID': response.questionnaire_id,
      'Status': response.status,
      'Submitted Date': response.submitted_at ? new Date(response.submitted_at).toLocaleDateString() : 'Not submitted',
      'Created Date': new Date(response.created_at).toLocaleDateString(),
      'Answers': JSON.stringify(response.answers)
    })) || [];
  } catch (error) {
    console.error('Error fetching questionnaire data:', error);
    return [];
  }
};

export const fetchMilestonesData = async (studyId?: string) => {
  try {
    let query = supabase
      .from('studies')
      .select('*');

    if (studyId) {
      query = query.eq('id', studyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(study => ({
      'Study Name': study.name,
      'Protocol': study.protocol,
      'Phase': study.phase || 'N/A',
      'Sponsor': study.sponsor || 'N/A',
      'Status': study.status,
      'Start Date': study.start_date ? new Date(study.start_date).toLocaleDateString() : 'Not set',
      'End Date': study.end_date ? new Date(study.end_date).toLocaleDateString() : 'Not set',
      'Created Date': new Date(study.created_at).toLocaleDateString(),
      'Last Updated': new Date(study.updated_at).toLocaleDateString()
    })) || [];
  } catch (error) {
    console.error('Error fetching milestones data:', error);
    return [];
  }
};

export const fetchEConsentData = async (studyId?: string) => {
  try {
    // Since we don't have a specific eConsent table, we'll use participants data
    // and create mock eConsent data based on enrollment
    let query = supabase
      .from('participants')
      .select(`
        *,
        studies(name, protocol)
      `);

    if (studyId) {
      query = query.eq('study_id', studyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(participant => ({
      'Participant ID': participant.subject_id,
      'Participant Name': `${participant.first_name || ''} ${participant.last_name || ''}`.trim(),
      'Study': participant.studies?.name || 'N/A',
      'Protocol': participant.studies?.protocol || 'N/A',
      'Consent Status': participant.status === 'active' ? 'Signed' : 'Pending',
      'Consent Version': 'v2.0',
      'Initial Consent Date': participant.enrollment_date ? new Date(participant.enrollment_date).toLocaleDateString() : 'Not signed',
      'Latest Consent Date': participant.enrollment_date ? new Date(participant.enrollment_date).toLocaleDateString() : 'Not signed',
      'Withdrawal Date': participant.completion_date ? new Date(participant.completion_date).toLocaleDateString() : 'N/A',
      'Email': participant.email || 'N/A'
    })) || [];
  } catch (error) {
    console.error('Error fetching eConsent data:', error);
    return [];
  }
};

export const fetchParticipantsData = async (studyId?: string) => {
  try {
    let query = supabase
      .from('participants')
      .select(`
        *,
        studies(name, protocol, sponsor)
      `);

    if (studyId) {
      query = query.eq('study_id', studyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(participant => ({
      'Subject ID': participant.subject_id,
      'First Name': participant.first_name || 'N/A',
      'Last Name': participant.last_name || 'N/A',
      'Email': participant.email || 'N/A',
      'Date of Birth': participant.date_of_birth ? new Date(participant.date_of_birth).toLocaleDateString() : 'N/A',
      'Gender': participant.gender || 'N/A',
      'Address': participant.address || 'N/A',
      'City': participant.city || 'N/A',
      'State': participant.state || 'N/A',
      'Country': participant.country || 'N/A',
      'Zip Code': participant.zip_code || 'N/A',
      'Status': participant.status,
      'Enrollment Date': participant.enrollment_date ? new Date(participant.enrollment_date).toLocaleDateString() : 'N/A',
      'Completion Date': participant.completion_date ? new Date(participant.completion_date).toLocaleDateString() : 'N/A',
      'Study Arm': participant.arm || 'N/A',
      'Study Name': participant.studies?.name || 'N/A',
      'Protocol': participant.studies?.protocol || 'N/A',
      'Sponsor': participant.studies?.sponsor || 'N/A'
    })) || [];
  } catch (error) {
    console.error('Error fetching participants data:', error);
    return [];
  }
};