# Prompt de Redesign — Landing Page Cineze
## Para usar no Antigravity — Seção por seção

---

## CONTEXTO GERAL ANTES DE COMEÇAR

**Identidade visual:**
- Cores primárias: `#0066FF` (azul escuro) → `#06B7D8` (azul ciano)
- Gradiente de fundo: dark navy `#060D1A` → `#0A1628`
- Texto principal: branco `#FFFFFF`
- Texto secundário: `#8B9DB5`
- Cards/superfícies: `#0D1F35` com borda `#1A3050` (1px)
- Fonte: Inter ou Plus Jakarta Sans — sem serifas

**Princípio de design desta página:**
- Mobile first — cada decisão começa pensando em 375px de largura
- Assimetria em vez de centralização — rompe o padrão de "IA fez isso"
- Profundidade com camadas — elementos flutuantes sobre fundo, não elementos colados no fundo
- Animações sutis — entram no scroll, não ficam piscando sem parar
- Foto dos dois sócios (Pedro e Davidson) — profissional, fundo neutro ou estúdio — é o elemento humano central

---

## SEÇÃO 1 — HERO (Topo da página)

### Problema atual
Texto 100% centralizado, sem âncora visual, sem elemento humano. No mobile vira um bloco de texto pesado antes do botão.

### O que fazer

**Layout desktop (2 colunas assimétricas):**
- Coluna esquerda (55%): headline + subheadline + CTA + microcopy
- Coluna direita (45%): foto dos sócios + elementos flutuantes

**Layout mobile:**
- Headline centralizada no topo
- Foto dos sócios abaixo da headline (largura total, cortada na cintura para cima)
- CTA fixo no bottom da tela como barra flutuante azul

---

**Foto dos sócios — instrução de posicionamento:**
- Posicionar a foto com corte natural na altura da cintura
- Aplicar gradiente sutil nas bordas para fundir com o fundo escuro (especialmente na base)
- Adicionar glow azul suave atrás da foto (`#0066FF` com 20% opacidade, blur 80px)
- A foto não fica num card — ela flutua diretamente sobre o fundo

**Elementos flutuantes ao redor da foto (todos animados com entrada suave no load):**

Flutuante 1 — canto superior direito da foto:
```
Notificação estilo WhatsApp/app
Ícone de sino + "Novo lead recebido"
"Nutricionista — Savassi, BH"
Fundo: #0D1F35, borda azul, borda radius 12px
Animação: slide-in da direita, 0.6s delay
```

Flutuante 2 — canto inferior esquerdo da foto:
```
Card de métrica pequeno
Ícone de gráfico de linha ascendente (azul)
"+3 clientes novos" em verde (#22C55E)
"este mês" em texto secundário
Animação: fade-up, 0.9s delay
```

Flutuante 3 — acima e à esquerda (metade dentro da foto, metade fora):
```
Badge de avaliação
★★★★★ em amarelo
"Pedro respondeu em 47 min"
Animação: scale-in, 1.2s delay
```

---

**Barra de topo (header fixo no scroll):**
- Fundo: `#060D1A` com `backdrop-blur`
- Logo Cineze à esquerda
- Botão "Fazer diagnóstico →" à direita — azul sólido, pequeno
- Aparece só após scroll de 100px

---

## SEÇÃO 2 — BLOCO DE PROBLEMA ("Você não tem problema de produto")

### Problema atual
Caixa com texto corrido, fundo levemente diferente. Não tem nenhum elemento visual. Parece um parágrafo de blog.

### O que fazer

**Estrutura mobile:**
- Título grande (32px mobile) em duas linhas — a segunda linha em azul gradiente
- Texto em blocos curtos separados por espaço — máximo 2 linhas por bloco
- Entre os blocos de texto: linha horizontal fina azul (`#0066FF`, 40% opacidade)

**Elemento visual novo — adicionar à direita no desktop, abaixo no mobile:**

Mini comparativo animado — dois "perfis" lado a lado:
```
❌ Concorrente           ✅ Com a Cineze
──────────────           ──────────────
Aparece no Google        ✓ Google Ads ativo
Tem landing page         ✓ Landing otimizada  
Roda anúncio             ✓ Meta Ads rodando

Resultado: cliente       Resultado: você
vai para ele →           aparece primeiro ✓
```
Estilo: card escuro, fonte monospace, borda esquerda colorida (vermelho no ❌, azul no ✅)
Animação: os itens do lado direito aparecem um a um com check animado (1.5s total)

---

## SEÇÃO 3 — COMO FUNCIONA (Os 4 passos)

### Problema atual
4 cards idênticos em grid 2x2. Sem hierarquia, sem conexão visual entre os passos, sem ícones diferenciados. No mobile empilha como tijolos.

### O que fazer

