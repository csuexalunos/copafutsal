-- Garante que os CPFs do time 2014 estão certos na tabela protegida
-- (pra pré-preencher quando o representante escolher essa turma na
-- Inscrição). Remove qualquer coisa que já exista pra "2014" antes, pra
-- não duplicar, e recoloca os 11 jogadores certos. Cole no SQL Editor do
-- Supabase e rode.

delete from elenco_historico where turma = '2014';

insert into elenco_historico (turma, apelido, nome, cpf) values
  ('2014', 'Bicuddo', 'LUCAS ALVES VIEIRA DE SOUZA', '121.498.814-89'),
  ('2014', 'Negão', 'MATEUS HENRIQUE DO NASCIMENTO ROCHA', '110.664.694-07'),
  ('2014', 'Brunno', 'BRUNNO CORADIN ZIERO', '076.264.084-70'),
  ('2014', 'Davi', 'DAVI FERNANDES BRANDÃO DE ALMEIDA', '105.379.494-02'),
  ('2014', 'Joca', 'JOÃO AUGUSTO DE CASTRO SILVA FILHO', '084.766.204-70'),
  ('2014', 'Cuiabá', 'VINICIUS MORAES CARDOSO', '120.983.254-28'),
  ('2014', 'Iury', 'IURY SIMÕES DE FRANÇA ALMEIDA', '069.776.094-43'),
  ('2014', 'Lebrão', 'RAPHAEL PEREIRA LEBRE', '055.284.444-62'),
  ('2014', 'Lira', 'ARTHUR DE SOUSA LIRA', '106.889.154-85'),
  ('2014', 'Léo', 'LEONARDO RAMOS PIMENTEL SANTANA', '085.056.934-69');
