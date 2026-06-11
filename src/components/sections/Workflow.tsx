import { GitCommit, Package, TestTube, ScanSearch, Rocket, CheckCircle2, XCircle } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";

const steps = [
  {
    icon: GitCommit,
    label: "Push Code",
    detail: "Developer pushes code to GitHub repository, triggering the CI/CD pipeline automatically.",
    status: "pass" as const,
  },
  {
    icon: Package,
    label: "Checkout & Build",
    detail: "GitHub Actions checks out the repo and builds the project using defined configurations.",
    status: "pass" as const,
  },
  {
    icon: TestTube,
    label: "Run Tests",
    detail: "Automated unit, integration, and end-to-end tests validate code correctness.",
    status: "pass" as const,
  },
  {
    icon: ScanSearch,
    label: "Secret Scanning",
    detail: "SecureFlow scans every file for hardcoded API keys, tokens, passwords, and credentials.",
    status: "scan" as const,
  },
  {
    icon: Rocket,
    label: "Deploy or Block",
    detail: "Clean code deploys to production. If secrets are found, deployment is blocked immediately.",
    status: "result" as const,
  },
];

export default function Workflow() {
  return (
    <AnimatedSection id="workflow" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            // CI/CD Workflow
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Pipeline <span className="gradient-text">Step by Step</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <AnimatedItem key={step.label} delay={i * 0.12}>
                <div className="relative flex gap-6 md:gap-8">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border transition-all ${
                        step.status === "scan"
                          ? "border-accent/50 bg-accent/10"
                          : step.status === "result"
                          ? "border-primary/50 bg-primary/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <step.icon
                        className={`w-5 h-5 md:w-6 md:h-6 ${
                          step.status === "scan"
                            ? "text-accent"
                            : step.status === "result"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pipeline-step flex-1 mt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        0{i + 1}
                      </span>
                      <h3 className="text-lg font-semibold">{step.label}</h3>
                      {step.status === "pass" && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                      {step.status === "result" && (
                        <div className="flex gap-1">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">/</span>
                          <XCircle className="w-4 h-4 text-destructive" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
