import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoCineze from "@/assets/logo-cineze.png";

export default function Privacidade() {
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
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Políticas de Privacidade</h1>
                        <p className="text-[#8B9DB5]">Última atualização: 27 de fevereiro de 2026</p>
                    </div>

                    <div className="prose prose-invert max-w-none prose-p:text-[#A1B3CB] prose-headings:text-white prose-a:text-[#0066FF] hover:prose-a:text-[#06B7D8]">
                        <h2>1. Introdução</h2>
                        <p>
                            A Cineze valoriza e respeita a sua privacidade. Esta Política de Privacidade explica como
                            coletamos, usamos, compartilhamos e protegemos suas informações pessoais quando você
                            visita nosso site e utiliza nossos serviços.
                        </p>

                        <h2>2. Coleta de Dados</h2>
                        <p>
                            Podemos coletar informações que você nos fornece diretamente, como nome, e-mail, telefone
                            e dados da sua empresa ao preencher nossos formulários de diagnóstico, contato ou ao
                            assinar nossa newsletter.
                        </p>
                        <p>
                            Além disso, coletamos dados automaticamente por meio de cookies e tecnologias semelhantes
                            para monitorar o desempenho do site e melhorar a sua experiência. Esses dados podem incluir
                            seu endereço IP, tipo de navegador, páginas acessadas e tempo de permanência.
                        </p>

                        <h2>3. Uso das Informações</h2>
                        <p>
                            As informações coletadas são utilizadas para:
                        </p>
                        <ul>
                            <li>Fornecer e melhorar nossos serviços;</li>
                            <li>Realizar diagnósticos e análises personalizadas do seu negócio;</li>
                            <li>Entrar em contato via e-mail ou WhatsApp (quando autorizado) com propostas comerciais e atualizações;</li>
                            <li>Personalizar a sua experiência e exibir anúncios relevantes (tráfego pago);</li>
                            <li>Cumprir obrigações legais.</li>
                        </ul>

                        <h2>4. Compartilhamento de Dados</h2>
                        <p>
                            A Cineze não vende ou aluga suas informações pessoais para terceiros.
                            Podemos compartilhar dados com parceiros de tecnologia (como plataformas de CRM
                            e serviços de hospedagem) que nos auxiliam na prestação dos serviços, sempre sob rigorosos acordos de confidencialidade.
                        </p>

                        <h2>5. Segurança</h2>
                        <p>
                            Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra
                            acesso não autorizado, perda, alteração ou divulgação. Contudo, nenhum sistema de segurança é infalível.
                        </p>

                        <h2>6. Seus Direitos</h2>
                        <p>
                            Conforme a Lei Geral de Proteção de Dados (LGPD), você tem o direito de solicitar:
                        </p>
                        <ul>
                            <li>A confirmação da existência de tratamento dos seus dados;</li>
                            <li>O acesso, correção ou exclusão dos seus dados;</li>
                            <li>A revogação do consentimento, quando aplicável.</li>
                        </ul>

                        <h2>7. Contato</h2>
                        <p>
                            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o uso de seus dados,
                            entre em contato conosco através do e-mail de suporte ou nossos canais oficiais.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
