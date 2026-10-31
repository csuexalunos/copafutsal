-- Impede cadastro repetido: o app pergunta ao banco, ANTES de criar a conta,
-- se já existe alguém com o mesmo nome completo ou o mesmo WhatsApp.
-- A função só responde sim/não (não expõe dados de ninguém).
-- Cole no SQL Editor do Supabase e rode uma vez.

create or replace function norm_nome(t text)
returns text
language sql
immutable
as $$
  select trim(regexp_replace(
    lower(translate(coalesce(t, ''),
      'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
      'aaaaaeeeeiiiiooooouuuucnaaaaaeeeeiiiiooooouuuucn')),
    '\s+', ' ', 'g'));
$$;

create or replace function perfil_duplicado(p_nome text, p_whatsapp text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where coalesce(status, '') <> 'recusado'
      and (
        ( array_length(regexp_split_to_array(norm_nome(p_nome), ' '), 1) >= 2
          and norm_nome(nome) = norm_nome(p_nome) )
        or ( length(regexp_replace(coalesce(p_whatsapp, ''), '\D', '', 'g')) >= 8
             and right(regexp_replace(coalesce(whatsapp, ''), '\D', '', 'g'), 8)
               = right(regexp_replace(p_whatsapp, '\D', '', 'g'), 8) )
      )
  );
$$;

grant execute on function perfil_duplicado(text, text) to anon, authenticated;
