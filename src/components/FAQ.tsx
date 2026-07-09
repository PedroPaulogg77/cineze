import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como a Cineze gera novos clientes para o meu negócio?",
    answer: "A gente monta a operação de marketing do seu negócio: estratégia, anúncio no Google e no Meta, conteúdo e o atendimento automatizado no WhatsApp. Tudo pensado junto, com relatório claro do que está funcionando.",
  },
  {
    question: "Em quanto tempo começo a ver resultado?",
    answer: "Anúncio traz os primeiros contatos já nas primeiras semanas. O resultado firme vem com o ajuste ao longo de 60 a 90 dias, e é por isso que trabalhamos com no mínimo 3 meses. Quem promete milagre em 7 dias está te enrolando.",
  },
  {
    question: "Preciso ter um site para contratar vocês?",
    answer: "Não. Se precisar, a gente cria a página como parte do trabalho. E se o seu site atual não converte, resolver isso também entra.",
  },
  {
    question: "Como começa a trabalhar com a Cineze?",
    answer: "Começa com uma conversa no WhatsApp pra entender seu negócio e seu momento. A gente monta um plano começando pelo que move a agulha primeiro, sem despejar tudo de uma vez, e você decide. Sem pressão e sem formulário interminável.",
  },
  {
    question: "A Cineze atende fora de Belo Horizonte?",
    answer: "A assessoria é remota e atende o Brasil todo. Reunião presencial e apoio de perto ficam concentrados em Belo Horizonte e região metropolitana.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Dúvidas Comuns</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass rounded-xl px-6 border-border/50 data-[state=open]:border-secondary/50 transition-all duration-300 hover:border-secondary/30"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium hover:text-secondary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
