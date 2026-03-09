import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { google } from 'googleapis';

// ── Types ───────────────────────────────────────────────────────────────────
interface DiagnosticAnswers {
  nome?: string;
  email?: string;
  whatsapp?: string;
  segmento?: string;
  captacao?: string;
  presenca?: string;
  trafego?: string;
  dor?: string;
  meta?: string;
  urgencia?: string;
  contexto?: string;
}

interface DiagnosticResult {
  score: number;
  prioridade: string;
  variant: 'A' | 'B';
  resumoLead: string;
  perfilDigital: string;
  dorPrincipal: string;
  abordagemRecomendada: string;
  pontosDeAtencao: string[];
}

// ── Diagnostic Engine ───────────────────────────────────────────────────────
function gerarDiagnostico(answers: DiagnosticAnswers): DiagnosticResult {
  const { nome, segmento, captacao, presenca, trafego, dor, meta, urgencia, contexto } = answers;

  let score = 0;

  if (urgencia === 'Agora — preciso de resultado rápido') score += 3;
  else if (urgencia === 'Nos próximos 1-2 meses') score += 2;
  else if (urgencia === 'Mais pra frente, só estou pesquisando') score += 1;

  if (trafego === 'Sim, já invisto atualmente') score += 2;
  else if (trafego === 'Já tentei, mas parei') score += 1;

  if (meta === 'Mais de 50' || meta === 'Entre 20 e 50') score += 2;
  else if (meta === 'Entre 10 e 20') score += 1;

  if (presenca === 'Tenho, mas não converte' || presenca === 'Tenho presença, mas não converte clientes') score += 2;
  else if (presenca === 'Não tenho presença digital') score += 1;

  if (dor === 'Atrair novos clientes' || dor === 'Não sei bem por onde começar') score += 1;

  score = Math.min(score, 10);

  let prioridade: string;
  if (score >= 8) prioridade = '🔴 QUENTE — Ligar hoje';
  else if (score >= 5) prioridade = '🟡 MORNO — 24h';
  else prioridade = '🔵 FRIO — Nutrir';

  const variant: 'A' | 'B' = trafego === 'Sim, já invisto atualmente' ? 'A' : 'B';

  const nomeDisplay = nome || 'Este lead';
  const segmentoDisplay = segmento || 'negócio local';
  const captacaoDisplay = captacao || 'depende de indicações';
  const resumoLead = `${nomeDisplay} é um(a) ${segmentoDisplay} que hoje ${captacaoDisplay.toLowerCase()}.`;

  const presencaKey = presenca?.toLowerCase() || '';
  const trafegoKey = trafego?.toLowerCase() || '';

  let perfilDigital: string;
  if (presencaKey.includes('converte') && trafegoKey.includes('já invisto')) {
    perfilDigital = 'Tem estrutura digital ativa, mas não está convertendo bem. Provavelmente há gargalos na landing page, no público-alvo ou no funil pós-clique.';
  } else if (presencaKey.includes('converte') && trafegoKey.includes('já tentei')) {
    perfilDigital = 'Já tentou tráfego pago, mas a presença digital não converte. O problema pode ser a oferta, o copy ou a página de destino.';
  } else if (presencaKey.includes('converte') && (trafegoKey.includes('nunca') || trafegoKey === '')) {
    perfilDigital = 'Tem presença online, mas ainda não usa tráfego pago. Grande potencial de escala com a estrutura certa de campanha.';
  } else if (presencaKey.includes('não tenho') && trafegoKey.includes('já invisto')) {
    perfilDigital = 'Investe em tráfego, mas sem presença digital consolidada. Provavelmente está queimando verba sem landing page ou perfil otimizados.';
  } else if (presencaKey.includes('não tenho') && trafegoKey.includes('já tentei')) {
    perfilDigital = 'Tentou tráfego pago sem uma base digital sólida — o que explica os resultados fracos. Precisa de estrutura antes de investir novamente.';
  } else if (presencaKey.includes('não tenho') && (trafegoKey.includes('nunca') || trafegoKey === '')) {
    perfilDigital = 'Sem presença digital e sem experiência com tráfego. Está completamente dependente de indicações — alta vulnerabilidade de receita.';
  } else if (presencaKey.includes('traz clientes') && trafegoKey.includes('já invisto')) {
    perfilDigital = 'Presença digital funcionando e tráfego pago ativo. Momento ideal para escalar e otimizar o custo por aquisição.';
  } else {
    perfilDigital = 'Tem presença digital que já traz resultados, mas ainda não explorou o potencial de tráfego pago para crescer mais rápido.';
  }

  const dorMap: Record<string, string> = {
    'Atrair novos clientes': 'Dificuldade em gerar fluxo constante de novos clientes — o negócio depende demais de indicações ou sazonalidade.',
    'Reter clientes existentes': 'Tem clientes entrando, mas a retenção é baixa. Falta processo de fidelização e recompra programada.',
    'Aumentar o ticket médio': 'O volume de clientes é razoável, mas o faturamento não cresce proporcionalmente. Oportunidade clara em upsell e posicionamento premium.',
    'Não sei bem por onde começar': 'Sem clareza sobre prioridades de marketing. Precisa de um diagnóstico estruturado para definir o próximo passo com segurança.',
  };
  const dorPrincipal = dorMap[dor || ''] || 'Enfrenta desafios de marketing que impactam diretamente o crescimento do negócio.';

  let prefix = '';
  if (urgencia === 'Agora — preciso de resultado rápido') prefix = 'Abordagem direta e focada em resultado rápido. ';
  else if (urgencia === 'Nos próximos 1-2 meses') prefix = 'Planejamento de curto prazo com ações de impacto. ';
  else prefix = 'Nutrição educativa com conteúdo de valor antes de apresentar proposta. ';

  let pitch = '';
  if (trafego === 'Sim, já invisto atualmente') pitch = 'Mostrar como otimizar o que já existe e escalar com mais eficiência. ';
  else if (trafego === 'Já tentei, mas parei') pitch = 'Entender por que parou e mostrar a diferença de ter estratégia vs. impulsionamento aleatório. ';
  else pitch = 'Educar sobre tráfego pago e apresentar cases do segmento antes de falar em investimento. ';

  let pergunta = '';
  if (dor === 'Atrair novos clientes') pergunta = 'Pergunta de abertura: "Quantos clientes novos você atrai por mês hoje, sem contar indicações?"';
  else if (dor === 'Reter clientes existentes') pergunta = 'Pergunta de abertura: "Qual % dos seus clientes voltam ou indicam espontaneamente?"';
  else if (dor === 'Aumentar o ticket médio') pergunta = 'Pergunta de abertura: "Qual é o seu serviço mais caro hoje e quantas vezes ele foi vendido esse mês?"';
  else pergunta = 'Pergunta de abertura: "Se você pudesse resolver um único problema de marketing agora, qual seria?"';

  const abordagemRecomendada = prefix + pitch + pergunta;

  const pontos: string[] = [];
  if (presencaKey.includes('não tenho') && trafegoKey.includes('invisto')) {
    pontos.push('⚠️ Queimando verba: investe em tráfego sem landing page ou perfil digital otimizado.');
  }
  if (trafegoKey.includes('nunca') && (presencaKey.includes('não tenho') || presencaKey === '')) {
    pontos.push('📌 Lead sem referência técnica — explicar conceitos básicos de tráfego na abordagem.');
  }
  if (presencaKey.includes('converte') && trafegoKey.includes('nunca')) {
    pontos.push('💡 Alta oportunidade: tem presença mas nunca usou tráfego. Fácil de mostrar valor rapidamente.');
  }
  if (score >= 8) {
    pontos.push('🔥 Lead quente — resposta em menos de 2 horas aumenta muito a taxa de conversão.');
  }
  if (contexto && contexto.length > 20) {
    pontos.push(`📝 Contexto livre: "${contexto.substring(0, 80)}${contexto.length > 80 ? '...' : ''}"`);
  }
  if (meta === 'Mais de 50') {
    pontos.push('🎯 Meta ambiciosa (50+ clientes/mês) — lead com alto potencial de ticket.');
  }

  return {
    score,
    prioridade,
    variant,
    resumoLead,
    perfilDigital,
    dorPrincipal,
    abordagemRecomendada,
    pontosDeAtencao: pontos,
  };
}

