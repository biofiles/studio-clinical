-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  user_id UUID,
  activity_type TEXT,
  details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.user_activity_log (user_id, activity_type, details)
  VALUES (user_id, activity_type, details);
$$;

-- RLS Policies for user_invitations
CREATE POLICY "CRO sponsors and admins can manage invitations"
  ON public.user_invitations FOR ALL
  USING (
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can view invitations they sent"
  ON public.user_invitations FOR SELECT
  USING (invited_by = auth.uid());

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their own activity"
  ON public.user_activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "CRO sponsors and admins can view all activity"
  ON public.user_activity_log FOR SELECT
  USING (
    public.has_role(auth.uid(), 'cro_sponsor') OR
    public.has_role(auth.uid(), 'admin')
  );