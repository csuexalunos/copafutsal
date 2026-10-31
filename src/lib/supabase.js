import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Faltam VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY. Configure o arquivo .env antes de rodar/publicar."
  );
}

export const supabase = createClient(url, anonKey);

// A tabela app_data guarda um "documento" JSON por chave — o mesmo formato
// que o app já usava no armazenamento do artifact, então o resto do app
// (App.jsx) não precisa mudar quase nada, só estas duas funções.

export async function readKey(key) {
  const { data, error } = await supabase.from("app_data").select("value").eq("key", key).maybeSingle();
  if (error) throw error;
  return data ? data.value : null;
}

// Só o carimbo de atualização (poucos bytes) — o app consulta isso a cada ciclo
// e só baixa o valor inteiro quando mudou. Economiza muito tráfego (egress).
export async function readStamp(key) {
  const { data, error } = await supabase.from("app_data").select("updated_at").eq("key", key).maybeSingle();
  if (error) throw error;
  return data ? data.updated_at : null;
}

export async function writeKey(key, value) {
  const { error } = await supabase.from("app_data").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// ---------------------------------------------------------------------
// Autenticação de verdade (Supabase Auth) — substitui o login caseiro.
// ---------------------------------------------------------------------

export async function cadastrarConta(email, senha) {
  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  if (error) throw error;
  // Com confirmação de e-mail ligada, o Supabase não dá erro pra e-mail já usado:
  // devolve um usuário "fantasma" sem identidades. Tratamos como cadastro repetido.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error("User already registered");
  }
  return data.user;
}

// Pergunta ao banco se já existe cadastro com o mesmo nome completo ou WhatsApp.
// Se a função ainda não foi criada no Supabase, não bloqueia o cadastro.
export async function cadastroDuplicado(nome, whatsapp) {
  try {
    const { data, error } = await supabase.rpc("perfil_duplicado", { p_nome: nome || "", p_whatsapp: whatsapp || "" });
    if (error) return false;
    return data === true;
  } catch (e) {
    return false;
  }
}

export async function entrarConta(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  return data.user;
}

export async function sairConta() {
  await supabase.auth.signOut();
}

export async function sessaoAtual() {
  const { data } = await supabase.auth.getSession();
  return data.session ? data.session.user : null;
}

export function aoMudarSessao(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session ? session.user : null, event);
  });
  return () => data.subscription.unsubscribe();
}

export async function esqueciSenha(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname,
  });
  if (error) throw error;
}

export async function definirNovaSenha(novaSenha) {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
}

export async function criarPerfil(userId, perfil) {
  let { error } = await supabase.from("profiles").insert({ id: userId, ...perfil });
  // Se a coluna "torce_turma" ainda não foi criada no Supabase, salva sem ela (o cadastro não pode falhar).
  if (error && /torce_turma/i.test(error.message || "") && "torce_turma" in perfil) {
    const { torce_turma, ...semTorce } = perfil;
    ({ error } = await supabase.from("profiles").insert({ id: userId, ...semTorce }));
  }
  if (error) throw error;
}

// E-mail de boas-vindas (função "boas-vindas" no Supabase). Segura pra chamar
// várias vezes: o servidor só envia uma vez por pessoa e só pra cadastros novos.
export function enviarBoasVindas() {
  return supabase.functions.invoke("boas-vindas", { body: {} }).catch((e) => console.error("Boas-vindas", e));
}

const CORTE_BOAS_VINDAS = new Date("2026-10-30T00:00:00Z");

export async function buscarPerfil(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  // Quem confirmou o e-mail depois do cadastro (sem sessão na hora) recebe no primeiro login.
  if (data && !data.boas_vindas_em && data.criado_em && new Date(data.criado_em) >= CORTE_BOAS_VINDAS) {
    enviarBoasVindas();
  }
  return data;
}

export async function listarPerfis() {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data || [];
}

export async function atualizarPerfil(userId, campos) {
  const { error } = await supabase.from("profiles").update(campos).eq("id", userId);
  if (error) throw error;
}

// Igual atualizarPerfil, mas confirma que alguma linha foi mesmo alterada
// (uma política do banco pode "aceitar" o update sem alterar nada).
export async function atualizarPerfilConfirmado(userId, campos) {
  const { data, error } = await supabase.from("profiles").update(campos).eq("id", userId).select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("O banco não alterou o cadastro (sem permissão ou cadastro não encontrado).");
}

