-- Permite que admins excluam cadastros (inscritos) na aba Organização → Pessoas.
-- Rode uma vez no SQL Editor do Supabase.
drop policy if exists "admin exclui perfil" on profiles;
create policy "admin exclui perfil" on profiles
  for delete using (is_admin());
