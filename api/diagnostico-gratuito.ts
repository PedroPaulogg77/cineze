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

  try {
    const respostas = (req.body || {}) as LeadGratuito;

    if (!respostas.nome || !respostas.email) {
      return res.status(400).json({ error: 'nome e email são obrigatórios' });
    }

    // 1. Gerar email completo com Gemini
    const emailHtml = await gerarDiagnosticoGratuito(respostas);

    // 2. Extrair score e temperatura do HTML gerado
    const scoreMatch = emailHtml.match(/Score:\s*(\d+)\/10/i);
    const score      = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    const temperatura = score >= 8 ? 'QUENTE' : score >= 5 ? 'MORNO' : 'FRIO';
    const isPremium   = score >= 9;

    // 3. Salvar no Google Sheets
    await salvarLeadNoSheets(respostas, score, temperatura);

    // 4. Enviar email para Pedro
    const resend      = new Resend(process.env.RESEND_API_KEY!);
    const pedroEmail  = process.env.PEDRO_EMAIL!;
    const subjectPrefix = isPremium ? '🔥 LEAD PREMIUM' : `[${temperatura}]`;

    await resend.emails.send({
      from:    'Cineze CRM <noreply@cineze.com.br>',
      to:      pedroEmail,
      subject: `${subjectPrefix} ${respostas.nome} — ${respostas.segmento} — Score ${score}/10`,
      html:    emailHtml,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[diagnostico-gratuito] Erro:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
