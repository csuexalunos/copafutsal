-- Copa de Ex-Alunos de Futsal — Migração para Supabase Auth
-- Cole isso no SQL Editor do Supabase e rode uma vez. Não apaga a tabela
-- "app_data" antiga (times, jogos, fotos continuam lá) — isso aqui cria só
-- as tabelas novas de conta/login.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  tipo text,               -- 'jogador' | 'torcedor'
  turma text,
  whatsapp text,
  nascimento date,
  status text not null default 'pendente', -- 'pendente' | 'aprovado' | 'recusado'
  criado_em timestamptz not null default now()
);
alter table profiles enable row level security;

create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  super_admin boolean not null default false,
  criado_em timestamptz not null default now()
);
alter table admins enable row level security;

-- Função auxiliar: a pessoa logada agora é admin?
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- profiles: cada um vê/edita o próprio perfil; admin vê/edita qualquer um
create policy "ver proprio perfil ou admin ve todos" on profiles
  for select using (auth.uid() = id or is_admin());
create policy "criar proprio perfil" on profiles
  for insert with check (auth.uid() = id);
create policy "editar proprio perfil ou admin edita qualquer" on profiles
  for update using (auth.uid() = id or is_admin());

-- admins: só admin vê a lista; só super admin adiciona novo admin
create policy "admin ve lista de admins" on admins
  for select using (is_admin());
create policy "super admin adiciona admin" on admins
  for insert with check (
    exists (select 1 from admins a where a.user_id = auth.uid() and a.super_admin = true)
  );

-- ---------------------------------------------------------------------
-- DEPOIS de rodar tudo isso:
-- 1. Vá no site e cadastre csuexalunos@gmail.com pelo formulário normal
--    de Cadastro (isso cria a conta de autenticação).
-- 2. Volte aqui no SQL Editor e rode o comando abaixo pra virar o
--    primeiro super admin (só funciona uma vez, à mão, porque ninguém
--    mais pode se autopromover):
--
-- insert into admins (user_id, email, super_admin)
-- select id, email, true from auth.users where email = 'csuexalunos@gmail.com';
-- ---------------------------------------------------------------------
