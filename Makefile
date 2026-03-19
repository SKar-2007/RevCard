.PHONY: dev frontend-wasm

dev:
	@echo "Run: cd frontend && npm install && npm run dev"

frontend-wasm:
	@wasm-pack build wasm --target web --out-dir wasm/pkg

