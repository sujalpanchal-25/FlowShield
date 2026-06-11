import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Overview from "@/components/sections/Overview";
import Workflow from "@/components/sections/Workflow";
import SecretScanner from "@/components/sections/SecretScanner";
import TechStack from "@/components/sections/TechStack";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Workflow />
        <SecretScanner />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
