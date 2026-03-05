import re
import os

filepath = r"e:\cineze-site-feito-main\src\pages\DiagnosticoObrigadoB.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports_to_add = """import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";"""

content = content.replace('import { CheckCircle2', imports_to_add + '\nimport { CheckCircle2')


# Add state and handleCheckout to the component
hook_to_add = """    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        const params = {
            nome: searchParams.get("nome") || "",
            email: searchParams.get("email") || "",
            phone: searchParams.get("phone") || ""
        };

        try {
            setIsLoading(true);
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
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
    };"""

content = content.replace('export default function DiagnosticoObrigadoB() {', 'export default function DiagnosticoObrigadoB() {\n' + hook_to_add)

# Replace buttons logic (Button 1: COMEÇAR AGORA)
btn1_original = """<Button className="w-full md:w-auto px-10 md:px-20 h-16 text-base font-bold tracking-wide shadow-[0_0_30px_rgba(6,183,216,0.3)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105" asChild>
                                    <a href="#">
                                        COMEÇAR AGORA
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" />
                                    </a>
                                </Button>"""

btn1_new = """<Button 
                                    onClick={handleCheckout} 
                                    disabled={isLoading}
                                    className="w-full md:w-auto px-10 md:px-20 h-16 text-base font-bold tracking-wide shadow-[0_0_30px_rgba(6,183,216,0.3)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105"
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                    COMEÇAR AGORA
                                    {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" />}
                                </Button>"""
content = content.replace(btn1_original, btn1_new)

# Button 2: COMEÇAR DIAGNÓSTICO AGORA (Desktop)
btn2_original = """<Button className="px-10 h-16 text-base font-bold tracking-wide shadow-lg glow-cyan group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105" asChild>
                                        <a href="#">
                                            COMEÇAR DIAGNÓSTICO AGORA
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" />
                                        </a>
                                    </Button>"""

btn2_new = """<Button 
                                        onClick={handleCheckout} 
                                        disabled={isLoading}
                                        className="px-10 h-16 text-base font-bold tracking-wide shadow-lg glow-cyan group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105"
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                        COMEÇAR DIAGNÓSTICO AGORA
                                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" />}
                                    </Button>"""
content = content.replace(btn2_original, btn2_new)


# Button 3: COMEÇAR DIAGNÓSTICO AGORA (Mobile)
btn3_original = """<Button className="w-full h-16 text-sm font-bold tracking-wide shadow-lg glow-cyan group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105" asChild>
                                        <a href="#">
                                            COMEÇAR DIAGNÓSTICO AGORA
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" />
                                        </a>
                                    </Button>"""

btn3_new = """<Button 
                                        onClick={handleCheckout} 
                                        disabled={isLoading}
                                        className="w-full h-16 text-sm font-bold tracking-wide shadow-lg glow-cyan group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-full hover:scale-105"
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                        COMEÇAR DIAGNÓSTICO AGORA
                                        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" />}
                                    </Button>"""
content = content.replace(btn3_original, btn3_new)

# Button 4: COMEÇAR DIAGNÓSTICO AGORA (Bottom)
btn4_original = """<Button className="w-full h-16 md:h-20 text-[15px] md:text-lg font-bold tracking-wide shadow-[0_0_30px_rgba(6,183,216,0.25)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-[2rem] hover:scale-[1.03] mb-10 md:mb-12" asChild>
                                    <a href="#">
                                        COMEÇAR DIAGNÓSTICO AGORA
                                    </a>
                                </Button>"""
btn4_new = """<Button 
                                    onClick={handleCheckout} 
                                    disabled={isLoading}
                                    className="w-full h-16 md:h-20 text-[15px] md:text-lg font-bold tracking-wide shadow-[0_0_30px_rgba(6,183,216,0.25)] group bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all rounded-[2rem] hover:scale-[1.03] mb-10 md:mb-12"
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                    COMEÇAR DIAGNÓSTICO AGORA
                                </Button>"""

content = content.replace(btn4_original, btn4_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("File updated successfully.")
