import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const unsafeCode = `// config.js
const config = {
  apiUrl: "https://api.secureflow.dev",
  AWS_SECRET_KEY: "AKIAIOSFODNN7EXAMPLE",
  DB_PASSWORD: "super_secret_p@ssw0rd!",
  STRIPE_KEY: "sk_live_51HG8e2...",
};

module.exports = config;`;

const safeCode = `// config.js
const config = {
  apiUrl: process.env.API_URL,
  awsSecretKey: process.env.AWS_SECRET_KEY,
  dbPassword: process.env.DB_PASSWORD,
  stripeKey: process.env.STRIPE_KEY,
};

module.exports = config;`;

type ScanState = "idle" | "scanning" | "fail" | "pass";

export default function SecretScanner() {
  const [activeTab, setActiveTab] = useState<"unsafe" | "safe">("unsafe");
  const [scanState, setScanState] = useState<ScanState>("idle");

  const runScan = useCallback(() => {
    setScanState("scanning");
    setTimeout(() => {
      setScanState(activeTab === "unsafe" ? "fail" : "pass");
    }, 2200);
  }, [activeTab]);

  const reset = useCallback(() => {
    setScanState("idle");
  }, []);

  const code = activeTab === "unsafe" ? unsafeCode : safeCode;

  return (
    <AnimatedSection id="demo" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            // Interactive Demo
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Secret Scanning <span className="gradient-text">Simulation</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Toggle between safe and unsafe code, then run the pipeline to see SecureFlow in action.
          </p>
        </div>

        <div className="code-editor">
          <div className="code-editor-header justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="dot dot-red" />
                <div className="dot dot-yellow" />
                <div className="dot dot-green" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">config.js</span>
            </div>
            <div className="flex gap-1 rounded-lg bg-secondary/50 p-0.5">
              <button
                onClick={() => { setActiveTab("unsafe"); reset(); }}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === "unsafe"
                    ? "bg-destructive/20 text-destructive"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Unsafe
              </button>
              <button
                onClick={() => { setActiveTab("safe"); reset(); }}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  activeTab === "safe"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Safe
              </button>
            </div>
          </div>

          {/* Code display */}
          <div className="relative p-6 overflow-x-auto">
            {scanState === "scanning" && <div className="scan-line" />}
            <pre className="font-mono text-sm leading-relaxed">
              {code.split("\n").map((line, i) => {
                const isSecret =
                  activeTab === "unsafe" &&
                  scanState === "fail" &&
                  (line.includes("SECRET") || line.includes("PASSWORD") || line.includes("STRIPE") || line.includes("sk_live"));

                return (
                  <div
                    key={i}
                    className={`flex transition-all duration-300 ${
                      isSecret ? "bg-destructive/10 -mx-6 px-6 border-l-2 border-destructive" : ""
                    }`}
                  >
                    <span className="w-8 flex-shrink-0 text-muted-foreground/40 select-none text-right mr-4">
                      {i + 1}
                    </span>
                    <span className={isSecret ? "text-destructive" : "text-foreground/80"}>
                      {line || " "}
                    </span>
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Actions */}
          <div className="border-t border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {scanState === "idle" && (
                <Button variant="hero" size="sm" onClick={runScan}>
                  <Play className="w-4 h-4 mr-1" /> Run Pipeline
                </Button>
              )}
              {scanState === "scanning" && (
                <div className="flex items-center gap-2 text-sm text-accent font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning for secrets...
                </div>
              )}
              {scanState === "fail" && (
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-mono text-destructive text-glow-red">
                    ✗ Deployment Blocked: Secrets Detected
                  </span>
                </div>
              )}
              {scanState === "pass" && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-mono text-primary text-glow">
                    ✓ Pipeline Passed — Deploying Securely
                  </span>
                </div>
              )}
            </div>
            {(scanState === "fail" || scanState === "pass") && (
              <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
