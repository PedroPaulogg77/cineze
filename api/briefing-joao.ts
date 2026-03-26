import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
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
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ error: 'Faltam campos (subject ou body).' });
    }

    // API Key provided by user for this functionality
    const resendApiKey = 're_i68QJ4wF_DQEdGRPv7prxm1CmfVEps5b3'; 
    const resend = new Resend(resendApiKey);

    const toEmail = process.env.PEDRO_EMAIL || 'pedro@cineze.com.br';

    await resend.emails.send({
      from: 'Cineze CRM <noreply@cineze.com.br>',
      to: toEmail,
      subject: subject,
      text: body, // Sends as plain text format
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[briefing-joao] Erro:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
