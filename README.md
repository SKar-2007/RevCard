# RevCard (prototype -> hybrid)

This workspace started as a single-file HTML prototype (`revcard.html`). It’s now being redesigned into a real hybrid stack:

- `frontend/`: React + TypeScript + GSAP (flip cards + compare panel)
- `wasm/`: Rust + WASM (data-heavy filtering/search)

## Run frontend

```bash
cd "frontend"
npm install
npm run dev
```

## Build Rust -> WASM (optional, enables Rust filtering)

From repo root:

```bash
wasm-pack build wasm --target web --out-dir wasm/pkg
```

Then restart the dev server. The frontend will *attempt* to load `wasm/pkg/revcards_wasm` and fall back to JS filtering if it’s not available yet.

## Next upgrades (tell me what to prioritize)

1. Port the full vehicle dataset (80+ cards) from the old prototype into Rust/WASM.
2. Add Rive (JS) tier animations on hover.
3. Add Bevy (WASM/3D background) + GSAP choreographed UI transitions.
4. Explore Makepad for Rust-driven UI panels.

