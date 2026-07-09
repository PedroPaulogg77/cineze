import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Bot,
  Users,
  MousePointerClick,
  Globe,
  Palette
} from "lucide-react";

type TabKey = "marketing" | "automacao";

const tabs: { key: TabKey; label: string }[] = [
  { key: "marketing", label: "Assessoria de Marketing" },
  { key: "automacao", label: "Automação & CRM" },
];

interface Service {
  icon: typeof Target;
  title: string;
  what: string;
  diferencial: string;
  beneficio: string;
}

const marketingServices: Service[] = [
  {
    icon: MousePointerClick,
    title: "Tráfego Pago (Gestão de Anúncios)",
    what: "Gestão de anúncios no Google Ads e no Meta Ads, do planejamento ao acompanhamento.",
    diferencial: "Foco em lead e venda, não em métrica de vaidade. Cada campanha é ajustada pelo resultado real, não pelo que fica bonito no print.",
    beneficio: "Captação mais previsível, com custo por lead rastreado e relatório claro a cada quinzena.",
  },
  {
    icon: Globe,
    title: "Criação de Páginas (Sites e Landing Pages)",
    what: "Sites e landing pages feitos pra transformar visitante em contato, não só pra ficar bonito.",
    diferencial: "Página pensada por quem entende de copy e design juntos. Estética a serviço da conversão.",
    beneficio: "Mais visitante virando contato de verdade.",
  },
  {
    icon: Palette,
    title: "Criativos (Anúncios e Posts)",
    what: "Criação dos anúncios e posts que rodam nas campanhas e no perfil.",
    diferencial: "Feito com apoio de IA pra ganhar escala, mas com a mão de um designer de 10 anos por trás. Não é template.",
    beneficio: "Conteúdo que prende a atenção certa e leva pro próximo passo.",
  },
  {
    icon: Target,
    title: "Assessoria de Marketing (Gestão Completa)",
    what: "A gente cuida do marketing do seu negócio do começo ao fim: estratégia, execução e ajuste, mês a mês.",
    diferencial: "Você trata com quem pensa a estratégia e também põe a mão na massa. Sem repassar pro estagiário, sem pacote genérico.",
    beneficio: "Um time de marketing inteiro sem o custo de montar um departamento interno.",
  },
];

const automacaoServices: Service[] = [
  {
    icon: Bot,
    title: "Automação de WhatsApp com IA",
    what: "Resposta automática, qualificação de lead e agendamento direto no WhatsApp, sem depender de você parar o que está fazendo.",
    diferencial: "Lead não espera. O sistema responde em segundos, 24 horas por dia, e mantém o interesse quente.",
    beneficio: "Mais agendamento e menos lead perdido por demora no atendimento.",
  },
  {
    icon: Users,
    title: "Implementação e Gestão de CRM",
    what: "Todo o relacionamento com o cliente num lugar só, do primeiro contato ao pós-venda.",
    diferencial: "Você enxerga o funil inteiro: onde está cada lead e qual o próximo passo.",
    beneficio: "Mais conversão e mais cliente que volta, com follow-up que não depende de memória.",
  },
  {
    icon: Target,
    title: "Integrações entre Plataformas",
    what: "Meta Ads, Google Ads, WhatsApp, CRM e site conversando entre si, sem retrabalho manual.",
    diferencial: "O lead que veio do anúncio já entra no CRM e recebe follow-up na hora.",
    beneficio: "Marketing que funciona como sistema, não como um monte de tarefa solta.",
  },
];

const servicesMap: Record<TabKey, { description: string; services: Service[] }> = {
  marketing: {
    description: "Estratégia, tráfego pago, conteúdo, site e criativo pensados juntos — não peças soltas. Com relatório claro do que está funcionando e do que não está.",
    services: marketingServices,
  },
  automacao: {
    description: "De nada adianta gerar contato e demorar pra responder. A gente monta o sistema que fala com o lead na hora, qualifica e agenda — enquanto você atende quem já está na sua frente.",
    services: automacaoServices,
  },
};

export function Solutions() {
  const [activeTab, setActiveTab] = useState<TabKey>("marketing");
  const [activeService, setActiveService] = useState<number | null>(null);

  const currentData = servicesMap[activeTab];

  return (
    <section id="solucoes" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Seu marketing inteiro{" "}
            <span className="gradient-text">numa operação só.</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8 px-2 sm:px-0"
        >
          <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-xl glass w-full sm:w-auto mx-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setActiveService(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-300 relative ${
                  activeTab === tab.key
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-12 px-2 sm:px-0"
        >
          {currentData.description}
        </motion.p>

        {/* Services Grid */}
        <motion.div
          key={`grid-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {currentData.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeService === index
                  ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-secondary/50 glow-cyan"
                  : "bg-card/50 border border-border/50 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/10"
              }`}
              onClick={() => setActiveService(activeService === index ? null : index)}
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    activeService === index
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-secondary"
                  }`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-semibold text-base leading-tight flex-1">
                  {service.title}
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {activeService === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4 overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-xs font-semibold text-secondary uppercase mb-1">O que é</p>
                      <p className="text-sm text-muted-foreground">{service.what}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <p className="text-xs font-semibold text-secondary uppercase mb-1">Diferencial</p>
                      <p className="text-sm text-muted-foreground">{service.diferencial}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-xs font-semibold text-secondary uppercase mb-1">Benefício</p>
                      <p className="text-sm text-foreground font-medium">{service.beneficio}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeService !== index && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.what}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
