-- Copa de Ex-Alunos de Futsal — Colégio Santa Úrsula
-- Cole isso inteiro no SQL Editor do Supabase (menu lateral > SQL Editor > New query)
-- e clique em "Run". Só precisa rodar uma vez.

create table if not exists app_data (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table app_data enable row level security;

-- Libera leitura e escrita pra quem tiver a chave "anon" do projeto (a
-- mesma chave pública que vai no .env do site). A segurança de quem pode
-- editar o quê continua sendo feita pelo próprio app (login, código do
-- time, senha de organizador) — igual já era antes.
create policy "leitura publica" on app_data for select using (true);
create policy "escrita publica" on app_data for insert with check (true);
create policy "atualizacao publica" on app_data for update using (true);
