# Antigravity Resource Hub & Sovereign Infrastructure Codelab

> Everything you need to compress the software development life cycle, build in the agent-first era, and architect your attention. Curated for the **Control Your World** community.
> 
> 🌐 **Live Global Portal:** [https://timothywheelspro.github.io/antigravity-event-talks-app/](https://timothywheelspro.github.io/antigravity-event-talks-app/)

---

## Overview

This repository houses two integrated projects:

1. **Antigravity & Vibe Coding Resource Hub**: A standalone, cyberpunk-themed static portal (`index.html`, `styles.css`, `script.js`) showcasing core tooling across the agentic engineering landscape—including Google Antigravity, Model Context Protocol (MCP), Agent Development Kit (ADK), Google AI Studio, and Sovereign Infrastructure.
2. **Sovereign Infrastructure Codelab**: A structured, 3-part educational curriculum located in [`docs/`](./docs) powered by **VitePress**, teaching engineers how to treat cognitive attention with the exact same architectural rigor as network infrastructure.

---

## Course Curriculum: Sovereign Infrastructure & Attention Routing

The codelab lessons and hands-on exercises are located in the [`docs/`](./docs) directory:

### [Module 1: The Physics of the Stack (Awareness)](./docs/module-1-awareness.md)
* **Concepts:** Bandwidth as finite cognitive network capacity, Sources vs. Loads, and identifying **Dead Ports** (endpoints drawing current with zero compounding return).
* **Hands-on Lab:** Declarative Topology Audit using Mermaid.js flowcharts (`topology-audit.md`) mapping where your bandwidth flows between your Internal Circuit and external networks.

### [Module 2: Sovereign Infrastructure (Action)](./docs/module-2-action.md)
* **Concepts:** Moving operations off rent-seeking platforms onto hardware you physically control (the **Sentinel** node).
* **Hands-on Lab 2.1 (Origin Core):** Initialize `~/sentinel-core` and boot a lightweight, sovereign background origin service.
* **Hands-on Lab 2.2 (Canary Protocol):** Write and execute `canary-deploy.sh` enforcing *Verify-Before-Logging* with deterministic HTTP checks and strict exit codes (`exit 1`).

### [Module 3: Collapsing the Stack (Integration)](./docs/module-3-integration.md)
* **Concepts:** The Isomorphism (port 22 firewalling mapped to psychological boundaries) and Agentic Delegation via local Model-Routers (e.g. Ollama for workhorse tasks).
* **Hands-on Lab (Edge Drop Webhook):** Build and deploy `edge-drop.py`—a local Python webhook that inspects incoming requests, evaluates payload value, and returns `403 Forbidden` to actively drop low-value demands at the edge.

---

## Repository Structure

```text
├── index.html                 # Antigravity & Vibe Coding Resource Hub landing page
├── styles.css                 # Cyberpunk / glowing dark theme styling
├── script.js                  # Frontend interactions
├── package.json               # Node dependencies & scripts for VitePress
├── docs/                      # Sovereign Infrastructure Codelab
│   ├── index.md               # Codelab introduction & feature cards
│   ├── module-1-awareness.md   # Module 1: Topology mapping & bandwidth
│   ├── module-2-action.md      # Module 2: Sentinel node & Canary protocol
│   ├── module-3-integration.md # Module 3: Edge Drop webhook & Model router
│   └── .vitepress/
│       └── config.mjs         # VitePress navigation, sidebar & theme config
└── .gitignore                 # Clean ignore rules for build cache & envs
```

---

## Getting Started Locally

### 1. View the Resource Hub
You can open `index.html` directly in your browser, or spin up a quick local web server:

```bash
# From repository root
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

### 2. Run the Sovereign Infrastructure Codelab (VitePress)
To launch the interactive documentation site:

```bash
# Install dependencies (requires Node.js)
npm install

# Start local dev server
npm run docs:dev

# Build static documentation
npm run docs:build
```
The documentation will be available at `http://localhost:5173`.

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
