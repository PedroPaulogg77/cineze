import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, ArrowLeft, CheckCircle2, Building2, Tag, Workflow,
    Users, Swords, Camera, ShieldAlert, BarChart3, Save, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCineze from "@/assets/logo-cineze.png";

const STORAGE_KEY = "dondoka_diag_v1";

type Field = {
    id: string;
    label: string;
    type: "text" | "textarea" | "options";
    placeholder?: string;
    hint?: string;
    options?: string[];
};

type Section = { id: string; title: string; icon: any; intro?: string; fields: Field[] };

const sections: Section[] = [
    {
        id: "espaco", title: "O espaço", icon: Building2,
        fields: [
            { id: "espaco_capacidade", label: "Quantas pessoas o espaço comporta?", type: "text", placeholder: "Ex: 100 sentados / 130 em pé" },
            { id: "espaco_tem", label: "O que o espaço já oferece?", type: "textarea", placeholder: "Cozinha, área externa, estacionamento, suíte dos noivos, ar-condicionado, gerador..." },
            { id: "espaco_falta", label: "O que ainda falta montar ou melhorar?", type: "textarea", placeholder: "O que vocês ainda querem instalar, comprar ou ajustar" },
        ],
    },
    {
        id: "oferta", title: "Oferta e preço", icon: Tag,
        fields: [
            { id: "oferta_tipos", label: "Que tipos de evento vocês aceitam?", type: "text", placeholder: "Casamento, aniversário, corporativo, 15 anos..." },
            { id: "oferta_preco", label: "Qual a faixa de preço da locação?", type: "text", placeholder: "Ex: de R$ X a R$ Y por evento" },
            { id: "oferta_incluso", label: "O que está incluso e o que é cobrado à parte?", type: "textarea", placeholder: "Limpeza, segurança, som, mobiliário, buffet..." },
            { id: "oferta_fornecedor", label: "Fornecedor é livre ou lista fechada? Tem caução?", type: "textarea", placeholder: "Buffet, decoração, DJ — o cliente traz o dele ou usa o de vocês?" },
        ],
    },
    {
        id: "operacao", title: "Como fecha hoje", icon: Workflow,
        fields: [
            { id: "op_chega", label: "Por onde os clientes chegam até vocês hoje?", type: "options", options: ["Indicação de quem já conhece", "Instagram", "Google", "Passaram na frente", "Não sabemos ao certo"] },
            { id: "op_responde", label: "Quem responde as consultas, e em quanto tempo?", type: "text", placeholder: "Ex: eu respondo pelo WhatsApp, no mesmo dia" },
            { id: "op_visita", label: "De cada visita ao espaço, quantas viram evento fechado?", type: "text", placeholder: "Mais ou menos" },
            { id: "op_sazonal", label: "Quais meses enchem e quais esvaziam?", type: "text", placeholder: "Ex: enche de out a dez, esvazia jan/fev" },
            { id: "op_datas", label: "Quantas datas por mês dá pra ocupar?", type: "text", placeholder: "Capacidade de agenda" },
        ],
    },
    {
        id: "cliente", title: "O cliente", icon: Users,
        fields: [
            { id: "cli_perfil", label: "Quem é o cliente típico de vocês?", type: "textarea", placeholder: "Perfil e faixa de renda de quem costuma alugar" },
            { id: "cli_origem", label: "Os eventos que já rolaram, de onde vieram?", type: "text", placeholder: "Indicação, passaram na frente, Instagram..." },
            { id: "cli_objecao", label: "Qual a objeção que mais escutam de quem não fecha?", type: "text", placeholder: "Ex: 'tá caro', 'a data não bate'..." },
        ],
    },
    {
        id: "concorrencia", title: "Concorrência", icon: Swords, intro: "Essa parte é a mais importante pra gente posicionar vocês.",
        fields: [
            { id: "conc_quem", label: "Quem vocês veem como concorrente direto?", type: "text", placeholder: "Nomes de outros espaços da região" },
            { id: "conc_porque", label: "Por que alguém escolheria a Dondoka em vez do concorrente?", type: "textarea", placeholder: "O que vocês têm de melhor / diferente" },
            { id: "conc_preco", label: "Como vocês justificam o preço?", type: "textarea", placeholder: "O que faz valer o valor cobrado" },
        ],
    },
    {
        id: "ativos", title: "O que já têm", icon: Camera,
        fields: [
            { id: "ativos_midia", label: "Têm fotos/vídeos dos eventos que já rolaram? De que qualidade?", type: "textarea", placeholder: "Fotos de celular, de fotógrafo, nenhuma ainda..." },
            { id: "ativos_insta", label: "Quem cuida do Instagram hoje e com que frequência posta?", type: "text", placeholder: "Ex: a Camila posta de vez em quando" },
            { id: "ativos_outros", label: "Têm site? Depoimento de cliente?", type: "text", placeholder: "Site, avaliações, prints de elogio..." },
        ],
    },
    {
        id: "restricoes", title: "Restrições e sábado", icon: ShieldAlert,
        fields: [
            { id: "restr_regras", label: "Tem horário-limite, regra de barulho ou tipo de evento que NÃO aceitam?", type: "textarea", placeholder: "Regras da casa, vizinhança, etc." },
            { id: "restr_sabado", label: "O evento deste sábado é de vocês ou de um cliente? Dá pra filmar?", type: "textarea", placeholder: "Se for de cliente, precisamos do ok dele pra usar as imagens" },
        ],
    },
    {
        id: "baseline", title: "Números de hoje", icon: BarChart3, intro: "Sem esses números de partida a gente não consegue provar o resultado depois.",
        fields: [
            { id: "base_consultas", label: "Quantas consultas/orçamentos vocês recebem por mês hoje? De onde vêm?", type: "text", placeholder: "Ex: umas 5 por mês, tudo indicação" },
            { id: "base_eventos", label: "Quantos eventos vocês fecharam desde a inauguração?", type: "text", placeholder: "Total até agora" },
            { id: "base_datas", label: "Quantas datas livres vocês têm por mês?", type: "text", placeholder: "Agenda disponível" },
            { id: "base_obs", label: "Quer acrescentar mais alguma coisa? (opcional)", type: "textarea", placeholder: "Qualquer coisa que ache importante a gente saber" },
        ],
    },
];

