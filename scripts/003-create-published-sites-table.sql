-- Create published_sites table
CREATE TABLE IF NOT EXISTS public.published_sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  site_content TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.published_sites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own published sites" ON public.published_sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public published sites" ON public.published_sites
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert own published sites" ON public.published_sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own published sites" ON public.published_sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own published sites" ON public.published_sites
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_published_sites_updated_at BEFORE UPDATE ON public.published_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_published_sites_user_id ON public.published_sites(user_id);
CREATE INDEX idx_published_sites_slug ON public.published_sites(slug);
CREATE INDEX idx_published_sites_is_public ON public.published_sites(is_public);
CREATE INDEX idx_published_sites_published_at ON public.published_sites(published_at DESC);
