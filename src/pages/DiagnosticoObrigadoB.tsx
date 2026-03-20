import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";
import { DiagnosticoFooter } from "@/components/DiagnosticoFooter";
import { Button } from "@/components/ui/button";
import { GridVignetteBackground } from "@/components/ui/grid-vignette-background";
import YouTubeFacade from "@/components/YouTubeFacade";
import logoCineze from "@/assets/logo-cineze.png";
import cardsImage from "@/assets/CARDS.png";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
});

const fadeDown = (delay = 0) => ({
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut", delay },
});

const fadeUpView = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: "easeOut", delay },
});

const scaleInView = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.92 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut", delay },
});

export default function DiagnosticoObrigadoB() {
    const leadData = JSON.parse(sessionStorage.getItem('cineze_lead') || '{}');
    const nome = leadData.nome || "";
    const email = leadData.email || "";
    const phone = leadData.phone || "";

    const [isLoading, setIsLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [isPreloading, setIsPreloading] = useState(true);

    // ── Meta Pixel: dispara evento de Lead na thank-you page ──────────
    useEffect(() => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Lead");
        }
    }, []);

    // Preload checkout URL as soon as the page mounts (só se tiver email)
    useEffect(() => {
        const preloadCheckout = async () => {
            if (!email) {
                setIsPreloading(false);
                return;
            }
            try {
                const response = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, phone }),
                });
                const data = await response.json();
                if (data.url) setCheckoutUrl(data.url);
            } catch {
                // silently fail — fallback handles it on click
            } finally {
                setIsPreloading(false);
            }
        };
        preloadCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckout = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Instant redirect if preload succeeded
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
        }

        // Fallback: call API normally if preload failed
        try {
            setIsLoading(true);
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, phone }),
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

    const ctaButton = (extraClass = "", isWide = true) => (
        <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className={`${isWide ? "w-full" : ""} h-auto min-h-[4rem] py-4 px-6 text-sm sm:text-[15px] md:text-lg font-bold tracking-normal text-center whitespace-normal leading-snug shadow-[0_0_30px_rgba(6,183,216,0.3)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105 ${extraClass}`}
        >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
            COMEÇAR DIAGNÓSTICO AGORA
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline shrink-0" />}
        </Button>
    );

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Top Banner */}
            <motion.div
                {...fadeDown(0)}
                className="bg-green-500/10 border-b border-green-500/20 text-center py-3 px-4 text-sm font-semibold text-green-400 relative z-10"
            >
                Seu cadastro foi concluído. Em até 12 horas um consultor falará com você!
            </motion.div>

            <main className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
                <GridVignetteBackground
                    size={40}
                    horizontalVignetteSize={100}
                    verticalVignetteSize={100}
                    intensity={15}
                    className="z-[-1]"
                />

                <div className="max-w-5xl w-full relative z-10">

                    {/* Success Message */}
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
                            SEU CADASTRO FOI<br />
                            <span className="text-green-400">REALIZADO COM SUCESSO</span>
                        </h2>
                        <motion.p
                            {...fadeUp(0.25)}
                            className="text-lg md:text-xl text-muted-foreground font-medium"
                        >
                            Um de nossos especialistas entrará em contato em até 12h.
                        </motion.p>
                    </div>

                    {/* Progress Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-20 relative px-0 md:px-4">

                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-[#1A3050] -z-10" />

                        {/* Step 1 */}
                        <motion.div
                            {...fadeUpView(0)}
                            className="flex flex-col items-center text-center relative group"
                        >
                            <div className="hidden lg:block absolute top-[28px] left-[50%] w-full h-[2px] bg-gradient-to-r from-[#22C55E] to-[#1A3050] -z-10" />
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#22C55E] flex items-center justify-center bg-[#0A1628] z-10 mb-5 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                                <span className="text-[#22C55E] text-xl font-bold tracking-tight">01</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Solicitação para<br />diagnóstico gratuita
                            </h3>
                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                Ao preencher o formulário, <strong className="text-white">nosso consultor entrará em contato</strong> com você em até 12h, por <span className="text-[#06B7D8] font-medium">ligação ou via whatsapp.</span>
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            {...fadeUpView(0.1)}
                            className="flex flex-col items-center text-center relative group"
                        >
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#8B9DB5] flex items-center justify-center bg-[#0A1628] z-10 mb-5 transition-colors group-hover:border-[#06B7D8]">
                                <span className="text-[#8B9DB5] group-hover:text-white transition-colors text-xl font-bold tracking-tight">02</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Um consultor<br />analisa seus dados
                            </h3>
                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                Nosso consultor é treinado para entender o <span className="text-[#06B7D8] font-medium">atual momento do seu negócio.</span>
                            </p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            {...fadeUpView(0.2)}
                            className="flex flex-col items-center text-center relative group"
                        >
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#8B9DB5] flex items-center justify-center bg-[#0A1628] z-10 mb-5 transition-colors group-hover:border-[#06B7D8]">
                                <span className="text-[#8B9DB5] group-hover:text-white transition-colors text-xl font-bold tracking-tight">03</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Análise gratuita<br />do seu negócio
                            </h3>
                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                Receba um diagnóstico humanizado com <span className="text-[#06B7D8] font-medium">direcionamentos sobre marketing e vendas.</span>
                            </p>
                        </motion.div>

                        {/* Step 4 */}
                        <motion.div
                            {...fadeUpView(0.3)}
                            className="flex flex-col items-center text-center relative group"
                        >
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#8B9DB5] flex items-center justify-center bg-[#0A1628] z-10 mb-5 transition-colors group-hover:border-[#06B7D8]">
                                <span className="text-[#8B9DB5] group-hover:text-white transition-colors text-xl font-bold tracking-tight">04</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Aceleração do<br />seu crescimento
                            </h3>
                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                É hora de planejar e executar as melhores estratégias para <span className="text-[#06B7D8] font-medium">impulsionar o crescimento da sua empresa.</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Enquanto isso... Section */}
                    <div className="w-full max-w-4xl mx-auto mb-2 mb-20 px-4 md:px-0 mt-8">
                        <motion.div {...fadeUpView(0)} className="text-center mb-6">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground mb-4 leading-tight">
                                Enquanto isso...
                            </h2>
                        </motion.div>

                        <div className="w-full flex flex-col items-center text-center relative mt-4 md:mt-8">
                            <div className="relative z-10 w-full flex flex-col items-center text-foreground">
                                {/* Logo */}
                                <motion.div
                                    {...fadeUpView(0.05)}
                                    className="mb-6 md:mb-10 flex items-center justify-center"
                                >
                                    <img src={logoCineze} alt="Cineze" width={393} height={56} className="h-8 md:h-12 w-auto object-contain shrink-0" decoding="async" />
                                </motion.div>

                                <motion.h2
                                    {...fadeUpView(0.1)}
                                    className="text-[26px] md:text-[40px] font-medium text-foreground mb-8 md:mb-12 leading-snug md:leading-tight max-w-[850px] tracking-tight w-full px-2 md:px-0"
                                >
                                    Quer ter um plano de ação para vender mais na internet
                                    <span className="bg-secondary text-secondary-foreground font-bold px-3 py-1 ml-2 mt-2 md:mt-0 inline-block rounded-md shadow-lg">ainda hoje?</span>
                                </motion.h2>

                                <div className="space-y-5 md:space-y-8 mb-10 md:mb-16 max-w-[700px] w-full px-4 md:px-0">
                                    {[
                                        "Antes de investir qualquer centavo em tráfego, você precisa saber exatamente onde está e o que priorizar.",
                                        "Conheça a inteligência da Cineze, a plataforma de crescimento da sua empresa.",
                                        "A IA da Cineze te mostra exatamente o que fazer para aumentar a sua lucratividade com base em uma inteligência de dados de diversas empresas de diferentes nichos."
                                    ].map((text, i) => (
                                        <motion.p
                                            key={i}
                                            {...fadeUpView(i * 0.1)}
                                            className="text-[15px] md:text-lg text-muted-foreground leading-relaxed font-normal"
                                        >
                                            {text}
                                        </motion.p>
                                    ))}
                                </div>

                                {/* Video Container */}
                                <motion.div
                                    {...scaleInView(0)}
                                    className="w-full max-w-[800px] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-8 md:mb-10"
                                >
                                    <YouTubeFacade
                                        videoId="KqCjnt6Zvsk"
                                        title="Vídeo Cineze"
                                        className="rounded-3xl"
                                    />
                                </motion.div>

                                {/* CTA Button */}
                                <motion.div
                                    {...fadeUpView(0.15)}
                                    className="w-full md:w-auto"
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {/* Micro-spinner hint while preloading */}
                                    <div className="relative">
                                        {isPreloading && (
                                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-muted-foreground/60">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                <span>preparando link...</span>
                                            </div>
                                        )}
                                        {ctaButton("md:px-20")}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Plataforma Section */}
                    <div className="mt-16 md:mt-32 w-full flex flex-col justify-center items-center max-w-6xl mx-auto px-4 md:px-0 mb-10">
                        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">

                            {/* Texto */}
                            <div className="w-full lg:w-1/2 flex flex-col space-y-6 lg:space-y-8 text-center lg:text-left order-1 lg:order-2 lg:pt-8">
                                <motion.h2
                                    {...fadeUpView(0)}
                                    className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight"
                                >
                                    UMA PLATAFORMA QUE REVELA COM IA <span className="text-secondary glow-cyan">O CAMINHO MAIS RÁPIDO PARA SUA EMPRESA CRESCER</span>
                                </motion.h2>

                                <div className="space-y-6 text-foreground/90 font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {[
                                        <>A Cineze usa <strong className="text-foreground">inteligência artificial e análise de dados</strong> para avaliar o <strong className="text-foreground">potencial de crescimento da sua empresa</strong> frente aos melhores do seu mercado.</>,
                                        <>Receba um <strong className="text-foreground">plano de ação claro para lucrar mais</strong>, com estratégias de curto, médio e longo prazo prontas para execução em cada um dos seus pilares de crescimento.</>
                                    ].map((content, i) => (
                                        <motion.p key={i} {...fadeUpView(i * 0.1)}>
                                            {content}
                                        </motion.p>
                                    ))}
                                </div>

                                {/* Botão Desktop */}
                                <motion.div {...fadeUpView(0.25)} className="hidden lg:flex pt-4 justify-start">
                                    {ctaButton("px-10", false)}
                                </motion.div>
                            </div>

                            {/* Imagem */}
                            <motion.div
                                {...scaleInView(0.1)}
                                className="w-full lg:w-1/2 flex flex-col items-center justify-center order-2 lg:order-1 relative"
                            >
                                <img
                                    src={cardsImage}
                                    alt="Dashboards da Plataforma Cineze"
                                    width={320}
                                    height={416}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-auto max-w-[95%] lg:max-w-[120%] lg:-ml-[10%] drop-shadow-2xl object-contain object-center scale-100 lg:scale-105 origin-center"
                                />

                                {/* Botão Mobile */}
                                <motion.div
                                    {...fadeUpView(0.2)}
                                    className="w-full flex justify-center mt-10 lg:hidden px-2"
                                >
                                    {ctaButton()}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Oferta / Garantia Section */}
                    <div className="w-full max-w-5xl mx-auto px-4 md:px-0 mt-16 md:mt-32 mb-10">
                        {/* Section Title */}
                        <motion.div {...fadeUpView(0)} className="text-center mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                                Invista no que <span className="text-secondary glow-cyan">vai fazer sua empresa crescer</span> nos próximos meses
                            </h2>
                        </motion.div>

                        {/* Glassmorphic Card */}
                        <motion.div
                            {...scaleInView(0.05)}
                            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row-reverse gap-12 md:gap-14 lg:gap-16 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative overflow-hidden"
                        >
                            {/* Ambient Glows */}
                            <div className="absolute -top-32 -left-32 p-40 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="absolute -bottom-32 -right-32 p-40 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

                            {/* Right Column (Benefits List) */}
                            <div className="relative z-10 lg:w-[45%] flex flex-col justify-center">
                                <ul className="space-y-4 md:space-y-6 lg:pl-4">
                                    {[
                                        "Diagnóstico completo de vendas",
                                        "Diagnóstico completo de marketing",
                                        "Diagnóstico completo de tecnologia",
                                        "Diagnóstico completo de indicadores",
                                        "Análise de mercado",
                                        "Auditoria de comunicação",
                                        "Objetivos claros",
                                        "Plano de ação",
                                        "Métricas"
                                    ].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -25 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.07 }}
                                            className="flex items-center gap-3 group"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: index * 0.07 + 0.15, type: "spring" }}
                                            >
                                                <ArrowRight className="w-5 h-5 text-secondary shrink-0 group-hover:translate-x-1 transition-transform" />
                                            </motion.div>
                                            <span className="text-[17px] md:text-lg text-foreground/90 font-normal leading-relaxed">
                                                {item}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Left Column (Pricing & Guarantee) */}
                            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center mt-8 lg:mt-0 w-full">
                                <motion.p
                                    {...fadeUpView(0)}
                                    className="text-xl md:text-[22px] text-muted-foreground font-light mb-2 w-full text-center"
                                >
                                    De <span className="line-through decoration-white/30 text-white/50">R$ 497,00</span> por
                                </motion.p>

                                <motion.div
                                    {...fadeUpView(0.1)}
                                    className="flex items-end justify-center w-full mb-8 md:mb-12"
                                >
                                    <div className="flex items-end text-secondary drop-shadow-[0_0_15px_rgba(6,183,216,0.3)]">
                                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 mr-1">R$</span>
                                        <span className="text-[110px] md:text-[140px] lg:text-[160px] font-black leading-none tracking-tighter">67</span>
                                        <span className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 ml-1">,00</span>
                                    </div>
                                </motion.div>

                                {/* CTA Button — fixed (h-auto, whitespace-normal) */}
                                <motion.div
                                    {...fadeUpView(0.15)}
                                    className="w-full mb-10 md:mb-12"
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={isLoading}
                                        className="w-full h-auto min-h-[4rem] md:min-h-[5rem] py-4 px-6 text-sm sm:text-[15px] md:text-lg font-bold tracking-normal text-center whitespace-normal leading-snug shadow-[0_0_30px_rgba(6,183,216,0.25)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-[2rem] hover:scale-[1.03]"
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
                                        COMEÇAR DIAGNÓSTICO AGORA
                                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline shrink-0" />}
                                    </Button>
                                </motion.div>

                                {/* Guarantee Box */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-8 relative overflow-hidden w-full"
                                >
                                    <div className="flex-1 space-y-4 text-center sm:text-left relative z-10 w-full">
                                        <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                                            Se após receber seu plano de ação personalizado você sentir que o diagnóstico não trouxe valor, <strong className="text-yellow-500 font-bold">devolvemos 100% do seu investimento.</strong>
                                        </p>
                                        <p className="text-[13px] md:text-[14px] text-muted-foreground font-medium">
                                            Sem perguntas. Sem burocracia. Sem risco.
                                        </p>
                                    </div>

                                    {/* Gold Guarantee Seal */}
                                    <motion.div
                                        initial={{ opacity: 0, rotate: -15, scale: 0.7 }}
                                        whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                                        className="shrink-0 relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center z-10"
                                    >
                                        <div className="absolute inset-0 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]" style={{ background: "conic-gradient(from 0deg, #fef08a, #eab308, #a16207, #eab308, #fef08a)", padding: "4px" }}>
                                            <div className="w-full h-full bg-[#1A1A1A] rounded-full flex flex-col items-center justify-center border-[3px] border-dashed border-yellow-500/50 p-2 text-center text-yellow-500 shadow-inner relative">
                                                <div className="flex items-center gap-[2px] mb-1">
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
                                                </div>
                                                <span className="text-2xl md:text-[26px] font-black leading-none drop-shadow-md text-yellow-400">7 DIAS</span>
                                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest leading-tight mt-1 opacity-90 text-yellow-500">DE GARANTIA</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>

                        </motion.div>

                    </div>

                </div>
            </main>
            <DiagnosticoFooter />
        </div>
    );
}
