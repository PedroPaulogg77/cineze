import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const depoimentos = [
  {
    nome: "Eiras",
    segmento: "Consultoria Contábil",
    texto: "Antes a gente dependia só de indicação. Estruturamos um funil de captação previsível de clientes B2B e passamos a saber de onde vinha cada contato. A leitura da Cineze sobre o digital é muito acima da média.",
  },
  {
    nome: "Ammax",
    segmento: "Mercado Imobiliário",
    texto: "O que era gargalo virou nossa principal fonte de cliente de alto padrão. Juntamos automação de CRM e tráfego pago de um jeito que faz sentido, sem desperdício de verba.",
  },
  {
    nome: "Decola Varejo",
    segmento: "Restaurantes",
    texto: "Escalar restaurante pede volume constante de cliente. A automação junto com o tráfego que montamos acelerou demais o crescimento da nossa carteira.",
  },
  {
    nome: "Startou",
    segmento: "Tecnologia / Apps",
    texto: "Demos um salto de posicionamento. Trabalhar o branding junto com o tráfego fez o lead chegar já entendendo o valor do nosso produto.",
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Quem já trabalhou{" "}
            <span className="gradient-text">com a gente.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Negócios reais que os sócios da Cineze já atenderam, de nichos diferentes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {depoimentos.map((d, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-8 flex flex-col gap-4 transition-shadow duration-300 hover:shadow-xl hover:shadow-secondary/10"
            >
              <Quote className="w-8 h-8 text-secondary shrink-0" />
              <p className="text-muted-foreground leading-relaxed flex-1">
                "{d.texto}"
              </p>
              <div className="pt-4 border-t border-border/50">
                <p className="font-bold">{d.nome}</p>
                <p className="text-sm text-secondary">{d.segmento}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
