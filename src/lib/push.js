// Avisos de jogo por notificação push (Web Push). O aparelho se inscreve
// aqui e a inscrição fica salva no Supabase; quando o organizador inicia
// um jogo, a Edge Function "avisar-jogo" dispara o push pra todo mundo.
import { supabase } from "./supabase.js";

export const VAPID_PUBLIC_KEY =
  "BCDfqlSJbGvUWVXnlH81MpCupw4ZeoBrpLMq4Ru6DAWnsnxm88v680Hpba5r9YucjKTL4joq4OG2KwavEv5juqk";

const CHAVE_TIMES = "copasu:push_times";

function b64ParaUint8(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function pushSuportado() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function ehIosNaoInstalado() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone;
  return ios && !standalone;
}

async function registro() {
  const reg = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  await navigator.serviceWorker.ready;
  return reg;
}

export async function inscricaoAtual() {
  if (!pushSuportado()) return null;
  try {
    const reg = await navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL);
    return reg ? await reg.pushManager.getSubscription() : null;
  } catch (e) {
    return null;
  }
}

export function timesSalvos() {
  try { return JSON.parse(localStorage.getItem(CHAVE_TIMES) || "[]"); } catch (e) { return []; }
}

// times = [] significa "todos os jogos"; senão, só jogos desses times (nomes).
async function inscreverAparelho() {
  if (!pushSuportado()) throw new Error("Este navegador não suporta notificações.");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permissão de notificação negada.");
  const reg = await registro();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ParaUint8(VAPID_PUBLIC_KEY) });
  }
  return sub.toJSON();
}

// Avisos da ORGANIZAÇÃO: este aparelho recebe notificação de tudo que
// acontece no app (time novo, elenco alterado, foto postada...). Só admin
// consegue (a função do banco confere).
export async function ativarPushAdmin() {
  const j = await inscreverAparelho();
  const { error } = await supabase.rpc("salvar_push_admin", { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth });
  if (error) throw error;
  try { localStorage.setItem("copasu:push_admin", "1"); } catch (e) { /* ok */ }
}
export function pushAdminAtivo() {
  try { return localStorage.getItem("copasu:push_admin") === "1"; } catch (e) { return false; }
}
export async function desativarPushAdmin() {
  await desativarPush();
  try { localStorage.removeItem("copasu:push_admin"); } catch (e) { /* ok */ }
}
// Dispara aviso pra organização (chamado por qualquer visitante/representante).
export async function avisarOrganizacao(tipo, titulo, corpo) {
  const { error } = await supabase.functions.invoke("avisar-admin", { body: { tipo, titulo, corpo } });
  if (error) throw error;
}

// Diagnóstico: manda um aviso de teste pra organização e devolve o que a função respondeu
// (quantos aparelhos receberam) ou o motivo exato da falha.
export async function testarAvisoOrganizacao() {
  const { data, error } = await supabase.functions.invoke("avisar-admin", {
    body: { tipo: "outro", titulo: "Teste de aviso", corpo: "Se você viu isso, os avisos da organização estão funcionando." },
  });
  if (error) {
    let detalhe = error.message || "erro desconhecido";
    try {
      if (error.context && typeof error.context.text === "function") {
        const t = await error.context.text();
        if (t) detalhe = t;
      }
    } catch (e) { /* ignora */ }
    return { ok: false, detalhe };
  }
  return { ok: true, enviados: (data && data.enviados) || 0, removidos: (data && data.removidos) || 0 };
}

export async function ativarPush(times = []) {
  if (!pushSuportado()) throw new Error("Este navegador não suporta notificações.");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permissão de notificação negada.");
  const reg = await registro();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ParaUint8(VAPID_PUBLIC_KEY) });
  }
  const j = sub.toJSON();
  const { error } = await supabase.rpc("salvar_push", {
    p_endpoint: j.endpoint,
    p_p256dh: j.keys.p256dh,
    p_auth: j.keys.auth,
    p_times: times,
  });
  if (error) throw error;
  try { localStorage.setItem(CHAVE_TIMES, JSON.stringify(times)); } catch (e) { /* ok */ }
  return true;
}

export async function desativarPush() {
  const sub = await inscricaoAtual();
  if (!sub) return;
  try { await supabase.rpc("remover_push", { p_endpoint: sub.endpoint }); } catch (e) { /* ok */ }
  await sub.unsubscribe();
}

// Chamado pelo organizador ao iniciar um jogo.
export async function avisarInicioJogo({ titulo, corpo, times, tag }) {
  const { data, error } = await supabase.functions.invoke("avisar-jogo", { body: { titulo, corpo, times, tag } });
  if (error) throw error;
  return data;
}
