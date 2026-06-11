import { GitBranch, Workflow, FileCode2, Shield, Terminal, Lock } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";

const techs = [
  { icon: GitBranch, label: "GitHub", desc: "Version control & collaboration" },
  { icon: Workflow, label: "GitHub Actions", desc: "CI/CD automation" },
  { icon: FileCode2, label: "YAML Workflows", desc: "Pipeline configuration" },
  { icon: Shield, label: "DevSecOps", desc: "Security-first methodology" },
  { icon: Terminal, label: "Secret Scanner", desc: "Credential detection engine" },
  { icon: Lock, label: "Secure Deploy", desc: "Protected production releases" },
];

export default function TechStack() {
  return (
    <AnimatedSection id="tech" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            // Tools & Technologies
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Built with <span className="gradient-text">Modern Tools</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techs.map((tech, i) => (
            <AnimatedItem key={tech.label} delay={i * 0.08}>
              <div className="glow-border rounded-2xl p-6 bg-card/30 text-center group cursor-default">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <tech.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{tech.label}</h3>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
}
