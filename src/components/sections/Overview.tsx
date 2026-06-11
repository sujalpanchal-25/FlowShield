import { Shield, Zap, AlertTriangle } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";

const cards = [
  {
    icon: Shield,
    title: "What is SecureFlow?",
    description:
      "A CI/CD pipeline framework that bakes security scanning directly into every deployment, catching secrets and vulnerabilities before they ever reach production.",
  },
  {
    icon: Zap,
    title: "Why DevSecOps?",
    description:
      "Traditional security is an afterthought. DevSecOps shifts security left, making it an automated part of every commit, build, and deploy cycle.",
  },
  {
    icon: AlertTriangle,
    title: "The Cost of Leaked Secrets",
    description:
      "A single exposed API key can cost millions. Hardcoded credentials in public repos are the #1 cause of cloud infrastructure breaches.",
  },
];

export default function Overview() {
  return (
    <AnimatedSection id="overview" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-primary/70 tracking-widest uppercase mb-3">
            // Overview
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Security at the <span className="gradient-text">Speed of DevOps</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <AnimatedItem key={card.title} delay={i * 0.15}>
              <div className="glow-border rounded-2xl p-8 bg-card/50 h-full group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {card.description}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
