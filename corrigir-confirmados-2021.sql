-- Corrige a lista de confirmados do time 2021 pra incluir TODO o elenco
-- atual (não só o Koury e o Veiga que tinham sido adicionados nela
-- antes) — evita que o resto do time volte a aparecer como pendente por
-- engano. Cole no SQL Editor do Supabase e rode uma vez.

update app_data
set value = (
  select jsonb_agg(
    case
      when elem->>'nome' = '2021' then
        elem || jsonb_build_object(
          'jogadoresConfirmadosPagos',
          (
            select jsonb_agg(jog->>'id')
            from jsonb_array_elements(elem->'jogadores') jog
          )
        )
      else elem
    end
  )
  from jsonb_array_elements(value) elem
)
where key = 'copasu:teams';
