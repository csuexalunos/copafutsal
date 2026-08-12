-- Copa de Ex-Alunos de Futsal — Fotos/vídeos só para quem tem login
-- Cole no SQL Editor do Supabase e rode. Se você já rodou o
-- "supabase-storage-setup.sql" antigo antes, pode rodar este por cima —
-- ele corrige as permissões sem apagar nenhuma foto já publicada.

-- Torna o bucket privado (deixa de existir link público fixo)
update storage.buckets set public = false where id = 'fotos';

-- Remove as regras antigas (abertas pra qualquer um)
drop policy if exists "leitura publica de fotos e videos" on storage.objects;
drop policy if exists "qualquer um pode publicar foto ou video" on storage.objects;

-- Só quem está logado (qualquer conta autenticada) pode ver ou publicar
create policy "leitura so pra quem tem login"
  on storage.objects for select
  using (bucket_id = 'fotos' and auth.role() = 'authenticated');

create policy "upload so pra quem tem login"
  on storage.objects for insert
  with check (bucket_id = 'fotos' and auth.role() = 'authenticated');
