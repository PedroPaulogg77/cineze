import { motion } from "framer-motion";
import { Quote, Store } from "lucide-react";

const depoimentos = [
  {
    nome: "Eiras",
    segmento: "Consultoria Contábil",
    texto: "A gente vivia de indicação e não sabia de onde vinha cliente. Depois que estruturaram nossa captação, isso virou processo. Outro nível.",
  },
  {
    nome: "Ammax",
    segmento: "Mercado Imobiliário",
    texto: "Juntaram CRM e tráfego do jeito certo. O que era o nosso gargalo virou a principal fonte de cliente bom.",
  },
  {
    nome: "Decola Varejo",
    segmento: "Restaurantes",
    texto: "Restaurante precisa de movimento constante. O tráfego e a automação que montaram aceleraram demais a nossa carteira.",
  },
  {
    nome: "Startou",
    segmento: "Tecnologia",
    texto: "Trabalharam o nosso posicionamento junto com o tráfego. O lead passou a chegar já sabendo o valor do que a gente faz.",
  },
];

export function SocialProof() {
  return (
    <section id="depoimentos" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Quem já confiou na gente
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">
            A Cineze é marca nova.{" "}
            <span className="gradient-text">Quem toca ela, não.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Antes de virar Cineze, Pedro e Davidson já entregavam esses trabalhos no próprio nome.
          </p>
        </motion.div>

        {/* Case compacto — Pizzaria Avenida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto glass rounded-2xl p-6 md:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-base md:text-lg text-muted-foreground flex-1">
            <span className="font-semibold text-foreground">Pizzaria Avenida (Ibirité):</span> refizemos marca, Instagram, fotos, embalagem e o tráfego pago. O movimento cresceu a ponto de abrir uma segunda unidade.
          </p>
          <div className="text-center shrink-0">
            <div className="text-3xl md:text-4xl font-bold gradient-text leading-none">1 → 2</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </div>
        </motion.div>

        {/* Depoimentos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {depoimentos.map((d, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass rounded-2xl p-6 flex flex-col gap-4"
            >
              <Quote className="w-6 h-6 text-secondary shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{d.texto}"
              </p>
              <div className="pt-3 border-t border-border/50">
                <p className="font-bold text-sm">{d.nome}</p>
                <p className="text-xs text-secondary">{d.segmento}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
