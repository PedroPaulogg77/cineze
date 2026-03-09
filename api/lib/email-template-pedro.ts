import type { DiagnosticAnswers } from './diagnostic-engine';
import type { DiagnosticResult } from './diagnostic-engine';

export function buildEmailHtml(answers: DiagnosticAnswers, diagnostic: DiagnosticResult, sheetUrl?: string): string {
  const { score, prioridade, resumoLead, perfilDigital, dorPrincipal, abordagemRecomendada, pontosDeAtencao } = diagnostic;

  const scoreColor = score >= 8 ? '#EF4444' : score >= 5 ? '#F59E0B' : '#06B7D8';
  const scoreBg = score >= 8 ? '#2D1212' : score >= 5 ? '#2D2212' : '#0D2228';

  const subjectEmoji = score >= 8 ? '🔴' : score >= 5 ? '🟡' : '🔵';

  const pontosHtml = pontosDeAtencao.length > 0
    ? pontosDeAtencao.map(p => `<li style="margin-bottom:8px;color:#A1B3CB;font-size:14px;">${escapeHtml(p)}</li>`).join('')
    : '<li style="color:#8B9DB5;font-size:14px;">Nenhum ponto de atenção identificado.</li>';

  const respostasHtml = Object.entries(answers)
    .filter(([k]) => !['email', 'nome', 'whatsapp'].includes(k))
    .map(([key, val]) => `
      <tr>
        <td style="padding:8px 12px;color:#8B9DB5;font-size:13px;border-bottom:1px solid #1A3050;white-space:nowrap;">${escapeHtml(labelFor(key))}</td>
        <td style="padding:8px 12px;color:#E2E8F0;font-size:13px;border-bottom:1px solid #1A3050;">${escapeHtml(val || '—')}</td>
      </tr>
    `).join('');

  const sheetLinkHtml = sheetUrl
    ? `<div style="text-align:center;margin-top:32px;">
        <a href="${escapeHtml(sheetUrl)}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#0066FF,#06B7D8);color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">Ver Google Sheet →</a>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Novo Lead: ${escapeHtml(answers.nome || 'Sem nome')}</title>
</head>
<body style="margin:0;padding:0;background:#060E1C;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060E1C;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0A1628,#0D1F35);border:1px solid #1A3050;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:3px;color:#06B7D8;text-transform:uppercase;margin-bottom:8px;">CINEZE — CRM DE LEADS</div>
          <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;">
            ${subjectEmoji} Novo Lead: ${escapeHtml(answers.nome || 'Sem nome')}
          </h1>
          <p style="margin:8px 0 0;color:#8B9DB5;font-size:14px;">${escapeHtml(answers.email || '')} • ${escapeHtml(answers.whatsapp || '')}</p>
        </td></tr>

        <!-- Score badge -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:${scoreBg};border:2px solid ${scoreColor};border-radius:12px;padding:20px 24px;text-align:center;">
                <div style="font-size:48px;font-weight:900;color:${scoreColor};line-height:1;">${score}/10</div>
                <div style="font-size:16px;font-weight:700;color:${scoreColor};margin-top:4px;">${escapeHtml(prioridade)}</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Resumo -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 24px;">
          <h2 style="color:#06B7D8;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Resumo do Lead</h2>
          <p style="color:#E2E8F0;font-size:15px;line-height:1.6;margin:0;">${escapeHtml(resumoLead)}</p>
        </td></tr>

        <!-- Perfil Digital -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 24px;">
          <h2 style="color:#06B7D8;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Perfil Digital</h2>
          <p style="color:#A1B3CB;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(perfilDigital)}</p>
        </td></tr>

        <!-- Dor Principal -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 24px;">
          <h2 style="color:#06B7D8;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Dor Principal</h2>
          <p style="color:#A1B3CB;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(dorPrincipal)}</p>
        </td></tr>

        <!-- Abordagem Recomendada (destaque) -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 24px;">
          <h2 style="color:#06B7D8;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Abordagem Recomendada</h2>
          <div style="border-left:3px solid #06B7D8;background:#0D1F35;border-radius:0 8px 8px 0;padding:16px 20px;">
            <p style="color:#E2E8F0;font-size:14px;line-height:1.7;margin:0;">${escapeHtml(abordagemRecomendada)}</p>
          </div>
        </td></tr>

        <!-- Pontos de Atenção -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 24px;">
          <h2 style="color:#06B7D8;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Pontos de Atenção</h2>
          <ul style="margin:0;padding-left:20px;">${pontosHtml}</ul>
        </td></tr>

        <!-- Respostas originais -->
        <tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 24px;">
          <h2 style="color:#06B7D8;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Respostas Originais</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1A3050;border-radius:8px;overflow:hidden;">
            <tr style="background:#0D1F35;">
              <td style="padding:8px 12px;color:#06B7D8;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #1A3050;">Campo</td>
              <td style="padding:8px 12px;color:#06B7D8;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #1A3050;">Resposta</td>
            </tr>
            ${respostasHtml}
          </table>
        </td></tr>

        <!-- CTA Sheet -->
        ${sheetLinkHtml ? `<tr><td style="background:#0A1628;border-left:1px solid #1A3050;border-right:1px solid #1A3050;padding:0 40px 32px;">${sheetLinkHtml}</td></tr>` : ''}

        <!-- Footer -->
        <tr><td style="background:#060E1C;border:1px solid #1A3050;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
          <p style="color:#4A5568;font-size:12px;margin:0;">Cineze CRM — gerado automaticamente via formulário de diagnóstico</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function labelFor(key: string): string {
  const labels: Record<string, string> = {
    segmento: 'Segmento',
    captacao: 'Como chegam hoje',
    presenca: 'Presença Digital',
    trafego: 'Já investiu em tráfego',
    dor: 'Maior desafio',
    meta: 'Meta de clientes/mês',
    urgencia: 'Urgência',
    contexto: 'Contexto livre',
  };
  return labels[key] || key;
}

export function buildEmailSubject(answers: DiagnosticAnswers, diagnostic: DiagnosticResult): string {
  const emoji = diagnostic.score >= 8 ? '🔴 QUENTE' : diagnostic.score >= 5 ? '🟡 MORNO' : '🔵 FRIO';
  return `[${emoji}] Novo lead: ${answers.nome || 'Sem nome'} — Score ${diagnostic.score}/10`;
}
