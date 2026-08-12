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
