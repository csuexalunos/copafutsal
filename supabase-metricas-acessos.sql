-- Copa de Ex-Alunos de Futsal — contador de acessos ao app
-- Cole no SQL Editor do Supabase e rode uma vez.

create table if not exists app_metricas (
  chave text primary key,
  valor bigint not null default 0
);
insert into app_metricas (chave, valor) values ('acessos', 0)
on conflict (chave) do nothing;

-- Soma 1 de cada vez que alguém abre o app — devolve o total já atualizado.
create or replace function incrementar_acesso()
returns bigint
language sql
security definer
as $$
  update app_metricas set valor = valor + 1 where chave = 'acessos'
  returning valor;
$$;
grant execute on function incrementar_acesso() to anon, authenticated;

-- Só lê o total, sem somar — usado pra mostrar a métrica na Organização.
create or replace function contar_acessos()
returns bigint
language sql
security definer
stable
as $$
  select valor from app_metricas where chave = 'acessos';
$$;
grant execute on function contar_acessos() to anon, authenticated;