export async function souAdmin(userId) {
  const { data, error } = await supabase.from("admins").select("super_admin, escopo").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data
    ? { admin: true, superAdmin: !!data.super_admin, escopo: data.escopo || "completo" }
    : { admin: false, superAdmin: false, escopo: null };
}

export async function listarAdmins() {
  const { data, error } = await supabase.from("admins").select("*");
  if (error) throw error;
  return data || [];
}

// escopo: 'completo' (acesso total à Organização) ou 'jogos' (só
// atualizar jogos/placar ao vivo — não vê inscritos, pagamentos, CPFs etc).
export async function promoverParaAdmin(userId, email, escopo = "completo") {
  const { error } = await supabase.from("admins").insert({ user_id: userId, email, super_admin: false, escopo });
  if (error) throw error;
}

export async function removerAdmin(userId) {
  const { error } = await supabase.from("admins").delete().eq("user_id", userId);
  if (error) throw error;
}

// ---------------------------------------------------------------------
// Armazenamento de fotos e vídeos (Supabase Storage) — bucket PRIVADO:
// só quem tem login consegue subir ou ver. Como não é mais público, não
// existe link fixo — cada exibição pede um link temporário (assinado),
// válido só por um tempo.
// ---------------------------------------------------------------------

export async function subirArquivo(blob, nomeArquivo, contentType) {
  const caminho = `${Date.now()}_${nomeArquivo.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("fotos").upload(caminho, blob, {
    contentType: contentType || blob.type,
    upsert: false,
  });
  if (error) throw error;
  return caminho; // guarda só o caminho — o link é gerado na hora de exibir
}

export async function urlAssinada(caminho, expiraEmSegundos = 3600) {
  if (!caminho) return null;
  const { data, error } = await supabase.storage.from("fotos").createSignedUrl(caminho, expiraEmSegundos);
  if (error) throw error;
  return data.signedUrl;
}

// Contagem pública de pessoas cadastradas (só o número, sem expor dados
// de ninguém) — pra mostrar na página inicial.
export async function contarPessoasInscritas() {
  const { data, error } = await supabase.rpc("contar_perfis");
  if (error) throw error;
  return data || 0;
}

// CPFs do elenco histórico — tabela protegida (só quem tem login
// consegue ler). Devolve um mapa apelido -> cpf pra completar o
// formulário sem precisar guardar CPF no código público do site.
export async function buscarCpfsDaTurma(turma) {
  const { data, error } = await supabase.from("elenco_historico").select("apelido, nome, cpf").eq("turma", turma);
  if (error) throw error;
  const mapa = {};
  (data || []).forEach((row) => {
    if (row.apelido) mapa[row.apelido] = row.cpf;
    if (row.nome) mapa[row.nome] = row.cpf;
  });
  return mapa;
}

// ---------------------------------------------------------------------------
// CPF dos jogadores da edição atual — guardado numa tabela separada e
// protegida (cpfs_jogadores), NUNCA dentro do registro do time em
// `app_data` (essa é lida publicamente por qualquer visitante do site,
// sem login). Ligado ao time e ao jogador pelos IDs internos.
// ---------------------------------------------------------------------------
export async function buscarCpfsDoTime(teamId) {
  const { data, error } = await supabase.from("cpfs_jogadores").select("jogador_id, cpf").eq("team_id", teamId);
  if (error) throw error;
  const mapa = {};
  (data || []).forEach((row) => {
    mapa[row.jogador_id] = row.cpf;
  });
  return mapa;
}

export async function salvarCpfJogador(teamId, jogadorId, cpf) {
  if (!cpf) {
    const { error } = await supabase
      .from("cpfs_jogadores")
      .delete()
      .eq("team_id", teamId)
      .eq("jogador_id", jogadorId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase
    .from("cpfs_jogadores")
    .upsert({ team_id: teamId, jogador_id: jogadorId, cpf, atualizado_em: new Date().toISOString() });
  if (error) throw error;
}

export async function salvarCpfsEmLote(linhas) {
  // linhas: [{ team_id, jogador_id, cpf }]
  if (!linhas || linhas.length === 0) return;
  const comCarimbo = linhas.map((l) => ({ ...l, atualizado_em: new Date().toISOString() }));
  const { error } = await supabase.from("cpfs_jogadores").upsert(comCarimbo);
  if (error) throw error;
}

export async function excluirCpfsDoJogador(jogadorIds) {
  if (!jogadorIds || jogadorIds.length === 0) return;
  const { error } = await supabase.from("cpfs_jogadores").delete().in("jogador_id", jogadorIds);
  if (error) throw error;
}

// Métricas simples de acesso ao app.
export async function registrarAcesso() {
  const { error } = await supabase.rpc("incrementar_acesso");
  if (error) throw error;
}
export async function contarAcessos() {
  const { data, error } = await supabase.rpc("contar_acessos");
  if (error) throw error;
  return data || 0;
}

// Métricas detalhadas — abas mais acessadas, links mais clicados e
// compartilhamentos. "registrarEvento" é chamado por qualquer visitante
// (sem precisar de login); "buscarMetricasDetalhadas" só funciona pra
// quem é admin (a função no banco confere isso por dentro dela mesma).
export async function registrarEvento(tipo, detalhe) {
  const { error } = await supabase.rpc("registrar_evento", { p_tipo: tipo, p_detalhe: detalhe || null });
  if (error) throw error;
}

export async function buscarMetricasDetalhadas() {
  const { data, error } = await supabase.rpc("metricas_detalhadas");
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Banco de atletas (tabela `atletas`, protegida) — todo atleta já cadastrado,
// pra preencher rápido nas próximas inscrições. E checagem de CPF repetido.
// ---------------------------------------------------------------------------
const soDigitos = (v) => String(v || "").replace(/\D/g, "");

export async function buscarAtletas() {
  const { data, error } = await supabase.from("atletas").select("cpf, nome, apelido, nascimento, periodo, ano_conclusao, turma").limit(5000);
  if (error) throw error;
  return data || [];
}

export async function salvarAtletas(lista, turma) {
  // lista: jogadores com cpf (nome, apelido, nascimento, periodo, anoConclusao)
  const mapa = new Map();
  (lista || []).forEach((j) => {
    const cpf = soDigitos(j.cpf);
    if (cpf.length !== 11 || !j.nome) return;
    mapa.set(cpf, {
      cpf,
      nome: j.nome,
      apelido: j.apelido || null,
      nascimento: j.nascimento || null,
      periodo: j.periodo || null,
      ano_conclusao: j.anoConclusao != null ? String(j.anoConclusao) : null,
      turma: j.turma || turma || null,
      atualizado_em: new Date().toISOString(),
    });
  });
  if (mapa.size === 0) return;
  const { error } = await supabase.from("atletas").upsert(Array.from(mapa.values()));
  if (error) throw error;
}

// CPFs que já estão em OUTRO time: devolve [{cpf, team_id}].
export async function cpfsEmOutrosTimes(teamId, cpfs) {
  const lista = (cpfs || []).map(soDigitos).filter((c) => c.length === 11);
  if (lista.length === 0) return [];
  const { data, error } = await supabase.rpc("cpfs_em_outros_times", { p_team_id: teamId || "", p_cpfs: lista });
  if (error) throw error;
  return data || [];
}

// Admin: junta no banco de atletas todo mundo que já tem CPF guardado (times
// desta edição + elenco histórico).
export async function sincronizarBancoAtletas(teams) {
  const { data: cpfs, error: e1 } = await supabase.from("cpfs_jogadores").select("team_id, jogador_id, cpf");
  if (e1) throw e1;
  const lista = [];
  const { data: hist } = await supabase.from("elenco_historico").select("turma, apelido, nome, cpf");
  (hist || []).forEach((r) => {
    if (r.nome && r.cpf) lista.push({ nome: r.nome, apelido: r.apelido, cpf: r.cpf, turma: r.turma });
  });
  (cpfs || []).forEach((r) => {
    const t = (teams || []).find((x) => x.id === r.team_id);
    const j = t && (t.jogadores || []).find((x) => x.id === r.jogador_id);
    if (j) lista.push({ ...j, cpf: r.cpf, turma: t.nome });
  });
  // lotes de 500
  for (let i = 0; i < lista.length; i += 500) await salvarAtletas(lista.slice(i, i + 500));
  return lista.length;
}

// Escudos dos times: ficam no Storage (público, cacheado pelo navegador) em vez
// de virar texto base64 dentro do registro dos times (que era baixado a cada visita).
export async function subirEscudo(blob) {
  const caminho = `escudos/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`;
  const { error } = await supabase.storage.from("fotos").upload(caminho, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return supabase.storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
}
