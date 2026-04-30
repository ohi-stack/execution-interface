const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;
const APP_NAME = "omos-site";
const VERSION = "1.0.0";

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(compression());

app.use("/assets", express.static(path.join(__dirname, "public", "assets")));
app.use("/styles", express.static(path.join(__dirname, "src", "styles")));
app.use("/scripts", express.static(path.join(__dirname, "src", "scripts")));
app.use(express.static(path.join(__dirname, "public")));

function sendPage(res, fileName) {
  const filePath = path.join(__dirname, "src", "pages", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("OMOS page not found");
  }

  return res.sendFile(filePath);
}

app.get("/health", (req, res) => {
  res.json({
    service: APP_NAME,
    status: "ok",
    uptime: process.uptime(),
    timestamp_utc: new Date().toISOString()
  });
});

app.get("/ready", (req, res) => {
  res.json({
    service: APP_NAME,
    ready: true,
    checks: {
      routes: true,
      pages: true,
      assets: true,
      styles: true
    },
    timestamp_utc: new Date().toISOString()
  });
});

app.get("/version", (req, res) => {
  res.json({
    service: APP_NAME,
    version: VERSION,
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/", (req, res) => sendPage(res, "home.html"));
app.get("/omos-1-0-protocol-specification", (req, res) => {
  sendPage(res, "omos-1-0-protocol-specification.html");
});
app.get("/what-is-omos", (req, res) => sendPage(res, "what-is-omos.html"));
app.get("/developer-docs", (req, res) => sendPage(res, "developer-docs.html"));

app.use((req, res) => {
  res.status(404).send("OMOS page not found");
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} v${VERSION} running on port ${PORT}`);
});
