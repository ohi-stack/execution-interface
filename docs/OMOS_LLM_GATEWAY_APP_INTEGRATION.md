# OMOS LLM Gateway + OneGodian App Integration

This upgrade connects the OMOS / OMO WordPress plugin to the OneGodian App as a first-class module and prepares the secure LLM gateway layer.

## App Module

Route added:

```txt
/omos
```

The page displays:

- Plugin bridge status
- App bridge key readiness
- App manifest data
- OMOS tool registry
- Submission stats
- LLM gateway status
- Provider configuration readiness
- REST endpoint list

## Server-Side App Proxy

Route added:

```txt
/api/omos/llm/chat
```

This route forwards chat requests to the WordPress OMOS bridge. Provider keys must never be exposed to the browser.

## Required App Environment Variables

```env
OMOS_REST_BASE_URL=https://onegodian.org/wp-json/omos/v1
OMOS_API_BASE_URL=https://onegodian.org/wp-json/omos/v1
OMOS_APP_BRIDGE_KEY=PASTE_GENERATED_KEY_HERE
OMOS_APP_DASHBOARD_URL=https://app.onegodian.com/omos
OMOS_MODULE_SLUG=omos
```

## WordPress Plugin Version

Install:

```txt
omos-core-tools-v1.2.0-llm-gateway-app-bridge.zip
```

## Plugin Endpoints

```txt
/wp-json/omos/v1/status
/wp-json/omos/v1/app-manifest
/wp-json/omos/v1/tools
/wp-json/omos/v1/submissions/stats
/wp-json/omos/v1/llm/providers
/wp-json/omos/v1/llm/models
/wp-json/omos/v1/llm/chat
/wp-json/omos/v1/llm/usage
/wp-json/omos/v1/llm/logs
```

## Provider Layer

The plugin admin screen supports:

- OpenAI
- Anthropic / Claude
- Google Gemini
- xAI / Grok
- Mistral
- Groq
- OpenRouter
- Perplexity
- DeepSeek
- Ollama / local models
- Meta / Llama-compatible providers
- Custom OpenAI-compatible providers

## Security Rule

Provider keys stay in WordPress admin settings. The OneGodian App calls OMOS through the app bridge using `X-OMOS-App-Key` from server-side code only.
