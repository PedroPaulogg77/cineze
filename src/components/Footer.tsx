import { ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import logoCineze from "@/assets/logo-cineze.png";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A1628] border-t border-[#1A3050] py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img src={logoCineze} alt="Cineze" className="h-6 md:h-8" />
            <div className="hidden md:block w-px h-8 bg-[#1A3050] mx-2"></div>
            <p className="text-white font-bold leading-tight text-center md:text-left">
              Nosso negócio <br className="hidden md:block" />
              <span className="italic font-normal">é crescer o seu</span>
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ChevronUp className="w-5 h-5 text-red-600" strokeWidth={3} />
            Retornar ao topo
          </button>
        </div>

        <div className="border-t border-[#1A3050] pt-8 flex justify-center">
          <p className="text-[13px] md:text-sm text-[#8B9DB5] text-center w-full">
            2026 © Cineze. Todos os direitos reservados.{" "}
            <Link to="/privacidade" className="hover:text-white transition-colors hover:underline">
              Políticas de privacidade
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}