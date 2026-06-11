import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Check, Copy, GitBranch, Settings, FileCode2, Rocket, AlertTriangle, Terminal, Globe, Key, ChevronRight } from "lucide-react";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
    <div className="relative my-4 rounded-lg border border-border bg-black/80 overflow-hidden">
      {filename && (
        <div className="px-4 py-2 border-b border-border bg-secondary/30 text-xs font-mono text-muted-foreground">
          {filename}
        </div>
      )}
      <div className="relative">
        <CopyButton text={code} />
        <pre className="p-4 pr-12 font-mono text-sm text-foreground/80 overflow-x-auto leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border text-primary">{title}</h2>
      {children}
    </section>
  );
}

function StageBadge({ type }: { type: 'Security' | 'Build' | 'Deploy' }) {
  const colors = {
    Security: "bg-red-500/20 text-red-400 border-red-500/30",
    Build: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Deploy: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[type]}`}>
      {type}
    </span>
  );
}

function SetupStep({ number, icon: Icon, title, children }: { number: number; icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="relative flex gap-5 pb-10 last:pb-0">
      {/* vertical line */}
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center z-10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="w-px flex-1 bg-border mt-2 last:hidden" />
      </div>
      <div className="flex-1 pt-1 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-primary/60">STEP {String(number).padStart(2, '0')}</span>
          <ChevronRight className="w-3 h-3 text-border" />
          <h3 className="font-bold text-foreground">{title}</h3>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'warning' | 'info' | 'tip'; children: React.ReactNode }) {
  const styles = {
    warning: { cls: "border-yellow-500/30 bg-yellow-500/5 text-yellow-300", icon: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />, label: "Warning" },
    info:    { cls: "border-blue-500/30 bg-blue-500/5 text-blue-300",   icon: <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />,         label: "Note" },
    tip:     { cls: "border-green-500/30 bg-green-500/5 text-green-300", icon: <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />,         label: "Tip" },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${s.cls} text-sm`}>
      {s.icon}
      <div><strong className="block mb-1">{s.label}</strong>{children}</div>
    </div>
  );
}

