import { motion } from "framer-motion";
import { Store } from "lucide-react";

export function CaseDestaque() {
  return (
    <section id="case" className="py-24 md:py-32 relative overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] -translate-y-1/2"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            A Cineze é marca nova.{" "}
            <span className="gradient-text">O trabalho por trás, não.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Antes de juntar design, estratégia e automação sob a Cineze, Pedro e Davidson já tocavam projetos assim. Esse é um deles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-14 glow-cyan"
        >
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Case · Pizzaria Avenida — Ibirité
            </span>
          </div>

          <div className="grid md:grid-cols-[1.6fr_1fr] gap-8 md:gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                De pizzaria de família a{" "}
                <span className="gradient-text">duas unidades.</span>
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                A Avenida chegou com um pedido grande: mudar tudo. E foi tudo mesmo. Rebranding, Instagram refeito do zero, fotografia nova e um posicionamento que enfim combinava com a comida. Nos bastidores, embalagem nova, panfleto, cupom, promoção na rua e tráfego pago no Meta pra puxar o movimento.
              </p>
              <p className="text-base md:text-lg text-foreground font-medium leading-relaxed mt-4">
                O resultado não foi um gráfico bonito. Foi movimento suficiente pra Avenida abrir uma segunda unidade, mais perto do centro, só pra dar conta da demanda.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center gap-2 border-t md:border-t-0 md:border-l border-border/50 pt-8 md:pt-0 md:pl-10">
              <div className="text-5xl md:text-6xl font-bold gradient-text leading-none">
                1 → 2
              </div>
              <p className="text-sm text-muted-foreground">
                unidades abertas depois do trabalho
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
