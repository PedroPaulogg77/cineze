import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ObjectionBreaker } from "@/components/ObjectionBreaker";
import { Founders } from "@/components/Founders";
import { Solutions } from "@/components/Solutions";
import { CaseDestaque } from "@/components/CaseDestaque";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ObjectionBreaker />
        <Founders />
        <Solutions />
        <CaseDestaque />
        <SocialProof />
        <FAQ />
        <FinalCTA />
      </main>
    </div>
  );
};

export default Index;
