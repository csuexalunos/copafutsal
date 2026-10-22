// Edge Function: avisar-jogo
// Dispara notificação push (Web Push) pra todos os aparelhos inscritos
// quando o organizador inicia um jogo. Só admin logado pode chamar.
// Secrets necessários: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
// (ex.: mailto:csuexalunos@gmail.com).
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

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token) return json({ error: "Não autenticado." }, 401);
    const sb = createClient(SUPABASE_URL, SECRET);
    const { data: u, error: ue } = await sb.auth.getUser(token);
    if (ue || !u?.user) return json({ error: "Sessão inválida." }, 401);
    const { data: adm } = await sb.from("admins").select("user_id").eq("user_id", u.user.id).maybeSingle();
    if (!adm) return json({ error: "Só administradores." }, 403);

    const { titulo, corpo, times, tag } = await req.json();
    if (!titulo) return json({ error: "Faltou o título." }, 400);
    const envolvidos: string[] = Array.isArray(times) ? times : [];

    const { data: subs, error } = await sb.from("push_subscriptions").select("*");
    if (error) return json({ error: error.message }, 500);

    const alvo = (subs || []).filter(
      (s: any) => !s.times?.length || s.times.some((t: string) => envolvidos.includes(t)),
    );
    const payload = JSON.stringify({ titulo, corpo, tag: tag || "jogo" });
    let enviados = 0, removidos = 0, falhas = 0;
    await Promise.all(alvo.map(async (s: any) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 600 });
        enviados++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await sb.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
          removidos++;
        } else { falhas++; console.error("push falhou", e?.statusCode, e?.body); }
      }
    }));
    return json({ ok: true, inscritos: subs?.length || 0, enviados, removidos, falhas });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});
