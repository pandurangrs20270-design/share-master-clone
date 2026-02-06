-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  mode TEXT NOT NULL,
  best_for TEXT,
  description TEXT,
  duration TEXT,
  price TEXT NOT NULL,
  original_price TEXT,
  students_count TEXT DEFAULT '0',
  rating DECIMAL(2,1) DEFAULT 4.5,
  features TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  color_gradient TEXT DEFAULT 'from-blue-500 to-cyan-500',
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Courses RLS policies
CREATE POLICY "Anyone can view published courses" 
ON public.courses 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all courses" 
ON public.courses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update courses" 
ON public.courses 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete courses" 
ON public.courses 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Testimonials RLS policies
CREATE POLICY "Anyone can view published testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all testimonials" 
ON public.testimonials 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials" 
ON public.testimonials 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default courses data
INSERT INTO public.courses (title, subtitle, mode, best_for, description, duration, price, original_price, students_count, rating, features, topics, is_popular, color_gradient, order_index) VALUES
(
  'Online Share Market Training',
  'Daily Batch',
  'Online (Live Classes)',
  'Students, Beginners, Remote Learners',
  'Learn the share market from the comfort of your home with our structured daily online classes.',
  '6-8 Weeks',
  '₹10,000',
  '₹15,000',
  '5000+',
  4.9,
  ARRAY['Daily live online sessions', 'Recorded class access', 'Beginner-friendly teaching', 'Doubt-clearing support'],
  ARRAY['Basics of Stock Market (NSE, BSE)', 'Technical Analysis Fundamentals', 'Chart Reading & Indicators', 'Intraday & Swing Trading', 'Risk & Money Management'],
  false,
  'from-blue-500 to-cyan-500',
  1
),
(
  'Offline Evening Batch',
  'Working Professionals',
  'Offline (Classroom Training)',
  'Working Professionals & Office-Goers',
  'Designed specially for working professionals. Learn trading after office hours with classroom-based learning.',
  '6-8 Weeks',
  '₹15,000',
  '₹20,000',
  '3000+',
  4.8,
  ARRAY['Evening batch timings', 'Classroom learning environment', 'Personal guidance from trainers', 'Ideal for job holders'],
  ARRAY['Stock Market Basics to Advanced', 'Technical Analysis & Indicators', 'Trading Strategies for Part-Time', 'Risk Management & Psychology', 'Live Examples & Case Studies'],
  true,
  'from-primary to-accent',
  2
),
(
  'Live Market Trading Batch',
  'Institute''s Best Program',
  'Offline + Live Market Trading',
  'Serious Traders & Career-Focused Learners',
  'Our most premium batch where students trade live with us during market hours. Real-time learning!',
  '8-10 Weeks',
  '₹25,000',
  '₹35,000',
  '2000+',
  5.0,
  ARRAY['Trade live during market hours', 'Sit with trainers & trade together', 'Real-time decision making', 'Institute''s most recommended batch'],
  ARRAY['Live Market Analysis (Real Trades)', 'Advanced Technical & Price Action', 'Options & Futures Trading', 'Professional Trading Strategies', 'Capital & Risk Management'],
  false,
  'from-orange-500 to-red-500',
  3
);

-- Insert default testimonials data
INSERT INTO public.testimonials (name, role, content, rating, image_url, order_index) VALUES
('Rahul Sharma', 'Software Engineer', 'ShareMaster completely changed my perspective on trading. The practical approach helped me become a confident trader within months. Highly recommend to anyone serious about learning!', 5, 'https://randomuser.me/api/portraits/men/32.jpg', 1),
('Priya Patel', 'Business Owner', 'As a business owner, I was skeptical about trading courses. But ShareMaster''s structured curriculum and expert guidance proved invaluable. Now trading is my second income source!', 5, 'https://randomuser.me/api/portraits/women/44.jpg', 2),
('Amit Kumar', 'Bank Manager', 'The live market sessions were game-changers for me. Learning to trade alongside experts gave me the confidence I needed. Best investment I made in my education!', 5, 'https://randomuser.me/api/portraits/men/52.jpg', 3),
('Sneha Desai', 'Homemaker', 'I joined ShareMaster to achieve financial independence. The flexible online classes fit perfectly with my schedule. Today, I proudly manage my family''s investments!', 5, 'https://randomuser.me/api/portraits/women/65.jpg', 4),
('Vikram Singh', 'Retired Professional', 'Post-retirement, I wanted to grow my savings. ShareMaster taught me safe trading strategies. Their lifetime support is truly exceptional!', 5, 'https://randomuser.me/api/portraits/men/67.jpg', 5),
('Ananya Joshi', 'College Student', 'Started learning while still in college. The beginner-friendly approach helped me understand complex concepts easily. Now I trade part-time and earn while I learn!', 5, 'https://randomuser.me/api/portraits/women/28.jpg', 6);