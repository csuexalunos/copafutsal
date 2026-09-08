// Edge Function: enviar-email-time
// -----------------------------------------------------------------------
// Envia e-mails administrativos (aprovação de time com ficha em PDF,
// lembrete de inscrição, etc.) através da API do Brevo. Roda no servidor
// (Deno), então a chave de API do Brevo nunca aparece no site público.
// O assunto e o corpo do e-mail vêm prontos do app (cada tela de admin
// monta o texto que precisa) — esta função só valida quem está chamando
// e faz o envio de verdade.
//
// Só quem estiver logado como ADMIN no app consegue chamar essa função —
// isso é checado aqui dentro, consultando a tabela `admins` com a chave
// secreta do projeto (que só existe no ambiente da função, nunca no
// navegador). Usa Deno.serve puro (não o template "withSupabase" que o
// editor do Supabase sugere por padrão) — os dois funcionam, mas este é
// mais simples de revisar linha a linha.
// -----------------------------------------------------------------------

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const REMETENTE_EMAIL = Deno.env.get("REMETENTE_EMAIL") || "csuexalunos@gmail.com";
const REMETENTE_NOME = Deno.env.get("REMETENTE_NOME") || "Copa de Ex-Alunos de Futsal — Santa Úrsula";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

// A chave secreta agora vem pronta do Supabase dentro de
// SUPABASE_SECRET_KEYS — um dicionário JSON com uma ou mais chaves
// "sb_secret_...". Não precisa cadastrar nada manualmente pra isso.
function pegarChaveSecreta(): string | undefined {
  const bruto = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!bruto) return undefined;
  try {
    const dicionario = JSON.parse(bruto);
    const valores = Object.values(dicionario as Record<string, string>);
    return valores.length > 0 ? String(valores[0]) : undefined;
  } catch (e) {
    console.error("Falha ao interpretar SUPABASE_SECRET_KEYS:", e);
    return undefined;
  }
}
const SUPABASE_SECRET_KEY = pegarChaveSecreta();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function respostaJson(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!BREVO_API_KEY) {
      console.error("[enviar-email-time] BREVO_API_KEY não configurada.");
      return respostaJson({ error: "BREVO_API_KEY não configurada nos secrets da função." }, 500);
    }
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      console.error("[enviar-email-time] SUPABASE_URL ou SUPABASE_SECRET_KEYS ausentes.", {
        temUrl: !!SUPABASE_URL,
        temSecretKey: !!SUPABASE_SECRET_KEY,
      });
      return respostaJson(
        { error: "SUPABASE_URL e/ou SUPABASE_SECRET_KEYS não disponíveis no ambiente da função." },
        500
      );
    }

    // 1) Confirma que quem está chamando é um admin logado (via token JWT
    //    enviado automaticamente pelo supabase.functions.invoke no app).
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.error("[enviar-email-time] Chamada sem Authorization header.");
      return respostaJson({ error: "Não autenticado." }, 401);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error("[enviar-email-time] Token inválido ao chamar auth.getUser:", userError);
      return respostaJson({ error: "Sessão inválida." }, 401);
    }

    const { data: adminRow, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (adminError) {
      console.error("[enviar-email-time] Erro ao consultar tabela admins:", adminError);
      return respostaJson({ error: "Erro ao verificar permissão de admin: " + adminError.message }, 500);
    }

    if (!adminRow) {
      console.error("[enviar-email-time] Usuário não é admin:", userData.user.id, userData.user.email);
      return respostaJson({ error: "Só administradores podem enviar esse e-mail." }, 403);
    }

    // 2) Lê os dados enviados pelo app — assunto e corpo já vêm prontos,
    //    o anexo em PDF é opcional (só o e-mail de aprovação usa).
    const body = await req.json();
    const { destinatarioEmail, destinatarioNome, assunto, htmlContent, pdfBase64, pdfNomeArquivo } = body || {};

    if (!destinatarioEmail || !assunto || !htmlContent) {
      console.error("[enviar-email-time] Corpo da requisição incompleto:", {
        temEmail: !!destinatarioEmail,
        temAssunto: !!assunto,
        temHtml: !!htmlContent,
      });
      return respostaJson({ error: "Faltam dados obrigatórios (e-mail, assunto ou conteúdo)." }, 400);
    }

    // 3) Envia via API do Brevo (Transactional Email API).
    const payload: Record<string, unknown> = {
      sender: { email: REMETENTE_EMAIL, name: REMETENTE_NOME },
      to: [{ email: destinatarioEmail, name: destinatarioNome || destinatarioEmail }],
      subject: assunto,
      htmlContent,
    };
    if (pdfBase64) {
      payload.attachment = [{ content: pdfBase64, name: pdfNomeArquivo || "anexo.pdf" }];
    }

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const detalhe = await resp.text();
      console.error("Erro da API do Brevo:", detalhe);
      return respostaJson({ error: "Falha ao enviar via Brevo: " + detalhe }, 502);
    }

    const resultado = await resp.json();
    return respostaJson({ ok: true, brevo: resultado });
  } catch (e) {
    console.error("Erro inesperado na função enviar-email-time:", e);
    return respostaJson({ error: String(e && e.message ? e.message : e) }, 500);
  }
});
