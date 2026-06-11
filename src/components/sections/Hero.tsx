import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import PipelineScene from "@/components/three/PipelineScene";
import { Shield, ArrowDown } from "lucide-react";

const pipelineStages = ["Commit", "Build", "Test", "Secret Scan", "Deploy"];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 1.1,
      });
      gsap.from(".hero-cta", {
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 1.4,
      });
      gsap.from(".hero-pipeline", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 1.8,
      });
      gsap.from(".hero-badge", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      <PipelineScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">DevSecOps Pipeline Security</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="hero-word inline-block">Automate&nbsp;</span>
          <span className="hero-word inline-block gradient-text">Fast.</span>
          <br />
          <span className="hero-word inline-block">Deploy&nbsp;</span>
          <span className="hero-word inline-block gradient-text">Secure.</span>
          <br />
          <span className="hero-word inline-block">Never Leak&nbsp;</span>
          <span className="hero-word inline-block gradient-text-red">Secrets.</span>
        </h1>

        <p className="hero-sub text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-2">
          SecureFlow integrates security directly into CI/CD pipelines using GitHub Actions.
          Catch secrets before they reach production.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
          <Button variant="hero" size="lg" className="hero-cta text-base px-8 py-6">
            Get Started
          </Button>
          <Button variant="hero-outline" size="lg" className="hero-cta text-base px-8 py-6">
            View Documentation
          </Button>
        </div>

        {/* Pipeline stages */}
        <div className="hero-pipeline mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-2 px-2">
          {pipelineStages.map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-border bg-card/50 text-xs sm:text-sm font-mono text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default">
                {stage}
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="hidden md:block w-8 h-px bg-gradient-to-r from-primary/40 to-primary/10 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <ArrowDown className="w-5 h-5 text-muted-foreground" />
      </div>
    </section>
  );
}
