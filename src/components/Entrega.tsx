import { motion } from "framer-motion";
import { Compass, Hand, LineChart } from "lucide-react";

const pilares = [
  {
    icon: Compass,
    title: "Estratégia primeiro",
    desc: "Antes de gastar um real em anúncio, a gente descobre por que o cliente ainda não acha o seu negócio. Aí sim a campanha vai pro ar.",
  },
  {
    icon: Hand,
    title: "Execução feita por gente",
    desc: "Design, texto e campanha saem da mão do Pedro, designer há mais de 10 anos. Nada de template pronto ou estagiário aprendendo no seu negócio.",
  },
  {
    icon: LineChart,
    title: "Acompanhamento de verdade",
    desc: "Todo mês você senta com a gente, vê seus números de um jeito que dá pra entender e já sai sabendo o próximo passo.",
  },
];

export function Entrega() {
  return (
    <section id="entrega" className="py-24 md:py-32 relative overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -translate-y-1/2"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Como a gente trabalha
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            A gente trata o seu negócio{" "}
            <span className="gradient-text">como se fosse o nosso.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Muita agência entrega post e some. A gente entende o seu negócio, monta a estratégia, põe pra rodar e senta com você todo mês pra mostrar o que deu certo e o que vai mudar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pilares.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl glass transition-shadow duration-300 hover:shadow-xl hover:shadow-secondary/10"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
                <p.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
