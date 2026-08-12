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
  return data.user;
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
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session ? session.user : null);
  });
  return () => data.subscription.unsubscribe();
}

export async function criarPerfil(userId, perfil) {
  const { error } = await supabase.from("profiles").insert({ id: userId, ...perfil });
  if (error) throw error;
}

export async function buscarPerfil(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
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

export async function souAdmin(userId) {
  const { data, error } = await supabase.from("admins").select("super_admin").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data ? { admin: true, superAdmin: !!data.super_admin } : { admin: false, superAdmin: false };
}

export async function listarAdmins() {
  const { data, error } = await supabase.from("admins").select("*");
  if (error) throw error;
  return data || [];
}

export async function promoverParaAdmin(userId, email) {
  const { error } = await supabase.from("admins").insert({ user_id: userId, email, super_admin: false });
  if (error) throw error;
}

// ---------------------------------------------------------------------
// Armazenamento de fotos e vídeos (Supabase Storage) — em vez de guardar
// a imagem inteira como texto dentro do banco, sobe o arquivo de verdade
// pro bucket "fotos" e guarda só o link curto. Mais leve e sem limite
// artificial de tamanho pra vídeo.
// ---------------------------------------------------------------------

export async function subirArquivo(blob, nomeArquivo, contentType) {
  const caminho = `${Date.now()}_${nomeArquivo.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("fotos").upload(caminho, blob, {
    contentType: contentType || blob.type,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("fotos").getPublicUrl(caminho);
  return data.publicUrl;
}
