export interface DiagnosticAnswers {
  nome?: string;
  email?: string;
  whatsapp?: string;
  segmento?: string;
  captacao?: string;
  presenca?: string;
  trafego?: string;
  dor?: string;
  meta?: string;
  urgencia?: string;
  contexto?: string;
}

export interface DiagnosticResult {
  score: number;
  prioridade: string;
  variant: 'A' | 'B';
  resumoLead: string;
  perfilDigital: string;
  dorPrincipal: string;
  abordagemRecomendada: string;
  pontosDeAtencao: string[];
}

export function gerarDiagnostico(answers: DiagnosticAnswers): DiagnosticResult {
  const { nome, segmento, captacao, presenca, trafego, dor, meta, urgencia, contexto } = answers;

  // ── Score ──────────────────────────────────────────────────────────────────
  let score = 0;

  // urgencia
  if (urgencia === 'Agora — preciso de resultado rápido') score += 3;
  else if (urgencia === 'Nos próximos 1-2 meses') score += 2;
  else if (urgencia === 'Mais pra frente, só estou pesquisando') score += 1;

  // trafego
  if (trafego === 'Sim, já invisto atualmente') score += 2;
  else if (trafego === 'Já tentei, mas parei') score += 1;
  // nunca → +0

  // meta
  if (meta === 'Mais de 50' || meta === 'Entre 20 e 50') score += 2;
  else if (meta === 'Entre 10 e 20') score += 1;
  // 5-10 → +0

  // presenca
  if (presenca === 'Tenho, mas não converte' || presenca === 'Tenho presença, mas não converte clientes') score += 2;
  else if (presenca === 'Não tenho presença digital') score += 1;
  // traz clientes → +0

  // dor
  if (dor === 'Atrair novos clientes' || dor === 'Não sei bem por onde começar') score += 1;

  score = Math.min(score, 10);

  // ── Prioridade & Variant ───────────────────────────────────────────────────
  let prioridade: string;
  if (score >= 8) prioridade = '🔴 QUENTE — Ligar hoje';
  else if (score >= 5) prioridade = '🟡 MORNO — 24h';
  else prioridade = '🔵 FRIO — Nutrir';

  const variant: 'A' | 'B' = trafego === 'Sim, já invisto atualmente' ? 'A' : 'B';

  // ── Resumo do Lead ─────────────────────────────────────────────────────────
  const nomeDisplay = nome || 'Este lead';
  const segmentoDisplay = segmento || 'negócio local';
  const captacaoDisplay = captacao || 'depende de indicações';
  const resumoLead = `${nomeDisplay} é um(a) ${segmentoDisplay} que hoje ${captacaoDisplay.toLowerCase()}.`;

  // ── Perfil Digital ─────────────────────────────────────────────────────────
  const presencaKey = presenca?.toLowerCase() || '';
  const trafegoKey = trafego?.toLowerCase() || '';

  let perfilDigital: string;
  if (presencaKey.includes('converte') && trafegoKey.includes('já invisto')) {
    perfilDigital = 'Tem estrutura digital ativa, mas não está convertendo bem. Provavelmente há gargalos na landing page, no público-alvo ou no funil pós-clique.';
  } else if (presencaKey.includes('converte') && trafegoKey.includes('já tentei')) {
    perfilDigital = 'Já tentou tráfego pago, mas a presença digital não converte. O problema pode ser a oferta, o copy ou a página de destino.';
  } else if (presencaKey.includes('converte') && (trafegoKey.includes('nunca') || trafegoKey === '')) {
    perfilDigital = 'Tem presença online, mas ainda não usa tráfego pago. Grande potencial de escala com a estrutura certa de campanha.';
  } else if (presencaKey.includes('não tenho') && trafegoKey.includes('já invisto')) {
    perfilDigital = 'Investe em tráfego, mas sem presença digital consolidada. Provavelmente está queimando verba sem landing page ou perfil otimizados.';
  } else if (presencaKey.includes('não tenho') && trafegoKey.includes('já tentei')) {
    perfilDigital = 'Tentou tráfego pago sem uma base digital sólida — o que explica os resultados fracos. Precisa de estrutura antes de investir novamente.';
  } else if (presencaKey.includes('não tenho') && (trafegoKey.includes('nunca') || trafegoKey === '')) {
    perfilDigital = 'Sem presença digital e sem experiência com tráfego. Está completamente dependente de indicações — alta vulnerabilidade de receita.';
  } else if (presencaKey.includes('traz clientes') && trafegoKey.includes('já invisto')) {
    perfilDigital = 'Presença digital funcionando e tráfego pago ativo. Momento ideal para escalar e otimizar o custo por aquisição.';
  } else {
    perfilDigital = 'Tem presença digital que já traz resultados, mas ainda não explorou o potencial de tráfego pago para crescer mais rápido.';
  }

  // ── Dor Principal ──────────────────────────────────────────────────────────
  const dorMap: Record<string, string> = {
    'Atrair novos clientes': 'Dificuldade em gerar fluxo constante de novos clientes — o negócio depende demais de indicações ou sazonalidade.',
    'Reter clientes existentes': 'Tem clientes entrando, mas a retenção é baixa. Falta processo de fidelização e recompra programada.',
    'Aumentar o ticket médio': 'O volume de clientes é razoável, mas o faturamento não cresce proporcionalmente. Oportunidade clara em upsell e posicionamento premium.',
    'Não sei bem por onde começar': 'Sem clareza sobre prioridades de marketing. Precisa de um diagnóstico estruturado para definir o próximo passo com segurança.',
  };
  const dorPrincipal = dorMap[dor || ''] || 'Enfrenta desafios de marketing que impactam diretamente o crescimento do negócio.';

  // ── Abordagem Recomendada ──────────────────────────────────────────────────
  let prefix = '';
  if (urgencia === 'Agora — preciso de resultado rápido') prefix = 'Abordagem direta e focada em resultado rápido. ';
  else if (urgencia === 'Nos próximos 1-2 meses') prefix = 'Planejamento de curto prazo com ações de impacto. ';
  else prefix = 'Nutrição educativa com conteúdo de valor antes de apresentar proposta. ';

  let pitch = '';
  if (trafego === 'Sim, já invisto atualmente') pitch = 'Mostrar como otimizar o que já existe e escalar com mais eficiência. ';
  else if (trafego === 'Já tentei, mas parei') pitch = 'Entender por que parou e mostrar a diferença de ter estratégia vs. impulsionamento aleatório. ';
  else pitch = 'Educar sobre tráfego pago e apresentar cases do segmento antes de falar em investimento. ';

  let pergunta = '';
  if (dor === 'Atrair novos clientes') pergunta = 'Pergunta de abertura: "Quantos clientes novos você atrai por mês hoje, sem contar indicações?"';
  else if (dor === 'Reter clientes existentes') pergunta = 'Pergunta de abertura: "Qual % dos seus clientes voltam ou indicam espontaneamente?"';
  else if (dor === 'Aumentar o ticket médio') pergunta = 'Pergunta de abertura: "Qual é o seu serviço mais caro hoje e quantas vezes ele foi vendido esse mês?"';
  else pergunta = 'Pergunta de abertura: "Se você pudesse resolver um único problema de marketing agora, qual seria?"';

  const abordagemRecomendada = prefix + pitch + pergunta;

  // ── Pontos de Atenção ──────────────────────────────────────────────────────
  const pontos: string[] = [];

  if (presencaKey.includes('não tenho') && trafegoKey.includes('invisto')) {
    pontos.push('⚠️ Queimando verba: investe em tráfego sem landing page ou perfil digital otimizado.');
  }
  if (trafegoKey.includes('nunca') && (presencaKey.includes('não tenho') || presencaKey === '')) {
    pontos.push('📌 Lead sem referência técnica — explicar conceitos básicos de tráfego na abordagem.');
  }
  if (presencaKey.includes('converte') && trafegoKey.includes('nunca')) {
    pontos.push('💡 Alta oportunidade: tem presença mas nunca usou tráfego. Fácil de mostrar valor rapidamente.');
  }
  if (score >= 8) {
    pontos.push('🔥 Lead quente — resposta em menos de 2 horas aumenta muito a taxa de conversão.');
  }
  if (contexto && contexto.length > 20) {
    pontos.push(`📝 Contexto livre: "${contexto.substring(0, 80)}${contexto.length > 80 ? '...' : ''}"`);
  }
  if (meta === 'Mais de 50') {
    pontos.push('🎯 Meta ambiciosa (50+ clientes/mês) — lead com alto potencial de ticket.');
  }

  return {
    score,
    prioridade,
    variant,
    resumoLead,
    perfilDigital,
    dorPrincipal,
    abordagemRecomendada,
    pontosDeAtencao: pontos,
  };
}
