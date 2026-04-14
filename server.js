const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "onegodian-api",
    status: "ok",
    domain: "api.onegodian.org"
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "onegodian-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/v1/status", (req, res) => {
  res.json({
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
    service: "api.onegodian.org"
  });
});

app.get("/v1/definition", (req, res) => {
  res.json({
    term: "ONEGODIAN",
    classification: "founder-defined identity framework",
    note: "Institution-safe public definition endpoint"
  });
});

app.listen(PORT, () => {
  console.log(`onegodian-api running on port ${PORT}`);
});
