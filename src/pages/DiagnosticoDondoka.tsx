import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, ArrowLeft, CheckCircle2, Building2, Tag, PartyPopper,
    Handshake, Store, MessagesSquare, ShieldAlert, Rocket, Save, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCineze from "@/assets/logo-cineze.png";

const STORAGE_KEY = "dondoka_diag_v2";

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
        id: "eventos", title: "Os primeiros eventos", icon: PartyPopper,
        intro: "Os eventos que já aconteceram são o nosso ponto de partida.",
        fields: [
            { id: "ev_quais", label: "Que festas foram os eventos que já rolaram aí?", type: "textarea", placeholder: "Ex: um batizado, uma festa de roupa... conta rapidinho como foi cada um" },
            { id: "ev_valor", label: "Quanto foi cobrado em cada um, e o que estava incluso?", type: "textarea", placeholder: "Pode ser por alto — nos ajuda a pensar o preço daqui pra frente" },
            { id: "ev_fotos", label: "Vocês têm (ou conseguem pedir) as fotos e vídeos desses eventos?", type: "text", placeholder: "Ex: o do casamento tem fotógrafo, o batizado dá pra pedir..." },
            { id: "ev_agenda", label: "Tem data fechada pros próximos meses? Quais?", type: "text", placeholder: "Ex: 29 de novembro; agosto ainda vazio" },
        ],
    },
    {
        id: "espaco", title: "O espaço", icon: Building2,
        fields: [
            { id: "espaco_capacidade", label: "Quantas pessoas o espaço comporta?", type: "text", placeholder: "Ex: 100 sentados / 130 em pé" },
            { id: "espaco_tem", label: "O que o espaço já oferece?", type: "textarea", placeholder: "Cozinha, área externa, estacionamento, ar-condicionado, som, área kids..." },
            { id: "espaco_falta", label: "O que ainda falta chegar ou montar — e pra quando?", type: "textarea", placeholder: "Ex: as cadeiras chegam no fim de julho..." },
            { id: "espaco_usos", label: "Além de festa, que outros usos o espaço aceitaria?", type: "text", placeholder: "Culto, palestra, formatura, ensaio, chá de bebê, evento de empresa..." },
        ],
    },
    {
        id: "preco", title: "Preço e pacote", icon: Tag,
        fields: [
            { id: "preco_valor", label: "Quanto vocês pretendem cobrar pela locação?", type: "text", placeholder: "Valor ou faixa que têm em mente" },
            { id: "preco_varia", label: "O preço muda por dia da semana ou tamanho da festa?", type: "text", placeholder: "Ex: sábado mais caro, sexta mais barato..." },
            { id: "preco_incluso", label: "O que entra no preço e o que seria cobrado à parte?", type: "textarea", placeholder: "Limpeza, som, mesas e cadeiras, segurança..." },
            { id: "preco_fornecedores", label: "O cliente traz os próprios fornecedores (buffet, decoração, DJ) ou vocês querem oferecer isso junto?", type: "textarea", placeholder: "Ex: a decoração a gente oferece pela parceria da Camila, o buffet o cliente traz..." },
        ],
    },
    {
        id: "parceiros", title: "Parceiros e indicações", icon: Handshake,
        intro: "Quem está em volta de vocês vale ouro pra divulgação.",
        fields: [
            { id: "parc_quem", label: "Que parceiros vocês já têm?", type: "textarea", placeholder: "Decoradora, buffet, DJ, fotógrafo, aluguel de mesas, cerimonialista..." },
            { id: "parc_indicou", label: "Quem indicou os primeiros eventos pra vocês?", type: "text", placeholder: "Amigo, parente, conhecido do bairro..." },
            { id: "parc_rede", label: "Conhecem pessoas que organizam eventos direto?", type: "textarea", placeholder: "Cerimonialista, igreja, escola, empresa, salão de beleza..." },
        ],
    },
    {
        id: "rua", title: "A rua e o movimento", icon: Store,
        intro: "A fachada de vocês chama atenção — queremos usar isso a favor.",
        fields: [
            { id: "rua_param", label: "Já aconteceu de alguém parar pra perguntar por causa da fachada?", type: "text", placeholder: "Se sim, com que frequência mais ou menos" },
            { id: "rua_placa", label: "A fachada tem placa ou letreiro com WhatsApp/Instagram? Fica iluminada à noite?", type: "text", placeholder: "O que quem passa na rua consegue ver e anotar" },
            { id: "rua_entorno", label: "O que tem perto que junta gente?", type: "text", placeholder: "Igreja, escola, avenida movimentada, comércio forte..." },
            { id: "rua_acoes", label: "Topariam ações na rua — banner, panfleto, cupom, um evento aberto pra apresentar o espaço?", type: "textarea", placeholder: "O que acham que combina com vocês" },
        ],
    },
    {
        id: "atendimento", title: "Do primeiro contato ao pós-festa", icon: MessagesSquare,
        fields: [
            { id: "at_contato", label: "Quando alguém chama, quem responde e por qual número?", type: "text", placeholder: "É número próprio da Dondoka ou o pessoal de vocês?" },
            { id: "at_visita", label: "Como funciona a visita ao espaço hoje?", type: "text", placeholder: "Quem mostra, que dia, como marca" },
            { id: "at_evento", label: "No dia do evento, quem da Dondoka acompanha? O que a casa faz?", type: "textarea", placeholder: "Recepção, limpeza, apoio durante a festa..." },
            { id: "at_pos", label: "Depois da festa: vocês pedem feedback? Os primeiros clientes deixariam um depoimento?", type: "textarea", placeholder: "Avaliação, foto, vídeo curto falando da experiência..." },
        ],
    },
    {
        id: "regras", title: "Regras da casa", icon: ShieldAlert,
        fields: [
            { id: "regras_som", label: "Tem horário máximo e regra de som/vizinhança?", type: "text", placeholder: "Ex: música até meia-noite..." },
            { id: "regras_nao", label: "Que tipo de evento vocês NÃO querem receber?", type: "text", placeholder: "Se tiver algum" },
        ],
    },
    {
        id: "visao", title: "Visão e investimento", icon: Rocket,
        intro: "Pra fechar: onde vocês querem chegar e com o que dá pra contar.",
        fields: [
            { id: "visao_evento", label: "Que tipo de evento vocês MAIS querem atrair?", type: "text", placeholder: "Casamento, 15 anos, aniversário, corporativo..." },
            { id: "visao_meta", label: "Quantos eventos por mês fariam vocês felizes até o fim do ano?", type: "text", placeholder: "Um número realista" },
            { id: "visao_verba", label: "Quanto dá pra investir por mês em anúncio?", type: "text", placeholder: "Verba que vai direto pra plataforma — pode começar pequeno", hint: "É separado do trabalho da Cineze" },
            { id: "visao_tempo", label: "Quanto tempo por semana vocês têm pra participar de gravações?", type: "text", placeholder: "Ex: uma tarde por semana, só fim de semana..." },
            { id: "visao_obs", label: "Algo mais que a gente deva saber? (opcional)", type: "textarea", placeholder: "Qualquer coisa que ache importante" },
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
                                    {f.hint && <p className="text-xs text-[#8B9DB5] -mt-1 mb-2">{f.hint}</p>}
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
