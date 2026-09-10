-- Remove o time "2008" que foi inserido por engano direto na tabela de
-- times já inscritos. Cole no SQL Editor do Supabase e rode uma vez.

update app_data
set value = (
  select jsonb_agg(elem)
  from jsonb_array_elements(value) elem
  where elem->>'nome' <> '2008'
)
where key = 'copasu:teams';

delete from cpfs_jogadores where team_id = 'time_1789008654907';
