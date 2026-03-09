import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Types ────────────────────────────────────────────────────────────────────
export interface LeadGratuito {
  nome: string;
  email: string;
  telefone?: string;
  segmento: string;
  cidade: string;
  como_chegam: string;
  presenca_digital: string;
  investiu_trafego: string;
  maior_desafio: string;
  meta_clientes: string;
  urgencia: string;
  contexto_livre?: string;
}

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT_CONSULTOR = `Você é Pedro Paulo, sócio-consultor da Cineze, agência de marketing \
digital especializada em negócios locais e pequenas empresas no Brasil.

SOBRE A CINEZE:
A Cineze é uma agência de resultados baseada em Belo Horizonte. \
Não trabalhamos com qualquer cliente — somos seletivos e focados em \
negócios que têm potencial real de crescimento com marketing digital.
Nosso modelo de trabalho começa sempre com diagnóstico antes de \
qualquer proposta. Entregamos o Quick Start (landing page + Google \
Meu Negócio + criativos em 7 dias por R$297) como porta de entrada, \
e gestão completa de marketing para clientes que querem escalar.

SEU PERFIL:
Você tem 8 anos de experiência em marketing digital para negócios \
locais brasileiros. Já acompanhou mais de 200 empresas de segmentos \
como saúde, beleza, jurídico, educação, alimentação e serviços em geral.
Você conhece os benchmarks reais de CPM, CPC e CAC de cada segmento.
Você sabe exatamente o que funciona e o que não funciona para \
negócios locais em Belo Horizonte e região.

SEU ESTILO:
- Direto e específico — nunca genérico
- Fala como consultor, não como vendedor
- Usa dados reais do mercado brasileiro
- Identifica o problema raiz, não os sintomas
- Entrega insights que o cliente não conseguiria sozinho
- Nunca promete resultado financeiro — promete clareza e estrutura

REGRA PRINCIPAL:
Toda análise deve usar obrigatoriamente os dados específicos \
que o cliente informou. Proibido escrever frases que poderiam \
servir para qualquer negócio. Cada frase deve ser verdadeira \
especificamente para este cliente.`;

// ── User Prompt ───────────────────────────────────────────────────────────────
function montarPromptUsuario(respostas: LeadGratuito): string {
  return `Com base nas respostas abaixo de um potencial cliente que preencheu \
nosso formulário de diagnóstico gratuito, gere o relatório interno \
completo conforme a estrutura solicitada.

DADOS DO CLIENTE:
- Nome: ${respostas.nome}
- Segmento: ${respostas.segmento}
- Cidade/Bairro: ${respostas.cidade}
- Como chegam clientes hoje: ${respostas.como_chegam}
- Presença digital: ${respostas.presenca_digital}
- Já investiu em tráfego: ${respostas.investiu_trafego}
- Maior desafio: ${respostas.maior_desafio}
- Meta de clientes/mês: ${respostas.meta_clientes}
- Urgência: ${respostas.urgencia}
- Contexto livre: ${respostas.contexto_livre || 'Não informado'}

ESTRUTURA DO RELATÓRIO (retorne em HTML limpo, sem markdown):

<secao id="cabecalho">
  Score de 0 a 10 com justificativa em 1 frase.
  Temperatura: QUENTE (8-10) / MORNO (5-7) / FRIO (0-4)
  Cor do badge: verde / amarelo / vermelho
</secao>

<secao id="diagnostico">
  2.1 SITUAÇÃO ATUAL
  2-3 parágrafos específicos sobre onde o negócio está hoje.
  Usar nome, segmento, cidade e dados reais das respostas.

  2.2 PROBLEMA PRINCIPAL
  1 parágrafo direto sobre o gargalo identificado.
  Citar as palavras do cliente quando possível.

  2.3 O QUE ESTÁ CUSTANDO CARO
  2-3 consequências concretas de não resolver agora.
  Específicas para o segmento e cidade.

  2.4 MAIOR OPORTUNIDADE
  1 parágrafo sobre o que resolvido nos próximos 30 dias
  teria maior impacto. Específico para este cliente.
</secao>

<secao id="inteligencia_segmento">
  3.1 COMO O SEGMENTO CAPTA CLIENTES
  2-3 estratégias que funcionam para este segmento no Brasil.

  3.2 BENCHMARK DE INVESTIMENTO
  Faixa de investimento, CPM e CPC estimados para o segmento.

  3.3 ERRO MAIS COMUM DO SEGMENTO
  O erro que 80% dos negócios desse segmento cometem.
</secao>

<secao id="scripts_whatsapp">
  MENSAGEM 1 — PRIMEIRO CONTATO (enviar em até 1h):
  [mensagem personalizada pronta para copiar]

  MENSAGEM 2 — ENTREGA DO DIAGNÓSTICO (enviar após ler):
  [mensagem com 2 insights específicos deste cliente]

  MENSAGEM 3 — FOLLOW-UP 24H:
  [mensagem curta de reativação]
</secao>

<secao id="preparacao_ligacao">
  5.1 PERGUNTA DE ABERTURA
  Uma pergunta específica usando os dados do formulário.

  5.2 SINAL PARA OFERECER O QUICK START
  O que o cliente vai dizer que indica que está pronto.

  5.3 OBJEÇÕES PROVÁVEIS
  Baseadas nas respostas específicas dele.
  Para cada objeção: resposta recomendada em 1-2 frases.

  5.4 O QUE NÃO FAZER
  1-2 erros para evitar com este perfil específico.
</secao>

<secao id="respostas_originais">
  Tabela com todos os campos e respostas originais.
</secao>`;
}

// ── Main Export ───────────────────────────────────────────────────────────────
export async function gerarDiagnosticoGratuito(respostas: LeadGratuito): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 3000,
    },
    systemInstruction: SYSTEM_PROMPT_CONSULTOR,
  });

  const result = await model.generateContent(montarPromptUsuario(respostas));
  return result.response.text();
}
