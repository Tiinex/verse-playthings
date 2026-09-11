# Carrier Major 002 browser reality receipts

These receipts preserve Prism's exact rerun against the qualified carried Verse/App/Core/Site source set. They do not claim a full React/Vite browser PASS or Sigma acceptance.

| File | Bytes | SHA-256 |
|---|---:|---|
| `chromium-probe.log` | 1506 | `2f3a6ab999f2592b883aeb38d14dfeead0614fdc83a559eb64653faf8c4c20fd` |
| `qualification-summary.json` | 2547 | `a7ade11ab9844c08532f3a50cb82b1483f2cefef938e69e765987fc3b139aab0` |
| `registry-ping.log` | 349 | `2da1706ef3b85aa43999faf181a1c5c27754edb3eecb53d6538d2fc55a53859d` |
| `site-browser-smoke.log` | 1730 | `2028ffa1d67c88457fa42857b48d297c298060d451e943601a975f253ad2afe0` |
| `site-node-integration.log` | 553 | `6b72b16065e051ebbcecbba0cd410aa18d99afafe0add925852962a3a3ac06d3` |
| `site-npm-ci-network.log` | 270 | `4921a8d3e077fd9664e13e8af29bd38c0e7628597d1e7efb7969e111ceef8910` |
| `verse-check.log` | 55623 | `178129d65b7bad659becb54bd2c5ab4d2ab01ca3498648b3ed90ba03b5333314` |

The unchanged Site `tools/browser-smoke.py` stops before Vite startup because the locked dependency tree is unavailable in this host. System Chromium itself launches through Python Playwright when explicitly selected; Playwright's default bundled Chromium is not installed.
