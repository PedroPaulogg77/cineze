import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { gerarDiagnosticoGratuito, type LeadGratuito } from './lib/gemini';
import { salvarLeadNoSheets } from './lib/sheets';

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const respostas = (req.body || {}) as LeadGratuito;

  if (!respostas.nome || !respostas.email) {
    return res.status(400).json({ error: 'nome e email são obrigatórios' });
  }

  // 1. Gerar diagnóstico com Gemini
  let diagnosticoHtml: string;
  try {
    diagnosticoHtml = await gerarDiagnosticoGratuito(respostas);
  } catch (err) {
    console.error('[diagnostico-gratuito] Gemini error:', err);
    return res.status(500).json({ error: 'Falha ao gerar diagnóstico' });
  }

  // 2. Extrair score e temperatura do HTML gerado
  const scoreMatch = diagnosticoHtml.match(/Score[:\s]+(\d+)/i);
  const score      = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  const temperatura = score >= 8 ? 'QUENTE' : score >= 5 ? 'MORNO' : 'FRIO';

  // 3. Salvar no Google Sheets
  const [sheetsResult, emailResult] = await Promise.allSettled([
    salvarLeadNoSheets(respostas, score, temperatura),
    enviarEmailPedro(respostas, score, temperatura, diagnosticoHtml),
  ]);

  if (sheetsResult.status === 'rejected') {
    console.error('[diagnostico-gratuito] Sheets error:', sheetsResult.reason);
  }
  if (emailResult.status === 'rejected') {
    console.error('[diagnostico-gratuito] Email error:', emailResult.reason);
  }

  return res.status(200).json({ ok: true, score, temperatura });
}

// ── Email ─────────────────────────────────────────────────────────────────────
async function enviarEmailPedro(
  lead: LeadGratuito,
  score: number,
  temperatura: string,
  diagnosticoHtml: string,
) {
  const resendKey  = process.env.RESEND_API_KEY;
  const pedroEmail = process.env.PEDRO_EMAIL;

  if (!resendKey || !pedroEmail) {
    throw new Error('RESEND_API_KEY ou PEDRO_EMAIL ausentes');
  }

  const resend  = new Resend(resendKey);
  const subject = `[${temperatura}] Novo lead: ${lead.nome} — ${lead.segmento} — Score ${score}/10`;

  const { error } = await resend.emails.send({
    from: 'Cineze CRM <noreply@cineze.com.br>',
    to:   pedroEmail,
    subject,
    html: diagnosticoHtml,
  });

  if (error) throw error;
}
