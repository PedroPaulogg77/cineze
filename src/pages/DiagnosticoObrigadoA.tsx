import { CheckCircle2, Layout, Search, PenTool, ArrowRight, Cog, LayoutTemplate, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DiagnosticoObrigadoA() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Top Banner */}
            <div className="bg-green-500/10 border-b border-green-500/20 text-center py-3 px-4 text-sm font-semibold text-green-400">
                Seu cadastro foi concluído. Em até 12 horas um consultor falará com você!
            </div>

            <main className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
                <div className="max-w-5xl w-full">

                    {/* Success Message */}
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
                            SEU CADASTRO FOI<br />
                            <span className="text-green-400">REALIZADO COM SUCESSO</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium">
                            Um de nossos especialistas entrará em contato em até 12h.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-20 relative px-0 md:px-4">

                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-[#1A3050] -z-10" />

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center relative group">
                            {/* Line override for step 1 to step 2 (green gradient) */}
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
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center relative group">
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#8B9DB5] flex items-center justify-center bg-[#0A1628] z-10 mb-5 transition-colors group-hover:border-[#06B7D8]">
                                <span className="text-[#8B9DB5] group-hover:text-white transition-colors text-xl font-bold tracking-tight">02</span>
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Um consultor<br />analisa seus dados
                            </h3>

                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                Nosso consultor é treinado para entender o <span className="text-[#06B7D8] font-medium">atual momento do seu negócio.</span>
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center relative group">
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#8B9DB5] flex items-center justify-center bg-[#0A1628] z-10 mb-5 transition-colors group-hover:border-[#06B7D8]">
                                <span className="text-[#8B9DB5] group-hover:text-white transition-colors text-xl font-bold tracking-tight">03</span>
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Análise gratuita<br />do seu negócio
                            </h3>

                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                Receba um diagnóstico humanizado com <span className="text-[#06B7D8] font-medium">direcionamentos sobre marketing e vendas.</span>
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center relative group">
                            <div className="w-14 h-14 rounded-full border-[3px] border-[#8B9DB5] flex items-center justify-center bg-[#0A1628] z-10 mb-5 transition-colors group-hover:border-[#06B7D8]">
                                <span className="text-[#8B9DB5] group-hover:text-white transition-colors text-xl font-bold tracking-tight">04</span>
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                                Aceleração do<br />seu crescimento
                            </h3>

                            <p className="text-[13px] md:text-sm text-[#8B9DB5] leading-relaxed max-w-[260px]">
                                É hora de planejar e executar as melhores estratégias para <span className="text-[#06B7D8] font-medium">impulsionar o crescimento da sua empresa.</span>
                            </p>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-16 space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Enquanto isso — você quer já ter resultado em <span className="gradient-text">7 dias</span>?
                        </h1>
                        <div className="space-y-4 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            <p>Você já investe em tráfego. Isso significa que você não precisa aprender do zero.</p>
                            <p>O problema provavelmente está em algum ponto da estrutura: <strong className="text-foreground">a landing page que não converte, o Google Meu Negócio abandonado, os criativos que cansaram, ou tudo isso junto.</strong></p>
                            <p className="text-foreground font-medium text-xl pt-2">O Quick Start da Cineze resolve isso em 7 dias.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 items-start">
                        {/* Left Column: What's included */}
                        <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-8">O que inclui:</h2>

                                <ul className="space-y-8">
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-primary mt-0.5">
                                            <LayoutTemplate className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Landing page do seu negócio</h3>
                                            <p className="text-muted-foreground text-sm">Criada do zero ou refeita totalmente focada em conversão.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-primary mt-0.5">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Google Meu Negócio otimizado</h3>
                                            <p className="text-muted-foreground text-sm">Configurado de ponta a ponta para buscas locais.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-primary mt-0.5">
                                            <PenTool className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">3 criativos prontos</h3>
                                            <p className="text-muted-foreground text-sm">Imagens ou roteiros prontos para rodar nos seus anúncios.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-primary mt-0.5">
                                            <Cog className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Prazo blindado</h3>
                                            <p className="text-muted-foreground text-sm">Entregue em exatos 7 dias corridos a partir do kickoff.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Checkout / Offer */}
                        <div className="lg:col-span-2 flex flex-col h-full bg-gradient-to-b from-card to-background border border-border shadow-2xl shadow-primary/5 rounded-3xl p-8 sticky top-8">
                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <div className="text-muted-foreground text-sm">
                                        Fazer isso separado, com freelancers ou agências, custa entre <span className="line-through">R$ 2.000</span> e <span className="line-through">R$ 3.500</span>.
                                    </div>
                                    <div className="pt-4 pb-2 border-b border-border/50">
                                        <p className="text-sm font-medium text-foreground mb-1">Com a Cineze, você paga:</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl text-muted-foreground">R$</span>
                                            <span className="text-6xl font-black text-foreground">297</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">Uma vez só. Sem mensalidade.</p>
                                    </div>
                                </div>

                                <div className="bg-card/50 border border-border rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground mb-1">Garantia Absoluta</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">Se não entregar tudo em 7 dias: 100% do seu dinheiro de volta. Sem discussão.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div className="space-y-3">
                                    <Button className="w-full text-base h-16 shadow-lg glow-blue group font-bold tracking-wide" asChild>
                                        <a href="#">
                                            QUERO MEU QUICK START POR R$ 297
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </Button>
                                    <div className="text-center text-xs text-muted-foreground">
                                        Pagamento único. Sem mensalidade. Começa amanhã.
                                    </div>
                                </div>

                                <div className="pt-4 text-center border-t border-border/30">
                                    <p className="text-sm text-foreground mb-1">Prefere esperar a conversa com Pedro antes de decidir?</p>
                                    <p className="text-xs text-muted-foreground">Tudo bem — ele vai te contatar em até 2h.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
