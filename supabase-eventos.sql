-- Copa de Ex-Alunos de Futsal — métricas detalhadas (abas, cliques,
-- compartilhamentos). Cole no SQL Editor do Supabase e rode uma vez.
-- Não mexe na tabela "app_metricas" antiga (o contador simples de
-- acessos continua funcionando do jeito que já estava).

create table if not exists app_eventos (
  id bigserial primary key,
  tipo text not null,       -- 'acesso' | 'aba' | 'clique' | 'compartilhamento'
  detalhe text,              -- nome da aba, do link clicado, ou de onde veio o compartilhamento
  criado_em timestamptz not null default now()
);
create index if not exists app_eventos_tipo_idx on app_eventos (tipo);
create index if not exists app_eventos_criado_em_idx on app_eventos (criado_em);

alter table app_eventos enable row level security;

-- Qualquer visitante pode REGISTRAR um evento (é assim que a métrica é
-- alimentada, mesmo por quem não tem login) — mas ninguém consegue LER a
-- tabela direto por RLS. A leitura só acontece pela função agregada
-- abaixo, que confere se quem chamou é admin por dentro dela mesma.
create policy "qualquer um registra evento" on app_eventos
  for insert with check (true);

create or replace function registrar_evento(p_tipo text, p_detalhe text default null)
returns void
language sql
security definer
as $$
  insert into app_eventos (tipo, detalhe) values (p_tipo, p_detalhe);
$$;
grant execute on function registrar_evento(text, text) to anon, authenticated;

-- Devolve tudo que a aba "Sistema" da Organização precisa, num JSON só:
-- total de cliques, de compartilhamentos, ranking de abas mais acessadas,
-- ranking de links mais clicados, de onde vieram os compartilhamentos e
-- os acessos dos últimos 7 dias (pra um gráfico simples).
create or replace function metricas_detalhadas()
returns json
language plpgsql
security definer
stable
as $$
declare
  resultado json;
begin
  if not is_admin() then
    raise exception 'Acesso negado';
  end if;

  select json_build_object(
    'cliquesTotais', (select count(*) from app_eventos where tipo = 'clique'),
    'compartilhamentosTotais', (select count(*) from app_eventos where tipo = 'compartilhamento'),
    'abas', (
      select coalesce(json_agg(x), '[]'::json) from (
        select detalhe as nome, count(*) as total
        from app_eventos where tipo = 'aba' and detalhe is not null
        group by detalhe order by count(*) desc
      ) x
    ),
    'cliques', (
      select coalesce(json_agg(x), '[]'::json) from (
        select detalhe as nome, count(*) as total
        from app_eventos where tipo = 'clique' and detalhe is not null
        group by detalhe order by count(*) desc
      ) x
    ),
    'compartilhamentos', (
      select coalesce(json_agg(x), '[]'::json) from (
        select detalhe as nome, count(*) as total
        from app_eventos where tipo = 'compartilhamento' and detalhe is not null
        group by detalhe order by count(*) desc
      ) x
    ),
    'acessosUltimos7Dias', (
      select coalesce(json_agg(x), '[]'::json) from (
        select to_char(dia, 'DD/MM') as data, total from (
          select date_trunc('day', criado_em) as dia, count(*) as total
          from app_eventos
          where tipo = 'acesso' and criado_em >= now() - interval '7 days'
          group by 1
        ) y
        order by dia
      ) x
    )
  ) into resultado;

  return resultado;
end;
$$;
grant execute on function metricas_detalhadas() to authenticated;
