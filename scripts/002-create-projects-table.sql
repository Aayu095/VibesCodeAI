-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  files JSONB NOT NULL DEFAULT '[]',
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  template_category TEXT,
  template_tags TEXT[] DEFAULT '{}',
  template_difficulty TEXT CHECK (template_difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  downloads_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" ON public.projects
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_is_public ON public.projects(is_public);
CREATE INDEX idx_projects_is_template ON public.projects(is_template);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
