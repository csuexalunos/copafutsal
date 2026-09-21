-- Marca Koury e Veiga (time 2021) como pagos, juntando os ids deles na
-- lista de jogadores já confirmados (sem duplicar quem já estava lá).
-- Cole no SQL Editor do Supabase e rode uma vez.

update app_data
set value = (
  select jsonb_agg(
    case
      when elem->>'nome' = '2021' then
        elem || jsonb_build_object(
          'jogadoresConfirmadosPagos',
          (
            select jsonb_agg(distinct v)
            from (
              select jsonb_array_elements_text(coalesce(elem->'jogadoresConfirmadosPagos', '[]'::jsonb)) as v
              union
              select jog->>'id'
              from jsonb_array_elements(elem->'jogadores') jog
              where lower(jog->>'apelido') in ('koury', 'veiga')
            ) x
          )
        )
      else elem
    end
  )
  from jsonb_array_elements(value) elem
)
where key = 'copasu:teams';
