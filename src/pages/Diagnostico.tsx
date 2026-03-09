import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import {
    ArrowRight, ArrowLeft, CheckCircle2, Check, UserRound, Phone, MapPin,
    ShieldCheck, Bell, TrendingUp, Star, ClipboardList, User, FileCheck,
    GitBranch, Search, AlertTriangle, BarChart, Calendar, Compass, X, ScanSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCineze from "@/assets/logo-cineze.png";
import { DiagnosticoFooter } from "@/components/DiagnosticoFooter";
import parceiro1 from "@/assets/Logos/PARCEIRO 1.jpg";
import parceiro2 from "@/assets/Logos/PARCEIRO 2.png";
import parceiro3 from "@/assets/Logos/PARCEIRO 3.png";
import parceiro4 from "@/assets/Logos/PARCEIRO 4.png";

// Questions configurations
const questions = [
    {
        id: "abertura",
        title: "Vamos começar seu diagnóstico.",
        subtitle: "Leva menos de 5 minutos. E pode mudar a forma como você atrai clientes.",
        type: "start",
        buttonText: "COMEÇAR AGORA →",
        sideContent: ""
    },
    {
        id: "nome",
        title: "Qual o seu nome?",
        type: "text",
        placeholder: "Seu nome completo",
        sideContent: "\"Finalmente entendi por que minha agenda não enchia — mesmo com um serviço bom.\"\n— Cliente Cineze, Savassi BH"
    },
    {
        id: "email",
        title: "Qual o seu melhor e-mail?",
        type: "text",
        placeholder: "seuemail@exemplo.com",
        sideContent: "Fique tranquilo, nós odiamos spam. Usaremos apenas para enviar informações do seu diagnóstico."
    },
    {
        id: "whatsapp",
        title: "Qual o seu WhatsApp?",
        subtitle: "Pedro vai te contatar por aqui em até 12h.",
        type: "text",
        placeholder: "(31) 9 0000-0000",
        sideContent: "Mais de 150 negócios em BH já passaram pelo nosso diagnóstico."
    },
    {
        id: "segmento",
        title: "Qual o segmento do seu negócio?",
        type: "options",
        options: [
            "Nutricionista / Personal Trainer / Esteticista",
            "Fisioterapeuta / Quiropraxista / Acupunturista",
            "Psicólogo / Terapeuta / Coach de saúde mental",
            "Médico / Dentista / Clínica médica",
            "Advogado / Escritório jurídico",
            "Contador / Consultor financeiro / Planejador",
            "Arquiteto / Designer de interiores / Engenheiro",
            "Coach / Mentor / Consultoria de negócios",
            "Escola / Curso presencial / Autoescola",
            "Infoproduto / Curso online / Treinamento",
            "Restaurante / Lanchonete / Food service",
            "Loja física / Varejo local",
            "E-commerce / Loja online",
            "Clínica estética / Spa / Salão de beleza",
            "Imobiliária / Corretor de imóveis",
            "Outro"
        ],
        sideContent: "A Cineze atende negócios de serviço local em BH — de todos os segmentos.\nO que muda é a estratégia. O objetivo é sempre o mesmo: mais clientes certos."
    },
    {
        id: "captacao",
        title: "Como a maioria dos seus clientes chega até você hoje?",
        type: "options",
        options: [
            "Indicação de quem já me conhece",
            "Me encontram no Google",
            "Me encontram pelo Instagram",
            "Vem de anúncios que eu pago",
            "Não sei de onde vêm"
        ],
        sideContent: "83% dos donos de negócio que passam pelo nosso diagnóstico dependem quase 100% de indicação.\n\nIndicação é ótima — mas não escala."
    },
    {
        id: "presenca",
        title: "Você tem site ou landing page hoje?",
        type: "options",
        options: [
            "Sim — e ele traz clientes",
            "Sim — mas não converte nada",
            "Não tenho"
        ],
        sideContent: "Uma landing page bem feita transforma tráfego em agenda cheia.\nUma mal feita só consome dinheiro de anúncio."
    },
    {
        id: "trafego",
        title: "Você já investiu em tráfego pago — Meta Ads ou Google Ads?",
        type: "options",
        options: [
            "Sim, já invisto atualmente",
            "Já tentei mas parei",
            "Nunca investi"
        ],
        sideContent: "Não existe resposta certa ou errada aqui.\nO que existe é a estratégia certa para onde você está hoje."
    },
    {
        id: "dor",
        title: "Qual é o seu maior desafio com clientes agora?",
        type: "options",
        options: [
            "Atrair clientes novos todo mês",
            "Converter quem chega mas não fecha",
            "Manter os clientes que já tenho",
            "Não sei por onde começar"
        ],
        sideContent: "\"Meu problema não era falta de cliente — era que eu não sabia de onde eles vinham.\nE aí não conseguia trazer mais.\"\n— Cliente Cineze"
    },
    {
        id: "meta",
        title: "Quantos clientes novos você quer receber por mês?",
        type: "options",
        options: [
            "5 a 10",
            "10 a 20",
            "20 a 50",
            "Mais de 50"
        ],
        sideContent: "Com a estrutura certa, a maioria dos nossos clientes atinge a meta em 60 a 90 dias."
    },
    {
        id: "urgencia",
        title: "Para quando você precisa ver resultado?",
        type: "options",
        options: [
            "Preciso de resultado agora",
            "Nos próximos 1 a 2 meses",
            "Estou planejando para mais pra frente"
        ],
        sideContent: "Seja qual for o prazo, o passo um é o mesmo:\nentender onde você está hoje."
    },
    {
        id: "contexto",
        title: "Conta um pouco mais sobre o seu negócio.",
        subtitle: "O que você faz, onde atua, e qual limite você quer superar.\nIsso ajuda Pedro a chegar preparado na conversa.",
        type: "textarea",
        placeholder: "Ex: \"Sou nutricionista no Savassi, atendo presencialmente e online.\nQuero parar de depender só de indicação e ter uma agenda mais previsível.\"",
        buttonText: "ENVIAR MEU DIAGNÓSTICO →",
        sideContent: "A clareza nas suas respostas nos ajuda a entregar um diagnóstico muito mais preciso e aplicável à sua realidade."
    }
];

export default function Diagnostico() {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isScrolledHeader, setIsScrolledHeader] = useState(false);
    const [isScrolledBottom, setIsScrolledBottom] = useState(false);
    const [showFloatingCTA, setShowFloatingCTA] = useState(true);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [stepCarouselIndex, setStepCarouselIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Check for "start" param to skip step 0
    useEffect(() => {
        if (searchParams.get("start") === "true") {
            setStep(1);
        }
    }, [searchParams]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex((prev) => (prev + 1) % 3);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepCarouselIndex((prev) => (prev + 1) % 4);
        }, 5500);
        return () => clearInterval(interval);
    }, []);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    // Handle header & floating CTA scroll states
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolledHeader(window.scrollY > 100);

            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            setIsScrolledBottom(scrollPosition > documentHeight * 0.8);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNext = () => {
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            void submitForm();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleOptionSelect = (value: string) => {
        const currentQ = questions[step - 1];
        setAnswers({ ...answers, [currentQ.id]: value });
        handleNext();
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/submit-diagnostico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answers),
            });
            let variant = 'b';
            if (res.ok) {
                const data = await res.json();
                variant = data.variant.toLowerCase();
            } else {
                variant = answers["trafego"] === "Sim, já invisto atualmente" ? 'a' : 'b';
            }
            const params = new URLSearchParams({ nome: answers["nome"] || "", email: answers["email"] || "", phone: answers["whatsapp"] || "" });
            navigate(`/diagnostico/obrigado-${variant}?${params.toString()}`);
        } catch {
            const variant = answers["trafego"] === "Sim, já invisto atualmente" ? 'a' : 'b';
            const params = new URLSearchParams({ nome: answers["nome"] || "", email: answers["email"] || "", phone: answers["whatsapp"] || "" });
            navigate(`/diagnostico/obrigado-${variant}?${params.toString()}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 0: Landing Page Long Copy (Redesign)
    if (step === 0) {
        return (
            <div className="min-h-screen bg-[#0A1628] text-foreground selection:bg-primary/30 font-sans pb-24 md:pb-0">

                {/* Top Banner */}
                <div className="relative z-20 bg-[#0066FF]/20 backdrop-blur-md text-center py-2 px-4 text-xs md:text-sm font-medium text-[#06B7D8]">
                    Para donos de negócio em BH que querem mais clientes — e não sabem por onde começar.
                </div>

                {/* --- SEÇÃO 1: HERO DESKTOP REFINADO --- */}
                {/* Isolado completamente FORA da tag main, ancorando o topo no limite do navegador. */}
                <section className="hidden md:flex flex-col relative w-full h-[calc(100vh-36px)] min-h-[700px] overflow-hidden bg-[#030812]">
                    {/* Background Expandido na tela inteira - Sem recuo  */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        <img
                            src="/assets/banner-desktop.webp"
                            alt="Background"
                            className="w-full h-full object-cover object-[70%_top]"
                        />
                    </div>

                    {/* Wrapper Principal de 1280px centralizado */}
                    <div className="w-full max-w-7xl mx-auto flex flex-col h-full px-4 md:px-8 relative z-10">

                        {/* HEADER DESKTOP APENAS. Faz parte do div e fluxo normal de renderizacao! */}
                        <header className="pt-8 pb-4 w-full flex justify-start items-center">
                            <img src={logoCineze} alt="Cineze" className="h-8" />
                        </header>

                        {/* Coluna da Esquerda (Textos Centralizados Verticalmente) */}
                        <div className="w-[60%] lg:w-[50%] flex-1 flex flex-col justify-center space-y-6 md:space-y-8 text-left pb-16">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                                className="text-[32px] md:text-[48px] lg:text-[60px] font-bold leading-[1.1] tracking-tight text-white"
                            >
                                EMPRESAS BOAS NÃO QUEBRAM POR FALTA DE PRODUTO. <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#06B7D8]">QUEBRAM POR FALTA DE PREVISIBILIDADE.</span>
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-2 max-w-xl"
                            >
                                <p className="text-lg md:text-[20px] text-[#A1B3CB] leading-relaxed">
                                    Descubra exatamente onde está o problema de marketing — e o que fazer para mudar isso.
                                </p>
                                <p className="text-lg md:text-[20px] text-white font-bold">
                                    Diagnóstico gratuito. Resultado em 12 horas.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="pt-4 flex flex-col items-start gap-3"
                            >
                                <Button
                                    onClick={() => setStep(1)}
                                    size="xl"
                                    className="text-base md:text-[18px] px-10 py-7 bg-gradient-to-r from-[#0066FF] to-[#06B7D8] text-white rounded-xl hover:scale-[1.02] transition-all border-0 flex font-bold tracking-wide uppercase"
                                >
                                    QUERO MEU DIAGNÓSTICO GRATUITO
                                    <ArrowRight className="ml-3 w-6 h-6" />
                                </Button>
                                <p className="text-[13px] md:text-[14px] text-[#8B9DB5] text-left block pl-2">
                                    Sem cartão. Sem compromisso. Só clareza.
                                </p>
                            </motion.div>
                        </div>

                        {/* Flutuantes Direita */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-full pointer-events-none"
                        >
                            {/* Flutuante 1: Pedro Paulo (Marketing) */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
                                className="absolute top-[22%] left-[5%] xl:left-[15%] bg-black/40 backdrop-blur-md border border-white/10 p-2 pr-6 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3 z-20 pointer-events-auto"
                            >
                                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-white/20 overflow-hidden shrink-0 bg-[#0A1628]">
                                    <img src="/assets/pedro-paulo-avatar.webp" alt="Pedro Paulo" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-white text-[14px] lg:text-[15px] font-medium leading-tight">Pedro Paulo</span>
                                    <span className="text-[#A1B3CB] text-[11px] lg:text-[12px] font-normal leading-tight">Especialista em Marketing</span>
                                </div>
                            </motion.div>

                            {/* Flutuante 2: Davidson (Tecnologia) */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}
                                className="absolute bottom-[25%] right-[5%] xl:right-[15%] bg-black/40 backdrop-blur-md border border-white/10 p-2 pr-6 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3 z-20 pointer-events-auto"
                            >
                                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-white/20 overflow-hidden shrink-0 bg-[#0A1628]">
                                    <img src="/assets/davidson-avatar.webp" alt="Davidson - Tecnologia" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-white text-[14px] lg:text-[15px] font-medium leading-tight">Davidson</span>
                                    <span className="text-[#A1B3CB] text-[11px] lg:text-[12px] font-normal leading-tight">Especialista em Tecnologia</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Header Mobile Oculto no Desktop */}
                <header className="md:hidden py-4 pt-6 pb-2 px-4 max-w-7xl mx-auto flex justify-center items-center relative z-20">
                    <img src={logoCineze} alt="Cineze" className="h-5" />
                </header>

                <main className="max-w-7xl mx-auto px-4 py-2 md:pt-16 md:pb-12 space-y-16 md:space-y-24">
                    {/* SEÇÃO 1 — HERO ESTILO V4 COMPANY (MOBILE) */}
                    <section className="flex flex-col relative md:hidden -mx-4 -mt-32 pt-32 h-[100dvh] overflow-hidden bg-[#0A1628]">

                        {/* Imagem Cover puxada pro Topo */}
                        <div className="absolute inset-x-0 top-0 w-full h-full z-0">
                            <img
                                src="/assets/banner-mobile.webp"
                                alt="Pedro Paulo Cineze"
                                className="w-full h-full object-cover object-[center_15%] opacity-90"
                            />
                            {/* Gradiente sutil do meio até a base salvando o Rosto da escuridão  */}
                            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0A1628] via-[#0A1628]/80 to-transparent"></div>
                        </div>

                        {/* Flutuantes Mobile */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                            className="absolute inset-0 z-10 pointer-events-none"
                        >
                            {/* Pedro Paulo (Esquerda/Cima) */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
                                className="absolute top-[18%] left-4 bg-black/40 backdrop-blur-md border border-white/10 p-1.5 pr-4 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto"
                            >
                                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0 bg-[#0A1628]">
                                    <img src="/assets/pedro-paulo-avatar.webp" alt="Pedro Paulo" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-white text-[12px] font-medium leading-tight">Pedro Paulo</span>
                                    <span className="text-[#A1B3CB] text-[10px] font-normal leading-tight">Especialista em Marketing</span>
                                </div>
                            </motion.div>

                            {/* Davidson (Direita/Meio) */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}
                                className="absolute top-[38%] right-4 bg-black/40 backdrop-blur-md border border-white/10 p-1.5 pr-4 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto"
                            >
                                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0 bg-[#0A1628]">
                                    <img src="/assets/davidson-avatar.webp" alt="Davidson" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-white text-[12px] font-medium leading-tight">Davidson</span>
                                    <span className="text-[#A1B3CB] text-[10px] font-normal leading-tight">Especialista em Tecnologia</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Texto Hero Ancorado 100% no Rodapé, liberto do Rosto e colado ao fundo p/ aproximar do CTA */}
                        <div className="w-full relative z-10 flex flex-col justify-end items-center px-4 pb-0 mt-auto h-full text-center text-balance space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                                className="text-[28px] leading-[1.1] font-bold tracking-tight text-white/90 drop-shadow-2xl"
                            >
                                SEU NEGÓCIO <span className="text-white">NÃO QUEBRA POR FALTA DE PRODUTO.</span><br />
                                <span className="uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#06B7D8]">
                                    QUEBRA POR FALTA DE PREVISIBILIDADE.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-[13px] text-white/80 leading-relaxed font-light mx-auto drop-shadow-xl"
                            >
                                Descubra exatamente onde está o problema na captação do seu negócio e o que fazer para mudar isso hoje.
                            </motion.p>
                        </div>
                    </section>

                    {/* SEÇÃO 1 B (EXTRA) — BOTÃO CTA MOBILE NA SEGUNDA DOBRA (FORA DO HERO 100VH) */}
                    <div className="md:hidden !mt-0 -mx-4 px-6 relative z-10 pb-0 pt-2 flex justify-center bg-[#0A1628]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="w-full max-w-md mx-auto"
                        >
                            <Button
                                onClick={() => setStep(1)}
                                size="lg"
                                className="w-full text-[17px] tracking-wide font-black py-8 bg-gradient-to-r from-[#0066FF] to-[#06B7D8] text-white rounded-xl shadow-[0_0_30px_rgba(0,102,255,0.25)] hover:scale-[1.02] transition-all border-0 flex uppercase"
                            >
                                AGENDAR DIAGNÓSTICO
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </motion.div>
                    </div>


                    {/* Separator / Divider */}
                    <div className="w-full max-w-lg mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#1A3050] to-transparent !mt-8 md:!mt-16"></div>

                    {/* SEÇÃO 2 — PROBLEMA E MUDANÇA DE PARADIGMA */}
                    <section className="flex flex-col items-center justify-center gap-12 lg:gap-16 relative pt-4 md:pt-16 !mt-6 md:!mt-16">
                        <div className="w-full max-w-4xl mx-auto space-y-8 text-center">

                            {/* Social Proof Badges - Animado (Refinado) */}
                            <div className="flex flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="flex -space-x-3 md:-space-x-4">
                                    {[parceiro1, parceiro2, parceiro3, parceiro4].map((logo, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.5, x: -20 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }} viewport={{ once: true }}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#0A1628] bg-black overflow-hidden shadow-2xl relative"
                                            style={{ zIndex: 10 - i }}
                                        >
                                            <img src={logo} alt={`Logo de Parceiro ${i + 1}`} className="w-full h-full object-cover" />
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 4 * 0.15, ease: "easeOut" }} viewport={{ once: true }}
                                    className="text-left"
                                >
                                    <p className="text-white font-black text-[15px] md:text-[19px] leading-tight tracking-tight"><span className="text-[#06B7D8]">+100</span> Clientes</p>
                                    <p className="text-white/70 text-[12px] md:text-[14px] font-medium leading-tight mt-0.5">atendidos e satisfeitos</p>
                                </motion.div>
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
                                className="text-[32px] md:text-4xl lg:text-5xl font-black leading-tight uppercase"
                            >
                                <span className="text-white">Você não tem problema de produto.</span><br />
                                <span className="bg-gradient-to-r from-[#0066FF] to-[#06B7D8] bg-clip-text text-transparent">Tem problema de visibilidade.</span>
                            </motion.h2>

                            <div className="relative w-full h-[160px] md:h-[120px] flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {carouselIndex === 0 && (
                                        <motion.div
                                            key="arg1"
                                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}
                                            className="absolute w-full px-4"
                                        >
                                            <p className="text-lg md:text-xl text-[#8B9DB5] px-2 md:px-0">A maioria dos negócios em BH não fecha mais porque é ruim.</p>
                                            <p className="text-[22px] md:text-2xl font-medium text-white mt-2">Fecha porque aparece menos.</p>
                                        </motion.div>
                                    )}
                                    {carouselIndex === 1 && (
                                        <motion.div
                                            key="arg2"
                                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}
                                            className="absolute w-full px-4"
                                        >
                                            <p className="text-lg md:text-xl text-[#8B9DB5] px-2 md:px-0">O concorrente que cobra mais e entrega menos aparece no Google.</p>
                                            <p className="text-[22px] md:text-2xl font-medium text-white mt-2">Tem landing page. Tem anúncio rodando.</p>
                                        </motion.div>
                                    )}
                                    {carouselIndex === 2 && (
                                        <motion.div
                                            key="arg3"
                                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}
                                            className="absolute w-full px-4"
                                        >
                                            <p className="text-[17px] md:text-xl text-[#8B9DB5] px-2 md:px-0">E quando o cliente pesquisa no celular — encontra o concorrente, não você.</p>
                                            <p className="text-[22px] md:text-2xl font-medium text-white mt-2">Isso não é sorte. É falta de estrutura.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    </section>

                    {/* SEÇÃO 3 — COMO FUNCIONA (Carrossel Automático) */}
                    <section className="py-2 md:py-12 relative z-10 !mt-2 md:!mt-8">
                        <h2 className="text-[28px] md:text-4xl lg:text-5xl font-black mb-8 md:mb-12 text-center uppercase tracking-tight px-4 leading-[1.1]">
                            <span className="text-white">COMO </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#06B7D8]">FUNCIONA</span><br />
                            <span className="text-white">O DIAGNÓSTICO</span>
                        </h2>

                        <div className="w-full max-w-2xl mx-auto relative px-4 flex justify-center">
                            <div className="relative w-full h-[340px] md:h-[260px] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {[
                                        { icon: ClipboardList, text: "Leva menos de 5 minutos. Algumas perguntas sobre seu negócio, seus clientes e sua situação atual.", title: "Você preenche o formulário" },
                                        { icon: User, text: "Não é um robô. É Pedro, sócio da Cineze, que vai olhar os seus dados e te ligar no WhatsApp.", title: "Pedro analisa em até 12h", extraElement: true },
                                        { icon: FileCheck, text: "Uma análise honesta do que está travando seu crescimento — e o que priorizar primeiro.", title: "Você recebe o diagnóstico" },
                                        { icon: GitBranch, text: "Sem pressão. Sem compromisso. Se fizer sentido avançar junto, a gente conversa.", title: "Você decide o que fazer" }
                                    ].map((step, idx) => (
                                        idx === stepCarouselIndex && (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}
                                                className="absolute inset-0 w-full flex items-center"
                                            >
                                                <div className="bg-[#0D1F35] border border-[#1A3050] border-l-[3px] border-l-[#0066FF] p-6 md:p-8 rounded-xl h-full w-full relative group shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col justify-center">
                                                    {/* Background Number */}
                                                    <span className="absolute -top-4 right-4 text-[80px] md:text-[100px] font-black text-[#0066FF]/10 z-0 select-none">
                                                        0{idx + 1}
                                                    </span>

                                                    <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#06B7D8] shrink-0 shadow-[0_0_15px_rgba(0,102,255,0.3)]">
                                                            <step.icon className="w-7 h-7 md:w-8 md:h-8" />
                                                        </div>
                                                        <div className="mt-2 md:mt-0">
                                                            <h3 className="text-xl md:text-[22px] font-bold mb-3 text-white leading-tight">{step.title}</h3>
                                                            <p className="text-[#8B9DB5] text-[15px] md:text-lg leading-relaxed">{step.text}</p>
                                                        </div>
                                                    </div>

                                                    {/* Flutuante "Pedro Online" on step 2 */}
                                                    {step.extraElement && (
                                                        <div className="mt-5 md:mt-6 inline-flex bg-[#0A1628] border border-[#1A3050] p-3 rounded-xl shadow-lg items-center gap-3 w-fit relative z-10">
                                                            <div className="relative shrink-0">
                                                                <div className="w-10 h-10 rounded-full bg-[#1A3050] flex items-center justify-center overflow-hidden">
                                                                    <User className="w-5 h-5 text-[#8B9DB5]" />
                                                                </div>
                                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A1628]" />
                                                            </div>
                                                            <div className="flex-1 min-w-[130px]">
                                                                <p className="text-xs font-bold text-white leading-tight">Pedro Paulo · Online</p>
                                                                <p className="text-[10px] text-[#8B9DB5] mt-1">Responde em &lt; 2h</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Indicadores do Carrossel */}
                        <div className="flex justify-center gap-2 mt-4 relative z-20">
                            {[0, 1, 2, 3].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setStepCarouselIndex(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === stepCarouselIndex ? "w-8 bg-[#06B7D8]" : "w-4 bg-[#1A3050] hover:bg-[#0066FF]/40"
                                        }`}
                                    aria-label={`Ir para etapa ${i + 1}`}
                                />
                            ))}
                        </div>

                        {/* Botão CTA Pós-Carrossel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full max-w-md mx-auto relative z-10 mt-8 md:mt-12 px-4"
                        >
                            <Button
                                onClick={() => setStep(1)}
                                size="lg"
                                className="w-full text-[17px] tracking-wide font-black py-8 bg-gradient-to-r from-[#0066FF] to-[#06B7D8] text-white rounded-xl shadow-[0_0_30px_rgba(0,102,255,0.25)] hover:scale-[1.02] transition-all border-0 flex uppercase"
                            >
                                AGENDAR DIAGNÓSTICO
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </motion.div>
                    </section>

                    {/* SEÇÃO 4 — DEPOIMENTOS (Carrossel Interativo) */}
                    <section className="pt-4 md:pt-8 pb-8 md:pb-16 relative z-10 overflow-hidden">
                        <div className="text-center px-2 mb-8 md:mb-12">
                            <h2 className="text-[26px] md:text-4xl font-black mb-2 md:mb-4 uppercase tracking-tight leading-tight whitespace-nowrap">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#06B7D8]">O QUE DIZEM</span><br className="md:hidden" />
                                <span className="text-white md:ml-3">SOBRE NÓS</span>
                            </h2>
                            <p className="text-[#8B9DB5] text-sm md:text-base max-w-xl mx-auto">
                                Descubra o que clientes satisfeitos e parceiros têm a dizer sobre a experiência com a nossa metodologia.
                            </p>
                        </div>

                        {/* Carrossel Scrollável */}
                        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory font-sans 
                                [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#1A3050]/30 [&::-webkit-scrollbar-thumb]:bg-[#0066FF]/40 hover:[&::-webkit-scrollbar-thumb]:bg-[#06B7D8]/80 [&::-webkit-scrollbar-thumb]:rounded-full cursor-grab active:cursor-grabbing"
                            >
                                {[
                                    { name: "Eiras", role: "Consultoria Contábil", logo: parceiro1, detail: "Antes dependíamos de indicações. Com as estratégias de growth, criamos um funil de captação previsível de clientes B2B. A visão analítica da Cineze sobre o ecossistema digital é excepcional." },
                                    { name: "Ammax", role: "Marketing Imobiliário", logo: parceiro2, detail: "O diagnóstico mudou o jogo. Implementamos automação de CRM e tráfego pago de forma inteligente. O que antes era um gargalo, hoje é nossa principal máquina de aquisição de alto padrão." },
                                    { name: "Decola Varejo", role: "Marketing para Restaurantes", logo: parceiro3, detail: "Escalar restaurantes requer volume constante. A automação junto ao tráfego que estruturamos com a Cineze trouxe um ROI que acelerou drasticamente o crescimento da nossa esteira de clientes." },
                                    { name: "Startou", role: "Criação de Apps via IA", logo: parceiro4, detail: "Tivemos um salto absurdo em posicionamento. Trabalhar nosso branding atrelado ao tráfego de alta performance fez com que os leads chegassem já entendendo o valor do nosso produto tech." }
                                ].map((testi, i) => (
                                    <div key={i} className="w-[85vw] md:w-[340px] max-w-[340px] snap-center shrink-0 bg-[#0D1623] border border-[#1A3050]/60 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden transition-all group hover:border-[#0066FF]/50" style={{ backgroundImage: "linear-gradient(to bottom, #0D1623 0%, #152A4A 100%)" }}>

                                        {/* Bottom Glow Effect (Reference Picture Style) */}
                                        <div className="absolute -bottom-10 left-0 w-full h-[120px] bg-[#0066FF] opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />

                                        {/* Avatar Placeholder */}
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#06B7D8]/20 to-[#0066FF]/20 border border-[#06B7D8]/40 flex items-center justify-center text-white text-lg md:text-xl font-bold mb-4 shadow-inner relative z-10 overflow-hidden shrink-0">
                                            <img src={testi.logo} alt={`Logo ${testi.name}`} className="w-full h-full object-cover" />
                                        </div>

                                        <h3 className="font-bold text-white text-[15px] md:text-[17px] relative z-10">{testi.name}</h3>
                                        <p className="text-[#8B9DB5] text-xs font-medium mb-5 md:mb-6 relative z-10">{testi.role}</p>

                                        <p className="text-[#A1B3CB] text-[13px] md:text-[14px] leading-relaxed relative z-10 flex-1 border-t border-[#1A3050]/30 pt-4 mt-2">
                                            "{testi.detail}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* SEÇÃO 5 — TABELA DE ANCORAGEM DE PREÇO */}
                    <section className="pt-0 md:pt-4 pb-4 md:pb-8 relative z-10">
                        <div className="text-center px-4 mb-6 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-white uppercase tracking-tight leading-[1.1]">
                                NÃO FIQUE MAIS NO ESCURO
                            </h2>
                            <p className="text-[#8B9DB5] text-sm md:text-lg max-w-xl mx-auto hidden md:block">
                                Preencha o formulário. A gente faz o trabalho.
                            </p>
                        </div>

                        {/* Box da Tabela */}
                        <div className="w-full max-w-4xl mx-auto px-2 md:px-6">
                            <div className="bg-[#0A111A] border border-[#1A3050] rounded-2xl md:rounded-[32px] p-4 md:p-12 relative overflow-hidden shadow-2xl">

                                {/* Glow sutil de fundo */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/5 rounded-full blur-[100px] pointer-events-none" />

                                <div className="space-y-2 md:space-y-5 relative z-10 w-full max-w-2xl mx-auto">
                                    {[
                                        { title: "Auditoria de Criativos", value: "R$ 600" },
                                        { title: "Auditoria de Mídia Paga (Meta/Google)", value: "R$ 800" },
                                        { title: "Análise Competitiva regional", value: "R$ 500" },
                                        { title: "Diagnóstico de Marketing", value: "R$ 700" },
                                        { title: "Presença Local (Google Maps)", value: "R$ 400" },
                                        { title: "Diagnóstico de Landing Page", value: "R$ 500" },
                                        { title: "Análise de Redes Sociais", value: "R$ 300" },
                                        { title: "Plano de Ação (30 dias)", value: "R$ 600" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 md:py-4 border-b border-[#1A3050]/50 last:border-0">
                                            <span className="text-[#A1B3CB] text-[11px] md:text-base font-medium pr-2 leading-tight max-w-[70%]">{item.title}</span>
                                            <span className="text-white text-[13px] md:text-xl font-bold font-serif relative shrink-0">
                                                {item.value}
                                                <span className="absolute top-1/2 -inset-x-1 md:-inset-x-2 h-[1.5px] md:h-[2px] bg-[#EF4444] -rotate-3 opacity-90 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                                            </span>
                                        </div>
                                    ))}

                                    {/* Linha Divisória Forte */}
                                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#1A3050] to-transparent my-3 md:my-8" />

                                    {/* Soma Total */}
                                    <div className="flex flex-row justify-between items-center py-3 px-4 md:py-6 bg-[#0D1623] rounded-xl md:px-8 border border-[#1A3050]/30 -mx-2 md:mx-0">
                                        <span className="text-white text-lg md:text-3xl font-black">Soma Total</span>
                                        <div className="flex items-center gap-3 md:gap-6">
                                            <span className="text-white/40 text-[15px] md:text-3xl font-black font-serif relative">
                                                R$ 4.400
                                                <span className="absolute top-1/2 -inset-x-1.5 md:-inset-x-3 h-[2px] md:h-[3px] bg-[#EF4444] -rotate-6 opacity-90 shadow-[0_0_12px_rgba(239,68,68,0.8)]"></span>
                                            </span>
                                            <span className="text-[#06B7D8] text-xl md:text-4xl font-black">
                                                Hoje: R$ 0
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botão de Ação CTA */}
                                    <div className="pt-4 md:pt-10 flex flex-col items-center">
                                        <Button
                                            onClick={() => setStep(1)}
                                            size="lg"
                                            className="w-full text-[13px] md:text-lg px-2 md:px-8 py-6 md:py-8 bg-[#0066FF] hover:bg-[#06B7D8] text-white rounded-xl shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:scale-[1.02] transition-all border-0 uppercase font-black tracking-wide whitespace-normal leading-tight text-balance h-auto"
                                        >
                                            FAZER DIAGNÓSTICO GRATUITO
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* SEÇÃO 7 — URGÊNCIA E CTA FINAL */}
                    <section className="text-center space-y-6 pb-12 pt-2 md:pt-4">
                        <div className="max-w-2xl mx-auto px-4">
                            <p className="text-xs md:text-sm font-bold text-[#8B9DB5] tracking-widest uppercase mb-4">Vagas desta semana</p>

                            {/* Progress indicator setup */}
                            <div className="w-full bg-[#1A3050] h-10 md:h-12 rounded-full overflow-hidden relative border border-[#11243E] shadow-inner">
                                <motion.div
                                    initial={{ width: "0%" }} whileInView={{ width: "80%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#0066FF] to-[#06B7D8] shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-sm md:text-base font-bold text-white tracking-wide">
                                    <span className="text-white">12</span> <span className="text-white/80 mx-1">de 15 preenchidas</span>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-[#06B7D8] font-medium mt-4">Resposta garantida em até 12h para as próximas 3 vagas.</p>
                        </div>

                        <div className="flex flex-col items-center gap-3 pt-6 max-w-lg mx-auto">
                            <Button
                                onClick={() => setStep(1)}
                                size="xl"
                                className="w-full text-lg px-8 py-7 bg-gradient-to-r from-[#0066FF] to-[#06B7D8] text-white rounded-xl shadow-[0_0_40px_rgba(0,102,255,0.25)] hover:shadow-[0_0_50px_rgba(0,102,255,0.4)] hover:scale-[1.02] transition-all border-0"
                            >
                                QUERO MEU DIAGNÓSTICO GRATUITO
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <p className="text-[13px] text-[#8B9DB5]">
                                Sem cartão. Sem compromisso. Só clareza.
                            </p>
                        </div>
                    </section>

                </main>

                <DiagnosticoFooter />

                {/* Floating Bottom CTA for Mobile */}
                <AnimatePresence>
                    {(isScrolledBottom && showFloatingCTA) && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed bottom-4 left-4 right-4 z-50 bg-[#0A1628] border border-[#1A3050] shadow-2xl rounded-2xl p-4 flex items-center justify-between md:hidden"
                        >
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Diagnóstico gratuito</span>
                                <span className="text-[#06B7D8] text-[10px] uppercase font-bold tracking-wider">Vagas Quase Esgotadas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={() => setStep(1)} className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white rounded-lg px-4 font-bold text-xs h-9">
                                    FAZER AGORA →
                                </Button>
                                <button onClick={() => setShowFloatingCTA(false)} className="w-8 h-8 flex items-center justify-center text-[#8B9DB5] bg-[#11243E] rounded-full shrink-0">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        );
    }

    // Step 1-11: Questions Form (Keeping the existing style for now, or minimal update to match Dark Navy theme)
    const currentQ = questions[step - 1];

    return (
        <div className="min-h-screen bg-[#0A1628] flex flex-col md:flex-row font-sans selection:bg-[#0066FF]/30">

            {/* Left side: Content / Authority (Visible on Desktop) */}
            <div className="hidden md:flex flex-1 relative bg-[#060D1A] border-r border-[#1A3050] overflow-hidden p-12 flex-col justify-center text-left">
                <div className="absolute inset-0 grid-pattern opacity-10" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-lg space-y-8">
                    <div className="flex items-center gap-2 mb-12">
                        <img src={logoCineze} alt="Cineze" className="h-6" />
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                        Seu negócio em BH no próximo nível.
                    </h2>

                    <div className="bg-[#0D1F35]/80 backdrop-blur border border-[#1A3050] rounded-2xl p-8 relative">
                        <div className="absolute -left-3 -top-3 text-[#0066FF]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.017 21L16.439 14.4926C16.597 14.0762 16.5503 13.6063 16.3148 13.2282C16.0793 12.8501 15.6836 12.6074 15.25 12.57L19.5 8.5H15.017L12.595 15.0074C12.437 15.4238 12.4837 15.8937 12.7192 16.2718C12.9547 16.65 13.3504 16.8926 13.784 16.93L9.5 21L14.017 21Z" />
                                <path d="M6 18V6H10C12.2091 6 14 7.79086 14 10C14 12.2091 12.2091 14 10 14H8V18H6Z" />
                            </svg>
                        </div>
                        {currentQ.sideContent ? (
                            <p className="text-lg text-[#8B9DB5] leading-relaxed whitespace-pre-line relative z-10 italic">
                                {currentQ.sideContent}
                            </p>
                        ) : (
                            <p className="text-lg text-[#8B9DB5] leading-relaxed relative z-10">
                                Responda com sinceridade. Cada informação nos ajuda a cruzar seus dados com as melhores práticas de marketing da sua região.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex-1 flex flex-col p-6 md:p-12 relative justify-center w-full max-w-3xl mx-auto md:max-w-none text-left">

                {/* Progress bar */}
                {step > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0D1F35]">
                        <div
                            className="h-full bg-gradient-to-r from-[#0066FF] to-[#06B7D8] transition-all duration-500 ease-out"
                            style={{ width: `${((step - 1) / (questions.length - 1)) * 100}%` }}
                        />
                    </div>
                )}

                <button
                    onClick={handlePrev}
                    className="absolute top-8 left-6 md:left-12 text-[#8B9DB5] hover:text-white transition-colors flex items-center gap-2 bg-[#0D1F35]/60 px-4 py-2 border border-[#1A3050] rounded-full text-sm font-medium hover:bg-[#11243E]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>

                <div className="mt-20 sm:mt-0 flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">

                    <div className="mb-10 lg:pl-4">
                        {step > 1 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0066FF]/10 text-[#06B7D8] border border-[#0066FF]/20 text-xs font-semibold uppercase tracking-wider mb-6">
                                Passo {step - 1} de {questions.length - 1}
                            </div>
                        )}
                        <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                            {currentQ.title}
                        </h3>
                        {currentQ.subtitle && (
                            <p className="text-lg text-[#8B9DB5] leading-relaxed">
                                {currentQ.subtitle}
                            </p>
                        )}

                        {/* Mobile side content display */}
                        <div className="md:hidden mt-6 bg-[#0D1F35] border border-[#1A3050] p-4 rounded-xl text-left border-l-2 border-l-[#0066FF]">
                            <p className="text-sm text-[#8B9DB5] italic whitespace-pre-line">
                                {currentQ.sideContent || "Responda com sinceridade para um diagnóstico preciso."}
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 w-full lg:px-4"
                        >
                            {currentQ.type === "start" && (
                                <div className="pt-4 flex justify-center sm:justify-start">
                                    <Button
                                        onClick={handleNext}
                                        size="xl"
                                        className="w-full sm:w-auto text-lg px-10 h-16 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white rounded-xl"
                                    >
                                        {currentQ.buttonText || "COMEÇAR AGORA"}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            )}

                            {(currentQ.type === "text" || currentQ.type === "textarea") && (
                                <div className="space-y-6">
                                    {currentQ.type === "textarea" ? (
                                        <textarea
                                            autoFocus
                                            className="w-full bg-[#0D1F35] border border-[#1A3050] rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all min-h-[180px] resize-none placeholder:text-[#8B9DB5]/50"
                                            placeholder={currentQ.placeholder}
                                            value={answers[currentQ.id] || ""}
                                            onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                                        />
                                    ) : (
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full bg-[#0D1F35] border border-[#1A3050] rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all placeholder:text-[#8B9DB5]/50"
                                            placeholder={currentQ.placeholder}
                                            value={answers[currentQ.id] || ""}
                                            onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && answers[currentQ.id]) {
                                                    handleNext();
                                                }
                                            }}
                                        />
                                    )}
                                    <Button
                                        onClick={handleNext}
                                        disabled={!answers[currentQ.id] || isSubmitting}
                                        size="xl"
                                        className="w-full sm:w-auto text-base px-10 h-14 bg-[#0066FF] hover:bg-[#0066FF]/90 disabled:bg-[#1A3050] text-white rounded-xl"
                                    >
                                        {isSubmitting ? "Enviando..." : (currentQ.buttonText || "CONTINUAR")}
                                        {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                                    </Button>
                                </div>
                            )}

                            {currentQ.type === "options" && currentQ.options && (
                                <div className="grid gap-3 sm:gap-4">
                                    {currentQ.options.map((option) => (
                                        <button
                                            key={option}
                                            autoFocus={false}
                                            className="w-full text-left bg-[#0D1F35] hover:bg-[#11243E] border border-[#1A3050] hover:border-[#0066FF] rounded-2xl p-5 md:p-6 text-white transition-all duration-200 group relative overflow-hidden"
                                            onClick={() => handleOptionSelect(option)}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex items-center justify-between relative z-10">
                                                <span className="text-lg font-medium">{option}</span>
                                                <div className="w-8 h-8 rounded-full bg-[#0A1628] border border-[#1A3050] flex shrink-0 items-center justify-center group-hover:bg-[#0066FF] group-hover:border-[#0066FF] transition-colors ml-4">
                                                    <Check className="w-4 h-4 text-transparent group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer simple step form */}
                <div className="mt-auto pt-10 text-center pb-6 md:pb-0">
                    <p className="text-xs text-[#8B9DB5] uppercase tracking-widest flex justify-center items-center gap-2">
                        Informações protegidas <ShieldCheck className="w-3 h-3" />
                    </p>
                </div>
            </div>
        </div>
    );
}
