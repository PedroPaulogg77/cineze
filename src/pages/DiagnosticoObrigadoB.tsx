import { CheckCircle2, FileJson, TrendingUp, ArrowRight, Activity, PercentSquare, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiagnosticoObrigadoB() {
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
                            Não quer esperar?<br className="hidden md:block" /> Receba o <span className="text-secondary glow-cyan">diagnóstico completo</span> do seu negócio agora.
                        </h1>
                        <div className="space-y-4 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            <p>Antes de investir qualquer centavo em tráfego, você precisa saber exatamente onde está e o que priorizar.</p>
                            <p>Colocamos a inteligência da Cineze para trabalhar pelos seus dados. Em menos de 24 horas você recebe um relatório completo.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 items-start mb-20">
                        {/* Left Column: What's included */}
                        <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-8 text-foreground">O que inclui:</h2>

                                <ul className="space-y-8">
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-secondary/10 border border-secondary/20 p-2.5 rounded-xl text-secondary mt-0.5">
                                            <PercentSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Pontuação atual da presença digital</h3>
                                            <p className="text-muted-foreground text-sm">Nota de 0 a 10 baseada na maturidade da sua estrutura frente ao mercado.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-secondary/10 border border-secondary/20 p-2.5 rounded-xl text-secondary mt-0.5">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Os 3 maiores problemas</h3>
                                            <p className="text-muted-foreground text-sm">Identificados claramente com o impacto estimado em perda de vendas e caixa.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-secondary/10 border border-secondary/20 p-2.5 rounded-xl text-secondary mt-0.5">
                                            <RefreshCcw className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Comparativo de mercado</h3>
                                            <p className="text-muted-foreground text-sm">Benchmarking com o concorrente mais forte da sua região.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="bg-secondary/10 border border-secondary/20 p-2.5 rounded-xl text-secondary mt-0.5">
                                            <FileJson className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 text-foreground">Plano de ação e recomendação</h3>
                                            <p className="text-muted-foreground text-sm">Passo a passo pros próximos 30 dias revelando o que priorizar, onde investir e quanto.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Checkout / Offer */}
                        <div className="lg:col-span-2 flex flex-col h-full bg-gradient-to-b from-card to-background border border-border shadow-2xl shadow-secondary/5 rounded-3xl p-8 sticky top-8">
                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <div className="text-muted-foreground text-sm">
                                        Uma consultoria com esse nível de detalhe custa <span className="line-through">R$ 497</span> por hora de analista.
                                    </div>
                                    <div className="pt-4 pb-2 border-b border-border/50">
                                        <p className="text-sm font-medium text-foreground mb-1">Aqui você recebe tudo por:</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl text-muted-foreground">R$</span>
                                            <span className="text-6xl font-black text-secondary">67</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card/50 border border-border rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground mb-1">Garantia 7 Dias</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">Leu o relatório e achou que não valeu? 7 dias para pedir o reembolso total. Sem perguntas.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div className="space-y-3">
                                    <Button className="w-full text-base h-16 shadow-lg glow-cyan group font-bold tracking-wide bg-secondary hover:bg-secondary/90 text-secondary-foreground" asChild>
                                        <a href="#">
                                            QUERO MEU DIAGNÓSTICO POR R$ 67
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </Button>
                                    <div className="text-center text-xs text-muted-foreground">
                                        Entrega em até 24h. Garantia de 7 dias.
                                    </div>
                                </div>

                                <div className="pt-4 text-center border-t border-border/30">
                                    <p className="text-sm text-foreground mb-1">Prefere esperar a conversa com Pedro antes de decidir?</p>
                                    <p className="text-xs text-muted-foreground">Tudo bem — ele vai te contatar em até 2h.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Como funciona */}
                    <section className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-16">
                        <h2 className="text-3xl font-bold text-center mb-10">Como o diagnóstico é gerado</h2>
                        <div className="grid md:grid-cols-3 gap-8 relative text-center">
                            <div className="space-y-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl mx-auto">1</div>
                                <h3 className="font-bold text-lg text-foreground">Você preenche as respostas</h3>
                                <p className="text-muted-foreground text-sm">Você acabou de enviar os dados principais da sua estrutura.</p>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl mx-auto">2</div>
                                <h3 className="font-bold text-lg text-foreground">Nossa IA analisa e cruza</h3>
                                <p className="text-muted-foreground text-sm">O motor cruza as informações com as melhores práticas de mercado da sua região.</p>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl mx-auto">3</div>
                                <h3 className="font-bold text-lg text-foreground">Você recebe o PDF</h3>
                                <p className="text-muted-foreground text-sm">Relatório personalizado com o nome e dados exatos do seu negócio.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
