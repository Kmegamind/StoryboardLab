
ALTER TABLE public.structured_shots
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
