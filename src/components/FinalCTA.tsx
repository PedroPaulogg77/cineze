import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const WHATSAPP_LINK = "https://wa.me/5531985335573";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[120px]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 px-2 sm:px-0"
          >
            Quanto está custando{" "}
            <span className="gradient-text">ficar invisível?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 px-2 sm:px-0"
          >
            Faça um diagnóstico gratuito da sua presença digital. Em 20 minutos você descobre o que está perdendo e o que fazer para mudar isso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 px-4 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="hero" size="xl" asChild className="w-full sm:w-auto text-sm sm:text-base whitespace-normal h-auto py-4">
                <Link
                  to="/diagnostico"
                  className="group flex items-center justify-center gap-2 text-center"
                >
                  AGENDAR DIAGNÓSTICO GRATUITO
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground"
          >
            <motion.a
              href="tel:+5531985335573"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <Phone className="w-5 h-5" />
              <span>+55 31 98533-5573</span>
            </motion.a>
            <motion.a
              href="mailto:contato@cineze.com.br"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <Mail className="w-5 h-5" />
              <span>contato@cineze.com.br</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}