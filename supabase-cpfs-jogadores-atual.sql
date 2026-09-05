-- Copa de Ex-Alunos de Futsal — CPFs dos jogadores inscritos (edição atual)
-- Cole no SQL Editor do Supabase e rode uma vez.
--
-- Por quê: o CPF NUNCA deve ficar guardado dentro do registro do time em
-- `app_data` (chave "copasu:teams"), porque essa tabela tem leitura pública
-- liberada pra qualquer pessoa (é assim que o site consegue mostrar times,
-- jogos e classificação sem exigir login). Um CPF ali dentro fica exposto
-- pra qualquer um que consulte a API do Supabase diretamente, mesmo sem
-- estar logado no site.
--
-- Esta tabela nova guarda CPF separado, ligado ao time e ao jogador pelos
-- IDs internos, com leitura restrita a quem tem login — igual já era feito
-- com `elenco_historico`.

create table if not exists cpfs_jogadores (
  team_id text not null,
  jogador_id text not null,
  cpf text not null,
  atualizado_em timestamptz not null default now(),
  primary key (team_id, jogador_id)
);

alter table cpfs_jogadores enable row level security;

drop policy if exists "leitura so pra quem tem login" on cpfs_jogadores;
create policy "leitura so pra quem tem login" on cpfs_jogadores
  for select using (auth.role() = 'authenticated');

drop policy if exists "escrita so pra quem tem login" on cpfs_jogadores;
create policy "escrita so pra quem tem login" on cpfs_jogadores
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "atualizacao so pra quem tem login" on cpfs_jogadores;
create policy "atualizacao so pra quem tem login" on cpfs_jogadores
  for update using (auth.role() = 'authenticated');

drop policy if exists "delecao so pra quem tem login" on cpfs_jogadores;
create policy "delecao so pra quem tem login" on cpfs_jogadores
  for delete using (auth.role() = 'authenticated');
