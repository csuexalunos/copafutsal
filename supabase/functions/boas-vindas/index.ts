// Edge Function: boas-vindas
// -----------------------------------------------------------------------
// Manda o e-mail de boas-vindas (Instagram da Copa, programação, parceiros
// e prestadores) pra quem acabou de se cadastrar. Usa o mesmo Brevo e os
// mesmos secrets da função enviar-email-time (BREVO_API_KEY etc.).
//
// Segurança: quem chama precisa estar logado; o e-mail SEMPRE vai para o
// e-mail da própria conta (vem do token, nunca do corpo da requisição) e só
// uma vez por pessoa (profiles.boas_vindas_em). Só envia pra perfis criados
// a partir de DATA_CORTE, pra não mandar e-mail pra quem já era cadastrado.
// -----------------------------------------------------------------------

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const REMETENTE_EMAIL = Deno.env.get("REMETENTE_EMAIL") || "csuexalunos@gmail.com";
const REMETENTE_NOME = Deno.env.get("REMETENTE_NOME") || "Copa de Ex-Alunos de Futsal — Santa Úrsula";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

// ---- Ajuste aqui se precisar ---------------------------------------
const INSTAGRAM_COPA_URL = Deno.env.get("INSTAGRAM_COPA_URL") || "https://www.instagram.com/copaexalunoscsu?vrfl=MXVoc3NncW91ank1bQ==";
const INSTAGRAM_COPA_NOME = Deno.env.get("INSTAGRAM_COPA_NOME") || "@copaexalunoscsu";
const APP_URL = "https://csuexalunos.github.io/copafutsal/";
const DATA_CORTE = "2026-10-30T00:00:00Z";
// ---------------------------------------------------------------------

const IMG = APP_URL + "email/";
const PARCEIROS = [
  { nome: "Pajú", img: "p-paju.png", url: "https://www.instagram.com/pajupasteis?xtok=MWY2MGRmZG4zenlkdQ==" },
  { nome: "Seu Buteco MCZ", img: "p-buteco.png", url: "https://www.instagram.com/seubutecomcz?mdxt=MnBpNWhjcGZqdHBn" },
  { nome: "Hype Pizza", img: "p-hype.png", url: "https://www.instagram.com/hypepizzabr?vrfl=MTg4bm1rZDM3YzlwYw==" },
  { nome: "Casa de Mãinha", img: "p-casa.png", url: "https://www.instagram.com/restaurantecasademainha?dlrf=MXJlZ29keDdnMnRvYg==" },
  { nome: "Papa Fritas", img: "p-papa.png", url: "https://www.instagram.com/papafritas?cplk=MW9ubzlpNWx6MWRhMQ==" },
];
const MOVEX_URL = "https://www.instagram.com/movexrecovery?cplk=MWI0azV6ZW53cXplaQ==";
const GV_URL = "https://www.youtube.com/channel/UCwAst32aZjhZdXTDXqP60Nw";

