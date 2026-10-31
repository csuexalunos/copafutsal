-- Marca quem já recebeu o e-mail de boas-vindas (evita enviar duas vezes).
-- Cole no SQL Editor do Supabase e rode uma vez.
alter table profiles add column if not exists boas_vindas_em timestamptz;
