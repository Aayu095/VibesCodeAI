-- Create site_analytics table for tracking site views and interactions
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES public.published_sites(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'like', 'share', 'comment')),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Site owners can view analytics" ON public.site_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.published_sites 
      WHERE id = site_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics" ON public.site_analytics
  FOR INSERT WITH CHECK (TRUE);

-- Create indexes
CREATE INDEX idx_site_analytics_site_id ON public.site_analytics(site_id);
CREATE INDEX idx_site_analytics_event_type ON public.site_analytics(event_type);
CREATE INDEX idx_site_analytics_created_at ON public.site_analytics(created_at DESC);
