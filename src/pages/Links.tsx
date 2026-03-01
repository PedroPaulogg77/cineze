import { motion } from 'framer-motion';
import { Globe, MessageCircle, Linkedin } from 'lucide-react';
import logoCineze from '@/assets/logo-cineze.png';

const links = [
  {
    title: 'Nosso Site',
    url: 'https://cineze.com.br',
    icon: Globe,
  },
  {
    title: 'Fale com a gente',
    url: 'https://wa.me/5531985335573',
    icon: MessageCircle,
  },
  {
    title: 'Veja outros conteúdos',
    url: 'https://www.linkedin.com/company/cineze',
    icon: Linkedin,
  },
];

const Links = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <img
            src={logoCineze}
            alt="Cineze Logo"
            className="h-12 w-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-center mb-8 text-sm"
        >
          T.I. Estratégica + Marketing Digital
        </motion.p>

        {/* Links */}
        <div className="w-full space-y-4">
          {links.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-foreground font-medium transition-all duration-300 hover:bg-primary hover:border-primary hover:text-primary-foreground hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
            >
              <link.icon className="w-5 h-5" />
              <span>{link.title}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Links;
