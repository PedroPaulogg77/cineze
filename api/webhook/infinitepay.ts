import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback to various common ENV prefixes depending on how Vercel is configured
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = req.body;

        // Logging body to check in Vercel logs
        console.log("Webhook InfinitePay Payload recebido:", JSON.stringify(payload, null, 2));

        let email = "";
        let name = "";

        // Tentativa de extração de e-mail e nome com base nos padrões mais comuns da InfinitePay
        if (payload?.customer?.email) {
            email = payload.customer.email;
            name = payload.customer.name;
        } else if (payload?.email) {
            email = payload.email;
            name = payload.name;
        } else if (payload?.metadata?.email) {
            email = payload.metadata.email;
        }

        if (!email) {
            console.warn("Não foi possível encontrar o email no payload para criar o usuário.");
            // Retornar 200 de qualquer forma para não fazer a InfinitePay reenviar o webhook infinito
            return res.status(200).json({ received: true, note: "No email found in payload" });
        }

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Credenciais do Supabase ausentes nas variáveis de ambiente.");
            return res.status(500).json({ error: "Configurações de banco de dados pendentes." });
        }

        const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

        // Criar o usuário no Supabase Auth usando o admin API
        const { data: user, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: { name: name || "Cliente Cineze InfinitePay" }
        });

        if (createError) {
            // Se o usuário já existir, apenas ignoramos
            if (createError.message.includes("already") || createError.status === 422) {
                console.log("Usuário já existe no banco de dados:", email);
                return res.status(200).json({ received: true, note: "User already exists" });
            }
            console.error("Erro ao criar usuário no Supabase Auth:", createError);
            return res.status(500).json({ error: "Erro na integração com banco de dados." });
        }

        console.log("Usuário criado com sucesso no Supabase! ID:", user?.user?.id);

        return res.status(200).json({ received: true, userId: user?.user?.id });
    } catch (error: any) {
        console.error("Erro interno no processamento do webhook:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
