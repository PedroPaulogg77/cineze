import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Shield } from "lucide-react";

const objections = [
  {
    icon: TrendingUp,
    title: "Leads que viram clientes",
    description:
      "Não entregamos métricas de vaidade. Entregamos contatos de pessoas reais interessadas no seu serviço — com número para provar todo mês.",
  },
  {
    icon: BarChart3,
    title: "Marketing que se paga",
    description:
      "Cada real investido em mídia é rastreado. Você sabe quantos leads gerou, quanto custou cada um e quantos viraram receita.",
  },
  {
    icon: Shield,
    title: "Automação que trabalha por você",
    description:
      "WhatsApp, CRM e integrações que respondem o lead em segundos e nutrem o relacionamento enquanto você foca no seu negócio.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function ObjectionBreaker() {
  return (
    <section id="objecoes" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Marketing que gera cliente.{" "}
            <span className="gradient-text">Não curtida.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {objections.map((objection, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.25 },
              }}
              className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10"
            >
              <motion.div
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <objection.icon className="w-7 h-7 text-secondary" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary transition-colors duration-300">
                {objection.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {objection.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
