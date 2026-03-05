import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function gerarOrderNsu(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `cineze-${timestamp}-${random}`;
}

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { nome, email, phone } = request.body || {};

    if (!email) {
        return response.status(400).json({ error: 'Email obrigatório' });
    }

    // 1. Salvar pedido no Supabase antes de ir para InfinitePay
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Credenciais Supabase ausentes");
        return response.status(500).json({ error: "Configuração de banco ausente" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const orderNsu = gerarOrderNsu();

    const { error: insertError } = await supabase
        .from('pedidos')
        .insert({ order_nsu: orderNsu, email: email.toLowerCase().trim(), status: 'pendente' });

    if (insertError) {
        console.error("Erro ao salvar pedido:", insertError);
        return response.status(500).json({ error: "Erro ao registrar pedido" });
    }

    // 2. Criar link de checkout na InfinitePay
    try {
        const payload = {
            handle: "cineze",
            items: [
                {
                    quantity: 1,
                    price: 100, // TEMPORÁRIO para teste — voltar para 6700
                    description: "Diagnóstico Empresarial Cineze"
                }
            ],
            order_nsu: orderNsu,
            redirect_url: "https://diagnostico.cineze.com.br/login",
            webhook_url: "https://diagnostico.cineze.com.br/api/webhook/infinitepay",
            customer: {
                name: nome || "",
                email: email.toLowerCase().trim(),
                phone_number: phone || ""
            }
        };

        const res = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("InfinitePay error:", data);
            return response.status(res.status).json({ error: "Erro ao gerar checkout", details: data });
        }

        const url = data.url ?? data.link ?? data.checkout_url ?? data.payment_url ?? data.data?.attributes?.url ?? "";

        if (!url) {
            console.error("InfinitePay não retornou URL:", data);
            return response.status(502).json({ error: "Link de pagamento não gerado" });
        }

        return response.status(200).json({ url });
    } catch (err: any) {
        console.error("Erro ao criar checkout:", err);
        return response.status(500).json({ error: "Erro interno no servidor", details: err.message });
    }
}
