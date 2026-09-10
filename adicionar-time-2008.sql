-- Adiciona o time 2008 direto no banco, com o mesmo formato dos times
-- já cadastrados pelo app. Cole no SQL Editor do Supabase e rode uma vez.

update app_data
set value = value || '[{"id": "time_1789008654907", "nome": "2008", "capitao": "Hugo Torres Melo", "contato": "(82) 98818-0186", "jogadores": [{"id": "j_1789008654907_0", "numero": 23, "apelido": "Torres", "nome": "Hugo Torres Melo", "periodo": "2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_1", "numero": 11, "apelido": "Pipeta", "nome": "Erico Albuquerque", "periodo": "1997-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_2", "numero": 9, "apelido": "Hugo Victor", "nome": "Hugo Victor Matias", "periodo": "1997-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_3", "numero": 14, "apelido": "Wagueta", "nome": "Wagner Ferreira de Oliveira", "periodo": "1996-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_4", "numero": 15, "apelido": "Marcus", "nome": "Marcus Pinheiro", "periodo": "1999-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_5", "numero": 6, "apelido": "Elton", "nome": "Elton Brandão", "periodo": "1997-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_6", "numero": 5, "apelido": "Kevanga", "nome": "Kevin Sá", "periodo": "2002-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_7", "numero": 8, "apelido": "Thiago", "nome": "Thiago Félix", "periodo": "2002-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_8", "numero": 7, "apelido": "Vini", "nome": "Vinicius Gouveia", "periodo": "2002-2008", "anoConclusao": "2008"}, {"id": "j_1789008654907_9", "numero": 12, "apelido": "Will", "nome": "William Salles Pinheiro", "periodo": "2000-2007", "anoConclusao": "2011"}, {"id": "j_1789008654907_10", "numero": 10, "apelido": "Dedel", "nome": "Fidel Dias de Melo Gomes", "periodo": "2006-2008", "anoConclusao": "2008"}], "codigo": "4922", "inscritoEm": "2026-09-09T12:00:00.000Z"}]'::jsonb
where key = 'copasu:teams';

insert into cpfs_jogadores (team_id, jogador_id, cpf, atualizado_em) values

  ('time_1789008654907', 'j_1789008654907_0', '085.369.564-45', now()),
  ('time_1789008654907', 'j_1789008654907_1', '084.644.254-06', now()),
  ('time_1789008654907', 'j_1789008654907_2', '071.022.444-36', now()),
  ('time_1789008654907', 'j_1789008654907_3', '063.769.994-76', now()),
  ('time_1789008654907', 'j_1789008654907_4', '085.158.664-39', now()),
  ('time_1789008654907', 'j_1789008654907_5', '074.430.154-88', now()),
  ('time_1789008654907', 'j_1789008654907_6', '048.537.554-03', now()),
  ('time_1789008654907', 'j_1789008654907_7', '068.315.734-52', now()),
  ('time_1789008654907', 'j_1789008654907_8', '046.513.544-75', now()),
  ('time_1789008654907', 'j_1789008654907_9', '109.865.194-48', now()),
  ('time_1789008654907', 'j_1789008654907_10', '046.360.244-78', now())
on conflict (team_id, jogador_id) do update set cpf = excluded.cpf, atualizado_em = excluded.atualizado_em;
