-- Métricas: ranking de times mais clicados + exclusão dos cliques do organizador.
-- Cole no SQL Editor do Supabase e rode uma vez.

-- 1) Apaga os cliques de teste/organizador já gravados (ajuste se quiser manter algo).
--    Como o banco não guarda quem clicou, o jeito honesto é zerar os eventos
--    de time e, se quiser, os de aba/clique feitos até agora:
-- delete from app_eventos where tipo = 'clique_time';
-- delete from app_eventos;   -- (opcional) zera TODAS as métricas detalhadas

-- 2) Função atualizada: devolve também 'times'.
create or replace function metricas_detalhadas()
returns json
language plpgsql
security definer
stable
as $$
declare resultado json;
begin
  if not is_admin() then raise exception 'Acesso negado'; end if;
  select json_build_object(
    'cliquesTotais', (select count(*) from app_eventos where tipo = 'clique'),
    'compartilhamentosTotais', (select count(*) from app_eventos where tipo = 'compartilhamento'),
    'abas', (select coalesce(json_agg(x), '[]'::json) from (
      select detalhe as nome, count(*) as total from app_eventos
      where tipo = 'aba' and detalhe is not null group by detalhe order by count(*) desc) x),
    'cliques', (select coalesce(json_agg(x), '[]'::json) from (
      select detalhe as nome, count(*) as total from app_eventos
      where tipo = 'clique' and detalhe is not null group by detalhe order by count(*) desc) x),
    'times', (select coalesce(json_agg(x), '[]'::json) from (
      select detalhe as nome, count(*) as total from app_eventos
      where tipo = 'clique_time' and detalhe is not null group by detalhe order by count(*) desc) x),
    'compartilhamentos', (select coalesce(json_agg(x), '[]'::json) from (
      select detalhe as nome, count(*) as total from app_eventos
      where tipo = 'compartilhamento' and detalhe is not null group by detalhe order by count(*) desc) x),
    'acessosUltimos7Dias', (select coalesce(json_agg(x), '[]'::json) from (
      select to_char(dia, 'DD/MM') as data, total from (
        select date_trunc('day', criado_em) as dia, count(*) as total from app_eventos
        where tipo = 'acesso' and criado_em >= now() - interval '7 days' group by 1) y
      order by dia) x)
  ) into resultado;
  return resultado;
end;
$$;
grant execute on function metricas_detalhadas() to authenticated;
