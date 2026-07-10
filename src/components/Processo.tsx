import { motion } from "framer-motion";

const passos = [
  {
    num: "01",
    title: "Você chama no WhatsApp",
    desc: "Conta rápido do seu negócio e do seu momento. Sem formulário interminável.",
  },
  {
    num: "02",
    title: "A gente entende e monta um plano",
    desc: "Olhamos o que você já tem e trazemos um plano com o que dá resultado mais rápido pro seu caso.",
  },
  {
    num: "03",
    title: "Você decide",
    desc: "Se fizer sentido pros dois lados, a gente começa. Sem pressão.",
  },
];

export function Processo() {
  return (
    <section id="processo" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Como começa
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4">
            Do primeiro oi ao plano na mão,{" "}
            <span className="gradient-text">sem enrolação.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {passos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-2xl glass"
            >
              <div className="text-5xl font-bold gradient-text mb-4">{p.num}</div>
              <h3 className="text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