// ── Email Template ──────────────────────────────────────────────────────────
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

function buildEmailSubject(answers: DiagnosticAnswers, diagnostic: DiagnosticResult): string {
  const emoji = diagnostic.score >= 8 ? '🔴 QUENTE' : diagnostic.score >= 5 ? '🟡 MORNO' : '🔵 FRIO';
  return `[${emoji}] Novo lead: ${answers.nome || 'Sem nome'} — Score ${diagnostic.score}/10`;
}

function buildEmailHtml(answers: DiagnosticAnswers, diagnostic: DiagnosticResult, sheetUrl?: string): string {
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

// ── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const answers = req.body || {};
  const { nome, email } = answers;

  if (!nome || !email) {
    return res.status(400).json({ error: 'nome e email são obrigatórios' });
  }

  const diagnostic = gerarDiagnostico(answers);

  const sheetIdRaw = process.env.GOOGLE_SHEET_ID || '';
  const sheetIdMatch = sheetIdRaw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  const sheetId = sheetIdMatch ? sheetIdMatch[1] : sheetIdRaw;
  const sheetUrl = sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}` : undefined;

  const [sheetsResult, emailResult] = await Promise.allSettled([
    appendToGoogleSheets(answers, diagnostic),
    sendEmailToPedro(answers, diagnostic, sheetUrl),
  ]);

  if (sheetsResult.status === 'rejected') {
    console.error('[submit-diagnostico] Google Sheets error:', sheetsResult.reason);
  }
  if (emailResult.status === 'rejected') {
    console.error('[submit-diagnostico] Email error:', emailResult.reason);
  }

  return res.status(200).json({
    ok: true,
    variant: diagnostic.variant,
    score: diagnostic.score,
  });
}

// ── Google Sheets ──────────────────────────────────────────────────────────
async function appendToGoogleSheets(answers: Record<string, string>, diagnostic: DiagnosticResult) {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetIdRaw = process.env.GOOGLE_SHEET_ID || '';
  const sheetIdMatch = sheetIdRaw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  const sheetId = sheetIdMatch ? sheetIdMatch[1] : sheetIdRaw;

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    throw new Error('Google Sheets env vars ausentes');
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const row = [
    now,
    answers.nome || '',
    answers.email || '',
    answers.whatsapp || '',
    answers.segmento || '',
    answers.captacao || '',
    answers.presenca || '',
    answers.trafego || '',
    answers.dor || '',
    answers.meta || '',
    answers.urgencia || '',
    answers.contexto || '',
    String(diagnostic.score),
    diagnostic.variant,
    diagnostic.resumoLead,
    diagnostic.perfilDigital,
    diagnostic.dorPrincipal,
    diagnostic.abordagemRecomendada,
    diagnostic.pontosDeAtencao.join(' | '),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Leads!A:S',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

// ── Email para Pedro ───────────────────────────────────────────────────────
async function sendEmailToPedro(answers: Record<string, string>, diagnostic: DiagnosticResult, sheetUrl?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const pedroEmail = process.env.PEDRO_EMAIL;

  if (!apiKey || !pedroEmail) {
    throw new Error('RESEND_API_KEY ou PEDRO_EMAIL ausentes');
  }

  const resend = new Resend(apiKey);
  const subject = buildEmailSubject(answers, diagnostic);
  const html = buildEmailHtml(answers, diagnostic, sheetUrl);

  const { error } = await resend.emails.send({
    from: 'Cineze CRM <noreply@cineze.com.br>',
    to: pedroEmail,
    subject,
    html,
  });

  if (error) throw error;
}
