import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { CATEGORY_BUTTONS, getSilhouette, tierCssClass, VEHICLES, Vehicle } from './vehicles';
import type { MouseEvent } from 'react';
import { rustFilter, RustWasmModule, tryInitRustWasm } from './wasmClient';

type TierColor = { fg: string; fill: string };
const TIER_COLORS: Record<Vehicle['tier'], TierColor> = {
  hyper: { fg: '#ff3300', fill: '#1a0500' },
  super: { fg: '#c9a84c', fill: '#1e1400' },
  sport: { fg: '#3366ff', fill: '#000a1f' },
  luxury: { fg: '#9933ff', fill: '#0a0015' },
  suv: { fg: '#00aa44', fill: '#001508' },
  ev: { fg: '#00ddff', fill: '#00151f' },
  bike: { fg: '#ff2222', fill: '#1a0000' },
  classic: { fg: '#888888', fill: '#0f0f0f' },
  bronze: { fg: '#cd7f32', fill: '#180b00' },
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return <div className={`toast show`}>{text}</div>;
}

function VehicleCard({
  v,
  selected,
  onToggleCompare,
}: {
  v: Vehicle;
  selected: boolean;
  onToggleCompare: (id: number, e: MouseEvent) => void;
}) {
  const ciRef = useRef<HTMLDivElement | null>(null);
  const [locked, setLocked] = useState(false);

  // Only hover-flip on fine pointers.
  const hoverCapable = useMemo(() => {
    const mm = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    return Boolean(mm?.matches);
  }, []);

  const tier = TIER_COLORS[v.tier];
  const cardRotateTo = (deg: number, duration: number) => {
    const el = ciRef.current;
    if (!el) return;
    gsap.to(el, {
      duration,
      rotateY: deg,
      ease: 'power3.out',
    });
  };

  const onMouseEnter = () => {
    if (!hoverCapable) return;
    if (locked) return;
    cardRotateTo(180, 0.65);
  };
  const onMouseLeave = () => {
    if (!hoverCapable) return;
    if (locked) return;
    cardRotateTo(0, 0.72);
  };

  const onTapFlip = () => {
    if (hoverCapable) return; // On desktop hover mode, tap should not fight hover.
    setLocked((p) => {
      const next = !p;
      cardRotateTo(next ? 180 : 0, 0.72);
      return next;
    });
  };

  return (
    <div className="cw">
      <div
        ref={ciRef}
        className="ci"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onTapFlip}
        role="button"
        tabIndex={0}
        aria-label={`Flip card for ${v.make} ${v.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onTapFlip();
        }}
      >
        <div className={`face front ${tierCssClass(v.tier)}`}>
          <div className="cardTop">
            <div className="tierBadge" style={{ borderColor: `${tier.fg}66`, color: tier.fg }}>
              {v.tier.toUpperCase()}
            </div>
            <div
              className={`circleBtn ${selected ? 'on' : ''}`}
              onClick={(e) => onToggleCompare(v.id, e)}
              title="Compare"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="silhouette" aria-hidden="true" dangerouslySetInnerHTML={{ __html: getSilhouette(v.cat) }} />

          <div className="frontBottom">
            <div className="make">{v.make}</div>
            <div className="name">{v.name}</div>
            <div className="statsRow">
              <div className="statPill">
                <b>{v.stats.spd}</b>
                <span>Speed</span>
              </div>
              <div className="statPill">
                <b>{v.stats.acc}</b>
                <span>Launch</span>
              </div>
              <div className="statPill">
                <b>{v.stats.pwr}</b>
                <span>Power</span>
              </div>
            </div>
          </div>
        </div>

        <div className="face back">
          <div className="backBody">
            <div className="backTitle">{v.make}</div>
            <div className="backMeta">
              {v.name} · {v.yr} · {v.ctry}
            </div>

            <div className="bars">
              {(
                [
                  ['SPD', v.stats.spd, 'spd'],
                  ['ACC', v.stats.acc, 'acc'],
                  ['PWR', v.stats.pwr, 'pwr'],
                  ['HND', v.stats.hnd, 'hnd'],
                  ['BRK', v.stats.brk, 'brk'],
                ] as const
              ).map(([label, val, key]) => {
                const pct = clamp(val, 0, 100);
                return (
                  <div className="bar" key={key}>
                    <label>{label}</label>
                    <div className="barTrack">
                      <div className="barFill" style={{ width: `${pct}%`, background: `${tier.fg}` }} />
                    </div>
                    <div className="barVal">{pct}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.6 }}>
              {v.desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePanel({
  open,
  a,
  b,
  onClose,
}: {
  open: boolean;
  a: Vehicle | null;
  b: Vehicle | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      duration: 0.35,
      y: open ? 0 : 110,
      ease: 'power3.out',
    });
  }, [open]);

  const stats = [
    ['spd', 'Speed'],
    ['acc', 'Launch'],
    ['pwr', 'Power'],
    ['hnd', 'Handling'],
    ['brk', 'Braking'],
  ] as const;

  return (
    <div ref={ref} className={`panelWrap ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="panelHead">
        <div className="panelTitle">Head to Head</div>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>

      {!a || !b ? null : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {[['A', a], ['B', b]].map(([key, v]) => {
            const tier = TIER_COLORS[v.tier];
            return (
              <div key={key} style={{ border: '1px solid rgba(201,168,76,0.18)', borderRadius: 16, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>{v.make}</div>
                  <div style={{ color: tier.fg, fontWeight: 900, fontSize: 12 }}>{v.tier.toUpperCase()}</div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 }}>{v.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 }}>
                  {v.hp} hp · {v.a0} · {v.spd}
                </div>

                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.map(([k, label]) => {
                    const va = a.stats[k];
                    const vb = b.stats[k];
                    const win = va >= vb ? a.id === v.id : b.id === v.id;
                    const val = v.stats[k];
                    return (
                      <div key={k} className="bar" style={{ gridTemplateColumns: '80px 1fr 46px' }}>
                        <label style={{ color: win ? tier.fg : 'rgba(255,255,255,0.65)' }}>{label}</label>
                        <div className="barTrack">
                          <div className="barFill" style={{ width: `${val}%`, background: tier.fg }} />
                        </div>
                        <div className="barVal" style={{ color: win ? tier.fg : 'rgba(255,255,255,0.75)' }}>
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [filterKey, setFilterKey] = useState('all');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [sel, setSel] = useState<Vehicle[]>([]);

  const jsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VEHICLES.filter((v) => {
      const okCat =
        filterKey === 'all' ||
        (filterKey === 'bronze' ? v.cat === 'bronze' : v.cat === (filterKey as Vehicle['cat']));
      const okQ = !q || `${v.make} ${v.name} ${v.ctry} ${v.cat}`.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [filterKey, query]);

  const [wasm, setWasm] = useState<RustWasmModule | null>(null);
  const [filteredRust, setFilteredRust] = useState<Vehicle[]>(jsFiltered);

  useEffect(() => {
    let cancelled = false;
    tryInitRustWasm(VEHICLES).then((m) => {
      if (cancelled) return;
      setWasm(m);
      setFilteredRust(jsFiltered);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!wasm) {
      setFilteredRust(jsFiltered);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const out = await rustFilter(wasm, VEHICLES, query, filterKey);
        if (!cancelled) setFilteredRust(out);
      } catch {
        if (!cancelled) setFilteredRust(jsFiltered);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wasm, query, filterKey, jsFiltered]);

  const filtered = wasm ? filteredRust : jsFiltered;

  const open = sel.length === 2;
  const a = sel[0] ?? null;
  const b = sel[1] ?? null;

  const toggleCompare = (id: number, e: MouseEvent) => {
    e.stopPropagation();
    const next = [...sel];
    const idx = next.findIndex((x) => x.id === id);
    if (idx >= 0) next.splice(idx, 1);
    else {
      if (next.length >= 2) {
        setToast('Max 2 vehicles for comparison');
        return;
      }
      const v = VEHICLES.find((x) => x.id === id);
      if (v) next.push(v);
    }
    setSel(next);
  };

  const closePanel = () => setSel([]);

  return (
    <div className="shell">
      {toast ? <Toast text={toast} onDone={() => setToast(null)} /> : null}

      <div className="topbar">
        <div className="brand">RevCard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, letterSpacing: 1.3 }}>
            Hover to flip · Tap to lock
          </div>
        </div>
      </div>

      <div className="filters">
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search make, model, country..."
        />
        {CATEGORY_BUTTONS.map((b) => (
          <div key={b.key} className={`chip ${filterKey === b.key ? 'on' : ''}`} onClick={() => setFilterKey(b.key)}>
            {b.label}
          </div>
        ))}
      </div>

      <div className="grid">
        {filtered.length === 0 ? (
          <div className="nor">No vehicles found.</div>
        ) : (
          filtered.map((v) => (
            <VehicleCard
              key={v.id}
              v={v}
              selected={sel.some((x) => x.id === v.id)}
              onToggleCompare={toggleCompare}
            />
          ))
        )}
      </div>

      <ComparePanel open={open} a={a} b={b} onClose={closePanel} />
    </div>
  );
}

