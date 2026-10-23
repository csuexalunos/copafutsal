// Edge Function: avisar-admin
// Manda push só pros aparelhos da ORGANIZAÇÃO (push_subscriptions.admin = true)
// quando algo acontece no app. Quem chama é o app de qualquer visitante /
// representante (não precisa login), por isso só aceita tipos conhecidos e
// limita o tamanho do texto. Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
function chaveSecreta(): string | undefined {
  try {
    const v = Object.values(JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}") as Record<string, string>);
    return v.length ? String(v[0]) : undefined;
  } catch { return undefined; }
}
const SECRET = chaveSecreta();
const TIPOS = new Set(["time_novo", "elenco", "solicitacao_org", "foto", "avaliacao", "perfil", "pagamento", "outro"]);
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (o: unknown, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const pub = Deno.env.get("VAPID_PUBLIC_KEY"), priv = Deno.env.get("VAPID_PRIVATE_KEY");
    if (!pub || !priv || !SECRET) return json({ error: "VAPID_* ou chave secreta não configuradas." }, 500);
    webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") || "mailto:csuexalunos@gmail.com", pub, priv);
    const { tipo, titulo, corpo } = await req.json();
    if (!TIPOS.has(tipo)) return json({ error: "Tipo inválido." }, 400);
    const sb = createClient(SUPABASE_URL, SECRET);
    const { data: subs, error } = await sb.from("push_subscriptions").select("*").eq("admin", true);
    if (error) return json({ error: error.message }, 500);
    const payload = JSON.stringify({
      titulo: String(titulo || "Copa Santa Úrsula").slice(0, 80),
      corpo: String(corpo || "").slice(0, 200),
      tag: `org-${tipo}`,
    });
    let enviados = 0, removidos = 0;
    await Promise.all((subs || []).map(async (s: any) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400 });
        enviados++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await sb.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
          removidos++;
        } else console.error("push falhou", e?.statusCode, e?.body);
      }
    }));
    return json({ ok: true, enviados, removidos });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});
