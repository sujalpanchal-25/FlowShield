import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold">
            Secure<span className="text-primary">Flow</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          A Secure CI/CD Pipeline with Integrated Secret Scanning
        </p>
        <p className="text-xs text-muted-foreground/60">
          Built with DevSecOps principles
        </p>
      </div>
    </footer>
  );
}