const fullYaml = `name: SecureFlow DevSecOps Pipeline

on:
  push:
    branches: [main]

permissions:
  contents: read

jobs:

# -------------------------------
# 1. Secret Scan (Universal)
# -------------------------------
  secret_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Run GitLeaks Secret Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

# -------------------------------
# 2. Dependency Vulnerability Scan (Universal + Python + Node.js)
# -------------------------------
  dependency_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      # A. Universal Dependency Scan (Runs for all technologies)
      - name: Run Trivy Dependency Scan (Universal)
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'fs'
          scan-ref: '.'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'

      # B. Python-specific Dependency Scan (Runs if requirements.txt exists)
      - name: Check if requirements.txt exists
        id: check_reqs
        run: |
          if [ -f requirements.txt ]; then
            echo "exists=true" >> \$GITHUB_OUTPUT
          else
            echo "exists=false" >> \$GITHUB_OUTPUT
          fi

      - name: Setup Python for pip-audit
        if: steps.check_reqs.outputs.exists == 'true'
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: 'pip'

      - name: Run pip-audit Scan (Python)
        if: steps.check_reqs.outputs.exists == 'true'
        run: |
          pip install pip-audit
          pip-audit -r requirements.txt

      # C. Node.js-specific Dependency Scan (Runs if package.json exists)
      - name: Check if package.json exists
        id: check_node
        run: |
          if [ -f package.json ]; then
            echo "exists=true" >> \$GITHUB_OUTPUT
          else
            echo "exists=false" >> \$GITHUB_OUTPUT
          fi

      - name: Setup Node.js for npm audit
        if: steps.check_node.outputs.exists == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'

      - name: Run npm audit (Node.js)
        if: steps.check_node.outputs.exists == 'true'
        run: npm audit --audit-level=high

# -------------------------------
# 3. Static Code Security Scan (Universal + Python)
# -------------------------------
  static_security_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      # A. Universal SAST Scan (Runs for all technologies)
      - name: Run Semgrep SAST Scan (Universal)
        uses: semgrep/semgrep-action@v1
        with:
          config: auto
          generateSarif: '0'

      # B. Python-specific SAST Scan (Runs if any Python file is present)
      - name: Check for Python files
        id: check_py
        run: |
          if find . -name "*.py" -print -quit | grep -q .; then
            echo "exists=true" >> \$GITHUB_OUTPUT
          else
            echo "exists=false" >> \$GITHUB_OUTPUT
          fi

      - name: Setup Python for Bandit
        if: steps.check_py.outputs.exists == 'true'
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: 'pip'

      - name: Run Bandit Scan (Python)
        if: steps.check_py.outputs.exists == 'true'
        run: |
          pip install bandit
          bandit -r .

# -------------------------------
# 4. Security Report Generation
# -------------------------------
  security_report:
    if: always()
    needs: [secret_scan, dependency_scan, static_security_scan]
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Generate Security Dashboard
        run: |
          # Create a secure isolated directory for the report
          mkdir -p report_dist

          SECRET="\${{ needs.secret_scan.result }}"
          DEP="\${{ needs.dependency_scan.result }}"
          STATIC="\${{ needs.static_security_scan.result }}"

          SCORE=0

          if [ "\$SECRET" = "success" ]; then
            SCORE=\$((SCORE+30))
          fi

          if [ "\$DEP" = "success" ]; then
            SCORE=\$((SCORE+40))
          fi

          if [ "\$STATIC" = "success" ]; then
            SCORE=\$((SCORE+30))
          fi

          if [ \$SCORE -ge 80 ]; then
            STATUS="SECURE"
            COLOR="green"
          else
            STATUS="VULNERABLE"
            COLOR="red"
          fi

          # Generate index.html so Pages serves it by default
          echo "<html>" > report_dist/index.html
          echo "<head><title>SecureFlow Security Dashboard</title></head>" >> report_dist/index.html
          echo "<body style='font-family:Arial;background:#f5f5f5;padding:30px'>" >> report_dist/index.html
          echo "<h1>🔐 SecureFlow DevSecOps Security Dashboard</h1>" >> report_dist/index.html
          echo "<p><b>Commit:</b> \${GITHUB_SHA::7}</p>" >> report_dist/index.html
          echo "<p><b>Generated:</b> \$(date)</p>" >> report_dist/index.html
          echo "<h2>Pipeline Results</h2>" >> report_dist/index.html
          echo "<table border='1' cellpadding='10' style='border-collapse:collapse;background:white'>" >> report_dist/index.html
          echo "<tr><th>Security Scan</th><th>Status</th></tr>" >> report_dist/index.html
          echo "<tr><td>Secret Scan</td><td>\$SECRET</td></tr>" >> report_dist/index.html
          echo "<tr><td>Dependency Scan (Trivy + Language-Specific)</td><td>\$DEP</td></tr>" >> report_dist/index.html
          echo "<tr><td>Static Code Scan (Semgrep + Language-Specific)</td><td>\$STATIC</td></tr>" >> report_dist/index.html
          echo "</table>" >> report_dist/index.html
          echo "<h2>Security Score</h2>" >> report_dist/index.html
          echo "<h1>\$SCORE / 100</h1>" >> report_dist/index.html
          echo "<h2 style='color:\$COLOR'>Status: \$STATUS</h2>" >> report_dist/index.html
          echo "<p>Generated automatically by SecureFlow DevSecOps Pipeline</p>" >> report_dist/index.html
          echo "</body></html>" >> report_dist/index.html

          # Also keep a copy as security_report.html for artifact download compatibility
          cp report_dist/index.html report_dist/security_report.html

      - name: Upload Security Report Artifact
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: report_dist/security_report.html

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Only upload the isolated report folder to prevent source code leaks!
          path: ./report_dist

# -------------------------------
# 5. Deploy Website
# -------------------------------
  deploy:
    needs: security_report
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write
      contents: read

    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`;

