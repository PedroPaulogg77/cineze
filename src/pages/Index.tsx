import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problema } from "@/components/Problema";
import { Entrega } from "@/components/Entrega";
import { Solutions } from "@/components/Solutions";
import { SocialProof } from "@/components/SocialProof";
import { Processo } from "@/components/Processo";
import { Founders } from "@/components/Founders";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Problema />
        <Entrega />
        <Solutions />
        <SocialProof />
        <Processo />
        <Founders />
        <FAQ />
        <FinalCTA />
      </main>
    </div>
  );
};

export default Index;
