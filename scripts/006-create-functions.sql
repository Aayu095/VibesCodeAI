-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_downloads(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.projects 
  SET downloads_count = downloads_count + 1 
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update project likes count
CREATE OR REPLACE FUNCTION update_project_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for project likes count
CREATE TRIGGER update_project_likes_count_trigger
  AFTER INSERT OR DELETE ON public.project_likes
  FOR EACH ROW EXECUTE FUNCTION update_project_likes_count();

-- Function to get user's project statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_projects', COUNT(*),
    'public_projects', COUNT(*) FILTER (WHERE is_public = true),
    'templates', COUNT(*) FILTER (WHERE is_template = true),
    'total_downloads', COALESCE(SUM(downloads_count), 0),
    'total_likes', COALESCE(SUM(likes_count), 0)
  ) INTO result
  FROM public.projects
  WHERE user_id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
