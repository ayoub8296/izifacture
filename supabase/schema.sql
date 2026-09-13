-- ==============================================================================
-- 🚀 IZI FACTURE — SCHEMA SQL SUPABASE / POSTGRESQL
-- ==============================================================================

-- 1. TABLE ENTREPRISE
CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  ncc TEXT,
  rc TEXT,
  bank_info TEXT,
  default_tva_rate NUMERIC DEFAULT 18,
  currency TEXT DEFAULT 'FCFA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  company_name TEXT NOT NULL,
  ncc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE FACTURES
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
  client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tva_rate NUMERIC NOT NULL DEFAULT 18,
  tva_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE LIGNES DE FACTURE
CREATE TABLE IF NOT EXISTS public.invoice_line_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  order_index INTEGER DEFAULT 0
);

-- 5. TABLE DEVIS
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
  client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  quote_number TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  validity_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tva_rate NUMERIC NOT NULL DEFAULT 18,
  tva_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE LIGNES DE DEVIS
CREATE TABLE IF NOT EXISTS public.quote_line_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  order_index INTEGER DEFAULT 0
);

-- Index pour les performances de recherche et tri
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON public.invoice_line_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON public.quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON public.quote_line_items(quote_id);

-- Politiques RLS (Row Level Security)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on companies') THEN
    CREATE POLICY "Allow all operations on companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on clients') THEN
    CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on invoices') THEN
    CREATE POLICY "Allow all operations on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on invoice_line_items') THEN
    CREATE POLICY "Allow all operations on invoice_line_items" ON public.invoice_line_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on quotes') THEN
    CREATE POLICY "Allow all operations on quotes" ON public.quotes FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on quote_line_items') THEN
    CREATE POLICY "Allow all operations on quote_line_items" ON public.quote_line_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
