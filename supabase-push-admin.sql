-- Avisos da organização por push. Rode uma vez no SQL Editor do Supabase
-- (depois do supabase-push.sql).
alter table push_subscriptions add column if not exists admin boolean not null default false;

-- Só admin registra o aparelho como "da organização". Esse aparelho NÃO
-- recebe os avisos de início de jogo (times = sentinela), só os da organização.
create or replace function salvar_push_admin(p_endpoint text, p_p256dh text, p_auth text)
returns void language plpgsql security definer as $$
begin
  if not is_admin() then raise exception 'Acesso negado'; end if;
  insert into push_subscriptions (endpoint, p256dh, auth, times, admin)
  values (p_endpoint, p_p256dh, p_auth, array['__nenhum__'], true)
  on conflict (endpoint) do update set p256dh = excluded.p256dh, auth = excluded.auth, admin = true;
end; $$;
grant execute on function salvar_push_admin(text, text, text) to authenticated;
