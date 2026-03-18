import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight, Star } from "lucide-react";
import { DiagnosticoFooter } from "@/components/DiagnosticoFooter";
import { Button } from "@/components/ui/button";
import { GridVignetteBackground } from "@/components/ui/grid-vignette-background";
import logoCineze from "@/assets/logo-cineze.png";
import mockupTelas from "@/assets/mockup-telas.png";
import { VerticalImageStack } from "@/components/VerticalImageStack";

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

export default function DiagnosticoObrigadoA() {
    const [searchParams] = useSearchParams();
    const nome = searchParams.get("nome") || "";
    const email = searchParams.get("email") || "";
    const phone = searchParams.get("phone") || "";

    const [isLoading, setIsLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [isPreloading, setIsPreloading] = useState(true);

    // Preload checkout URL as soon as the page mounts (só se tiver email)
    useEffect(() => {
        const preloadCheckout = async () => {
            if (!email) {
                setIsPreloading(false);
                return;
            }
            try {
                const response = await fetch('/api/create-checkout-quicks', {
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
            const response = await fetch('/api/create-checkout-quicks', {
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

    const ctaContent = (
        <>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
            QUERO RESULTADO EM 7 DIAS
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline shrink-0" />}
        </>
    );

    const ctaContentBottom = (
        <>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
            QUERO MEU QUICK START POR R$297
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline shrink-0" />}
        </>
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
                        <motion.h2
                            {...fadeUp(0.1)}
                            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase"
                        >
                            SEU CADASTRO FOI<br />
                            <span className="text-green-400">REALIZADO COM SUCESSO</span>
                        </motion.h2>
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
                                Não precisa esperar a ligação para começar.
                            </h2>
                        </motion.div>

                        <div className="w-full flex flex-col items-center text-center relative mt-4 md:mt-8">
                            <div className="relative z-10 w-full flex flex-col items-center text-foreground">
                                {/* Logo */}
                                <motion.div
                                    {...fadeUpView(0.05)}
                                    className="mb-6 md:mb-10 flex items-center justify-center"
                                >
                                    <img src={logoCineze} alt="Cineze" className="h-8 md:h-12 w-auto object-contain shrink-0" />
                                </motion.div>

                                <motion.h2
                                    {...fadeUpView(0.1)}
                                    className="text-[26px] md:text-[40px] font-medium text-foreground mb-8 md:mb-12 leading-snug md:leading-tight max-w-[850px] tracking-tight w-full px-2 md:px-0"
                                >
                                    Você quer já ter resultado em 7 dias —
                                    <span className="bg-secondary text-secondary-foreground font-bold px-3 py-1 ml-2 mt-2 md:mt-0 inline-block rounded-md shadow-lg">mesmo antes da nossa conversa?</span>
                                </motion.h2>

                                <div className="space-y-5 md:space-y-8 mb-10 md:mb-16 max-w-[700px] w-full px-4 md:px-0">
                                    {[
                                        "Você já investe em tráfego — ou está prestes a começar. O problema quase nunca é falta de verba.",
                                        "É que os clientes chegam num lugar que não converte. O Google Meu Negócio está abandonado. Os criativos cansaram. Ou tudo isso junto.",
                                        "O Quick Start da Cineze resolve a estrutura em 7 dias corridos — para que cada real que você investir em anúncio tenha para onde ir."
                                    ].map((text, i) => (
                                        <motion.p
                                            key={i}
                                            {...fadeUpView(i * 0.1)}
                                            className={`text-[15px] md:text-lg leading-relaxed font-normal ${i === 2 ? "text-white" : "text-muted-foreground"}`}
                                        >
                                            {text}
                                        </motion.p>
                                    ))}
                                </div>

                                {/* Mockup Image */}
                                <motion.div
                                    {...scaleInView(0)}
                                    className="w-[135%] md:w-full max-w-none md:max-w-[950px] relative z-20 -mb-6 md:-mb-14 pointer-events-none scale-110 md:scale-100"
                                >
                                    <img
                                        src={mockupTelas}
                                        alt="Plataforma Cineze Mockup"
                                        className="w-full h-auto object-contain"
                                    />
                                </motion.div>

                                {/* CTA Button */}
                                <motion.div
                                    {...fadeUpView(0.15)}
                                    className="relative z-10 w-full flex justify-center"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Button 
                                            onClick={handleCheckout} 
                                            disabled={isLoading}
                                            className="w-full md:w-auto px-10 md:px-20 h-auto min-h-[4rem] md:min-h-[5rem] py-4 text-sm sm:text-[15px] md:text-lg font-bold tracking-wide text-center whitespace-normal leading-snug shadow-[0_0_30px_rgba(6,183,216,0.3)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105"
                                        >
                                            {isPreloading && !isLoading && (
                                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-muted-foreground/60 whitespace-nowrap">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    <span>preparando link...</span>
                                                </div>
                                            )}
                                            {ctaContent}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Plataforma Section */}
                    <div className="mt-24 md:mt-40 w-full flex flex-col justify-center items-center max-w-6xl mx-auto px-4 md:px-0 mb-20 lg:mb-10">
                        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-24 lg:gap-16">

                            {/* Texto */}
                            <div className="w-full lg:w-1/2 flex flex-col space-y-6 lg:space-y-8 text-center lg:text-left order-1 lg:order-2 lg:pt-8">
                                <motion.h2
                                    {...fadeUpView(0)}
                                    className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight"
                                >
                                    ESTRUTURA PRONTA EM 7 DIAS. <span className="text-secondary glow-cyan">SEM VOCÊ PRECISAR ENTENDER DE MARKETING.</span>
                                </motion.h2>

                                <div className="space-y-6 text-foreground/90 font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {[
                                        <>A Cineze monta a <strong className="text-foreground">estrutura digital do seu negócio do zero</strong> — ou refaz o que não está funcionando.</>,
                                        <>Em 7 dias você tem uma <strong className="text-foreground">landing page focada em conversão</strong>, seu Google Meu Negócio otimizado para aparecer nas buscas locais e <strong className="text-foreground">3 criativos prontos para rodar</strong> nos seus anúncios.</>,
                                        <span className="text-foreground font-semibold">Tudo entregue. Tudo configurado. Você só precisa aprovar.</span>
                                    ].map((content, i) => (
                                        <motion.p key={i} {...fadeUpView(i * 0.1)}>
                                            {content}
                                        </motion.p>
                                    ))}
                                </div>

                                {/* Botão Desktop */}
                                <motion.div {...fadeUpView(0.3)} className="hidden lg:flex pt-4 justify-start">
                                    <Button 
                                        onClick={handleCheckout}
                                        disabled={isLoading}
                                        className="px-10 h-16 text-base font-bold tracking-wide shadow-lg glow-cyan group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105"
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
                                        COMEÇAR MEU QUICK START
                                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline shrink-0" />}
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Carrossel Vertical */}
                            <motion.div
                                {...scaleInView(0.1)}
                                className="w-full lg:w-1/2 flex flex-col items-center justify-center order-2 lg:order-1 relative min-h-[550px]"
                            >
                                <VerticalImageStack />

                                {/* Botão Mobile */}
                                <motion.div
                                    {...fadeUpView(0.2)}
                                    className="w-full flex justify-center mt-48 lg:hidden px-2 relative z-40"
                                >
                                    <Button 
                                        onClick={handleCheckout}
                                        disabled={isLoading}
                                        className="w-full h-auto min-h-[4rem] py-4 text-sm font-bold tracking-wide shadow-lg glow-cyan group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105"
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" /> : null}
                                        COMEÇAR MEU QUICK START
                                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline shrink-0" />}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Oferta / Garantia Section */}
                    <div className="w-full max-w-5xl mx-auto px-4 md:px-0 mt-16 md:mt-32 mb-10">
                        {/* Section Title */}
                        <motion.div {...fadeUpView(0)} className="text-center mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                                Fazer isso separado, com freelancers ou agências, custa <span className="text-secondary glow-cyan">entre R$2.000 e R$3.500.</span>
                            </h2>
                            <motion.p
                                {...fadeUpView(0.1)}
                                className="text-xl md:text-2xl font-bold text-foreground/80 mt-6"
                            >
                                Com a Cineze, você paga uma vez e recebe tudo em 7 dias.
                            </motion.p>
                        </motion.div>

                        {/* Glassmorphic Card */}
                        <motion.div
                            {...scaleInView(0.05)}
                            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row-reverse gap-12 md:gap-14 lg:gap-16 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative overflow-hidden"
                        >
                            {/* Ambient Glows inside the card */}
                            <div className="absolute -top-32 -left-32 p-40 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="absolute -bottom-32 -right-32 p-40 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

                            {/* Right Column (Benefits List) */}
                            <div className="relative z-10 lg:w-[45%] flex flex-col justify-center">
                                <ul className="space-y-6 md:space-y-8 lg:pl-4">
                                    {[
                                        { title: "Landing page do seu negócio", desc: "Criada do zero ou refeita totalmente, focada em conversão. Com botão de WhatsApp, prova social e CTA claro." },
                                        { title: "Google Meu Negócio otimizado", desc: "Configurado de ponta a ponta para aparecer nas buscas locais. Categoria, fotos, horário, descrição e primeiras avaliações." },
                                        { title: "3 criativos prontos para anúncios", desc: "Imagens ou roteiros de vídeo no formato certo para Meta Ads. Prontos para subir na campanha no dia da entrega." },
                                        { title: "Prazo blindado — 7 dias corridos", desc: "Kickoff no dia seguinte ao pagamento. Entrega total em exatos 7 dias úteis. Sem enrolação." }
                                    ].map((item, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="flex flex-col space-y-2 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    whileInView={{ scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2, type: "spring" }}
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                                </motion.div>
                                                <span className="text-lg md:text-xl text-foreground font-bold leading-tight">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed pl-8">
                                                {item.desc}
                                            </p>
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
                                    De <span className="line-through decoration-white/30 text-white/50">R$997</span> por apenas
                                </motion.p>

                                <motion.div
                                    {...fadeUpView(0.1)}
                                    className="flex flex-col items-center justify-center w-full mb-8 md:mb-12"
                                >
                                    <div className="flex items-end text-secondary drop-shadow-[0_0_15px_rgba(6,183,216,0.3)]">
                                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 mr-1">R$</span>
                                        <span className="text-[110px] md:text-[140px] lg:text-[160px] font-black leading-none tracking-tighter">297</span>
                                    </div>
                                    <p className="text-lg md:text-xl text-foreground font-medium mt-2">
                                        Uma vez só. Sem mensalidade. Começa amanhã.
                                    </p>
                                </motion.div>

                                {/* CTA Button — fixed (h-auto, whitespace-normal) */}
                                <motion.div
                                    {...fadeUpView(0.15)}
                                    className="w-full mb-6 md:mb-8"
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={isLoading}
                                        className="w-full h-auto min-h-[4rem] md:min-h-[5rem] py-4 px-6 text-sm sm:text-[15px] md:text-lg font-bold tracking-wide text-center whitespace-normal leading-snug shadow-[0_0_30px_rgba(6,183,216,0.25)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-[2rem] hover:scale-[1.03]"
                                    >
                                        {ctaContentBottom}
                                    </Button>
                                </motion.div>

                                <motion.p
                                    {...fadeUpView(0.2)}
                                    className="text-sm md:text-base text-muted-foreground mb-10 md:mb-12 text-center"
                                >
                                    Prefere esperar a conversa com Pedro antes de decidir?<br />
                                    <span className="text-foreground">Tudo bem — ele vai entrar em contato em até 12h.</span>
                                </motion.p>

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
                                            Se a Cineze não entregar tudo dentro de 7 dias — landing page, Google Meu Negócio e os 3 criativos — <strong className="text-yellow-500 font-bold">você recebe 100% do valor de volta.</strong>
                                        </p>
                                        <p className="text-[13px] md:text-[14px] text-muted-foreground font-medium">
                                            Sem formulário. Sem discussão. O risco é todo nosso.
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
                                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest leading-tight mt-1 opacity-90 text-yellow-500">DE ENTREGA GARANTIDA</span>
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
