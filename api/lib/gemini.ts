import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LeadGratuito, DiagnosticoConteudo } from './types.js';

export type { LeadGratuito, DiagnosticoConteudo };

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function gerarDiagnosticoGratuito(r: LeadGratuito): Promise<DiagnosticoConteudo> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(montarPrompt(r));
  const raw = result.response.text();

  return parsearResposta(raw);
}

// ── Parser ────────────────────────────────────────────────────────────────────

function extrairBloco(raw: string, tag: string): string {
  const regex = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\n\\[|$)`, 'i');
  return raw.match(regex)?.[1]?.trim() ?? '';
}

function parsearResposta(raw: string): DiagnosticoConteudo {
  const scoreMatch = raw.match(/^SCORE:\s*(\d+)/im);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

  const tempMatch = raw.match(/^TEMPERATURA:\s*(QUENTE|MORNO|FRIO)/im);
  const temperatura = (tempMatch?.[1] ?? (score >= 8 ? 'QUENTE' : score >= 5 ? 'MORNO' : 'FRIO')) as 'QUENTE' | 'MORNO' | 'FRIO';

  const isPremium = score >= 9;

  const objecoes: string[] = [];
  for (const tag of ['OBJECAO_1', 'OBJECAO_2', 'OBJECAO_3']) {
    const txt = extrairBloco(raw, tag);
    if (txt) objecoes.push(txt);
  }

  return {
    score,
    temperatura,
    isPremium,
    perfil:        extrairBloco(raw, 'PERFIL'),
    produto:       extrairBloco(raw, 'PRODUTO'),
    whatsapp1:     extrairBloco(raw, 'WHATSAPP_1'),
    whatsapp2:     extrairBloco(raw, 'WHATSAPP_2'),
    objecoes,
    situacaoAtual: extrairBloco(raw, 'SITUACAO_ATUAL'),
    gargalo:       extrairBloco(raw, 'GARGALO'),
    custo:         extrairBloco(raw, 'CUSTO'),
    oportunidade:  extrairBloco(raw, 'OPORTUNIDADE'),
    recomendacao:  extrairBloco(raw, 'RECOMENDACAO'),
  };
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
Analise os dados e retorne APENAS o texto abaixo, sem HTML, sem markdown, sem explicações adicionais.

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

Retorne EXATAMENTE neste formato, substituindo o conteúdo entre colchetes:

SCORE: [número de 0 a 10]
TEMPERATURA: [QUENTE|MORNO|FRIO]
IS_PREMIUM: [true|false]

[PERFIL]
3 frases objetivas sobre quem é este cliente: momento do negócio, maturidade digital, urgência percebida. Usar dados reais — nada genérico.

[PRODUTO]
Se score 9-10: "🔥 LEAD PREMIUM — Pedro decide a abordagem" + 2-3 frases explicando por que este lead é especial e o que avaliar antes de qualquer oferta.
Se score 1-8: escolher Quick Start (R$297) OU Kit Lançamento (R$1.297/mês). Justificar em 2 frases por que este e não o outro. Citar o dado específico do formulário que embasou a escolha.

[WHATSAPP_1]
Mensagem para enviar em até 1h após receber o lead. Tom pessoal e direto, sem vender. Máximo 3 linhas. Usar o nome do cliente. Sem emojis excessivos.

[WHATSAPP_2]
Mensagem para enviar após ler todo o email. Mencionar 1-2 achados específicos deste cliente para criar curiosidade. Terminar perguntando se pode aprofundar em uma ligação rápida. Máximo 5 linhas. Tom: consultor que entrega valor.

[OBJECAO_1]
Objeção: [o que o cliente vai dizer] | Resposta: [o que Pedro fala — 1-2 frases]

[OBJECAO_2]
Objeção: [o que o cliente vai dizer] | Resposta: [o que Pedro fala — 1-2 frases]

[OBJECAO_3]
Objeção: [o que o cliente vai dizer] | Resposta: [o que Pedro fala — 1-2 frases]

[SITUACAO_ATUAL]
2-3 parágrafos descrevendo a situação atual com precisão. Usar nome, segmento, cidade, como chegam clientes, presença digital. Citar palavras exatas do contexto livre quando fizer sentido. O cliente deve ler e pensar: "essa pessoa realmente entendeu meu caso."

[GARGALO]
1 parágrafo direto sobre o gargalo principal identificado. Ser específico e levemente desconfortável — é aqui que o cliente reconhece a própria dor e confia na análise.

[CUSTO]
2-3 consequências concretas de continuar do jeito que está. Exemplos reais para o segmento e cidade. Realista e útil — não catastrófico.

[OPORTUNIDADE]
1 parágrafo sobre o que, resolvido nos próximos 30 dias, teria o maior impacto para este cliente específico. Mostrar que existe um caminho claro.

[RECOMENDACAO]
Se score 9-10: escrever apenas "Analisei seu caso com atenção e tenho uma proposta estruturada para você. Prefiro apresentar pessoalmente na nossa conversa — consigo montar algo mais preciso do que qualquer formato padrão entregaria. Quando podemos falar?"
Se score 1-8: apresentar o produto escolhido como próximo passo natural — não como oferta, mas como solução lógica. Descrever de forma concreta o que será entregue. Terminar com pergunta aberta. Tom: "com base no que vi, o caminho mais direto seria..."
`;
}
