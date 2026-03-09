import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LeadGratuito } from './types.js';

export type { LeadGratuito };

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function gerarDiagnosticoGratuito(r: LeadGratuito): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 2000 },
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(montarPrompt(r));
  const raw = result.response.text();

  // Remove blocos de markdown ```html ... ``` que o modelo às vezes insere
  return raw.replace(/^```(?:html)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
}

// ── System Prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é Pedro Paulo, sócio-fundador da Cineze, agência de
growth marketing especializada em negócios locais no Brasil, baseada em BH.

Você tem 8 anos de experiência com mais de 200 empresas atendidas nos segmentos
de saúde, estética, educação, serviços locais e fitness.
Conhece benchmarks reais de CPM, CPC e CAC por segmento no mercado brasileiro.
Sabe o que funciona — e o que não funciona — para pequenos negócios em BH.

SEU ESTILO:
- Direto, consultivo e específico — nunca genérico
- Identifica o problema raiz, não os sintomas
- Cada análise usa obrigatoriamente os dados reais do cliente
- Proibido escrever frases que servem para qualquer negócio
- Fala como quem estudou o caso, não como vendedor

PRODUTOS QUE VOCÊ OFERECE (preços exatos, sem arredondar):
1. Quick Start — R$297 (único): landing page + Google Meu Negócio + 3 criativos em 7 dias
2. Kit Lançamento — R$1.297/mês: gestão Meta Ads + 4 criativos + landing + relatório mensal + 1 reunião

REGRA ABSOLUTA:
- Score 9-10: NÃO recomendar produto. Sinalizar como lead premium para Pedro decidir.
- Score 1-8: escolher UM produto (Quick Start OU Kit Lançamento) com base no perfil real.
  Nunca oferecer os dois. Nunca mencionar planos acima do Kit Lançamento.`;

// ── User Prompt ───────────────────────────────────────────────────────────────

function montarPrompt(r: LeadGratuito): string {
  return `
Um potencial cliente preencheu o formulário de diagnóstico gratuito da Cineze.
Gere o email completo para Pedro com as DUAS partes abaixo.

DADOS DO CLIENTE:
- Nome: ${r.nome}
- Segmento: ${r.segmento}
- Cidade/Bairro: ${r.cidade}
- Como chegam clientes hoje: ${r.como_chegam}
- Tem site ou landing page: ${r.presenca_digital}
- Já investiu em tráfego pago: ${r.investiu_trafego}
- Maior desafio: ${r.maior_desafio}
- Meta de clientes/mês: ${r.meta_clientes}
- Urgência: ${r.urgencia}
- Contexto livre (palavras exatas do cliente): ${r.contexto_livre}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTE 1 — BRIEFING INTERNO PARA PEDRO
Pedro lê antes de qualquer contato. Não é enviado ao cliente.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.1 SCORE E TEMPERATURA
Atribua um score de 0 a 10 para o potencial comercial deste lead.
Justificativa em 1 frase direta usando os dados reais.
Temperatura: QUENTE (8-10) / MORNO (5-7) / FRIO (0-4)
Formato: "Score: X/10 — [justificativa]"

1.2 PERFIL DO LEAD EM 3 LINHAS
Quem é este cliente em 3 frases objetivas.
Cobrir: momento do negócio, maturidade digital, urgência percebida.
Usar os dados reais — nada genérico.

1.3 PRODUTO RECOMENDADO
Se score 9 ou 10:
  Escrever: "🔥 LEAD PREMIUM — Pedro decide a abordagem"
  Explicar em 2-3 frases por que este lead é especial e o que avaliar
  antes de fazer qualquer oferta na call.

Se score 1 a 8:
  Escolher: Quick Start (R$297) OU Kit Lançamento (R$1.297/mês)
  Justificar em 2 frases por que este e não o outro.
  Citar o dado específico do formulário que embasou a escolha.

1.4 MENSAGEM 1 — WHATSAPP (enviar em até 1h após receber o lead)
Objetivo: avisar que recebeu o formulário e que vai entregar algo de valor.
Tom: pessoal e direto. Sem tentar vender.
Máximo 3 linhas. Usar o nome do cliente. Sem emojis excessivos.
Formato: caixa pronta para copiar.

1.5 MENSAGEM 2 — WHATSAPP (enviar após ler todo o email)
Pedro envia esta mensagem apresentando o diagnóstico ao cliente.
Mencionar 1-2 achados específicos deste cliente para criar curiosidade.
Terminar perguntando se pode aprofundar em uma ligação rápida.
Máximo 5 linhas. Tom: consultor que entrega valor, não vendedor.
Formato: caixa pronta para copiar.

1.6 OBJEÇÕES PROVÁVEIS DESTE CLIENTE
Baseadas nas respostas específicas dele — não lista genérica.
Formato por objeção:
  "Objeção: [o que ele vai dizer]"
  "Resposta: [o que Pedro fala — 1-2 frases]"
Máximo 3 objeções.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTE 2 — DIAGNÓSTICO PARA ENTREGAR AO CLIENTE
Pedro envia este conteúdo ao cliente como se tivesse preparado pessoalmente.
Tom: consultor especialista que analisou o caso com cuidado.
Linguagem: clara, direta, sem jargão técnico.
NUNCA mencionar IA, plataforma ou geração automática.
NUNCA usar frases genéricas — tudo deve ser verdadeiro para este cliente específico.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÍTULO: Diagnóstico Digital — ${r.nome} — ${r.segmento}

2.1 ONDE SEU NEGÓCIO ESTÁ HOJE
2-3 parágrafos descrevendo a situação atual com precisão.
Usar: nome, segmento, cidade, como chegam clientes, presença digital.
Citar as palavras exatas do contexto livre quando fizer sentido.
O cliente deve ler e pensar: "essa pessoa realmente entendeu meu caso."

2.2 O QUE ESTÁ TRAVANDO O CRESCIMENTO
1 parágrafo direto sobre o gargalo principal identificado.
Ser específico e levemente desconfortável — é aqui que o cliente
reconhece a própria dor e confia na análise.

2.3 O QUE ISSO ESTÁ CUSTANDO
2-3 consequências concretas de continuar do jeito que está.
Exemplos reais para o segmento e cidade.
Realista e útil — não catastrófico.

2.4 A MAIOR OPORTUNIDADE AGORA
1 parágrafo sobre o que, resolvido nos próximos 30 dias,
teria o maior impacto para este cliente específico.
Mostrar que existe um caminho claro.

2.5 O QUE EU RECOMENDO
Se score 9-10:
  Não mencionar produto. Escrever apenas:
  "Analisei seu caso com atenção e tenho uma proposta estruturada para você.
  Prefiro apresentar pessoalmente na nossa conversa — consigo montar algo
  mais preciso do que qualquer formato padrão entregaria. Quando podemos falar?"

Se score 1-8:
  Apresentar o produto escolhido (Quick Start ou Kit Lançamento)
  como próximo passo natural — não como oferta, mas como solução lógica.
  Descrever de forma concreta o que será entregue.
  Terminar com pergunta aberta para convidar a conversa.
  Tom: "com base no que vi, o caminho mais direto seria..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TABELA DE RESPOSTAS ORIGINAIS
Para referência de Pedro durante a ligação.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tabela com todos os campos e respostas exatas do formulário.

FORMATAÇÃO HTML DO EMAIL:
- Retornar HTML limpo com estilos inline (compatível com Outlook e Gmail)
- Largura máxima: 680px, centralizado
- Cabeçalho: fundo #0A0F1E, texto branco, "CINEZE — Diagnóstico Gratuito", nome do cliente em destaque

- Score em destaque grande (fonte 32px bold) com badge colorido por temperatura:
    QUENTE (8-10) → badge #22C55E (verde)
    MORNO  (5-7)  → badge #F59E0B (amarelo)
    FRIO   (0-4)  → badge #EF4444 (vermelho)
  Lead premium (9-10): adicionar badge extra "🔥 LEAD PREMIUM" em #FF6B00

- PARTE 1 (briefing interno):
    Fundo #F8F9FA, borda esquerda 4px sólida #6B7280
    Label no topo: "BRIEFING INTERNO — NÃO ENVIAR AO CLIENTE"
    em fonte pequena, cinza, maiúscula

- Mensagens de WhatsApp:
    Caixa com fundo #F0FDF4, borda #22C55E, fonte monospace
    Label: "📱 Copiar e enviar no WhatsApp"
    As duas mensagens em caixas separadas com label "Mensagem 1 (até 1h)" e "Mensagem 2 (após ler)"

- Objeções:
    Cada objeção em card com fundo #FEF3C7, borda #F59E0B
    "Objeção:" em negrito, "Resposta:" em texto normal

- PARTE 2 (diagnóstico para cliente):
    Fundo #FFFFFF, borda esquerda 4px sólida #0066FF
    Label no topo destacado: "📋 DIAGNÓSTICO PARA ENVIAR AO CLIENTE"
    em azul #0066FF, maiúscula, negrito

- Seção de produto recomendado:
    Score 9-10: fundo #FFF7ED, borda #FF6B00, label "🔥 DECISÃO DO PEDRO"
    Score 1-8: fundo #EFF6FF, borda #0066FF, label "✅ PRODUTO RECOMENDADO"
    Nome do produto em negrito, preço em destaque, bullets dos entregáveis

- Tabela de respostas: fundo #F8F9FA, rodapé, fonte pequena

- Seções com títulos em maiúscula, espaçamento generoso, fácil de escanear`;
}
