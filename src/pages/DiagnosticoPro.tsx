import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Zap, Target, ShieldCheck, Check, CheckCircle2 } from "lucide-react";
import { DiagnosticoFooter } from "@/components/DiagnosticoFooter";
import { Button } from "@/components/ui/button";
import { GridVignetteBackground } from "@/components/ui/grid-vignette-background";
import YouTubeFacade from "@/components/YouTubeFacade";
import logoCineze from "@/assets/logo-cineze.png";
import cardsImage from "@/assets/CARDS.png";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

// --- MOCKUPS OTIMIZADOS ---
import mockup1Desktop from "@/assets/mockups/mockup-1-desktop.webp";
import mockup1Mobile from "@/assets/mockups/mockup-1-mobile.webp";
import mockup2 from "@/assets/mockups/mockup-2.webp";
import mockup3 from "@/assets/mockups/mockup-3.webp";
import mockup4 from "@/assets/mockups/mockup-4.webp";
import mockup5 from "@/assets/mockups/mockup-5.webp";

// --- ANIMATIONS ---
const fadeUpView = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut", delay },
});

const scaleInView = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "backOut", delay },
});



export default function DiagnosticoPro() {
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

    // Pré-carregamento do checkout para cold traffic
    useEffect(() => {
        const preloadCheckout = async () => {
            try {
                const response = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: "", email: "", phone: "" }),
                });
                const data = await response.json();
                if (data.url) setCheckoutUrl(data.url);
            } catch {
                // silencioso
            }
        };
        preloadCheckout();
    }, []);

    const handleCheckout = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Pixel de InitiateCheckout
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "InitiateCheckout");
        }

        if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: "", email: "", phone: "" }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erro ao gerar checkout');
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Link não retornado");
            }
        } catch (error: any) {
            toast.error(error.message || "Erro inesperado. Tente novamente.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const CtaButton = ({ text = "QUERO MEU DIAGNÓSTICO", className = "", isWide = false }) => (
        <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className={`${isWide ? "w-full" : "px-8 md:px-12"} h-14 md:h-16 text-[15px] md:text-lg font-bold tracking-wide text-center whitespace-nowrap shadow-[0_0_40px_rgba(6,183,216,0.25)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105 hover:shadow-[0_0_50px_rgba(6,183,216,0.4)] ${className}`}
        >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
            {text}
            {!isLoading && <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform inline shrink-0" />}
        </Button>
    );

    const checkListItems = [
        "Diagnóstico completo de vendas e conversão",
        "Diagnóstico completo de marketing e captação",
        "Diagnóstico completo de presença digital",
        "Análise de indicadores financeiros do negócio",
        "Análise competitiva regional em BH",
        "Auditoria de comunicação e posicionamento",
        "Metas alinhadas com seu momento atual",
        "Plano de ação focado para 30 dias",
        "Estratégias de curto e médio prazo"
    ];

    return (
        <div className="min-h-screen bg-[#050D18] text-white selection:bg-cyan-500/30 font-sans font-medium overflow-x-hidden flex flex-col">
            
            {/* 1. HERO SECTION */}
            <section className="relative w-full overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <GridVignetteBackground size={40} intensity={25} horizontalVignetteSize={200} verticalVignetteSize={200} />
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
                </div>
                
                <div className="relative z-10 w-full">
                    <ContainerScroll
                        titleComponent={
                            <>
                                <motion.img 
                                    {...fadeUpView(0)}
                                    src={logoCineze} 
                                    alt="Cineze" 
                                    className="h-7 md:h-9 w-auto object-contain mb-10 opacity-90" 
                                />

                                <motion.div 
                                    {...fadeUpView(0.1)}
                                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm mx-auto"
                                >
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    <span className="text-[13px] font-bold tracking-widest uppercase text-cyan-100">Inteligência de Dados</span>
                                </motion.div>
                                
                                <h1 
                                    className="text-[28px] sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-150"
                                >
                                    O motor de inteligência por trás do <br className="hidden lg:block"/>
                                    <span className="text-secondary drop-shadow-[0_0_30px_rgba(6,183,216,0.4)]">crescimento do seu negócio</span>
                                </h1>

                                <motion.p 
                                    {...fadeUpView(0.3)}
                                    className="text-[15px] sm:text-[17px] md:text-xl text-[#A1B3CD] font-normal leading-relaxed max-w-3xl mb-8 md:mb-12"
                                >
                                    Em 40 minutos, nossa IA escaneia os 10 pilares da sua empresa e te entrega um plano de ação claro — descobrir o que trava seu faturamento nunca foi tão exato.
                                </motion.p>

                                <motion.div {...fadeUpView(0.4)} className="flex flex-col items-center w-full max-w-md mx-auto mb-16 md:mb-0 px-6 lg:px-0">
                                    <CtaButton text="INICIAR DIAGNÓSTICO AGORA" className="w-full text-[14px] md:text-lg" />
                                    <span className="text-[13px] text-muted-foreground mt-4 flex items-center gap-2 font-medium">
                                        <ShieldCheck className="w-4 h-4 text-cyan-500" /> Acesso imediato · Garantia de 7 dias
                                    </span>
                                </motion.div>
                            </>
                        }
                    >
                        {/* [MOCKUP 1] HERO DASHBOARD */}
                        <div className="w-full h-full relative group perspective-1000 overflow-hidden bg-[#07111F]">
                             <img 
                                src={mockup1Mobile} 
                                alt="Dashboard Mobile" 
                                fetchPriority="high"
                                decoding="async"
                                className="md:hidden block w-full h-full absolute inset-0 object-cover object-[center_top] scale-[1.02]" 
                             />
                             <img 
                                src={mockup1Desktop} 
                                alt="Dashboard Desktop" 
                                fetchPriority="high"
                                decoding="async"
                                className="hidden md:block w-full h-full absolute inset-0 object-cover object-left-top scale-[1.02]" 
                             />
                        </div>
                    </ContainerScroll>
                </div>
            </section>

            {/* 2. LOGOS SOCIAL PROOF (Optional structure setup) */}
            <section className="w-full border-b border-white/5 bg-white/[0.01] py-8 md:py-10 px-6 sm:px-8 flex flex-col items-center overflow-hidden relative">
                <p className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold text-[#8B9DB5] mb-6 md:mb-8 text-center max-w-[280px] md:max-w-full">
                    Confiança estabelecida no mercado de Belo Horizonte
                </p>
                <div className="w-full max-w-5xl flex flex-wrap gap-6 md:gap-20 items-center justify-center opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-700">
                    {/* Placeholders for logos */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="text-lg md:text-xl font-black italic select-none">Logo {i}</div>
                    ))}
                </div>
            </section>

            {/* 3. BENTO GRID: DORES (O PROBLEMA) */}
            <section className="w-full max-w-6xl mx-auto py-16 md:py-32 px-6 md:px-8">
                <motion.div {...fadeUpView(0)} className="text-center md:text-left mb-12 md:mb-16">
                    <h2 className="text-[28px] md:text-5xl font-black tracking-tight leading-tight mb-4">
                        O esforço está lá. <span className="text-secondary block md:inline">O resultado, não.</span>
                    </h2>
                    <p className="text-[15px] sm:text-[17px] text-[#A1B3CD] max-w-2xl font-normal mx-auto md:mx-0">
                        Você investe, muda o criativo, contrata pessoas, tenta metodologias. Mas o ponteiro do faturamento recusa-se a subir consistentemente. Por quê?
                    </p>
                </motion.div>

                {/* BENTO GRID CSS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 auto-rows-fr">
                    
                    {/* Item 1 - Span 2 Columns */}
                    <motion.div 
                        {...fadeUpView(0.1)}
                        className="col-span-1 md:col-span-2 flex flex-col bg-gradient-to-br from-[#0A1628] to-[#07111F] rounded-3xl border border-white/5 p-6 md:p-10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="relative z-10 mb-6 md:mb-12">
                            <span className="bg-red-500/10 text-red-500 flex items-center w-fit px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 uppercase tracking-wider backdrop-blur-md border border-red-500/20">
                                <Zap className="w-3 h-3 mr-2" /> O Ralo do Tráfego
                            </span>
                            <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-white">Você paga por cliques, não por vendas.</h3>
                            <p className="text-[16px] text-[#A1B3CD] max-w-md font-normal leading-relaxed">
                                A campanha traz lead, mas a operação não converte. Gastar mais em anúncios sem estrutura é jogar dinheiro no lixo.
                            </p>
                        </div>
                        {/* [MOCKUP 2] Desperdício de Tráfego */}
                        <div className="mt-8 w-full rounded-xl lg:rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:border-white/20 transition-colors">
                            <img 
                                src={mockup2} 
                                alt="Funil de Perda de Leads" 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto object-cover object-top hover:scale-[1.03] transition-transform duration-700 ease-out" 
                            />
                        </div>
                    </motion.div>

                    {/* Item 2 - Span 1 Column, taller */}
                    <motion.div 
                        {...fadeUpView(0.2)}
                        className="col-span-1 flex flex-col bg-gradient-to-br from-[#0A1628] to-[#07111F] rounded-3xl border border-white/5 p-6 md:p-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="relative z-10 mb-6 md:mb-8">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">Decisões no Escuro.</h3>
                            <p className="text-[14px] md:text-[15px] text-[#A1B3CD] font-normal leading-relaxed">
                                O achismo custa caro. Mudar estratégia baseada em sentimentos em vez de dados destrói a sua esteira.
                            </p>
                        </div>
                        {/* [MOCKUP 3] Decisões no Escuro */}
                        <div className="mt-6 md:mt-8 flex justify-center items-center h-full w-full">
                            <img 
                                src={mockup3} 
                                alt="Elemento 3D Clean" 
                                loading="lazy"
                                decoding="async"
                                className="w-[85%] sm:w-3/4 md:w-full h-auto object-contain hover:rotate-1 hover:scale-[1.05] drop-shadow-2xl transition-all duration-700" 
                            />
                        </div>
                    </motion.div>

                    {/* Item 3 - Span 3 Columns as a banner across the bottom */}
                    <motion.div 
                        {...fadeUpView(0.3)}
                        className="col-span-1 md:col-span-3 flex flex-col md:flex-row items-center bg-secondary/5 rounded-3xl border border-secondary/20 p-6 md:p-12 shadow-[0_0_40px_rgba(6,183,216,0.05)] relative overflow-hidden gap-6 md:gap-8"
                    >
                        <div className="w-full md:w-3/5 text-center md:text-left">
                            <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-white">
                                O problema nunca está onde você foca.
                            </h3>
                            <p className="text-[16px] md:text-lg text-[#A1B3CD] font-normal leading-relaxed">
                                Cada negócio tem um gargalo específico que trava a escala. O concorrente que domina o mercado não é o melhor — ele apenas descobriu qual é a sua principal falha competitiva e a corrigiu.
                            </p>
                        </div>
                        <div className="w-full md:w-2/5 flex justify-center md:justify-end">
                             <CtaButton text="DESCOBRIR MEU GARGALO" className="w-full text-[14px]" />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* 4. MECANISMO (COMO FUNCIONA / FEATURES) */}
            <section className="w-full border-y border-white/5 bg-[#081320] py-16 md:py-32 px-6 md:px-8 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-64 bg-cyan-900/10 rounded-full blur-[160px] pointer-events-none" />
                
                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div {...fadeUpView(0)} className="text-center mb-12 md:mb-24">
                        <span className="text-secondary font-bold text-[10px] md:text-xs tracking-widest uppercase mb-3 block">Inteligência Estratégica, não achismos</span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4 md:mb-6">
                            Como a Plataforma Funciona
                        </h2>
                        <p className="text-[15px] md:text-[18px] text-[#A1B3CD] max-w-2xl mx-auto font-normal">
                            Esqueça planilhas com dados não acionáveis. Nossa inteligência converte números em decisões executáveis.
                        </p>
                    </motion.div>

                    {/* Feature 1 (Text left on desktop, Text top on mobile due to natural DOM order) */}
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 mb-16 lg:mb-32">
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 md:mb-6">
                                <Target className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl md:text-[32px] font-bold text-white mb-3 md:mb-4 leading-snug">Cruzamento Automático com o Benchmark</h3>
                            <p className="text-[15px] md:text-lg text-[#A1B3CD] leading-relaxed font-normal mb-6 md:mb-8">
                                Avaliamos os 10 pilares da sua empresa e comparamos o seu negócio imediatamente contra os concorrentes que têm o mesmo porte em Belo Horizonte.
                            </p>
                        </div>
                        <motion.div {...scaleInView(0.1)} className="w-full lg:w-1/2 w-[90%] md:w-full">
                             {/* [MOCKUP 4] Radar Chart */}
                             <img 
                                src={mockup4} 
                                alt="Radar de Benchmarking" 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:shadow-[0_20px_80px_rgba(6,183,216,0.25)] hover:border-white/30 transition-all duration-500 bg-[#07111F]" 
                            />
                        </motion.div>
                    </div>

                    {/* Feature 2 (Text right on desktop, Text top on mobile using flex orders) */}
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
                        <motion.div {...scaleInView(0.1)} className="w-full lg:w-1/2 order-2 lg:order-1 w-[90%] md:w-full">
                             {/* [MOCKUP 5] Plano de Ação */}
                             <img 
                                src={mockup5} 
                                alt="Plano de Ação Inteligente" 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:shadow-[0_20px_80px_rgba(6,183,216,0.25)] hover:border-white/30 transition-all duration-500 bg-[#07111F]" 
                            />
                        </motion.div>
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2 mb-6 lg:mb-0">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 md:mb-6">
                                <Check className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl md:text-[32px] font-bold text-white mb-3 md:mb-4 leading-snug">Plano de Ação Altamente Focado</h3>
                            <p className="text-[15px] md:text-lg text-[#A1B3CD] leading-relaxed font-normal">
                                Sem PDFs genéricos. Nossa inteligência enfileira as resoluções por prioridade exata de execução para faturar mais rápido.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. VÍDEO SECTION SAAS STYLE */}
            <section className="w-full max-w-6xl mx-auto py-24 md:py-32 px-6 sm:px-8 flex flex-col items-center">
                <motion.div {...fadeUpView(0)} className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Experiência da Plataforma</h2>
                    <p className="text-lg text-[#A1B3CD] font-normal">Veja como nosso motor cruza dados em tempo real.</p>
                </motion.div>

                <motion.div
                    {...scaleInView(0.1)}
                    className="w-full max-w-[900px] rounded-[2rem] p-3 md:p-5 bg-white/5 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl mb-12 relative"
                >
                    {/* Mockup Top Bar of a browser/software */}
                    <div className="w-full h-8 flex items-center gap-2 mb-4 px-2 opacity-60">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-black aspect-video relative isolate border border-white/5">
                        <YouTubeFacade videoId="KqCjnt6Zvsk" title="Vídeo Demonstração Cineze" className="absolute inset-0 w-full h-full" />
                    </div>
                </motion.div>
                
                <CtaButton text="EXECUTAR MEU DIAGNÓSTICO" />
            </section>

            {/* 6. ENTREGÁVEIS (O QUE VOCÊ RECEBE) */}
            <section className="w-full bg-[#081320] py-16 md:py-24 px-6 md:px-8 border-y border-white/5 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUpView(0)} className="text-center md:text-left mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-4xl lg:text-[40px] font-black uppercase tracking-tight text-white mb-2 md:mb-6">
                            Deliverables após os 40 minutos
                        </h2>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                        <div className="w-full lg:w-1/2 order-1 lg:order-1 border border-white/10 bg-[#0B182B] rounded-3xl p-6 md:p-8 shadow-xl">
                            <ul className="space-y-4 md:space-y-5">
                                {checkListItems.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="bg-secondary/10 p-1.5 rounded-full shrink-0 flex items-center justify-center border border-secondary/20">
                                            <Check className="w-4 h-4 text-cyan-400 stroke-[3px]" />
                                        </div>
                                        <span className="text-[16px] text-white/90 font-medium leading-tight pt-1">
                                            {item}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Imagem CARDS.png existente sendo preservada mas alocada visualmente diferente */}
                        <motion.div
                            {...scaleInView(0.1)}
                            className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center relative"
                        >
                            <div className="absolute inset-0 bg-cyan-900/20 blur-[100px] rounded-full z-0" />
                            <img
                                src={cardsImage}
                                alt="UI Cards da Plataforma"
                                width={500}
                                height={600}
                                loading="lazy"
                                className="w-full h-auto drop-shadow-2xl object-contain scale-[1.05] relative z-10"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 7. OFERTA SAAS PLAN CARD */}
            <section className="w-full py-16 md:py-32 px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center">
                <motion.div {...fadeUpView(0)} className="text-center mb-10 md:mb-12 border-white/5 pt-2">
                     <h2 className="text-[28px] md:text-5xl font-black tracking-tight leading-tight text-white">
                        O investimento num plano de ação claro.
                     </h2>
                </motion.div>

                {/* SaaS Pricing Card */}
                <motion.div
                    {...scaleInView(0.1)}
                    className="w-full max-w-[480px] bg-gradient-to-b from-[#132840] to-[#0A1628] border border-cyan-500/20 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent left-0" />
                    
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-5 py-2 rounded-full text-[11px] md:text-[13px] font-bold uppercase tracking-widest mb-6 md:mb-8">
                        Licença de Análise Única
                    </span>

                    <p className="text-[#8B9DB5] line-through mb-2 opacity-60 font-medium">R$ 497,00</p>
                    <div className="flex items-start justify-center mb-10 drop-shadow-[0_0_15px_rgba(6,183,216,0.3)]">
                        <span className="text-3xl font-bold mt-2 mr-1 text-white">R$</span>
                        <span className="text-7xl font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">67</span>
                    </div>

                    <ul className="w-full border-t border-white/5 pt-8 mb-10 space-y-4 text-left">
                        {[
                            "Acesso imediato ao Hub de Diagnóstico",
                            "Análise cruza 10 pilares da sua empresa",
                            "Receba o plano de execução para 30 dias",
                            "Válido por 1 utilização corporativa"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                                <span className="text-[15px] font-medium text-white/80">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <CtaButton text="ATIVAR AGORA" isWide className="h-16 text-lg" />
                    <p className="text-xs text-muted-foreground mt-6 font-medium">Pagamento 100% Seguro. Criptografia SSL.</p>
                </motion.div>
            </section>

            {/* 8. GARANTIA SAAS & CTA FINAL */}
            <section className="w-full py-12 md:py-24 px-6 md:px-8 bg-[#050B14] border-t border-white/5">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    
                    {/* Minimalist Tech Guarantee */}
                    <motion.div {...fadeUpView(0)} className="bg-[#0A1628] border border-white/10 rounded-[2rem] p-6 md:p-8 w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-16 md:mb-24 shadow-xl">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Garantia Técnica de 7 Dias</h3>
                            <p className="text-[15px] text-[#8B9DB5] font-normal leading-relaxed max-w-xl">
                                Gere o mapa de inteligência do seu negócio. Se os dados processados não tornarem a clareza da sua esteira óbvia com as recomendações, com um clique, devolvemos R$67. Sem integrações, sem burocracia.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUpView(0.1)} className="w-full flex flex-col items-center px-2">
                        <h2 className="text-3xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.05] text-white mb-8">
                            Clareza gera <span className="text-secondary drop-shadow-[0_0_15px_rgba(6,183,216,0.3)]">Progresso.</span>
                        </h2>
                        <p className="text-[16px] md:text-[20px] text-[#A1B3CD] font-normal mb-14 max-w-2xl px-2 md:px-0">
                            40 minutos da nossa IA mapeando sua empresa hoje, vão poupar meses de investimento e tempo cegos em canais errados amanhã.
                        </p>
                        <CtaButton text="INICIAR DIAGNÓSTICO" className="w-full md:w-auto px-14 h-[4.5rem] bg-white text-black hover:bg-white/90 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all" />
                    </motion.div>
                </div>
            </section>

            <DiagnosticoFooter />
        </div>
    );
}
