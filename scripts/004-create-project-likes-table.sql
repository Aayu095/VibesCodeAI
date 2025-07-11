-- Create project_likes table for user likes on projects
CREATE TABLE IF NOT EXISTS public.project_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Enable RLS
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own likes" ON public.project_likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes" ON public.project_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.project_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_project_likes_user_id ON public.project_likes(user_id);
CREATE INDEX idx_project_likes_project_id ON public.project_likes(project_id);
