-- Copa de Ex-Alunos de Futsal — Armazenamento de fotos e vídeos
-- Cole no SQL Editor do Supabase e rode uma vez.
-- Gratuito dentro do plano free do Supabase (tem um limite generoso de
-- espaço e tráfego por mês — mais que suficiente pra uma copa como essa).

insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "leitura publica de fotos e videos"
  on storage.objects for select
  using (bucket_id = 'fotos');

create policy "qualquer um pode publicar foto ou video"
  on storage.objects for insert
  with check (bucket_id = 'fotos');
