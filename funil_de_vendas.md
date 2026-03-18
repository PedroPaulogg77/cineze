# Documentação do Funil de Vendas: Cineze

Este documento detalha a estrutura, o comportamento e a estratégia por trás do funil de vendas principal da Cineze, que se inicia na página `/diagnostico` e se divide (bifurca) nas páginas `/obrigado-a` e `/obrigado-b`.

---

## 1. O Ponto de Entrada: `/diagnostico` (Página de Captura e Qualificação)

A página de diagnóstico atua como o topo do nosso funil de conversão. O objetivo principal é **capturar o lead, qualificá-lo através de perguntas estratégicas e prepará-lo para a abordagem comercial**, entregando a ele a promessa de uma análise gratuita ("Diagnóstico Gratuito") em até 12 horas.

### Estrutura e Captação
O formulário é apresentado de forma sequencial (step-by-step) para reduzir o atrito e aumentar a taxa de conversão. As informações coletadas são:
- **Dados Básicos:** Nome, E-mail, WhatsApp (com a promessa de que o especialista Pedro Paulo entrará em contato por lá).
- **Contexto do Negócio:** Segmento de atuação e onde os clientes atuais vêm (Google, Instagram, indicação, etc.).
- **Maturidade Digital:** Se possui site/landing page e, crucialmente, **se já investe em tráfego pago**.
- **Dores e Metas:** O maior desafio atual, quantos novos clientes deseja por mês, urgência para resultados e um campo de texto aberto para contexto adicional.

### A Regra de Bifurcação (O Pulo do Gato)
O destino pós-cadastro do lead não é o mesmo para todos. O sistema toma uma decisão em tempo real baseada na resposta da pergunta:
> *"Você já investiu em tráfego pago — Meta Ads ou Google Ads?"*

* **Se a resposta for "Sim, já invisto atualmente":** O lead é direcionado para a página **`/obrigado-a`**.
* **Qualquer outra resposta ("Já tentei mas parei" ou "Nunca investi"):** O lead é direcionado para a página **`/obrigado-b`**.

Essa estratégia de bifurcação garante que a oferta imediata de *Upsell / Tripwire* (produto de baixo custo ofertado logo após o cadastro) na página de obrigado seja **100% alinhada com o momento atual do negócio do lead**.

---

## 2. A Rota A: `/obrigado-a` (Para Leads que JÁ Investem em Tráfego)

Esta página é exibida para empresas que já estão colocando dinheiro em anúncios, mas provavelmente não estão vendo o retorno esperado (ou querem escalar).

### A Narrativa da Página
* **Confirmação:** Garante que o cadastro foi concluído e reforça que o consultor ligará em até 12h.
* **A Dor Alvo:** "Você já investe em tráfego... O problema quase nunca é falta de verba. É que os clientes chegam num lugar que não converte."
* **O Argumento:** De nada adianta pagar por tráfego se a landing page é ruim, o Google Meu Negócio está abandonado e os criativos (anúncios) estão cansados.

### A Oferta: "Quick Start Cineze"
Para curar essa dor de imediato, a página faz uma oferta irresistível de um serviço prático ("Feito para você").
* **O que é entregue:** Uma estrutura pronta em 7 dias corridos.
* **Entregáveis exatos:** 
  1. Criação/Refação de Landing Page focada em conversão.
  2. Google Meu Negócio otimizado para buscas locais.
  3. 3 Criativos prontos (imagens/vídeos) para subir nas campanhas.
* **Previsão de Preço (Ancoragem):** "Fazer isso com agências/freelas custa entre R$2.000 e R$3.500". "A tabela do nosso site mostra R$ 997".
* **Preço Ofertado:** **R$ 297,00** (Pagamento único).
* **Garantia Forte (Reversão de Risco):** Promessa de entrega em 7 dias úteis. Caso atrasem ou não entreguem tudo, o lead recebe 100% do dinheiro de volta, sem questionamentos.

**Resumo da Rota A:** Oferece "mão na massa" barata e rápida para tapar o ralo de dinheiro de quem já faz anúncios.

---

## 3. A Rota B: `/obrigado-b` (Para Leads que NÃO Investem ou Pararam)

Esta página é desenhada para empresas que ainda não rodam tráfego pago ativamente, onde o gargalo principal costuma ser o desconhecimento de *por onde começar* ou a falta de um plano tangível.

### A Narrativa da Página
* **Confirmação:** Também valida o cadastro e reforça o contato do consultor em 12h.
* **A Dor Alvo:** "Antes de investir qualquer centavo em tráfego, você precisa saber exatamente onde está e o que priorizar."
* **O Argumento:** É arriscado colocar dinheiro na internet às cegas. O negócio precisa de um direcionamento inteligente, baseado em dados e não em achismos. 

### A Oferta: "Plataforma de Diagnóstico / Plano de Ação IA"
Como o lead ainda não está no ponto de receber propostas de campanhas, a oferta aqui é educacional e estratégica, de altíssimo valor percebido e barreira de entrada quase nula.
* **O que é entregue:** Acesso à inteligência da Cineze para gerar um "Plano de Ação" claro de crescimento.
* **Entregáveis exatos:** Um direcionamento focado em pilares - diagnóstico de vendas, marketing, tecnologia, indicadores, análise de mercado, auditoria de comunicação e metas claras.
* **Previsão de Preço (Ancoragem):** De R$ 497,00.
* **Preço Ofertado:** **R$ 67,00** (Pagamento único).
* **Processo de Compra Facilitado:** A página conta com um VSL (Vídeo de Vendas) e um botão integrado diretamente com a InfinitePay via API, que gera o link de checkout instantaneamente assim que o lead decide comprar.
* **Garantia Transparente:** 7 dias de garantia. Se o lead achar que o plano de ação gerado não trouxe valor real, recebe o reembolso integral.

**Resumo da Rota B:** Oferece "direção e clareza" empacotados em um ticket extremamente barato para gerar os primeiros micro-compromissos do cliente com a marca Cineze antes mesmo do consultor ligar.

---

## 4. Conclusão da Estratégia de Funil

Essa configuração de funil da Cineze é extremamente eficiente pelas seguintes razões:

1. **Qualificação Automática:** O formulário já entrega para o vendedor (Pedro / Consultor) informações riquíssimas, transformando a ligação em uma reunião de negócios assertiva, não uma "cold call".
2. **Segmentação (Bifurcação):** Em vez de usar uma página de "Obrigado" genérica, aproveitamos a atenção máxima do lead (imediatamente após preencher o formulário) para fazer uma venda instantânea *(Tripwire Funnel)*.
3. **Oferecimento Baseado no Dores Específicas:**
   - O lead avançado (Rota A) é estimulado a resolver um problema de **conversão**. (Ticket R$ 297).
   - O lead iniciante (Rota B) é estimulado a conseguir **orientação**. (Ticket R$ 67).
4. **Múltiplos Pontos de Contato:** Independentemente de comprarem ou não a oferta na página de obrigado, os leads já forneceram o telefone, o que garante que a Cineze feche vendas mais caras de consultoria e assessoria ("High Ticket") pelas próximas etapas comerciais manuais realizadas nos bastidores.
