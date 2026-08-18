-- Copa de Ex-Alunos de Futsal — Contagem pública de pessoas cadastradas
-- Cole no SQL Editor do Supabase e rode uma vez.
-- Isso NÃO expõe nenhum dado de ninguém — só devolve um número, pra
-- mostrar "X pessoas já inscritas" na página inicial pra todo mundo,
-- mesmo sem estar logado como admin (a tabela profiles continua
-- protegida, só esse número específico fica público).

create or replace function contar_perfis()
returns integer
language sql
security definer
stable
as $$
  select count(*)::integer from profiles;
$$;

grant execute on function contar_perfis() to anon, authenticated;
