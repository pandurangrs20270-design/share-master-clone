-- Consolidated RLS policies for key tables.
-- This migration is idempotent: it only creates a policy if it does not already exist.

DO $$
BEGIN
  --------------------------------------------------------------------
  -- user_roles
  --------------------------------------------------------------------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Admins can view all roles'
  ) THEN
    CREATE POLICY "Admins can view all roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Admins can manage roles'
  ) THEN
    CREATE POLICY "Admins can manage roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  --------------------------------------------------------------------
  -- blogs
  --------------------------------------------------------------------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blogs'
      AND policyname = 'Anyone can view published blogs'
  ) THEN
    CREATE POLICY "Anyone can view published blogs"
    ON public.blogs
    FOR SELECT
    USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blogs'
      AND policyname = 'Admins can view all blogs'
  ) THEN
    CREATE POLICY "Admins can view all blogs"
    ON public.blogs
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blogs'
      AND policyname = 'Admins can create blogs'
  ) THEN
    CREATE POLICY "Admins can create blogs"
    ON public.blogs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blogs'
      AND policyname = 'Admins can update blogs'
  ) THEN
    CREATE POLICY "Admins can update blogs"
    ON public.blogs
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blogs'
      AND policyname = 'Admins can delete blogs'
  ) THEN
    CREATE POLICY "Admins can delete blogs"
    ON public.blogs
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  --------------------------------------------------------------------
  -- syllabus_topics
  --------------------------------------------------------------------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'syllabus_topics'
      AND policyname = 'Anyone can view published syllabus'
  ) THEN
    CREATE POLICY "Anyone can view published syllabus"
    ON public.syllabus_topics
    FOR SELECT
    USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'syllabus_topics'
      AND policyname = 'Admins can view all syllabus'
  ) THEN
    CREATE POLICY "Admins can view all syllabus"
    ON public.syllabus_topics
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'syllabus_topics'
      AND policyname = 'Admins can create syllabus'
  ) THEN
    CREATE POLICY "Admins can create syllabus"
    ON public.syllabus_topics
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'syllabus_topics'
      AND policyname = 'Admins can update syllabus'
  ) THEN
    CREATE POLICY "Admins can update syllabus"
    ON public.syllabus_topics
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'syllabus_topics'
      AND policyname = 'Admins can delete syllabus'
  ) THEN
    CREATE POLICY "Admins can delete syllabus"
    ON public.syllabus_topics
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  --------------------------------------------------------------------
  -- courses
  --------------------------------------------------------------------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'Anyone can view published courses'
  ) THEN
    CREATE POLICY "Anyone can view published courses" 
    ON public.courses 
    FOR SELECT 
    USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'Admins can view all courses'
  ) THEN
    CREATE POLICY "Admins can view all courses" 
    ON public.courses 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'Admins can create courses'
  ) THEN
    CREATE POLICY "Admins can create courses" 
    ON public.courses 
    FOR INSERT 
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'Admins can update courses'
  ) THEN
    CREATE POLICY "Admins can update courses" 
    ON public.courses 
    FOR UPDATE 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'Admins can delete courses'
  ) THEN
    CREATE POLICY "Admins can delete courses" 
    ON public.courses 
    FOR DELETE 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  --------------------------------------------------------------------
  -- testimonials
  --------------------------------------------------------------------
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Anyone can view published testimonials'
  ) THEN
    CREATE POLICY "Anyone can view published testimonials" 
    ON public.testimonials 
    FOR SELECT 
    USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Admins can view all testimonials'
  ) THEN
    CREATE POLICY "Admins can view all testimonials" 
    ON public.testimonials 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Admins can create testimonials'
  ) THEN
    CREATE POLICY "Admins can create testimonials" 
    ON public.testimonials 
    FOR INSERT 
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Admins can update testimonials'
  ) THEN
    CREATE POLICY "Admins can update testimonials" 
    ON public.testimonials 
    FOR UPDATE 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'testimonials'
      AND policyname = 'Admins can delete testimonials'
  ) THEN
    CREATE POLICY "Admins can delete testimonials" 
    ON public.testimonials 
    FOR DELETE 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

END;
$$;

