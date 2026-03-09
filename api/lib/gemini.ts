import { GoogleGenerativeAI } from '@google/generative-ai'
import type { LeadGratuito } from './types.js'

export type { LeadGratuito }

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function gerarDiagnosticoGratuito(
  r: LeadGratuito
): Promise<{ html: string; score: number; temperatura: string; isPremium: boolean }> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 6000,
    },
  })

  const prompt = montarPrompt(r)
  const result = await model.generateContent(prompt)
  const texto = result.response.text()

  // Extrai score/temperatura do JSON para retornar ao handler
  let score = 0
  let temperatura = 'MORNO'
  let isPremium = false
  try {
    const limpo = texto.replace(/```json/g, '').replace(/```/g, '').trim()
    const dados = JSON.parse(limpo)
    score = Number(dados.score) || 0
    temperatura = String(dados.temperatura || 'MORNO')
    isPremium = score >= 9
  } catch {
    // mantém defaults — emailErro será gerado em montarEmailHtml
  }

  const html = montarEmailHtml(r, texto)
  return { html, score, temperatura, isPremium }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT: pede JSON estruturado, sem HTML, sem markdown
// ─────────────────────────────────────────────────────────────────────────────

function montarPrompt(r: LeadGratuito): string {
  return `Você é Pedro Paulo, sócio-fundador da Cineze, agência de growth marketing em BH.
Você analisou o formulário de um lead e precisa gerar um diagnóstico completo.

DADOS DO LEAD:
- Nome: ${r.nome}
- Segmento: ${r.segmento}
- Cidade/Bairro: ${r.cidade}
- Como chegam clientes hoje: ${r.como_chegam}
- Tem site ou landing page: ${r.presenca_digital}
- Já investiu em tráfego pago: ${r.investiu_trafego}
- Maior desafio: ${r.maior_desafio}
- Meta de clientes/mês: ${r.meta_clientes}
- Urgência: ${r.urgencia}
- Contexto livre (palavras exatas): ${r.contexto_livre}

PRODUTOS DA CINEZE:
- Quick Start: R$297 único — landing page + Google Meu Negócio + 3 criativos em 7 dias. Para quem nunca investiu, tem objeção com mensalidade, precisa ver resultado primeiro.
- Kit Lançamento: R$1.297/mês — gestão Meta Ads (budget até R$800/mês) + 4 criativos/mês + landing page + relatório mensal + 1 reunião. Para quem tem urgência real, já tentou algo no digital ou quer começar com estrutura.

REGRA DE PRODUTO:
- Se score for 9 ou 10: NÃO recomende produto. Indique que Pedro deve decidir pessoalmente.
- Se score for 1 a 8: escolha Quick Start OU Kit Lançamento. Justifique com dados reais do formulário. NUNCA os dois.

INSTRUÇÕES CRÍTICAS:
1. Retorne APENAS um JSON válido, sem markdown, sem blocos de código, sem explicações fora do JSON.
2. Cada campo de texto deve ser preenchido com conteúdo real e específico para este lead.
3. Use os dados do formulário em cada análise — nada genérico.
4. Proibido frases que servem para qualquer negócio.

Retorne exatamente este JSON preenchido:

{
  "score": <número de 0 a 10>,
  "temperatura": "<QUENTE|MORNO|FRIO>",
  "score_justificativa": "<1 frase direta explicando o score com dados reais do lead>",
  "perfil_3_linhas": "<3 frases sobre momento do negócio, maturidade digital e urgência. Usar dados reais.>",
  "produto_recomendado": "<Quick Start|Kit Lançamento|LEAD PREMIUM>",
  "produto_justificativa": "<Se score 1-8: 2 frases por que esse produto. Citar dado específico do formulário. Se score 9-10: 2-3 frases explicando por que é lead premium e o que Pedro deve avaliar na call.>",
  "whatsapp_msg1": "<Mensagem curta para enviar em até 1h. Pessoal, sem vender. Máx 3 linhas. Usar o nome do cliente.>",
  "whatsapp_msg2": "<Mensagem após ler o email. Mencionar 1-2 achados específicos do diagnóstico. Terminar convidando para ligação rápida. Máx 5 linhas.>",
  "objecao_1": "<Objeção provável baseada nos dados reais deste lead>",
  "objecao_1_resposta": "<Resposta recomendada em 1-2 frases>",
  "objecao_2": "<Segunda objeção provável>",
  "objecao_2_resposta": "<Resposta recomendada em 1-2 frases>",
  "objecao_3": "<Terceira objeção provável>",
  "objecao_3_resposta": "<Resposta recomendada em 1-2 frases>",
  "diagnostico_situacao_atual": "<2-3 parágrafos separados por \\n\\n. Descrever situação atual com precisão. Usar nome, segmento, cidade, como chegam clientes, presença digital. Citar palavras exatas do contexto livre quando fizer sentido. O cliente deve ler e pensar: essa pessoa entendeu meu caso.>",
  "diagnostico_gargalo": "<1 parágrafo direto sobre o principal problema identificado. Específico e levemente desconfortável.>",
  "diagnostico_custo": "<2-3 consequências concretas de continuar assim. Exemplos reais para o segmento. Realista, não catastrófico.>",
  "diagnostico_oportunidade": "<1 parágrafo sobre o que, resolvido em 30 dias, teria maior impacto para este cliente específico.>",
  "diagnostico_recomendacao": "<Se score 9-10: 'Analisei seu caso com atenção e tenho uma proposta estruturada para você. Prefiro apresentar pessoalmente — consigo montar algo muito mais preciso do que qualquer formato padrão. Quando podemos falar?' Se score 1-8: apresentar o produto escolhido como próximo passo natural. Descrever o que será entregue de forma concreta. Terminar com pergunta aberta. Tom: com base no que vi, o caminho mais direto seria...>"
}`
}

