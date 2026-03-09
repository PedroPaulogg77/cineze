import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { gerarDiagnosticoGratuito, type LeadGratuito } from './lib/gemini.js';
import { salvarLeadNoSheets } from './lib/sheets.js';

// ── Mapeia os campos do formulário (nomes antigos) para LeadGratuito ─────────
function mapearCampos(body: Record<string, string>): LeadGratuito {
  return {
    nome:             body.nome             || '',
    email:            body.email            || '',
    telefone:         body.telefone         || body.whatsapp      || '',
    segmento:         body.segmento         || '',
    cidade:           body.cidade           || '',
    como_chegam:      body.como_chegam      || body.captacao      || '',
    presenca_digital: body.presenca_digital || body.presenca      || '',
    investiu_trafego: body.investiu_trafego || body.trafego       || '',
    maior_desafio:    body.maior_desafio    || body.dor           || '',
    meta_clientes:    body.meta_clientes    || body.meta          || '',
    urgencia:         body.urgencia         || '',
    contexto_livre:   body.contexto_livre   || body.contexto      || '',
  };
}

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
    const body = (req.body || {}) as Record<string, string>;

    if (!body.nome || !body.email) {
      return res.status(400).json({ error: 'nome e email são obrigatórios' });
    }

    const respostas = mapearCampos(body);

    // 1. Gerar diagnóstico com Gemini (retorna HTML + metadados)
    const { html: emailHtml, score, temperatura, isPremium } = await gerarDiagnosticoGratuito(respostas);

    // variant para o redirect do frontend (mantém compatibilidade)
    const trafego = respostas.investiu_trafego.toLowerCase();
    const variant = trafego.includes('já invisto') ? 'A' : 'B';

    // 2. Salvar no Google Sheets
    await salvarLeadNoSheets(respostas, score, temperatura);

    // 3. Enviar email para Pedro
    const resend        = new Resend(process.env.RESEND_API_KEY!);
    const pedroEmail    = process.env.PEDRO_EMAIL!;
    const subjectPrefix = isPremium ? '🔥 LEAD PREMIUM' : `[${temperatura}]`;

    await resend.emails.send({
      from:    'Cineze CRM <noreply@cineze.com.br>',
      to:      pedroEmail,
      subject: `${subjectPrefix} ${respostas.nome} — ${respostas.segmento} — Score ${score}/10`,
      html:    emailHtml,
    });

    return res.status(200).json({ ok: true, variant, score, temperatura });
  } catch (error) {
    console.error('[diagnostico-gratuito] Erro:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