**Trocar o grid 2x2 por timeline vertical com linha conectora:**

```
Layout mobile (vertical):

    ●─────────────────────────────────
    │
[01] Você preenche o formulário
     Texto curto. Ícone à esquerda.
    │
    ●─────────────────────────────────
    │
[02] Pedro analisa em até 12h
     Texto curto. Ícone diferente.
    │
    ●─────────────────────────────────
    │
[03] Você recebe o diagnóstico
    │
    ●─────────────────────────────────

[04] Você decide o que fazer
```

**Especificações da linha conectora:**
- Linha vertical fina (2px) em gradiente azul `#0066FF` → `#06B7D8`
- Os pontos `●` têm glow azul suave
- A linha "preenche" de cima para baixo no scroll (animação de fill — height 0% → 100%)

**Ícones por passo (usar estilo outline, azul, 32px):**
- Passo 1: ícone de formulário/clipboard
- Passo 2: ícone de pessoa/usuário (representa Pedro)
- Passo 3: ícone de relatório/documento com check
- Passo 4: ícone de seta bifurcada (decisão)

**Card de cada passo:**
- Fundo: `#0D1F35`
- Borda esquerda: 3px sólido azul `#0066FF`
- Número do passo: grande (48px), cor `#0066FF` com 30% opacidade, atrás do título
- Padding: 20px
- Border radius: 12px

**Elemento flutuante nesta seção — aparece ao lado do Passo 2 no desktop:**
```
Card de "Pedro online"
Avatar circular (foto do Pedro pequena) + ponto verde animado
"Pedro Paulo · Online agora"
"Responde em menos de 2h"
```

---

## SEÇÃO 4 — DEPOIMENTOS

### Problema atual
Avatar genérico cinza + nome de nicho ("Clínica da Estética") sem nome real. Zero credibilidade. Parece placeholder.

### O que fazer agora (sem depoimentos reais ainda):

**Trocar por um único depoimento de destaque + 2 menores:**

**Depoimento principal (card grande):**
```
Quote em destaque:
Aspas grandes azuis decorativas (72px, cor #0066FF, 40% opacidade)
"[Resultado específico em uma frase]"

Abaixo:
Foto real circular (quando tiver) com borda azul 2px
Nome real — Profissão — Bairro BH
⭐⭐⭐⭐⭐
```

**Até ter depoimentos reais — usar este placeholder honesto:**
```
[Em breve — depoimentos dos primeiros clientes]
Seja um dos primeiros. Faça o diagnóstico agora.
```
Estilo: card com borda pontilhada azul, texto centralizado, CTA pequeno interno

**Depoimentos menores (2 cards lado a lado no desktop, empilhados no mobile):**
- Versão menor do mesmo formato
- Fundo levemente mais claro que o principal para criar profundidade

---

## SEÇÃO 5 — O QUE VOCÊ RECEBE DE GRAÇA

### Problema atual
Lista simples de checkmarks em caixa. Sem ícone único por item, sem hierarquia, sem nenhum número de impacto em destaque.

### O que fazer

**Trocar a lista por cards de benefício individuais:**

```
Layout mobile: 1 coluna, cards empilhados
Layout desktop: grid 2 colunas
```

**Cada card de benefício:**
```
[Ícone único 24px azul]  [Título do benefício em branco]
                          Texto curto explicativo em cinza
```

**Ícones por benefício (outline, azul):**
- Análise da presença: ícone de lupa/radar
- 3 maiores gargalos: ícone de alerta/triângulo
- Benchmarking: ícone de gráfico comparativo
- Plano 30 dias: ícone de calendário/roadmap
- Recomendação: ícone de estrela/bússola

**Adicionar número de impacto em destaque acima da lista:**
```
Elemento visual grande:

R$ 800
────────────────────────────────
Esse é o valor cobrado por hora de
consultoria com esse nível de análise.

Hoje: gratuito.
```
Estilo: número `R$ 800` em tamanho grande (64px mobile), tachado em vermelho `#EF4444`, abaixo "Hoje: gratuito." em azul

---

## SEÇÃO 6 — POR QUE É GRATUITO (bloco de transparência)

### Problema atual
Texto corrido dentro da mesma caixa dos benefícios. Não respira, não tem personalidade.

### O que fazer

**Separar em seção própria com fundo levemente diferente (`#0A1628`):**

Layout com foto pequena do Pedro à esquerda + texto à direita:
```
[Foto do Pedro pequena, circular, borda azul]

"Somos uma agência nova em BH.

A melhor forma de provar que 
o que fazemos funciona é mostrar —
não prometer.

Se o diagnóstico fizer sentido pra você,
a gente conversa sobre trabalhar junto.
Se não fizer, você sai com clareza
— sem pagar nada."

— Pedro Paulo, sócio da Cineze
```

