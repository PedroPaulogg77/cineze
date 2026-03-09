import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { google } from 'googleapis';
import { gerarDiagnostico } from './lib/diagnostic-engine';
import { buildEmailHtml, buildEmailSubject } from './lib/email-template-pedro';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS ───────────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Validação ──────────────────────────────────────────────────────────────
  const answers = req.body || {};
  const { nome, email } = answers;

  if (!nome || !email) {
    return res.status(400).json({ error: 'nome e email são obrigatórios' });
  }

  // ── Diagnóstico (síncrono) ─────────────────────────────────────────────────
  const diagnostic = gerarDiagnostico(answers);

  // ── Side effects em paralelo ───────────────────────────────────────────────
  const sheetId = process.env.GOOGLE_SHEET_ID;
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
async function appendToGoogleSheets(answers: Record<string, string>, diagnostic: ReturnType<typeof gerarDiagnostico>) {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

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
    now,                              // A - Data/Hora
    answers.nome || '',               // B - Nome
    answers.email || '',              // C - Email
    answers.whatsapp || '',           // D - WhatsApp
    answers.segmento || '',           // E - Segmento
    answers.captacao || '',           // F - Como Chegam Hoje
    answers.presenca || '',           // G - Presença Digital
    answers.trafego || '',            // H - Já Investiu em Tráfego
    answers.dor || '',                // I - Maior Desafio
    answers.meta || '',               // J - Meta de Clientes/Mês
    answers.urgencia || '',           // K - Urgência
    answers.contexto || '',           // L - Contexto Livre
    String(diagnostic.score),         // M - Score Prioridade
    diagnostic.variant,               // N - Variante Funil
    diagnostic.resumoLead,            // O - Resumo do Lead
    diagnostic.perfilDigital,         // P - Perfil Digital
    diagnostic.dorPrincipal,          // Q - Dor Principal
    diagnostic.abordagemRecomendada,  // R - Abordagem Recomendada
    diagnostic.pontosDeAtencao.join(' | '), // S - Pontos de Atenção
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Leads!A:S',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

// ── Email para Pedro ───────────────────────────────────────────────────────
async function sendEmailToPedro(answers: Record<string, string>, diagnostic: ReturnType<typeof gerarDiagnostico>, sheetUrl?: string) {
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
