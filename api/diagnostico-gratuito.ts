import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { gerarDiagnosticoGratuito, type LeadGratuito, type DiagnosticoConteudo } from './lib/gemini.js';
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

// ── HTML Builder ──────────────────────────────────────────────────────────────

function e(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function buildEmailHtml(c: DiagnosticoConteudo, lead: LeadGratuito): string {
  const badgeColor = c.temperatura === 'QUENTE' ? '#22C55E' : c.temperatura === 'MORNO' ? '#F59E0B' : '#EF4444';

  const objecoesHtml = c.objecoes.map(o => {
    const [objecaoPart, respostaPart] = o.split('|');
    return `
    <div style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:6px;padding:12px 16px;margin-bottom:10px;">
      <p style="margin:0 0 6px 0;"><strong>${e(objecaoPart?.trim() ?? o)}</strong></p>
      ${respostaPart ? `<p style="margin:0;">${e(respostaPart.trim())}</p>` : ''}
    </div>`;
  }).join('');

  const tabelaRows = [
    ['Nome', lead.nome],
    ['Email', lead.email],
    ['Telefone', lead.telefone],
    ['Segmento', lead.segmento],
    ['Cidade/Bairro', lead.cidade],
    ['Como chegam clientes', lead.como_chegam],
    ['Presença digital', lead.presenca_digital],
    ['Investiu em tráfego', lead.investiu_trafego],
    ['Maior desafio', lead.maior_desafio],
    ['Meta de clientes/mês', lead.meta_clientes],
    ['Urgência', lead.urgencia],
    ['Contexto livre', lead.contexto_livre],
  ].map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #E5E7EB;white-space:nowrap;">${e(label)}</td>
      <td style="padding:8px 12px;color:#6B7280;border-bottom:1px solid #E5E7EB;">${e(value)}</td>
    </tr>`).join('');

  const produtoBoxStyle = c.isPremium
    ? 'background:#FFF7ED;border-left:4px solid #FF6B00;'
    : 'background:#EFF6FF;border-left:4px solid #0066FF;';
  const produtoLabel = c.isPremium
    ? '🔥 DECISÃO DO PEDRO'
    : '✅ PRODUTO RECOMENDADO';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,sans-serif;">
<div style="max-width:680px;margin:0 auto;background:#ffffff;">

  <!-- Header -->
  <div style="background:#0A0F1E;padding:32px 40px;text-align:center;">
    <p style="margin:0 0 8px 0;color:#9CA3AF;font-size:12px;letter-spacing:2px;text-transform:uppercase;">CINEZE — Diagnóstico Gratuito</p>
    <h1 style="margin:0;color:#ffffff;font-size:24px;">${e(lead.nome)}</h1>
    <p style="margin:8px 0 0 0;color:#9CA3AF;font-size:14px;">${e(lead.segmento)} · ${e(lead.cidade)}</p>
  </div>

  <!-- Score Badge -->
  <div style="background:#111827;padding:24px 40px;text-align:center;">
    <span style="background:${badgeColor};color:#fff;font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;">${c.temperatura}</span>
    ${c.isPremium ? '<span style="background:#FF6B00;color:#fff;font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px;margin-left:8px;">🔥 LEAD PREMIUM</span>' : ''}
    <div style="margin-top:12px;color:#ffffff;font-size:48px;font-weight:700;line-height:1;">${c.score}<span style="font-size:24px;color:#9CA3AF;">/10</span></div>
  </div>

  <div style="padding:32px 40px;">

    <!-- PARTE 1 — Briefing interno -->
    <div style="background:#F8F9FA;border-left:4px solid #6B7280;border-radius:0 8px 8px 0;padding:24px;margin-bottom:32px;">
      <p style="margin:0 0 20px 0;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:2px;text-transform:uppercase;">BRIEFING INTERNO — NÃO ENVIAR AO CLIENTE</p>

      <h2 style="margin:0 0 8px 0;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:1px;">Perfil do Lead</h2>
      <p style="margin:0 0 20px 0;color:#374151;line-height:1.6;">${e(c.perfil)}</p>

      <div style="${produtoBoxStyle}border-radius:0 6px 6px 0;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:1px;text-transform:uppercase;">${produtoLabel}</p>
        <p style="margin:0;color:#374151;line-height:1.6;">${e(c.produto)}</p>
      </div>

      <h2 style="margin:0 0 12px 0;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:1px;">📱 WhatsApp — Mensagem 1 (até 1h)</h2>
      <div style="background:#F0FDF4;border:1px solid #22C55E;border-radius:6px;padding:14px 16px;margin-bottom:16px;">
        <p style="margin:0 0 6px 0;font-size:11px;color:#16A34A;font-weight:700;">Copiar e enviar no WhatsApp</p>
        <pre style="margin:0;font-family:monospace;font-size:13px;color:#374151;white-space:pre-wrap;">${e(c.whatsapp1)}</pre>
      </div>

      <h2 style="margin:0 0 12px 0;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:1px;">📱 WhatsApp — Mensagem 2 (após ler)</h2>
      <div style="background:#F0FDF4;border:1px solid #22C55E;border-radius:6px;padding:14px 16px;margin-bottom:20px;">
        <p style="margin:0 0 6px 0;font-size:11px;color:#16A34A;font-weight:700;">Copiar e enviar no WhatsApp</p>
        <pre style="margin:0;font-family:monospace;font-size:13px;color:#374151;white-space:pre-wrap;">${e(c.whatsapp2)}</pre>
      </div>

      ${c.objecoes.length > 0 ? `
      <h2 style="margin:0 0 12px 0;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:1px;">Objeções Prováveis</h2>
      ${objecoesHtml}` : ''}
    </div>

    <!-- PARTE 2 — Diagnóstico para cliente -->
    <div style="background:#FFFFFF;border-left:4px solid #0066FF;border-radius:0 8px 8px 0;padding:24px;margin-bottom:32px;">
      <p style="margin:0 0 20px 0;font-size:11px;font-weight:700;color:#0066FF;letter-spacing:2px;text-transform:uppercase;">📋 DIAGNÓSTICO PARA ENVIAR AO CLIENTE</p>

      <h2 style="margin:0 0 8px 0;font-size:15px;color:#111827;">Onde Seu Negócio Está Hoje</h2>
      <p style="margin:0 0 20px 0;color:#374151;line-height:1.7;">${e(c.situacaoAtual)}</p>

      <h2 style="margin:0 0 8px 0;font-size:15px;color:#111827;">O Que Está Travando o Crescimento</h2>
      <p style="margin:0 0 20px 0;color:#374151;line-height:1.7;">${e(c.gargalo)}</p>

      <h2 style="margin:0 0 8px 0;font-size:15px;color:#111827;">O Que Isso Está Custando</h2>
      <p style="margin:0 0 20px 0;color:#374151;line-height:1.7;">${e(c.custo)}</p>

      <h2 style="margin:0 0 8px 0;font-size:15px;color:#111827;">A Maior Oportunidade Agora</h2>
      <p style="margin:0 0 20px 0;color:#374151;line-height:1.7;">${e(c.oportunidade)}</p>

      <h2 style="margin:0 0 8px 0;font-size:15px;color:#111827;">O Que Eu Recomendo</h2>
      <p style="margin:0;color:#374151;line-height:1.7;">${e(c.recomendacao)}</p>
    </div>

    <!-- Tabela de respostas -->
    <div style="background:#F8F9FA;border-radius:8px;overflow:hidden;">
      <p style="margin:0;padding:12px 16px;font-size:11px;font-weight:700;color:#6B7280;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #E5E7EB;">Respostas Originais do Formulário</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tbody>${tabelaRows}</tbody>
      </table>
    </div>

  </div>
</div>
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

  try {
    const body = (req.body || {}) as Record<string, string>;

    if (!body.nome || !body.email) {
      return res.status(400).json({ error: 'nome e email são obrigatórios' });
    }

    const respostas = mapearCampos(body);

    // 1. Gerar diagnóstico com Gemini (retorna objeto estruturado)
    const conteudo = await gerarDiagnosticoGratuito(respostas);

    // 2. Montar HTML do email
    const emailHtml = buildEmailHtml(conteudo, respostas);

    // variant para o redirect do frontend (mantém compatibilidade)
    const trafego = respostas.investiu_trafego.toLowerCase();
    const variant = trafego.includes('já invisto') ? 'A' : 'B';

    // 3. Salvar no Google Sheets
    await salvarLeadNoSheets(respostas, conteudo.score, conteudo.temperatura);

    // 4. Enviar email para Pedro
    const resend      = new Resend(process.env.RESEND_API_KEY!);
    const pedroEmail  = process.env.PEDRO_EMAIL!;
    const subjectPrefix = conteudo.isPremium ? '🔥 LEAD PREMIUM' : `[${conteudo.temperatura}]`;

    await resend.emails.send({
      from:    'Cineze CRM <noreply@cineze.com.br>',
      to:      pedroEmail,
      subject: `${subjectPrefix} ${respostas.nome} — ${respostas.segmento} — Score ${conteudo.score}/10`,
      html:    emailHtml,
    });

    return res.status(200).json({ ok: true, variant, score: conteudo.score, temperatura: conteudo.temperatura });
  } catch (error) {
    console.error('[diagnostico-gratuito] Erro:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
