-- Create optimized role fetching function
CREATE OR REPLACE FUNCTION public.get_user_role_fast(check_user_id uuid, check_study_id uuid DEFAULT NULL::uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = check_user_id 
    AND (check_study_id IS NULL OR study_id = check_study_id OR study_id IS NULL)
  LIMIT 1;
$function$;

-- Create index to speed up user role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_study ON public.user_roles(user_id, study_id);