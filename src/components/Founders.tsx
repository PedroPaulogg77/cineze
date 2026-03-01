import { motion } from "framer-motion";
import { Shield, Rocket, Users } from "lucide-react";
import davidsonImg from "@/assets/davidson.jpg";

const founders = [
  {
    name: "Davidson",
    role: "Especialista em Automação e CRM",
    image: davidsonImg,
    icon: Shield,
    description:
      "Davidson garante que cada lead gerado pelo marketing seja capturado, respondido e acompanhado. Ele é o responsável pelas automações de WhatsApp, integrações de CRM e toda a infraestrutura que transforma interesse em agendamento — sem depender de processo manual.",
  },
  {
    name: "Pedro",
    role: "Especialista em Marketing",
    image: "/assets/pedro.webp",
    icon: Rocket,
    description:
      "Pedro lidera a estratégia de growth marketing da Cineze. Designer com mais de 10 anos de experiência, utiliza inteligência artificial para criar conteúdo e campanhas em escala sem abrir mão da qualidade — com foco 100% em resultado mensurável para o cliente.",
  },
];

export function Founders() {
  return (
    <section id="fundadores" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -translate-y-1/2"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] -translate-y-1/2"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            A Cineze nasceu de uma convicção:{" "}
            <motion.span
              className="gradient-text inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              bom serviço merece ser encontrado.
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0"
          >
            A Cineze não é apenas uma empresa; é a convergência de duas visões
            complementares, nascida da experiência dos irmãos Davidson e Pedro.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {founders.map((founder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-8 md:p-10 transition-shadow duration-300 hover:shadow-xl hover:shadow-secondary/10"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <founder.icon className="w-5 h-5 text-secondary-foreground" />
                  </motion.div>
                </motion.div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold mb-1">{founder.name}</h3>
                  <p className="text-secondary font-semibold">{founder.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {founder.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Convergence section */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            className="glass rounded-3xl p-8 md:p-12 glow-cyan"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Users className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">A Convergência</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Toda semana, negócios competentes em BH perdem clientes para concorrentes com produto pior mas marketing melhor. Isso é injusto — e tem solução. A Cineze foi criada para isso: unir{" "}
              <strong className="text-foreground">estratégia de marketing</strong>, design profissional e{" "}
              <strong className="text-foreground">automação inteligente</strong> numa operação que gera resultado real, não presença decorativa.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
