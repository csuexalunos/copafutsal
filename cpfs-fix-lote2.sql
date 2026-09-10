-- Corrige 4 CPFs que estavam com 10 dígitos na planilha original — o
-- Excel apagou o zero da frente ao converter pra número. Validei os 4
-- com o algoritmo oficial de checagem do CPF antes de confirmar. Cole no
-- SQL Editor do Supabase e rode.

delete from elenco_historico
  where (turma, apelido) in (
    ('2022.1', 'Eugênio'),
    ('2022.1', 'Assis'),
    ('2020', 'Bernardo'),
    ('2020', 'Dudu')
  );

insert into elenco_historico (turma, apelido, nome, cpf) values
  ('2022.1', 'Eugênio', 'Luiz Eugênio Duarte Santos', '080.589.064-50'),
  ('2022.1', 'Assis', 'Pedro Assis leite nobre', '094.821.154-73'),
  ('2020', 'Bernardo', 'Bernardo Torres de Souza', '088.191.974-80'),
  ('2020', 'Dudu', 'EDUARDO LARANJEIRA LEAHY', '058.478.434-10');
