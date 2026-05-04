const express = require("express");
const fs = require("fs");
const path = require("path");
const { OMOSProcess } = require("./src/runtime/omos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));
app.use(express.static(path.join(__dirname, "public")));

const version = process.env.npm_package_version || "0.1.0";

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "omos-runtime", timestamp: new Date().toISOString() });
});

app.get("/ready", (_req, res) => {
  res.json({ status: "ready", checks: { process: "up", memory: "ok" } });
});

app.get("/version", (_req, res) => {
  res.json({ version, name: "omos-runtime" });
});

app.post("/process", (req, res) => {
  const pipeline = OMOSProcess(req.body || {});
  res.json({ status: "ok", pipeline });
});

const staticPages = {
  "/": "home.html",
  "/what-is-omos": "what-is-omos.html",
  "/onegodian-algorithm": "onegodian-algorithm.html",
  "/developer-docs": "developer-docs.html",
  "/contact": "contact.html",
  "/omos-1-0-protocol-specification": "omos-1-0-protocol-specification.html",
};

Object.entries(staticPages).forEach(([route, fileName]) => {
  app.get(route, (_req, res, next) => {
    const pagePath = path.join(__dirname, "src", "pages", fileName);
    if (!fs.existsSync(pagePath)) return next();
    return res.sendFile(pagePath);
  });
});

app.listen(PORT, () => {
  console.log(`OMOS runtime listening on http://localhost:${PORT}`);
});
