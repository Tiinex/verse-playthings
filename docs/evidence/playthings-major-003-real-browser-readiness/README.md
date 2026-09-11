# Playthings Major 003 real-browser readiness receipts

These receipts preserve Prism’s exact qualification of the carried Verse/App/Core/Site source set. They do **not** claim a real React/Vite browser PASS or Sigma readiness.

| File | Bytes | SHA-256 |
|---|---:|---|
| `candidate-hashes.json` | 1050 | `54a2c4b86ebd2d5f2107976c0a3a44f6ce477debcb97472f6d775f23a905c43d` |
| `chromium-probe.log` | 1613 | `96ff0adc3543e04fab5cb86509932927de5cf8f7ee687cb1453c0cf925ea9e4f` |
| `dependency-availability.log` | 730 | `b3024036349a559526abdb44f2ff4d43b8c221ad252330f965392760a375982e` |
| `qualification-summary.json` | 6390 | `c234347f8fe0043f0286c1d97d442e7362d2425a800de4841d9c303eceb41b5c` |
| `site-browser-smoke.log` | 1730 | `ff0cbc324d9573eccbaa755c451afbe2ee68709ff4d16de0e419131e5256a20c` |
| `site-node-integration.log` | 552 | `7ea2a8ada894729bd905d2472bb96ed39a06f8ea716f8bba4d638a9536c4cf9e` |
| `site-npm-ci-offline.log` | 316 | `2ea933196786b237defa86c89f35032fdb2d17e0f4365356aa6262ca00d4001f` |
| `smoke-reconciliation.json` | 1231 | `b72697c30f33115e2d1954553899720150c8d99934d08e1fd1dbcb789bc41c33` |
| `verse-check.log` | 55619 | `822efcbc3e9e74f02da5c4453bba735b0464fe26706b91ec1830d79bf4f8c8bc` |

Verse `npm run check` and Site node integration pass against exact carried sibling sources. The unchanged Site browser smoke stops before Vite startup because the locked Site dependency tree is unavailable in this host. The carried smoke also retains stale historical-moment text and Root Gate/fullscreen assumptions; those are Site-smoke ownership issues rather than Verse-local defects. System Chromium launches through Python Playwright when selected explicitly.
