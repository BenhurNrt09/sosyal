-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  platform_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  task_type_name TEXT NOT NULL,
  link TEXT NOT NULL,
  account_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  assigned_to UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_platform ON public.tasks(platform);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (for now - no auth required)
DROP POLICY IF EXISTS "Enable all access for tasks" ON public.tasks;
CREATE POLICY "Enable all access for tasks" ON public.tasks
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