// ─────────────────────────────────────────────────────────────────────────────
// MONTA O HTML DO EMAIL com os dados do JSON retornado pelo Gemini
// ─────────────────────────────────────────────────────────────────────────────

function montarEmailHtml(r: LeadGratuito, jsonTexto: string): string {
  let dados: Record<string, string | number>

  try {
    // Remove possíveis blocos de markdown que o modelo às vezes insere
    const limpo = jsonTexto
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
    dados = JSON.parse(limpo)
  } catch (e) {
    // Se falhar o parse, retorna email de erro legível
    return emailErro(r, jsonTexto)
  }

  const score = Number(dados.score) || 0
  const temperatura = String(dados.temperatura || 'MORNO')
  const isPremium = score >= 9

  const corTemperatura =
    score >= 8 ? '#22C55E' : score >= 5 ? '#F59E0B' : '#EF4444'

  const textoParas = (texto: string) =>
    String(texto || '')
      .split('\n\n')
      .map(p => `<p style="margin:0 0 12px 0;line-height:1.7;">${p.trim()}</p>`)
      .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Diagnóstico — ${r.nome}</title></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;">
<tr><td align="center" style="padding:24px 16px;">
<table width="660" cellpadding="0" cellspacing="0" style="max-width:660px;width:100%;">

  <!-- CABEÇALHO -->
  <tr><td style="background:#0A0F1E;padding:28px 32px;border-radius:8px 8px 0 0;">
    <p style="margin:0;color:#9CA3AF;font-size:11px;letter-spacing:2px;text-transform:uppercase;">CINEZE — DIAGNÓSTICO GRATUITO</p>
    <p style="margin:8px 0 0;color:#FFFFFF;font-size:22px;font-weight:bold;">${r.nome}</p>
    <p style="margin:4px 0 0;color:#9CA3AF;font-size:13px;">${r.segmento} · ${r.cidade}</p>
  </td></tr>

  <!-- SCORE -->
  <tr><td style="background:#0A0F1E;padding:0 32px 28px;border-radius:0 0 8px 8px;">
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:16px;">
          <span style="display:inline-block;background:${corTemperatura};color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:4px;letter-spacing:1px;">${temperatura}</span>
          ${isPremium ? '<span style="display:inline-block;background:#FF6B00;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:4px;letter-spacing:1px;margin-left:8px;">🔥 LEAD PREMIUM</span>' : ''}
        </td>
      </tr>
      <tr>
        <td style="padding-top:8px;">
          <span style="font-size:52px;font-weight:900;color:#FFFFFF;line-height:1;">${score}</span>
          <span style="font-size:24px;color:#9CA3AF;font-weight:400;">/10</span>
        </td>
      </tr>
      <tr>
        <td style="padding-top:6px;">
          <p style="margin:0;color:#D1D5DB;font-size:13px;font-style:italic;">${dados.score_justificativa || ''}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ESPAÇO -->
  <tr><td style="height:16px;"></td></tr>

  <!-- ═══════════ PARTE 1 — BRIEFING INTERNO ═══════════ -->
  <tr><td style="background:#F8F9FA;border-left:4px solid #6B7280;border-radius:6px;padding:24px 28px;">

    <p style="margin:0 0 20px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6B7280;font-weight:bold;">BRIEFING INTERNO — NÃO ENVIAR AO CLIENTE</p>

    <!-- PERFIL -->
    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">PERFIL DO LEAD</p>
    <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.7;">${dados.perfil_3_linhas || ''}</p>

    <!-- PRODUTO RECOMENDADO -->
    <p style="margin:0 0 10px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">
      ${isPremium ? '🔥 DECISÃO DO PEDRO' : '✅ PRODUTO RECOMENDADO'}
    </p>
    <div style="background:${isPremium ? '#FFF7ED' : '#EFF6FF'};border:1px solid ${isPremium ? '#FF6B00' : '#3B82F6'};border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${isPremium ? '#C2410C' : '#1D4ED8'};">
        ${dados.produto_recomendado === 'Quick Start' ? '⚡ Quick Start — R$297 (único)' :
          dados.produto_recomendado === 'Kit Lançamento' ? '📦 Kit Lançamento — R$1.297/mês' :
          '🔥 LEAD PREMIUM — Pedro decide a abordagem'}
      </p>
      <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">${dados.produto_justificativa || ''}</p>
    </div>

    <!-- WHATSAPP MSG 1 -->
    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">📱 WHATSAPP — MENSAGEM 1 (até 1h)</p>
    <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:10px;color:#16A34A;font-weight:bold;letter-spacing:1px;">COPIAR E ENVIAR NO WHATSAPP</p>
      <p style="margin:0;font-family:monospace;font-size:13px;color:#1A1A1A;line-height:1.7;white-space:pre-wrap;">${dados.whatsapp_msg1 || ''}</p>
    </div>

    <!-- WHATSAPP MSG 2 -->
    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">📱 WHATSAPP — MENSAGEM 2 (após ler)</p>
    <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:10px;color:#16A34A;font-weight:bold;letter-spacing:1px;">COPIAR E ENVIAR NO WHATSAPP</p>
      <p style="margin:0;font-family:monospace;font-size:13px;color:#1A1A1A;line-height:1.7;white-space:pre-wrap;">${dados.whatsapp_msg2 || ''}</p>
    </div>

    <!-- OBJEÇÕES -->
    <p style="margin:0 0 12px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">⚠️ OBJEÇÕES PROVÁVEIS</p>
    ${[1, 2, 3].map(n => {
      const obj = dados[`objecao_${n}`]
      const resp = dados[`objecao_${n}_resposta`]
      if (!obj) return ''
      return `<div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:14px 18px;margin-bottom:12px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#92400E;">Objeção: ${obj}</p>
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;"><strong>Resposta:</strong> ${resp}</p>
      </div>`
    }).join('')}

  </td></tr>

  <!-- ESPAÇO -->
  <tr><td style="height:16px;"></td></tr>

  <!-- ═══════════ PARTE 2 — DIAGNÓSTICO AO CLIENTE ═══════════ -->
  <tr><td style="background:#FFFFFF;border-left:4px solid #0066FF;border-radius:6px;padding:24px 28px;">

    <p style="margin:0 0 20px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#0066FF;font-weight:bold;">📋 DIAGNÓSTICO PARA ENVIAR AO CLIENTE</p>
    <p style="margin:0 0 24px;font-size:16px;font-weight:bold;color:#0A0F1E;">Diagnóstico Digital — ${r.nome} — ${r.segmento}</p>

    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">Onde Seu Negócio Está Hoje</p>
    <div style="margin-bottom:20px;font-size:14px;color:#374151;">${textoParas(String(dados.diagnostico_situacao_atual || ''))}</div>

    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">O Que Está Travando o Crescimento</p>
    <div style="margin-bottom:20px;font-size:14px;color:#374151;">${textoParas(String(dados.diagnostico_gargalo || ''))}</div>

    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">O Que Isso Está Custando</p>
    <div style="margin-bottom:20px;font-size:14px;color:#374151;">${textoParas(String(dados.diagnostico_custo || ''))}</div>

    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">A Maior Oportunidade Agora</p>
    <div style="margin-bottom:20px;font-size:14px;color:#374151;">${textoParas(String(dados.diagnostico_oportunidade || ''))}</div>

    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">O Que Eu Recomendo</p>
    <div style="background:#F8FAFF;border-radius:6px;padding:16px 20px;margin-bottom:0;font-size:14px;color:#374151;">${textoParas(String(dados.diagnostico_recomendacao || ''))}</div>

  </td></tr>

  <!-- ESPAÇO -->
  <tr><td style="height:16px;"></td></tr>

  <!-- TABELA RESPOSTAS ORIGINAIS -->
  <tr><td style="background:#F8F9FA;border-radius:6px;padding:20px 28px;">
    <p style="margin:0 0 14px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6B7280;font-weight:bold;">RESPOSTAS ORIGINAIS DO FORMULÁRIO</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;">
      ${[
        ['Nome', r.nome],
        ['Email', r.email],
        ['Telefone', r.telefone],
        ['Segmento', r.segmento],
        ['Cidade/Bairro', r.cidade],
        ['Como chegam clientes', r.como_chegam],
        ['Presença digital', r.presenca_digital],
        ['Investiu em tráfego', r.investiu_trafego],
        ['Maior desafio', r.maior_desafio],
        ['Meta de clientes/mês', r.meta_clientes],
        ['Urgência', r.urgencia],
        ['Contexto livre', r.contexto_livre],
      ].map(([label, valor], i) => `
        <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F1F5F9'};">
          <td style="padding:8px 12px;font-weight:bold;color:#374151;width:40%;vertical-align:top;">${label}</td>
          <td style="padding:8px 12px;color:#4B5563;vertical-align:top;">${valor || '—'}</td>
        </tr>
      `).join('')}
    </table>
  </td></tr>

  <!-- RODAPÉ -->
  <tr><td style="padding:16px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;">Cineze Agência · cineze.com.br · BH</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL DE ERRO — exibe o JSON bruto quando falha o parse
// ─────────────────────────────────────────────────────────────────────────────

function emailErro(r: LeadGratuito, raw: string): string {
  return `<!DOCTYPE html><html><body style="font-family:Arial;padding:32px;">
    <h2 style="color:#EF4444;">⚠️ Erro ao processar diagnóstico de ${r.nome}</h2>
    <p>O Gemini retornou uma resposta que não pôde ser interpretada. Resposta bruta abaixo:</p>
    <pre style="background:#F1F5F9;padding:16px;border-radius:6px;font-size:12px;overflow-x:auto;">${raw.replace(/</g, '&lt;')}</pre>
    <hr>
    <p><strong>Nome:</strong> ${r.nome}</p>
    <p><strong>Telefone:</strong> ${r.telefone}</p>
    <p><strong>Segmento:</strong> ${r.segmento}</p>
    <p><strong>Contexto livre:</strong> ${r.contexto_livre}</p>
  </body></html>`
}
