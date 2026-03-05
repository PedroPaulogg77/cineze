import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoCineze from "@/assets/logo-cineze.png";

export default function Termos() {
    return (
        <div className="min-h-screen bg-[#0A1628] text-white flex flex-col font-sans">
            {/* Simple Header */}
            <header className="border-b border-[#1A3050] bg-[#0A1628]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img src={logoCineze} alt="Cineze" className="h-6" />
                    </Link>
                    <Link to="/" className="text-sm text-[#8B9DB5] hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Termos de Serviço</h1>
                        <p className="text-[#8B9DB5]">Última atualização: 05 de março de 2026</p>
                    </div>

                    <div className="prose prose-invert max-w-none prose-p:text-[#A1B3CB] prose-headings:text-white prose-a:text-[#0066FF] hover:prose-a:text-[#06B7D8]">
                        <h2>1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar ou utilizar os serviços da Cineze, você concorda em cumprir e estar vinculado a estes
                            Termos de Serviço. Se você não concordar com qualquer parte destes termos, solicitamos que
                            não utilize nossos serviços.
                        </p>

                        <h2>2. Descrição dos Serviços</h2>
                        <p>
                            A Cineze oferece serviços de diagnóstico empresarial, consultoria de marketing digital,
                            análise de dados e planejamento estratégico para crescimento de negócios. Nossos serviços
                            incluem, mas não se limitam a:
                        </p>
                        <ul>
                            <li>Diagnóstico completo de vendas, marketing, tecnologia e indicadores;</li>
                            <li>Análise de mercado e auditoria de comunicação;</li>
                            <li>Planos de ação e métricas personalizadas;</li>
                            <li>Acesso à plataforma de inteligência artificial da Cineze.</li>
                        </ul>

                        <h2>3. Cadastro e Informações do Usuário</h2>
                        <p>
                            Para utilizar determinados serviços, pode ser necessário fornecer informações pessoais e empresariais
                            precisas e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais de acesso
                            e por todas as atividades realizadas sob sua conta.
                        </p>

                        <h2>4. Pagamentos e Reembolsos</h2>
                        <p>
                            Os preços e condições de pagamento estão disponíveis nas páginas de oferta de cada serviço.
                            Oferecemos garantia de 7 dias para o diagnóstico: se após receber seu plano de ação
                            personalizado você sentir que o diagnóstico não trouxe valor, devolvemos 100% do seu
                            investimento, sem perguntas e sem burocracia.
                        </p>

                        <h2>5. Propriedade Intelectual</h2>
                        <p>
                            Todo o conteúdo presente no site e na plataforma da Cineze, incluindo textos, gráficos,
                            logotipos, ícones, imagens, análises e software, é de propriedade exclusiva da Cineze ou de
                            seus licenciadores e está protegido por leis de propriedade intelectual.
                        </p>

                        <h2>6. Limitação de Responsabilidade</h2>
                        <p>
                            A Cineze se esforça para fornecer informações e análises precisas, porém não garante resultados
                            específicos. Os diagnósticos e planos de ação são recomendações baseadas em dados, e os
                            resultados podem variar conforme a execução e o contexto de cada negócio.
                        </p>

                        <h2>7. Modificações dos Termos</h2>
                        <p>
                            A Cineze se reserva o direito de modificar estes Termos de Serviço a qualquer momento.
                            Alterações significativas serão comunicadas por meio do site ou por e-mail. O uso continuado
                            dos serviços após as alterações constitui aceitação dos novos termos.
                        </p>

                        <h2>8. Contato</h2>
                        <p>
                            Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco
                            através do e-mail de suporte ou nossos canais oficiais.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
