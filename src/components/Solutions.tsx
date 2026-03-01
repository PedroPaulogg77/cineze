import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Monitor, 
  CloudCog, 
  ShieldCheck, 
  Wrench, 
  Headphones,
  Target,
  Bot,
  Users,
  MousePointerClick,
  Globe,
  Palette
} from "lucide-react";

type TabKey = "marketing" | "automacao" | "ti";

const tabs: { key: TabKey; label: string }[] = [
  { key: "marketing", label: "Assessoria de Marketing" },
  { key: "automacao", label: "Automação & CRM" },
  { key: "ti", label: "Infraestrutura" },
];

interface Service {
  icon: typeof Server;
  title: string;
  what: string;
  diferencial: string;
  beneficio: string;
}

const tiServices: Service[] = [
  {
    icon: Server,
    title: "Gestão de T.I. Terceirizada (Outsourcing)",
    what: "Sua T.I. nas mãos de especialistas. Atuamos como o seu próprio departamento de T.I., com planejamento estratégico, suporte e gestão completa de infraestrutura.",
    diferencial: "Foco em redução de custos operacionais e alinhamento da tecnologia com os objetivos de negócio.",
    beneficio: "Libere seu tempo e recursos internos para focar no core business, enquanto garantimos a estabilidade da sua operação.",
  },
  {
    icon: Monitor,
    title: "Monitoramento Proativo 24/7",
    what: "Acompanhamento ininterrupto de servidores, rede, estações e sistemas críticos.",
    diferencial: "Prevenção de falhas. Resolvemos problemas remotamente antes que eles se manifestem e impactem o negócio.",
    beneficio: "Zero tempo de inatividade inesperado. Sua empresa funciona sem interrupções, 24 horas por dia.",
  },
  {
    icon: CloudCog,
    title: "Backup em Nuvem e Disaster Recovery",
    what: "Estratégias sólidas para proteção e restauração de dados. Inclui cópias seguras, automatizadas e versionadas em nuvem, além de planos de rollback e recuperação de desastres.",
    diferencial: "Não é apenas um backup; é uma garantia de continuidade de negócio em qualquer cenário (falhas, ataques ou perdas críticas).",
    beneficio: "Segurança total dos dados e restauração rápida de sistemas.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança da Informação",
    what: "Implementação de políticas de segurança, antivírus corporativo, auditorias de acesso e proteção avançada contra ameaças cibernéticas.",
    diferencial: "Proteção em múltiplas camadas, focada em conformidade e prevenção de vazamento de dados.",
    beneficio: "Paz de espírito e proteção robusta contra ataques, mantendo a integridade da sua operação.",
  },
  {
    icon: Wrench,
    title: "Projetos de TI e Consultoria",
    what: "Análise, diagnóstico e planejamento tecnológico para otimizar a infraestrutura. Inclui implantação de Microsoft 365, Active Directory, redes estruturadas e migrações.",
    diferencial: "Consultoria que traduz tecnologia em aumento de produtividade e redução de custos.",
    beneficio: "Infraestrutura moderna, eficiente e alinhada com o crescimento da sua PME.",
  },
  {
    icon: Headphones,
    title: "Helpdesk Profissional",
    what: "Central de chamados com atendimento remoto e presencial.",
    diferencial: "Serviço com SLA (Service Level Agreement) definido, prioridades claras e relatórios mensais de performance.",
    beneficio: "Resolução rápida e profissional para manter seus colaboradores produtivos.",
  },
];

const marketingServices: Service[] = [
  {
    icon: MousePointerClick,
    title: "Tráfego Pago (Gestão de Anúncios)",
    what: "Gestão de anúncios online em plataformas como Google Ads e Meta Ads.",
    diferencial: "Foco exclusivo em leads e conversões — não em métricas de vaidade. Cada campanha é otimizada pelo resultado real.",
    beneficio: "Captação previsível de novos clientes todo mês, com custo por lead rastreado e relatório quinzenal.",
  },
  {
    icon: Globe,
    title: "Criação de Páginas (Sites e Landing Pages)",
    what: "Desenvolvimento de Landing Pages profissionais otimizadas para converter visitantes em leads.",
    diferencial: "Páginas criadas por especialistas em copywriting e design com foco em conversão — não em estética vazia.",
    beneficio: "Aumente a taxa de conversão dos seus visitantes em contatos qualificados.",
  },
  {
    icon: Palette,
    title: "Criativos (Anúncios e Posts)",
    what: "Criação de anúncios e posts visualmente impactantes para campanhas de marketing.",
    diferencial: "Criativos desenvolvidos com apoio de IA para máxima performance e alinhados com a estratégia de tráfego pago.",
    beneficio: "Conteúdo que atrai a atenção certa e gera o clique para a conversão.",
  },
  {
    icon: Target,
    title: "Assessoria de Marketing (Gestão Completa)",
    what: "Gestão completa do seu marketing digital por especialistas em Growth.",
    diferencial: "Não é apenas execução. É uma assessoria estratégica focada em resultados e otimização contínua.",
    beneficio: "Um departamento de marketing de alta performance sem os custos de contratação interna.",
  },
];

const automacaoServices: Service[] = [
  {
    icon: Bot,
    title: "Automação de WhatsApp com IA",
    what: "Configuramos respostas automáticas, qualificação de leads e agendamentos direto no WhatsApp — sem intervenção manual.",
    diferencial: "Lead gerado não pode esperar. O sistema responde em segundos, 24 horas por dia, mantendo o interesse do prospect aquecido.",
    beneficio: "Mais agendamentos e menos leads perdidos por demora no atendimento.",
  },
  {
    icon: Users,
    title: "Implementação e Gestão de CRM",
    what: "Centralizamos todo o relacionamento com o cliente numa plataforma única — do primeiro contato ao pós-venda.",
    diferencial: "Visibilidade total do funil de vendas. Você sabe exatamente onde está cada lead e qual o próximo passo.",
    beneficio: "Aumento da taxa de conversão e retenção de clientes com comunicação personalizada e automatizada.",
  },
  {
    icon: Target,
    title: "Integrações entre Plataformas",
    what: "Conectamos Meta Ads, Google Ads, WhatsApp, CRM e landing pages numa operação integrada e sem retrabalho manual.",
    diferencial: "Cada lead gerado pelo tráfego pago entra automaticamente no CRM e recebe follow-up imediato pelo WhatsApp.",
    beneficio: "Operação de marketing que funciona como um sistema — não como tarefas manuais desconectadas.",
  },
];

const servicesMap: Record<TabKey, { description: string; services: Service[] }> = {
  marketing: {
    description: "Transformamos sua captação de clientes num sistema previsível. Tráfego pago, conteúdo estratégico, landing pages e criativos — tudo integrado e com relatório claro todo mês.",
    services: marketingServices,
  },
  automacao: {
    description: "Lead gerado não pode esperar. Configuramos o sistema que responde, qualifica e agenda automaticamente — enquanto você atende quem já está na sua frente.",
    services: automacaoServices,
  },
  ti: {
    description: "Para empresas que precisam de suporte técnico além do marketing. Infraestrutura segura como base para crescer.",
    services: tiServices,
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
            Tudo que você precisa para{" "}
            <span className="gradient-text">encher sua agenda.</span>
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