const stagesData = [
  {
    id: "stage-01",
    name: "01. secret_scan",
    type: "Security",
    tool: "GitLeaks",
    desc: "Universal secret scanner. Scans the entire repository and commit history for leaked API keys, credentials, and private tokens using the GitLeaks action. Pipeline halts immediately on detection.",
    yaml: `  secret_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Run GitLeaks Secret Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`
  },
  {
    id: "stage-02",
    name: "02. dependency_scan",
    type: "Security",
    tool: "Trivy + pip-audit + npm audit",
    desc: "Performs universal dependency scanning with Trivy (filesystem scan) to check package dependencies, plus language-specific audits: pip-audit if requirements.txt exists (Python) and npm audit if package.json exists (Node.js).",
    yaml: `  dependency_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      # A. Universal Dependency Scan (Runs for all technologies)
      - name: Run Trivy Dependency Scan (Universal)
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'fs'
          scan-ref: '.'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'

      # B. Python-specific Dependency Scan (Runs if requirements.txt exists)
      - name: Check if requirements.txt exists
        id: check_reqs
        run: |
          if [ -f requirements.txt ]; then
            echo "exists=true" >> \$GITHUB_OUTPUT
          else
            echo "exists=false" >> \$GITHUB_OUTPUT
          fi

      - name: Setup Python for pip-audit
        if: steps.check_reqs.outputs.exists == 'true'
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: 'pip'

      - name: Run pip-audit Scan (Python)
        if: steps.check_reqs.outputs.exists == 'true'
        run: |
          pip install pip-audit
          pip-audit -r requirements.txt

      # C. Node.js-specific Dependency Scan (Runs if package.json exists)
      - name: Check if package.json exists
        id: check_node
        run: |
          if [ -f package.json ]; then
            echo "exists=true" >> \$GITHUB_OUTPUT
          else
            echo "exists=false" >> \$GITHUB_OUTPUT
          fi

      - name: Setup Node.js for npm audit
        if: steps.check_node.outputs.exists == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'

      - name: Run npm audit (Node.js)
        if: steps.check_node.outputs.exists == 'true'
        run: npm audit --audit-level=high`
  },
  {
    id: "stage-03",
    name: "03. static_security_scan",
    type: "Security",
    tool: "Semgrep + Bandit",
    desc: "SAST scanning phase. Runs Semgrep for universal pattern-based vulnerability scanning, and conditionally runs Bandit if Python files are detected.",
    yaml: `  static_security_scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      # A. Universal SAST Scan (Runs for all technologies)
      - name: Run Semgrep SAST Scan (Universal)
        uses: semgrep/semgrep-action@v1
        with:
          config: auto
          generateSarif: '0'

      # B. Python-specific SAST Scan (Runs if any Python file is present)
      - name: Check for Python files
        id: check_py
        run: |
          if find . -name "*.py" -print -quit | grep -q .; then
            echo "exists=true" >> \$GITHUB_OUTPUT
          else
            echo "exists=false" >> \$GITHUB_OUTPUT
          fi

      - name: Setup Python for Bandit
        if: steps.check_py.outputs.exists == 'true'
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: 'pip'

      - name: Run Bandit Scan (Python)
        if: steps.check_py.outputs.exists == 'true'
        run: |
          pip install bandit
          bandit -r .`
  },
  {
    id: "stage-04",
    name: "04. security_report",
    type: "Security",
    tool: "Bash + upload-artifact + Pages setup + upload-pages-artifact",
    desc: "Always runs (if: always()) after all scans. Compiles results, calculates security score, generates an HTML security dashboard isolated in report_dist to prevent source code leaks, uploads it as a workflow artifact, configures GitHub Pages, and uploads the isolated report directory as a Pages artifact.",
    yaml: `  security_report:
    if: always()
    needs: [secret_scan, dependency_scan, static_security_scan]
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Generate Security Dashboard
        run: |
          # Create a secure isolated directory for the report
          mkdir -p report_dist

          SECRET="\${{ needs.secret_scan.result }}"
          DEP="\${{ needs.dependency_scan.result }}"
          STATIC="\${{ needs.static_security_scan.result }}"

          SCORE=0

          if [ "\$SECRET" = "success" ]; then
            SCORE=\$((SCORE+30))
          fi

          if [ "\$DEP" = "success" ]; then
            SCORE=\$((SCORE+40))
          fi

          if [ "\$STATIC" = "success" ]; then
            SCORE=\$((SCORE+30))
          fi

          if [ \$SCORE -ge 80 ]; then
            STATUS="SECURE"
            COLOR="green"
          else
            STATUS="VULNERABLE"
            COLOR="red"
          fi

          # Generate index.html so Pages serves it by default
          echo "<html>" > report_dist/index.html
          echo "<head><title>SecureFlow Security Dashboard</title></head>" >> report_dist/index.html
          echo "<body style='font-family:Arial;background:#f5f5f5;padding:30px'>" >> report_dist/index.html
          echo "<h1>🔐 SecureFlow DevSecOps Security Dashboard</h1>" >> report_dist/index.html
          echo "<p><b>Commit:</b> \${GITHUB_SHA::7}</p>" >> report_dist/index.html
          echo "<p><b>Generated:</b> \$(date)</p>" >> report_dist/index.html
          echo "<h2>Pipeline Results</h2>" >> report_dist/index.html
          echo "<table border='1' cellpadding='10' style='border-collapse:collapse;background:white'>" >> report_dist/index.html
          echo "<tr><th>Security Scan</th><th>Status</th></tr>" >> report_dist/index.html
          echo "<tr><td>Secret Scan</td><td>\$SECRET</td></tr>" >> report_dist/index.html
          echo "<tr><td>Dependency Scan (Trivy + Language-Specific)</td><td>\$DEP</td></tr>" >> report_dist/index.html
          echo "<tr><td>Static Code Scan (Semgrep + Language-Specific)</td><td>\$STATIC</td></tr>" >> report_dist/index.html
          echo "</table>" >> report_dist/index.html
          echo "<h2>Security Score</h2>" >> report_dist/index.html
          echo "<h1>\$SCORE / 100</h1>" >> report_dist/index.html
          echo "<h2 style='color:\$COLOR'>Status: \$STATUS</h2>" >> report_dist/index.html
          echo "<p>Generated automatically by SecureFlow DevSecOps Pipeline</p>" >> report_dist/index.html
          echo "</body></html>" >> report_dist/index.html

          # Also keep a copy as security_report.html for artifact download compatibility
          cp report_dist/index.html report_dist/security_report.html

      - name: Upload Security Report Artifact
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: report_dist/security_report.html

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Only upload the isolated report folder to prevent source code leaks!
          path: ./report_dist`
  },
  {
    id: "stage-05",
    name: "05. deploy",
    type: "Deploy",
    tool: "deploy-pages",
    desc: "Final deployment step. Deploys the generated security dashboard artifact to GitHub Pages. Requires elevated write permissions for Pages and ID tokens.",
    yaml: `  deploy:
    needs: security_report
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write
      contents: read

    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4`
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar />
      
      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-border bg-card/30 p-6 doc-sidebar">
          <h3 className="font-bold text-lg mb-6 text-foreground">SecureFlow Routes</h3>
          <nav className="space-y-1.5 text-sm">
            <a href="#overview" className="block py-1.5 text-muted-foreground hover:text-primary transition-colors">Pipeline Overview</a>
            <a href="#setup-guide" className="block py-1.5 text-muted-foreground hover:text-primary transition-colors">Setup Guide</a>
            <a href="#full-yaml" className="block py-1.5 text-muted-foreground hover:text-primary transition-colors">Full Workflow YAML</a>
            <a href="#stage-ref" className="block py-1.5 text-muted-foreground hover:text-primary transition-colors">Stage Reference Table</a>
            
            <div className="pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stages</div>
            {stagesData.map((stage) => (
              <a key={stage.id} href={`#${stage.id}`} className="block py-1 text-muted-foreground hover:text-primary transition-colors truncate">
                {stage.name}
              </a>
            ))}

            <div className="pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</div>
            <a href="#security-checks" className="block py-1.5 text-muted-foreground hover:text-primary transition-colors">Security Checks</a>
            <a href="#requirements" className="block py-1.5 text-muted-foreground hover:text-primary transition-colors">Requirements</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-5xl w-full">
          
          <section id="overview" className="bg-card/40 border border-border p-8 rounded-xl mb-16 scroll-mt-24">
            <span className="text-primary font-semibold tracking-wider text-sm mb-2 block uppercase">DevSecOps & GitHub Actions</span>
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              SecureFlow Pipeline
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A complete, professional CI/CD architecture based on a Security-First philosophy. Secret scanning acts as the primary gate, ensuring no code is built or deployed if vulnerabilities or leaked secrets are discovered. A security score dashboard is automatically generated after every run.
            </p>
            <ul className="space-y-2 text-sm text-foreground/80 bg-background p-4 rounded-lg border border-border">
              <li><strong className="text-foreground">Trigger:</strong> Push to <code className="text-primary">main</code> branch</li>
              <li><strong className="text-foreground">Runner:</strong> <code className="text-primary">ubuntu-latest</code> for all jobs</li>
              <li><strong className="text-foreground">Architecture:</strong> 5 Pipeline Jobs</li>
            </ul>
          </section>

          <DocSection id="setup-guide" title="Setup Guide">
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Follow these steps to integrate the SecureFlow pipeline into your repository from scratch. Each step includes the exact settings to configure in GitHub.
            </p>

            <SetupStep number={1} icon={GitBranch} title="Create or prepare your repository">
              <p>Your repository must have a <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">main</code> branch. The pipeline triggers on every push to <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">main</code>.</p>
              <p>The pipeline is fully universal: it runs filesystem security checks (Trivy, Semgrep) on any codebase, and dynamically detects Python (<code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">requirements.txt</code>, Python files) or Node.js (<code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">package.json</code>) to run language-specific audits automatically.</p>
              <CodeBlock code={`# Example project structure
.
├── .github/
│   └── workflows/
│       └── secureflow.yml   ← workflow file goes here
├── requirements.txt          ← optional (detected for pip-audit)
├── package.json              ← optional (detected for npm audit)
└── ...`} />
            </SetupStep>

            <SetupStep number={2} icon={FileCode2} title="Add the workflow file">
              <p>Create the directory <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">.github/workflows/</code> at your repository root and place the YAML file inside it.</p>
              <CodeBlock code={`mkdir -p .github/workflows
# Then paste the full YAML from the "Full Workflow YAML" section above
# into .github/workflows/secureflow.yml`} />
              <Callout type="info">You can also create this file directly on GitHub: go to your repo → <strong>Actions</strong> tab → <strong>New workflow</strong> → <strong>set up a workflow yourself</strong>, then paste the YAML.</Callout>
            </SetupStep>

            <SetupStep number={3} icon={Settings} title="Enable GitHub Pages with Actions source">
              <p>This is the most important configuration step. GitHub Pages must be set to deploy from <strong>GitHub Actions</strong> — not from a branch.</p>
              <div className="p-4 rounded-lg border border-border bg-card/40 space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">1.</span> Go to your repo on GitHub
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">2.</span> Click <strong className="text-foreground">Settings</strong> (top tab)
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">3.</span> Scroll to <strong className="text-foreground">Pages</strong> in the left sidebar
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">4.</span> Under <strong className="text-foreground">Build and deployment → Source</strong>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">5.</span> Select <strong className="text-foreground text-green-400">GitHub Actions</strong> <em>(not "Deploy from a branch")</em>
                </div>
              </div>
              <Callout type="warning">If this is set to "Deploy from a branch", the <code>deploy-pages</code> action will fail with a permissions error. It must be set to <strong>GitHub Actions</strong>.</Callout>
            </SetupStep>

            <SetupStep number={4} icon={Key} title="Verify workflow permissions">
              <p>GitHub Actions needs permission to write to Pages and request an OIDC token for deployment. Check these settings:</p>
              <div className="p-4 rounded-lg border border-border bg-card/40 space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">1.</span> Go to <strong className="text-foreground">Settings → Actions → General</strong>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">2.</span> Scroll to <strong className="text-foreground">Workflow permissions</strong>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">3.</span> Select <strong className="text-foreground text-green-400">Read and write permissions</strong>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">4.</span> Check <strong className="text-foreground text-green-400">Allow GitHub Actions to create and approve pull requests</strong>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">5.</span> Click <strong className="text-foreground">Save</strong>
                </div>
              </div>
              <Callout type="info">The <code>GITHUB_TOKEN</code> secret is automatically provided by GitHub — you do not need to create it manually. It is used by GitLeaks in the first stage.</Callout>
            </SetupStep>

            <SetupStep number={5} icon={Terminal} title="Commit and push to trigger the pipeline">
              <p>Once the workflow file is in place and settings are configured, push any commit to <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">main</code> to trigger the pipeline.</p>
              <CodeBlock code={`git add .github/workflows/secureflow.yml requirements.txt
git commit -m "chore: add SecureFlow DevSecOps pipeline"
git push origin main`} />
              <p>Navigate to the <strong>Actions</strong> tab in your repository to watch each stage run in sequence.</p>
            </SetupStep>

            <SetupStep number={6} icon={Globe} title="Verify deployment and download the security report">
              <p>After a successful run:</p>
              <div className="p-4 rounded-lg border border-border bg-card/40 space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="text-primary font-mono">→</span>
                  <span><strong className="text-foreground">Live URL:</strong> Go to <strong>Settings → Pages</strong> — the deployed URL is shown at the top once the first deployment completes.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-mono">→</span>
                  <span><strong className="text-foreground">Security Report:</strong> Go to <strong>Actions</strong> → click the latest run → scroll to <strong>Artifacts</strong> at the bottom → download <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">security-report</code>. Open <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">security_report.html</code> in your browser to see the full score dashboard.</span>
                </div>
              </div>
              <Callout type="tip">The <code>security_report</code> job uses <code>if: always()</code>, meaning the HTML dashboard is generated and uploaded <em>even if</em> the scans detect vulnerabilities — so you always have a record of what failed.</Callout>
            </SetupStep>

            <SetupStep number={7} icon={Rocket} title="Ongoing usage — what happens on every push">
              <p>After setup, every <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">git push</code> to <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">main</code> will automatically:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {[
                  ["🔍", "Scan for leaked secrets (GitLeaks)"],
                  ["📦", "Audit dependencies (Trivy + pip-audit + npm audit)"],
                  ["🧪", "Run SAST scans (Semgrep + Bandit)"],
                  ["📊", "Generate isolated security score report"],
                  ["⚙️", "Configure and package report for Pages"],
                  ["🌐", "Deploy and publish your dashboard at Pages URL"],
                ].map(([emoji, text]) => (
                  <div key={text} className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card/20 text-sm text-muted-foreground">
                    <span>{emoji}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </SetupStep>
          </DocSection>

          <DocSection id="full-yaml" title="Full Workflow YAML">
            <CodeBlock filename=".github/workflows/secureflow.yml" code={fullYaml} />
          </DocSection>

          <DocSection id="stage-ref" title="Stage Reference Table">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Job ID</th>
                    <th className="px-6 py-4 font-medium">Stage Name</th>
                    <th className="px-6 py-4 font-medium">Tool / Action</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card/20">
                  {stagesData.map((stage) => (
                    <tr key={stage.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-primary">{stage.id.replace('stage-', '')}</td>
                      <td className="px-6 py-4 font-medium">{stage.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{stage.tool}</td>
                      <td className="px-6 py-4">
                        <StageBadge type={stage.type as any} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocSection>

          <h2 className="text-2xl font-bold mt-24 mb-10 pb-3 border-b border-border text-primary">Pipeline Stages Detailed</h2>

          {stagesData.map((stage) => (
            <section key={stage.id} id={stage.id} className="mb-12 scroll-mt-24 p-6 border border-border bg-card/20 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-foreground">{stage.name}</h3>
                <StageBadge type={stage.type as any} />
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{stage.desc}</p>
              <CodeBlock code={stage.yaml} />
            </section>
          ))}

          <DocSection id="security-checks" title="Security Checks Deep-Dive">
            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <div className="p-5 border border-border bg-card/30 rounded-lg">
                <strong className="text-foreground block mb-2 text-base">GitLeaks</strong>
                Executes as the absolute first step. If a secret is detected in the commit history or codebase, the pipeline halts immediately, preventing secrets from entering the artifact or deployment stream.
              </div>
              <div className="p-5 border border-border bg-card/30 rounded-lg">
                <strong className="text-foreground block mb-2 text-base">Dependency Vulnerability Scan</strong>
                Runs Trivy universally on the filesystem to identify open-source vulnerabilities. Conditionally triggers <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">pip-audit</code> (if <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">requirements.txt</code> exists) and <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">npm audit</code> (if <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">package.json</code> exists).
              </div>
              <div className="p-5 border border-border bg-card/30 rounded-lg">
                <strong className="text-foreground block mb-2 text-base">Static Code Security Scan (SAST)</strong>
                Runs Semgrep universally to check for pattern-based security vulnerabilities across all source files, and conditionally triggers Bandit to recursively analyze Python code syntax if Python files are detected.
              </div>
              <div className="p-5 border border-border bg-card/30 rounded-lg">
                <strong className="text-foreground block mb-2 text-base">Security Score Dashboard</strong>
                Runs with <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">if: always()</code> so it executes even when scans fail. Computes a weighted score — Secret Scan (30 pts), Dependency Scan (40 pts), Static Scan (30 pts) — and outputs an HTML report isolated in the <code className="text-primary">report_dist</code> directory to prevent source code leaks. A score &ge; 80 is marked <strong className="text-green-400">SECURE</strong>; below 80 is <strong className="text-red-400">VULNERABLE</strong>.
              </div>
            </div>
          </DocSection>

          <DocSection id="requirements" title="Pipeline Requirements">
            <ul className="space-y-4 text-sm text-muted-foreground bg-card/20 border border-border p-6 rounded-lg list-disc list-inside">
              <li><strong className="text-foreground">Permissions:</strong> The <code className="text-primary">deploy</code> job requires <code className="text-primary">pages: write</code>, <code className="text-primary">id-token: write</code>, and <code className="text-primary">contents: read</code> permissions. GitHub Pages source must be set to Actions.</li>
              <li><strong className="text-foreground">Secrets:</strong> Access to <code className="text-primary">{"\${{ secrets.GITHUB_TOKEN }}"}</code> for GitLeaks to authenticate and scan repository history.</li>
              <li><strong className="text-foreground">Dynamic detection:</strong> The workflow auto-detects files like <code className="text-primary">requirements.txt</code> or <code className="text-primary">package.json</code> and Python source files to determine whether to run language-specific scanners.</li>
              <li><strong className="text-foreground">Isolated Deployment:</strong> The HTML dashboard is built into <code className="text-primary">report_dist/</code> and only this directory is deployed to GitHub Pages, preventing accidental leakage of your repository's source code.</li>
            </ul>
          </DocSection>
          
        </main>
      </div>

      <Footer />
    </div>
  );
}