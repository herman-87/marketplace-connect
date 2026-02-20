
-- Create order messages table
CREATE TABLE public.order_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('client', 'business')),
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to read/write messages (will refine later with proper user/business mapping)
CREATE POLICY "Authenticated users can read order messages"
  ON public.order_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order messages"
  ON public.order_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;

-- Index for fast lookup by order
CREATE INDEX idx_order_messages_order_id ON public.order_messages (order_id);
CREATE INDEX idx_order_messages_created_at ON public.order_messages (order_id, created_at);
