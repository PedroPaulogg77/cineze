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
    answer: "Através de tráfego pago no Meta e Google, conteúdo estratégico e automação de WhatsApp — tudo integrado numa operação que captura leads, nutre e converte. Você acompanha tudo em relatórios quinzenais com métricas reais.",
  },
  {
    question: "Em quanto tempo começo a ver resultado?",
    answer: "Campanhas de tráfego pago geram os primeiros leads nas primeiras semanas. O algoritmo otimiza ao longo de 60 a 90 dias, reduzindo o custo por lead progressivamente. Trabalhamos com contratos de no mínimo 3 meses justamente para esse ciclo funcionar.",
  },
  {
    question: "Preciso ter um site para contratar vocês?",
    answer: "Não. Criamos landing pages estratégicas como parte do serviço. Se você não tem site ou o site atual não converte, isso faz parte da nossa entrega.",
  },
  {
    question: "Como funciona o processo de contratação?",
    answer: "Tudo começa com o Diagnóstico Digital Gratuito. Em 20 minutos analisamos sua presença digital atual, identificamos os principais gargalos e apresentamos o que precisa ser feito. Sem compromisso.",
  },
  {
    question: "A Cineze atende fora de Belo Horizonte?",
    answer: "Nossa Assessoria de Marketing é feita remotamente, permitindo atender clientes em todo o Brasil. O suporte presencial e reuniões estratégicas são focados em Belo Horizonte e região metropolitana.",
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
