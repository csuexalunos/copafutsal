-- Marca os jogadores Koury e Veiga (adicionados ao time 2021 depois do
-- pagamento inicial) como cobrados no Lote 2. Cole no SQL Editor do
-- Supabase e rode uma vez.

update app_data
set value = (
  select jsonb_agg(
    case
      when elem->>'nome' = '2021' then
        jsonb_set(
          elem,
          '{jogadores}',
          (
            select jsonb_agg(
              case
                when lower(jog->>'apelido') in ('koury', 'veiga') then jog || '{"loteContratado": "Lote 2"}'::jsonb
                else jog
              end
            )
            from jsonb_array_elements(elem->'jogadores') jog
          )
        )
      else elem
    end
  )
  from jsonb_array_elements(value) elem
)
where key = 'copasu:teams';
