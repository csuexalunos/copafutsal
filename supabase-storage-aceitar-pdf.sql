-- Permite enviar PDF (regulamento novo) no espaço de arquivos "fotos".
-- Rode no Supabase: SQL Editor > New query > Run.
update storage.buckets
   set allowed_mime_types = null,   -- null = aceita qualquer tipo
       file_size_limit = null       -- ou coloque um limite em bytes
 where id = 'fotos';
