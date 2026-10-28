-- Banco de atletas + trava de CPF repetido. Cole no SQL Editor do Supabase e rode uma vez.

create table if not exists atletas (
  cpf text primary key,            -- só dígitos
  nome text not null,
  apelido text,
  nascimento text,
  periodo text,
  ano_conclusao text,
  turma text,                      -- último time/turma conhecido
  atualizado_em timestamptz not null default now()
);
alter table atletas enable row level security;
drop policy if exists "atletas leitura login" on atletas;
create policy "atletas leitura login" on atletas for select using (auth.role() = 'authenticated');
drop policy if exists "atletas insert login" on atletas;
create policy "atletas insert login" on atletas for insert with check (auth.role() = 'authenticated');
drop policy if exists "atletas update login" on atletas;
create policy "atletas update login" on atletas for update using (auth.role() = 'authenticated');

-- Quais destes CPFs já estão em OUTRO time? (o representante não pode ler os CPFs
-- dos outros times, então a checagem roda por dentro do banco e devolve só o time.)
create or replace function cpfs_em_outros_times(p_team_id text, p_cpfs text[])
returns table(cpf text, team_id text)
language sql security definer set search_path = public as $$
  select regexp_replace(c.cpf, '\D', '', 'g') as cpf, c.team_id
  from cpfs_jogadores c
  where auth.role() = 'authenticated'
    and c.team_id <> p_team_id
    and regexp_replace(c.cpf, '\D', '', 'g') = any (select regexp_replace(x, '\D', '', 'g') from unnest(p_cpfs) x);
$$;
grant execute on function cpfs_em_outros_times(text, text[]) to authenticated;