const PROGRAMACAO = [
  { dia: "SEXTA · 6/11", tit: "Abertura e fase de grupos", txt: "Abertura às 18h30 · primeiro jogo às 19h" },
  { dia: "SÁBADO · 7/11", tit: "Fase de grupos", txt: "Jogos a partir das 8h · definição dos classificados" },
  { dia: "DOMINGO · 8/11", tit: "Eliminatórias e final", txt: "Jogos a partir das 9h · premiação dos destaques" },
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
function respostaJson(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function pegarChaveSecreta(): string | undefined {
  const bruto = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!bruto) return undefined;
  try {
    const valores = Object.values(JSON.parse(bruto) as Record<string, string>);
    return valores.length > 0 ? String(valores[0]) : undefined;
  } catch (_e) {
    return undefined;
  }
}
const SUPABASE_SECRET_KEY = pegarChaveSecreta();

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function montarHtml(nome: string) {
  const primeiro = esc((nome || "").trim().split(/\s+/)[0] || "");
  const diasHtml = PROGRAMACAO.map(
    (d) => `<tr><td style="padding:10px 0;border-bottom:1px solid #E7E3D8">
<div style="font:700 12px Arial,sans-serif;letter-spacing:2px;color:#E8630A">${d.dia}</div>
<div style="font:700 16px Arial,sans-serif;color:#1B2338;margin-top:2px">${d.tit}</div>
<div style="font:14px Arial,sans-serif;color:#5B6478;margin-top:2px">${d.txt}</div></td></tr>`
  ).join("");
  const parcHtml = PARCEIROS.map(
    (p) => `<a href="${p.url}" style="text-decoration:none;display:inline-block;margin:4px"><img src="${IMG}${p.img}" width="84" height="84" alt="${p.nome}" style="border-radius:14px;display:block"></a>`
  ).join("");
  return `<!doctype html><html><body style="margin:0;background:#F4F1E8">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1E8"><tr><td align="center" style="padding:16px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden">
<tr><td align="center" style="background:#0A1128;padding:28px 16px"><img src="${IMG}logo-copa.png" width="300" alt="Jogos dos Ex-Alunos — Santa Úrsula" style="display:block;max-width:100%;height:auto"></td></tr>
<tr><td style="height:6px;background:#FF7A00;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:28px 28px 8px">
<div style="font:800 26px Arial,sans-serif;color:#1B2338">Bem-vindo${primeiro ? ", " + primeiro : ""}! 🏆</div>
<p style="font:15px/1.55 Arial,sans-serif;color:#3A4358;margin:12px 0 0">Seu cadastro na <b>VIII Copa CSU de Ex-Alunos</b> está feito. De <b>6 a 8 de novembro</b>, no Ginásio CSU, vamos ter futsal, reencontros e muita resenha. No app você acompanha jogos, placares e a tabela em tempo real.</p>
<table cellpadding="0" cellspacing="0" style="margin:20px 0 6px"><tr>
<td style="background:#FF6B35;border-radius:10px"><a href="${APP_URL}" style="display:inline-block;padding:13px 22px;font:700 15px Arial,sans-serif;color:#FFFFFF;text-decoration:none">Abrir o app da Copa</a></td>
<td width="10"></td>
<td style="background:#1B2338;border-radius:10px"><a href="${INSTAGRAM_COPA_URL}" style="display:inline-block;padding:13px 22px;font:700 15px Arial,sans-serif;color:#FFFFFF;text-decoration:none">Instagram ${INSTAGRAM_COPA_NOME}</a></td>
</tr></table></td></tr>
<tr><td style="padding:18px 28px 0"><div style="font:800 13px Arial,sans-serif;letter-spacing:3px;color:#8A93A6">PROGRAMAÇÃO</div>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px">${diasHtml}</table></td></tr>
<tr><td style="padding:22px 28px 0"><div style="font:800 13px Arial,sans-serif;letter-spacing:3px;color:#8A93A6">PARCEIROS OFICIAIS</div>
<div style="margin:10px -4px 0">${parcHtml}</div></td></tr>
<tr><td style="padding:20px 28px 0"><div style="font:800 13px Arial,sans-serif;letter-spacing:3px;color:#8A93A6">FISIOTERAPIA</div>
<table cellpadding="0" cellspacing="0" style="margin-top:10px"><tr>
<td width="84" valign="middle"><a href="${MOVEX_URL}"><img src="${IMG}p-movex.png" width="84" height="84" alt="MoveX Recovery" style="border-radius:14px;display:block"></a></td>
<td valign="middle" style="padding-left:16px;font:14px/1.5 Arial,sans-serif;color:#3A4358">MoveX Recovery cuida da recuperação dos atletas durante a Copa. <a href="${MOVEX_URL}" style="color:#E8630A">Ver no Instagram</a>.</td></tr></table></td></tr>
<tr><td style="padding:20px 28px 0"><div style="font:800 13px Arial,sans-serif;letter-spacing:3px;color:#8A93A6">TRANSMISSÃO</div>
<table cellpadding="0" cellspacing="0" style="margin-top:10px"><tr>
<td width="84" valign="middle"><a href="${GV_URL}"><img src="${IMG}p-gv.png" width="84" height="84" alt="GV Produções" style="border-radius:14px;display:block"></a></td>
<td valign="middle" style="padding-left:16px;font:14px/1.5 Arial,sans-serif;color:#3A4358">Todos os jogos ao vivo pela GV Produções. <a href="${GV_URL}" style="color:#E8630A">Ver o canal</a>.</td></tr></table></td></tr>
<tr><td style="padding:28px;font:12px/1.5 Arial,sans-serif;color:#8A93A6;text-align:center">Copa de Ex-Alunos de Futsal · Colégio Santa Úrsula<br>Você recebeu este e-mail porque criou uma conta no app da Copa.</td></tr>
</table></td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (!BREVO_API_KEY) return respostaJson({ error: "BREVO_API_KEY não configurada." }, 500);
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return respostaJson({ error: "Ambiente do Supabase incompleto." }, 500);

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token) return respostaJson({ error: "Não autenticado." }, 401);

    const admin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { data: u, error: ue } = await admin.auth.getUser(token);
    if (ue || !u?.user?.email) return respostaJson({ error: "Sessão inválida." }, 401);

    const { data: perfil, error: pe } = await admin
      .from("profiles")
      .select("id, nome, criado_em, boas_vindas_em")
      .eq("id", u.user.id)
      .maybeSingle();
    if (pe) return respostaJson({ error: "Erro ao ler perfil: " + pe.message }, 500);
    if (!perfil) return respostaJson({ ok: false, motivo: "sem_perfil" });
    if (perfil.boas_vindas_em) return respostaJson({ ok: false, motivo: "ja_enviado" });
    if (new Date(perfil.criado_em) < new Date(DATA_CORTE)) return respostaJson({ ok: false, motivo: "cadastro_antigo" });

    // Marca antes de enviar: se duas chamadas chegarem juntas, só uma envia.
    const { data: marcado } = await admin
      .from("profiles")
      .update({ boas_vindas_em: new Date().toISOString() })
      .eq("id", perfil.id)
      .is("boas_vindas_em", null)
      .select("id");
    if (!marcado || marcado.length === 0) return respostaJson({ ok: false, motivo: "ja_enviado" });

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { email: REMETENTE_EMAIL, name: REMETENTE_NOME },
        to: [{ email: u.user.email, name: perfil.nome || u.user.email }],
        subject: "Bem-vindo à VIII Copa CSU de Ex-Alunos! 🏆",
        htmlContent: montarHtml(perfil.nome || ""),
      }),
    });
    if (!resp.ok) {
      const detalhe = await resp.text();
      console.error("[boas-vindas] Brevo:", detalhe);
      await admin.from("profiles").update({ boas_vindas_em: null }).eq("id", perfil.id); // tenta de novo no próximo login
      return respostaJson({ error: "Falha ao enviar via Brevo: " + detalhe }, 502);
    }
    return respostaJson({ ok: true });
  } catch (e) {
    console.error("[boas-vindas] erro:", e);
    return respostaJson({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
