import crypto from 'crypto';

const PIXEL_ID = '1314140077415723';
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN!;

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface LeadEventParams {
  email: string;
  phone: string;
  nome: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
  userAgent?: string;
  clientIp?: string;
}

export async function enviarLeadCAPI(params: LeadEventParams): Promise<void> {
  const { email, phone, nome, fbp, fbc, sourceUrl, userAgent, clientIp } = params;

  // Monta o nome: primeiro nome e sobrenome separados
  const partes = nome.trim().split(/\s+/);
  const fn = partes[0] || '';
  const ln = partes.length > 1 ? partes[partes.length - 1] : '';

  const userData: Record<string, string> = {};
  if (email) userData.em = sha256(email);
  if (phone) userData.ph = sha256(phone.replace(/\D/g, ''));
  if (fn)    userData.fn = sha256(fn);
  if (ln)    userData.ln = sha256(ln);
  userData.country = sha256('br');
  userData.st = sha256('mg');
  userData.ct = sha256('belo horizonte');

  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: sourceUrl || 'https://cineze.com.br/diagnostico',
        user_data: userData,
      },
    ],
  };

  const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[CAPI] Erro ao enviar evento Lead:', error);
  } else {
    console.log('[CAPI] Evento Lead enviado com sucesso');
  }
}
