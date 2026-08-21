-- Copa de Ex-Alunos de Futsal — marcar inscritos como já vistos
-- Cole no SQL Editor do Supabase e rode uma vez (junto com o
-- supabase-aprovado-em.sql, se ainda não rodou aquele).

alter table profiles add column if not exists visualizado boolean not null default false;
