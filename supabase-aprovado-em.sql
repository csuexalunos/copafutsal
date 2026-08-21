-- Copa de Ex-Alunos de Futsal — data de aprovação como representante
-- Cole no SQL Editor do Supabase e rode uma vez.

alter table profiles add column if not exists aprovado_em timestamptz;
