// Edge Function: enviar-email-time
// -----------------------------------------------------------------------
// Recebe os dados de um time aprovado pela comissão (nome, e-mail de
// destino, PDF da ficha em base64 e o link de finalização) e manda o
// e-mail de verdade através da API do Brevo. Roda no servidor (Deno),
// então a chave de API do Brevo nunca aparece no site público.
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
      return respostaJson({ error: "BREVO_API_KEY não configurada nos secrets da função." }, 500);
    }
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
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
      return respostaJson({ error: "Não autenticado." }, 401);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return respostaJson({ error: "Sessão inválida." }, 401);
    }

    const { data: adminRow } = await supabaseAdmin
      .from("admins")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!adminRow) {
      return respostaJson({ error: "Só administradores podem enviar esse e-mail." }, 403);
    }

    // 2) Lê os dados enviados pelo app.
    const body = await req.json();
    const { destinatarioEmail, destinatarioNome, timeNome, linkFinalizacao, pdfBase64, pdfNomeArquivo } = body || {};

    if (!destinatarioEmail || !timeNome || !pdfBase64 || !linkFinalizacao) {
      return respostaJson({ error: "Faltam dados obrigatórios (e-mail, nome do time, PDF ou link)." }, 400);
    }

    // 3) Monta e envia o e-mail via API do Brevo (Transactional Email API).
    const assunto = `Time ${timeNome} aprovado — finalize sua inscrição na Copa CSU`;
    const htmlContent = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #12203D; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #12203D;">Seu time foi avaliado e aprovado! 🎉</h2>
        <p>Olá${destinatarioNome ? ", " + destinatarioNome : ""}!</p>
        <p>
          O time <strong>${timeNome}</strong> foi avaliado pela comissão organizadora da
          Copa de Ex-Alunos de Futsal do Colégio Santa Úrsula e está <strong>aprovado</strong>.
        </p>
        <p>
          Em anexo você encontra a <strong>ficha do time em PDF</strong>, com a lista de
          jogadores aprovada pela comissão.
        </p>
        <p>Pra finalizar a inscrição, siga estes passos:</p>
        <ol>
          <li>Acesse o link abaixo;</li>
          <li>Anexe o PDF da ficha do time (em anexo neste e-mail);</li>
          <li>Realize o pagamento da inscrição.</li>
        </ol>
        <p style="text-align: center; margin: 28px 0;">
          <a href="${linkFinalizacao}"
             style="background-color: #F97316; color: #FFFFFF; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; display: inline-block;">
            Finalizar inscrição e pagar
          </a>
        </p>
        <p style="font-size: 13px; color: #667085;">
          Se o botão não funcionar, copie e cole este link no navegador:<br />
          <a href="${linkFinalizacao}">${linkFinalizacao}</a>
        </p>
        <p>Qualquer dúvida, fale com a organização.</p>
        <p>Copa de Ex-Alunos de Futsal — Colégio Santa Úrsula</p>
      </div>
    `;

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: REMETENTE_EMAIL, name: REMETENTE_NOME },
        to: [{ email: destinatarioEmail, name: destinatarioNome || timeNome }],
        subject: assunto,
        htmlContent,
        attachment: [
          {
            content: pdfBase64,
            name: pdfNomeArquivo || `ficha-${timeNome}.pdf`,
          },
        ],
      }),
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
