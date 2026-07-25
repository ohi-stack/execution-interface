# OneGodian Digital Coin — Production Platform v1

Canonical public platform for **OneGodian Digital Coin (ODC)** on Ethereum Mainnet.

- Production: <https://odc.onegodian.com>
- Contract: `0x9eee1e3615efe0374a7588d2760db5ffb2d5ce98`
- Chain ID: `1`
- Standard: ERC-20
- Maximum supply: `777,000,000,000 ODC`

## Development

```bash
npm ci
npm run dev
```

## Validation

```bash
npm test
npm run build
```

The platform and WordPress bridge are read-only. They provide no wallet custody and never accept private keys or seed phrases. Capabilities which are not operational are labeled with the shared Feature Registry rather than represented as live.

Production operating guides are available under [`/docs`](https://odc.onegodian.com/docs).