**Elemento flutuante nesta seção:**
```
Badge de garantia (estilo selo circular)
"SEM COMPROMISSO"
"Diagnóstico 100% gratuito"
Fundo azul gradiente, texto branco
Rotação suave: -8deg
Posição: canto superior direito do card
```

---

## SEÇÃO 7 — URGÊNCIA + CTA FINAL

### Problema atual
Caixa pequena com texto corrido. O elemento de urgência (15 diagnósticos por semana) está escondido e não gera urgência visual nenhuma.

### O que fazer

**Barra de vagas — estilo indicador de progresso:**
```
VAGAS DESTA SEMANA

[████████████░░░] 12 de 15 preenchidas

Resposta garantida em até 12h
```
Especificações:
- Barra de progresso: fundo `#1A3050`, fill `#0066FF`
- Número "12" em azul + "de 15" em cinza
- Animação: fill da barra do 0% ao número real no scroll (1.5s, easing)
- Texto abaixo da barra: "Faltam 3 vagas para esta semana."

**CTA final — botão principal:**
- Tamanho: largura total no mobile (100%)
- Fundo: gradiente `#0066FF` → `#06B7D8`
- Texto: "QUERO MEU DIAGNÓSTICO GRATUITO →"
- Borda radius: 12px
- Padding: 18px 32px
- Sombra: `0 0 40px #0066FF40` (glow azul)
- Hover: escala 1.02, sombra mais intensa

**Microcopy abaixo do botão:**
```
Sem cartão. Sem compromisso. Só clareza.
```
Cor: `#8B9DB5`, tamanho 13px, centralizado

**Elemento flutuante CTA — aparece após scroll de 80% da página:**
```
Barra flutuante bottom (mobile):
Fundo: #0066FF
"Diagnóstico gratuito — vagas limitadas"
Botão pequeno: "FAZER AGORA →"
Fecha com X
```

---

## INSTRUÇÕES DE ANIMAÇÃO GLOBAIS

**Regra geral:** nada anima sem motivo. Cada animação tem função.

| Elemento | Animação | Duração | Trigger |
|---|---|---|---|
| Headline principal | fade-up 20px | 0.6s | page load |
| Foto dos sócios | fade-in | 0.8s | page load |
| Flutuantes da hero | slide-in por direção | 0.5s each, staggered | page load |
| Cards de seção | fade-up 30px | 0.4s | scroll enter |
| Linha da timeline | height 0→100% | 1.5s | scroll enter |
| Barra de vagas | fill 0→80% | 1.5s ease | scroll enter |
| Comparativo (seção 2) | checks aparecem 1 a 1 | 1.5s total | scroll enter |

**Easing padrão para tudo:** `cubic-bezier(0.16, 1, 0.3, 1)` — suave, natural

---

## FORMATOS DA FOTO DOS SÓCIOS

Para usar no Antigravity você vai precisar das fotos nestas versões:

| Uso | Formato | Resolução mínima | Observação |
|---|---|---|---|
| Hero desktop (coluna direita) | PNG com fundo removido | 800×1000px | Fundo transparente para o glow azul funcionar |
| Hero mobile (largura total) | PNG com fundo removido | 750×600px | Corte na cintura para cima |
| Seção transparência (Pedro pequeno) | JPG ou PNG | 200×200px | Circular com borda — pode ser com fundo |
| Flutuante "Pedro online" | JPG ou PNG | 80×80px | Circular pequeno |

**Dica para remover o fundo:** usar remove.bg ou Canva Pro (remove fundo em 1 clique). Com foto de estúdio (fundo neutro) o resultado é perfeito.

---

## CHECKLIST PARA IMPLEMENTAR NO ANTIGRAVITY

### Fase 1 — Estrutura (sem foto ainda)
- [ ] Trocar layout hero para 2 colunas assimétricas (desktop)
- [ ] Criar placeholder da foto com glow azul e os 3 flutuantes no lugar
- [ ] Converter "Como funciona" de grid 2x2 para timeline vertical
- [ ] Trocar lista de benefícios por cards individuais com ícone
- [ ] Adicionar número R$ 800 tachado com "Hoje: gratuito"
- [ ] Criar barra de vagas com progresso

### Fase 2 — Foto
- [ ] Remover fundo da foto dos sócios (remove.bg)
- [ ] Inserir na hero com glow e flutuantes
- [ ] Inserir foto pequena do Pedro na seção de transparência

### Fase 3 — Depoimentos
- [ ] Substituir placeholder quando tiver o primeiro cliente real
- [ ] Adicionar foto, nome real, resultado específico

### Fase 4 — Refinamento mobile
- [ ] Testar cada seção em 375px (iPhone SE)
- [ ] Confirmar que CTA flutuante aparece e fecha corretamente
- [ ] Confirmar que timeline não quebra em mobile
