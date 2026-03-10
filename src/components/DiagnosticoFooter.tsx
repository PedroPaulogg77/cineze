import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logoCineze from "@/assets/logo-cineze.png";

export function DiagnosticoFooter() {
    return (
        <footer className="w-full border-t border-white/10 bg-background/80 backdrop-blur-sm mt-16 md:mt-24">
            {/* Top row: Logo + Retornar ao topo */}
            <div className="container mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <img src={logoCineze} alt="Cineze" width={133} height={24} loading="lazy" className="h-5 md:h-6 w-auto object-contain" />
                </Link>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors text-sm md:text-[15px] font-medium group"
                >
                    <ArrowRight className="w-4 h-4 -rotate-90 group-hover:-translate-y-0.5 transition-transform" />
                    Retornar ao topo
                </button>
            </div>

            {/* Divider */}
            <div className="container mx-auto px-6 md:px-8">
                <div className="h-px w-full bg-white/10" />
            </div>

            {/* Bottom row: Copyright + Links */}
            <div className="container mx-auto px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0 text-[13px] text-muted-foreground">
                <span>2026 © Cineze. Todos os direitos reservados.</span>
                <span className="hidden sm:inline mx-2">·</span>
                <div className="flex items-center gap-2">
                    <Link to="/privacidade" className="hover:text-white transition-colors">
                        Políticas de privacidade
                    </Link>
                    <span>·</span>
                    <Link to="/termos" className="hover:text-white transition-colors">
                        Termos de serviço
                    </Link>
                </div>
            </div>
        </footer>
    );
}
