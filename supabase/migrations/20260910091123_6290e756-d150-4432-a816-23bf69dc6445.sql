CREATE TABLE public.business_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX business_tags_unique_name ON public.business_tags (business_id, lower(name));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_tags TO authenticated;
GRANT SELECT ON public.business_tags TO anon;
GRANT ALL ON public.business_tags TO service_role;

ALTER TABLE public.business_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read business tags" ON public.business_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create business tags" ON public.business_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update business tags" ON public.business_tags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete business tags" ON public.business_tags FOR DELETE TO authenticated USING (true);

CREATE TABLE public.product_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  tag_id UUID NOT NULL REFERENCES public.business_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX product_tags_unique ON public.product_tags (product_id, tag_id);
CREATE INDEX product_tags_business_idx ON public.product_tags (business_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_tags TO authenticated;
GRANT SELECT ON public.product_tags TO anon;
GRANT ALL ON public.product_tags TO service_role;

ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product tags" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create product tags" ON public.product_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete product tags" ON public.product_tags FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_business_tags_updated_at
BEFORE UPDATE ON public.business_tags
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();