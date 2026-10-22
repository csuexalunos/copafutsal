-- Avisos de jogo por notificação push. Rode uma vez no SQL Editor do Supabase.
create table if not exists push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  times text[] not null default '{}',   -- vazio = todos os jogos
  criado_em timestamptz not null default now()
);
alter table push_subscriptions enable row level security;
-- Sem policies: ninguém lê/escreve direto. Só pelas funções abaixo
-- (e pela Edge Function, que usa a chave secreta).

create or replace function salvar_push(p_endpoint text, p_p256dh text, p_auth text, p_times text[] default '{}')
returns void language sql security definer as $$
  insert into push_subscriptions (endpoint, p256dh, auth, times)
  values (p_endpoint, p_p256dh, p_auth, coalesce(p_times, '{}'))
  on conflict (endpoint) do update
    set p256dh = excluded.p256dh, auth = excluded.auth, times = excluded.times;
$$;
grant execute on function salvar_push(text, text, text, text[]) to anon, authenticated;

create or replace function remover_push(p_endpoint text)
returns void language sql security definer as $$
  delete from push_subscriptions where endpoint = p_endpoint;
$$;
grant execute on function remover_push(text) to anon, authenticated;

-- Quantos aparelhos têm os avisos ativos (só admin vê).
create or replace function contar_push() returns bigint language plpgsql security definer stable as $$
begin
  if not is_admin() then raise exception 'Acesso negado'; end if;
  return (select count(*) from push_subscriptions);
end; $$;
grant execute on function contar_push() to authenticated;
