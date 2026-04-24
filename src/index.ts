import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiBaseUrl = process.env.QRV_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.onegodian.org";

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin?: string) => {
  if (!origin) {
    return true;
  }

  if (corsOrigins.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  return corsOrigins.includes(origin);
};

const corsOriginValidator = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) => {
  if (isOriginAllowed(origin ?? undefined)) {
    return callback(null, true);
  }

  return callback(new Error("Not allowed by CORS"));
};

const portalLayout = ({ title, heading, body, activeNav = "/" }: { title: string; heading: string; body: string; activeNav?: string }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="QR-V Issuer Portal for managing issuance and certificate lifecycle." />
    <link rel="stylesheet" href="/css/issuer-portal.css" />
  </head>
  <body>
    <div class="portal-shell">
      <header class="portal-header">
        <div>
          <p class="kicker">QR-V Issuer Portal</p>
          <h1>${heading}</h1>
        </div>
        <nav>
          <a href="/" ${activeNav === "/" ? "class=active" : ""}>Home</a>
          <a href="/dashboard" ${activeNav === "/dashboard" ? "class=active" : ""}>Dashboard</a>
          <a href="/certificates" ${activeNav === "/certificates" ? "class=active" : ""}>Certificates</a>
          <a href="/issue" ${activeNav === "/issue" ? "class=active" : ""}>Issue</a>
          <a href="/login" ${activeNav === "/login" ? "class=active" : ""}>Login</a>
        </nav>
      </header>
      <main>
        ${body}
      </main>
    </div>
  </body>
</html>`;

const metricCard = (label: string, value: string, subtext: string) => `
  <article class="metric-card">
    <p>${label}</p>
    <h3>${value}</h3>
    <small>${subtext}</small>
  </article>
`;

app.disable("x-powered-by");
app.set("trust proxy", true);

app.use(cors({ origin: corsOriginValidator }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.join(__dirname, "../public/css")));
app.use("/js", express.static(path.join(__dirname, "../public/js")));

app.get("/", (_req, res) => {
  res.status(200).send(portalLayout({
    title: "QR-V Issuer Portal",
    heading: "Production-ready certificate issuance",
    activeNav: "/",
    body: `
      <section class="panel hero-panel">
        <h2>QR-V Issuer operations center</h2>
        <p>Manage secure login, issuance workflows, and certificate lifecycle visibility from a single portal.</p>
        <div class="cta-row">
          <a class="button primary" href="/login">Open issuer login</a>
          <a class="button" href="/dashboard">View dashboard</a>
        </div>
      </section>
      <section class="panel muted">
        <h3>Environment wiring</h3>
        <p>API Base URL is loaded from <code>QRV_API_BASE_URL</code> (fallback: <code>NEXT_PUBLIC_API_URL</code>).</p>
        <p><strong>Current API Base:</strong> <code>${apiBaseUrl}</code></p>
      </section>
    `,
  }));
});

app.get("/login", (_req, res) => {
  res.status(200).send(portalLayout({
    title: "Login | QR-V Issuer Portal",
    heading: "Issuer login",
    activeNav: "/login",
    body: `
      <section class="panel auth-panel">
        <h2>Sign in</h2>
        <p>Scaffold login screen ready for SSO/JWT integration.</p>
        <form class="form-grid" method="post" action="/login">
          <label>Email
            <input type="email" name="email" placeholder="issuer@company.com" required />
          </label>
          <label>Password
            <input type="password" name="password" placeholder="••••••••" required />
          </label>
          <button class="button primary" type="submit">Continue</button>
        </form>
      </section>
    `,
  }));
});

app.post("/login", (_req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", (_req, res) => {
  res.status(200).send(portalLayout({
    title: "Dashboard | QR-V Issuer Portal",
    heading: "Issuer dashboard",
    activeNav: "/dashboard",
    body: `
      <section class="metric-grid">
        ${metricCard("Certificates Issued", "12,480", "+182 in the last 24h")}
        ${metricCard("Pending Reviews", "37", "Manual verification queue")}
        ${metricCard("Revocations", "4", "Across all active templates")}
        ${metricCard("API Success Rate", "99.98%", "Based on last 7 days")}
      </section>
      <section class="panel">
        <h3>Next actions</h3>
        <ul>
          <li><a href="/issue">Create a new certificate issuance</a></li>
          <li><a href="/certificates">Review existing certificate records</a></li>
        </ul>
      </section>
    `,
  }));
});

app.get("/certificates", (_req, res) => {
  res.status(200).send(portalLayout({
    title: "Certificates | QR-V Issuer Portal",
    heading: "Certificate records",
    activeNav: "/certificates",
    body: `
      <section class="panel">
        <h2>Recent certificates</h2>
        <table>
          <thead><tr><th>QRVID</th><th>Recipient</th><th>Status</th><th>Issued</th></tr></thead>
          <tbody>
            <tr><td>QRV-900113</td><td>Ada Lovelace</td><td><span class="status ok">ACTIVE</span></td><td>2026-04-22</td></tr>
            <tr><td>QRV-900114</td><td>Alan Turing</td><td><span class="status ok">ACTIVE</span></td><td>2026-04-22</td></tr>
            <tr><td>QRV-900115</td><td>Katherine Johnson</td><td><span class="status warn">PENDING</span></td><td>2026-04-23</td></tr>
          </tbody>
        </table>
      </section>
    `,
  }));
});

app.get("/issue", (_req, res) => {
  res.status(200).send(portalLayout({
    title: "Issue Certificate | QR-V Issuer Portal",
    heading: "Issue certificate",
    activeNav: "/issue",
    body: `
      <section class="panel">
        <h2>Certificate issuance form</h2>
        <p>Submits to API base URL configured via environment variables.</p>
        <form class="form-grid" method="post" action="${apiBaseUrl}/api/v1/records">
          <label>Recipient Name
            <input type="text" name="subjectName" placeholder="Full name" required />
          </label>
          <label>Recipient ID
            <input type="text" name="subjectId" placeholder="ID / Membership Number" required />
          </label>
          <label>Certificate Type
            <input type="text" name="recordType" placeholder="Completion, License, Identity" required />
          </label>
          <label>Issuer Name
            <input type="text" name="issuer" placeholder="Organization name" required />
          </label>
          <label>Issue Date
            <input type="date" name="issuedAt" required />
          </label>
          <button class="button primary" type="submit">Issue Certificate</button>
        </form>
      </section>
    `,
  }));
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "issuer-qrv-portal",
    timestamp: new Date().toISOString(),
  });
});

app.get("/v1/status", (_req, res) => {
  res.json({
    status: "ok",
    service: "issuer-qrv-portal",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
});

app.get("/v1/definition", (_req, res) => {
  res.json({
    name: "QR-V Issuer Portal",
    classification: "issuer-interface",
    description: "Portal and API surface for QR-V issuer operations",
  });
});

app.post("/execute", (req, res) => {
  const expectedApiKey = process.env.EXECUTE_API_KEY;
  const providedApiKey = req.header("x-api-key");

  if (!expectedApiKey) {
    return res.status(503).json({
      success: false,
      error: "Execution endpoint unavailable: missing EXECUTE_API_KEY",
    });
  }

  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  const { task, agent, metadata } = req.body || {};

  if (!task) {
    return res.status(400).json({
      success: false,
      error: "Missing required field: task",
    });
  }

  console.log("Execution request:", {
    task,
    agent,
    metadata,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: "Execution received",
    input: { task, agent },
    timestamp: new Date().toISOString(),
  });
});

app.use((_req, res) => {
  res.status(404).send(portalLayout({
    title: "Not Found | QR-V Issuer Portal",
    heading: "Page not found",
    body: `<section class="panel"><p>The route you requested does not exist.</p></section>`,
  }));
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

const server = app.listen(PORT, () => {
  console.log(`QR-V Issuer Portal running on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
