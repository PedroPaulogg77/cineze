import { motion } from "framer-motion";
import { X } from "lucide-react";

const dores = [
  "Post bonito que não traz um cliente sequer.",
  "Impulsionar no escuro, sem saber o que deu certo.",
  "Agência que some depois que assina o contrato.",
  "Relatório cheio de número que não vira dinheiro.",
  "Depender de indicação e torcer pra chegar cliente.",
];

export function Problema() {
  return (
    <section id="problema" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Cansado de postar e não virar cliente?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">
              Você faz a sua parte.{" "}
              <span className="gradient-text">O marketing é que não acompanha.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              A maioria dos negócios bons em BH trava no mesmo lugar:
            </p>
          </motion.div>

          <div className="space-y-3">
            {dores.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-base md:text-lg">{d}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-semibold text-center mt-10"
          >
            Isso não é culpa do seu esforço. É o que acontece quando o marketing roda sem{" "}
            <span className="gradient-text">estrutura por trás</span>.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
