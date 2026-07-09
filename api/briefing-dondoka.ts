import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Recebe as respostas já organizadas do formulário do Dondoka e envia
// um e-mail formatado (HTML) para o Pedro. Espelha o padrão de briefing-joao.ts.

interface Secao {
  titulo: string;
  itens: { pergunta: string; resposta: string }[];
}

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
    const { respondente, secoes } = (req.body || {}) as {
      respondente?: string;
      secoes?: Secao[];
    };

    if (!Array.isArray(secoes) || secoes.length === 0) {
      return res.status(400).json({ error: 'Faltam as seções de respostas.' });
    }

    const quem = (respondente || 'Não informado').trim();

    // Monta o corpo HTML organizado por seção
    const blocos = secoes
      .map((s) => {
        const linhas = s.itens
          .map(
            (i) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eef1f4;vertical-align:top;width:44%;color:#5b6b78;font-size:13px;">${escapeHtml(i.pergunta)}</td>
              <td style="padding:8px 0 8px 14px;border-bottom:1px solid #eef1f4;vertical-align:top;color:#1C2D3A;font-size:14px;font-weight:600;">${escapeHtml(i.resposta) || '<span style="color:#b0bcc6;font-weight:400">— em branco —</span>'}</td>
            </tr>`
          )
          .join('');
        return `
          <h2 style="font-size:15px;color:#fff;background:#1C2D3A;margin:22px 0 0;padding:9px 16px;border-radius:8px 8px 0 0;">${escapeHtml(s.titulo)}</h2>
          <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eef1f4;border-top:0;border-radius:0 0 8px 8px;padding:0 16px;">
            <tbody>${linhas}</tbody>
          </table>`;
      })
      .join('');

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#1C2D3A;">
        <div style="background:linear-gradient(90deg,#0066FF,#06B7D8);padding:22px 20px;border-radius:12px;color:#fff;">
          <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.85;">Diagnóstico respondido</div>
          <div style="font-size:23px;font-weight:800;margin-top:4px;">Dondoka Recepções</div>
          <div style="font-size:13px;opacity:.9;margin-top:4px;">Respondido por: <b>${escapeHtml(quem)}</b></div>
        </div>
        ${blocos}
        <p style="color:#8B9DB5;font-size:11px;margin-top:24px;text-align:center;">Enviado automaticamente pelo formulário /diagnostico-dondoka</p>
      </div>`;

    // Texto simples de fallback
    const texto =
      `DIAGNÓSTICO DONDOKA — respondido por: ${quem}\n\n` +
      secoes
        .map(
          (s) =>
            `== ${s.titulo} ==\n` +
            s.itens.map((i) => `${i.pergunta}\n> ${i.resposta || '(em branco)'}`).join('\n\n')
        )
        .join('\n\n');

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[briefing-dondoka] RESEND_API_KEY não configurada');
      return res.status(500).json({ error: 'Serviço de e-mail não configurado' });
    }
    const resend = new Resend(apiKey);
    const toEmail = process.env.PEDRO_EMAIL || 'pedro@cineze.com.br';

    await resend.emails.send({
      from: 'Cineze CRM <noreply@cineze.com.br>',
      to: toEmail,
      subject: `📋 Diagnóstico Dondoka — respondido por ${quem}`,
      html,
      text: texto,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[briefing-dondoka] Erro:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}
