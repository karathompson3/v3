
-- Create a table for daily chat logs
CREATE TABLE public.daily_chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create a table for chat messages within each daily log
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_log_id UUID REFERENCES public.daily_chat_logs(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reflection_captured BOOLEAN DEFAULT FALSE
);

-- Add Row Level Security (RLS) for daily_chat_logs
ALTER TABLE public.daily_chat_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_chat_logs
CREATE POLICY "Users can view their own daily logs" 
  ON public.daily_chat_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily logs" 
  ON public.daily_chat_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily logs" 
  ON public.daily_chat_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily logs" 
  ON public.daily_chat_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view messages from their daily logs" 
  ON public.chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_chat_logs 
      WHERE id = daily_log_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their daily logs" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.daily_chat_logs 
      WHERE id = daily_log_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their daily logs" 
  ON public.chat_messages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_chat_logs 
      WHERE id = daily_log_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their daily logs" 
  ON public.chat_messages 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_chat_logs 
      WHERE id = daily_log_id AND user_id = auth.uid()
    )
  );

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update the updated_at column
CREATE TRIGGER update_daily_chat_logs_updated_at 
    BEFORE UPDATE ON public.daily_chat_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
