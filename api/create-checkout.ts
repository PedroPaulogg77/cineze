import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    // CORS configuration for local testing if needed
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

    try {
        const payload = {
            handle: "cineze",
            items: [
                {
                    quantity: 1,
                    price: 100, // R$ 1,00 temporário para teste - alterar para 6700 depois
                    description: "Diagnóstico Empresarial Cineze"
                }
            ],
            redirect_url: "https://diagnostico.cineze.com.br",
            webhook_url: "https://diagnostico.cineze.com.br/api/webhook/infinitepay",
            customer: {
                name: nome || "",
                email: email || "",
                phone_number: phone || ""
            }
        };

        const res = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("InfinitePay error:", data);
            return response.status(res.status).json({
                error: "Erro ao gerar checkout na InfinitePay",
                details: data
            });
        }

        // Try to extract the URL from different common structural responses
        let url = "";
        if (data.url) {
            url = data.url;
        } else if (data.data?.attributes?.url) {
            url = data.data.attributes.url;
        } else if (data.website_url) {
            url = data.website_url;
        } else if (data.payment_url) {
            url = data.payment_url;
        } else {
            url = data; // If it's a string or fallback to raw
        }

        return response.status(200).json({ url, raw: data });
    } catch (err: any) {
        console.error("Error creating checkout:", err);
        return response.status(500).json({ error: "Erro interno no servidor.", details: err.message });
    }
}