const allFieldLabels: Record<string, { label: string; section: string }> = {};
sections.forEach((s) => s.fields.forEach((f) => { allFieldLabels[f.id] = { label: f.label, section: s.title }; }));

export default function DiagnosticoDondoka() {
    const [started, setStarted] = useState(false);
    const [respondente, setRespondente] = useState("");
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [sectionIndex, setSectionIndex] = useState(0);
    const [sent, setSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedTick, setSavedTick] = useState(false);

    // Carrega rascunho salvo (mesmo aparelho)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const d = JSON.parse(raw);
                if (d.answers) setAnswers(d.answers);
                if (d.respondente) setRespondente(d.respondente);
                if (typeof d.sectionIndex === "number") setSectionIndex(d.sectionIndex);
                if (d.started) setStarted(true);
            }
        } catch { /* ignora */ }
    }, []);

    // Autosave a cada mudança
    useEffect(() => {
        if (sent) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, respondente, sectionIndex, started }));
            setSavedTick(true);
            const t = setTimeout(() => setSavedTick(false), 1200);
            return () => clearTimeout(t);
        } catch { /* ignora */ }
    }, [answers, respondente, sectionIndex, started, sent]);

    const progress = useMemo(() => Math.round((sectionIndex / sections.length) * 100), [sectionIndex]);
    const section = sections[sectionIndex];

    const setField = (id: string, value: string) => setAnswers((p) => ({ ...p, [id]: value }));

    const goNext = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (sectionIndex < sections.length - 1) setSectionIndex((i) => i + 1);
        else void submit();
    };
    const goPrev = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (sectionIndex > 0) setSectionIndex((i) => i - 1);
        else setStarted(false);
    };

    const submit = async () => {
        setIsSubmitting(true);
        const secoes = sections.map((s) => ({
            titulo: s.title,
            itens: s.fields.map((f) => ({ pergunta: f.label, resposta: answers[f.id] || "" })),
        }));
        try {
            await fetch("/api/briefing-dondoka", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ respondente, secoes }),
                keepalive: true,
            });
        } catch (e) {
            console.error(e);
        }
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignora */ }
        setSent(true);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Tela de agradecimento ─────────────────────────────────────────────
    if (sent) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-6 text-center font-sans">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#0066FF] to-[#06B7D8] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,102,255,0.4)]">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Recebemos, obrigado! 🎉</h1>
                    <p className="text-[#8B9DB5] max-w-md mx-auto text-lg">
                        As respostas de vocês já chegaram pra gente. Agora é com a Cineze — o Pedro te chama pra dar o próximo passo.
                    </p>
                    <img src={logoCineze} alt="Cineze" className="h-6 mx-auto mt-10 opacity-70" />
                </motion.div>
            </div>
        );
    }

    // ── Tela inicial ──────────────────────────────────────────────────────
    if (!started) {
        return (
            <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-6 font-sans">
                <div className="w-full max-w-lg text-center">
                    <img src={logoCineze} alt="Cineze" className="h-6 mx-auto mb-10" />
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0066FF]/10 text-[#06B7D8] border border-[#0066FF]/20 text-xs font-semibold uppercase tracking-wider mb-6">
                        Diagnóstico · Dondoka
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                        Vamos entender a Dondoka a fundo
                    </h1>
                    <p className="text-[#8B9DB5] text-lg mb-8 leading-relaxed">
                        São algumas perguntas rápidas sobre o espaço e o negócio de vocês. Pode responder com calma —
                        <span className="text-white font-medium"> o progresso salva sozinho</span>, dá pra parar e voltar depois no mesmo aparelho.
                    </p>
                    <div className="bg-[#0D1F35] border border-[#1A3050] rounded-2xl p-5 text-left mb-8">
                        <label className="text-sm text-[#8B9DB5] block mb-2">Quem está respondendo?</label>
                        <input
                            type="text"
                            value={respondente}
                            onChange={(e) => setRespondente(e.target.value)}
                            placeholder="Ex: João, Camila, ou os dois"
                            className="w-full bg-[#0A1628] border border-[#1A3050] rounded-xl p-4 text-white focus:outline-none focus:border-[#0066FF] transition-all placeholder:text-[#8B9DB5]/50"
                        />
                    </div>
                    <Button
                        onClick={() => { setStarted(true); window.scrollTo({ top: 0 }); }}
                        disabled={!respondente.trim()}
                        size="xl"
                        className="w-full text-lg h-16 bg-gradient-to-r from-[#0066FF] to-[#06B7D8] disabled:opacity-40 text-white rounded-xl"
                    >
                        Começar <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs text-[#8B9DB5] mt-4">Leva uns 10 minutos · o progresso fica salvo</p>
                </div>
            </div>
        );
    }

    // ── Seções ────────────────────────────────────────────────────────────
    const Icon = section.icon;
    const isLast = sectionIndex === sections.length - 1;

    return (
        <div className="min-h-screen bg-[#0A1628] font-sans flex flex-col">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 bg-[#0D1F35] z-50">
                <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#06B7D8] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>

            <header className="px-5 md:px-8 py-5 flex items-center justify-between max-w-2xl mx-auto w-full">
                <img src={logoCineze} alt="Cineze" className="h-5" />
                <span className="text-xs text-[#8B9DB5] flex items-center gap-1.5">
                    {savedTick ? <><Save className="w-3.5 h-3.5 text-[#06B7D8]" /> salvo</> : `Etapa ${sectionIndex + 1} de ${sections.length}`}
                </span>
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto px-5 md:px-8 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.28 }}
                    >
                        <div className="flex items-center gap-3 mt-4 mb-1">
                            <div className="w-11 h-11 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#06B7D8] shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-[#06B7D8] font-semibold uppercase tracking-wider">Seção {sectionIndex + 1}</div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{section.title}</h2>
                            </div>
                        </div>
                        {section.intro && (
                            <p className="text-[#8B9DB5] text-sm mb-6 mt-3 bg-[#0D1F35] border border-[#1A3050] border-l-2 border-l-[#0066FF] rounded-lg p-3">
                                {section.intro}
                            </p>
                        )}

                        <div className="space-y-6 mt-6">
                            {section.fields.map((f) => (
                                <div key={f.id}>
                                    <label className="block text-white font-medium mb-2 leading-snug">{f.label}</label>
                                    {f.type === "textarea" && (
                                        <textarea
                                            value={answers[f.id] || ""}
                                            onChange={(e) => setField(f.id, e.target.value)}
                                            placeholder={f.placeholder}
                                            className="w-full bg-[#0D1F35] border border-[#1A3050] rounded-xl p-4 text-white focus:outline-none focus:border-[#0066FF] transition-all min-h-[110px] resize-none placeholder:text-[#8B9DB5]/50"
                                        />
                                    )}
                                    {f.type === "text" && (
                                        <input
                                            type="text"
                                            value={answers[f.id] || ""}
                                            onChange={(e) => setField(f.id, e.target.value)}
                                            placeholder={f.placeholder}
                                            className="w-full bg-[#0D1F35] border border-[#1A3050] rounded-xl p-4 text-white focus:outline-none focus:border-[#0066FF] transition-all placeholder:text-[#8B9DB5]/50"
                                        />
                                    )}
                                    {f.type === "options" && f.options && (
                                        <div className="grid gap-2.5">
                                            {f.options.map((opt) => {
                                                const active = answers[f.id] === opt;
                                                return (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => setField(f.id, opt)}
                                                        className={`w-full text-left rounded-xl p-4 border transition-all ${active
                                                            ? "bg-[#0066FF]/15 border-[#0066FF] text-white"
                                                            : "bg-[#0D1F35] border-[#1A3050] text-[#C7D3E0] hover:border-[#0066FF]/50"}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Navegação fixa */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0A1628]/95 backdrop-blur border-t border-[#1A3050] px-5 md:px-8 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <button
                        onClick={goPrev}
                        className="flex items-center gap-2 text-[#8B9DB5] hover:text-white transition-colors px-4 py-3 rounded-xl border border-[#1A3050] bg-[#0D1F35] text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <Button
                        onClick={goNext}
                        disabled={isSubmitting}
                        size="lg"
                        className="flex-1 h-14 text-base bg-gradient-to-r from-[#0066FF] to-[#06B7D8] text-white rounded-xl font-bold"
                    >
                        {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando...</>)
                            : isLast ? (<>Enviar respostas <CheckCircle2 className="ml-2 w-5 h-5" /></>)
                                : (<>Continuar <ArrowRight className="ml-2 w-5 h-5" /></>)}
                    </Button>
                </div>
            </div>
        </div>
    );
}
