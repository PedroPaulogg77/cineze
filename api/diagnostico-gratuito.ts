import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { gerarDiagnosticoGratuito, type LeadGratuito } from './lib/gemini';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extrai o score numérico do HTML gerado pelo Gemini. */
function extrairScore(html: string): number {
  // Procura padrão "Score: 8" / "Score 8/10" / "score: 7" dentro do cabecalho
  const match = html.match(/score[:\s]+(\d{1,2})\s*(?:\/\s*10)?/i);
  if (match) {
    const n = parseInt(match[1], 10);
    return Math.min(10, Math.max(0, n));
  }
  return 0;
}

/** Extrai QUENTE / MORNO / FRIO do HTML gerado pelo Gemini. */
function extrairTemperatura(html: string): string {
  if (/QUENTE/i.test(html)) return 'QUENTE';
  if (/MORNO/i.test(html)) return 'MORNO';
  return 'FRIO';
}

/** Envolve o HTML do Gemini num template de email com CSS inline. */
function wrapEmailHtml(diagnosticoHtml: string, lead: LeadGratuito, score: number, temperatura: string): string {
  const badgeColor = temperatura === 'QUENTE' ? '#EF4444' : temperatura === 'MORNO' ? '#F59E0B' : '#06B7D8';
  const badgeBg   = temperatura === 'QUENTE' ? '#2D1212'  : temperatura === 'MORNO' ? '#2D2212'  : '#0D2228';
  const emoji     = temperatura === 'QUENTE' ? '🔴' : temperatura === 'MORNO' ? '🟡' : '🔵';

  // Converte as tags <secao> em divs com estilo inline compatível com email
  const styledContent = diagnosticoHtml
    .replace(/<secao id="cabecalho">/gi,        '<div style="background:#0D1F35;border:2px solid ' + badgeColor + ';border-radius:12px;padding:24px 32px;margin-bottom:24px;text-align:center;">')
    .replace(/<secao id="diagnostico">/gi,       '<div style="background:#0A1628;border:1px solid #1A3050;border-radius:8px;padding:24px 32px;margin-bottom:20px;">')
    .replace(/<secao id="inteligencia_segmento">/gi, '<div style="background:#0A1628;border:1px solid #1A3050;border-radius:8px;padding:24px 32px;margin-bottom:20px;">')
    .replace(/<secao id="scripts_whatsapp">/gi,  '<div style="background:#0A1F18;border:1px solid #10B981;border-radius:8px;padding:24px 32px;margin-bottom:20px;">')
    .replace(/<secao id="preparacao_ligacao">/gi,'<div style="background:#0A1628;border:1px solid #F59E0B;border-radius:8px;padding:24px 32px;margin-bottom:20px;">')
    .replace(/<secao id="respostas_originais">/gi,'<div style="background:#060E1C;border:1px solid #1A3050;border-radius:8px;padding:24px 32px;margin-bottom:20px;">')
    .replace(/<\/secao>/gi, '</div>');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Diagnóstico: ${lead.nome}</title>
</head>
<body style="margin:0;padding:0;background:#060E1C;font-family:Arial,sans-serif;color:#E2E8F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060E1C;padding:32px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0A1628,#0D1F35);border:1px solid #1A3050;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="font-size:12px;font-weight:700;letter-spacing:3px;color:#06B7D8;text-transform:uppercase;margin-bottom:8px;">CINEZE — DIAGNÓSTICO GRATUITO</div>
          <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;">
            ${emoji} ${lead.nome} — ${lead.segmento}
          </h1>
          <p style="margin:8px 0 0;color:#8B9DB5;font-size:13px;">${lead.email} • ${lead.telefone || ''} • ${lead.cidade}</p>
        </td></tr>

        <!-- Score badge -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:${badgeBg};border:2px solid ${badgeColor};border-radius:12px;padding:20px 24px;text-align:center;">
                <div style="font-size:48px;font-weight:900;color:${badgeColor};line-height:1;">${score}/10</div>
                <div style="font-size:16px;font-weight:700;color:${badgeColor};margin-top:4px;">${temperatura}</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Conteúdo gerado pelo Gemini -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 32px;">
          <div style="font-size:14px;line-height:1.7;color:#A1B3CB;">
            ${styledContent}
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#060E1C;border:1px solid #1A3050;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="color:#4A5568;font-size:12px;margin:0;">Cineze CRM — gerado via Gemini 2.0 Flash · diagnóstico-gratuito</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
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

  const body = req.body || {};
  const { nome, email } = body as LeadGratuito;

  if (!nome || !email) {
    return res.status(400).json({ error: 'nome e email são obrigatórios' });
  }

  const lead = body as LeadGratuito;

  // 1. Gera diagnóstico via Gemini
  let diagnosticoHtml: string;
  try {
    diagnosticoHtml = await gerarDiagnosticoGratuito(lead);
  } catch (err) {
    console.error('[diagnostico-gratuito] Gemini error:', err);
    return res.status(500).json({ error: 'Falha ao gerar diagnóstico' });
  }

  const score      = extrairScore(diagnosticoHtml);
  const temperatura = extrairTemperatura(diagnosticoHtml);

  // 2. Salva no Supabase
  const supabaseUrl      = process.env.SUPABASE_URL;
  const supabaseKey      = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase.from('leads_gratuitos').insert({
        nome:             lead.nome,
        email:            lead.email,
        telefone:         lead.telefone || null,
        segmento:         lead.segmento || null,
        cidade:           lead.cidade || null,
        score,
        temperatura,
        diagnostico_html: diagnosticoHtml,
      });
      if (dbError) console.error('[diagnostico-gratuito] Supabase error:', dbError);
    } catch (err) {
      console.error('[diagnostico-gratuito] Supabase exception:', err);
    }
  } else {
    console.warn('[diagnostico-gratuito] Supabase env vars ausentes — pulando salvamento');
  }

  // 3. Envia email para Pedro
  const resendKey  = process.env.RESEND_API_KEY;
  const pedroEmail = process.env.PEDRO_EMAIL;

  if (resendKey && pedroEmail) {
    try {
      const resend  = new Resend(resendKey);
      const subject = `[${temperatura}] Novo lead: ${lead.nome} — ${lead.segmento || 'sem segmento'}`;
      const html    = wrapEmailHtml(diagnosticoHtml, lead, score, temperatura);

      const { error: emailError } = await resend.emails.send({
        from:    'Cineze CRM <noreply@cineze.com.br>',
        to:      pedroEmail,
        subject,
        html,
      });
      if (emailError) console.error('[diagnostico-gratuito] Resend error:', emailError);
    } catch (err) {
      console.error('[diagnostico-gratuito] Email exception:', err);
    }
  } else {
    console.warn('[diagnostico-gratuito] RESEND_API_KEY ou PEDRO_EMAIL ausentes — pulando email');
  }

  return res.status(200).json({ ok: true, score, temperatura });
}
