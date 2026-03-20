# Implementar Meta Conversions API (CAPI) server-side no funil de diagnóstico

Preciso que você implemente o envio do evento "Lead" via Meta Conversions API (CAPI) server-side. São 3 alterações:

---

## 1. Frontend: `src/pages/Diagnostico.tsx`

Na função `submitForm()`, antes do fetch, leia os cookies `_fbp` e `_fbc` do browser e envie-os junto com os dados do formulário. Altere assim:

```tsx
const submitForm = () => {
    setIsSubmitting(true);

    const variant = answers["trafego"] === "Sim, já invisto atualmente" ? 'a' : 'b';
    const params = new URLSearchParams({
        nome:  answers["nome"]     || "",
        email: answers["email"]    || "",
        phone: answers["whatsapp"] || "",
    });

    // Lê cookies do Meta Pixel para enviar ao servidor (CAPI)
    const getCookie = (name: string) =>
        document.cookie.split('; ').find(c => c.startsWith(name + '='))?.split('=')[1] || '';

    fetch('/api/diagnostico-gratuito', {
        method:    'POST',
        headers:   { 'Content-Type': 'application/json' },
        body:      JSON.stringify({
            ...answers,
            _fbp: getCookie('_fbp'),
            _fbc: getCookie('_fbc'),
            source_url: window.location.href,
            user_agent: navigator.userAgent,
        }),
        keepalive: true,
    }).catch(console.error);

    navigate(`/diagnostico/obrigado-${variant}?${params.toString()}`);
};
```

---

## 2. Backend: Criar `api/lib/meta-capi.ts`

Crie este arquivo novo:

```ts
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
```

---

## 3. Backend: Alterar `api/diagnostico-gratuito.ts`

Adicione o import do CAPI e chame a função após salvar no Sheets. As alterações são:

No topo, adicione o import:
```ts
import { enviarLeadCAPI } from './lib/meta-capi.js';
```

Dentro do try, logo após o `await salvarLeadNoSheets(respostas, score, temperatura);`, adicione:

```ts
    // 2.5 Enviar evento Lead via Meta Conversions API (CAPI)
    enviarLeadCAPI({
      email:     respostas.email,
      phone:     respostas.telefone,
      nome:      respostas.nome,
      fbp:       body._fbp,
      fbc:       body._fbc,
      sourceUrl: body.source_url,
      userAgent: body.user_agent,
      clientIp:  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
                 || req.socket?.remoteAddress || '',
    }).catch(err => console.error('[CAPI] Falha (não bloqueante):', err));
```

Note: o `enviarLeadCAPI` é chamado SEM await de propósito — ele roda em background e não bloqueia a resposta ao usuário. O `.catch()` garante que falhas na CAPI não quebram o fluxo principal.

---

## 4. Variável de ambiente necessária

Após implementar, eu preciso adicionar a variável `META_CAPI_TOKEN` na Vercel. NÃO crie essa variável — apenas implemente o código. Eu gero o token no Meta Events Manager depois.

---

Não mude nada além do que está descrito acima. Mantenha todo o resto do código intacto.
