import { google } from 'googleapis';
import type { LeadGratuito } from './gemini';

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// ── Append ────────────────────────────────────────────────────────────────────
export async function salvarLeadNoSheets(
  lead: LeadGratuito,
  score: number,
  temperatura: string,
) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
  const auth    = getAuthClient();
  const sheets  = google.sheets({ version: 'v4', auth });
  const agora   = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Cabeçalhos esperados na aba "Leads" (linha 1):
  // Data | Temperatura | Score | Nome | Email | Telefone | Segmento | Cidade |
  // Como chegam | Presença digital | Tráfego | Maior desafio | Meta clientes |
  // Urgência | Contexto livre | Status | Observações
  const linha = [
    agora,
    temperatura,
    score,
    lead.nome,
    lead.email,
    lead.telefone,
    lead.segmento,
    lead.cidade,
    lead.como_chegam,
    lead.presenca_digital,
    lead.investiu_trafego,
    lead.maior_desafio,
    lead.meta_clientes,
    lead.urgencia,
    lead.contexto_livre,
    '',   // Status — Pedro preenche manualmente
    '',   // Observações — Pedro preenche manualmente
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Leads!A:Q',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [linha] },
  });
}
