export type VehicleTier =
  | 'hyper'
  | 'super'
  | 'sport'
  | 'luxury'
  | 'suv'
  | 'ev'
  | 'bike'
  | 'classic'
  | 'bronze';

export type VehicleCat =
  | 'hypercar'
  | 'supercar'
  | 'sport'
  | 'luxury'
  | 'suv'
  | 'sedan'
  | 'ev'
  | 'bike'
  | 'classic'
  | 'bronze';

export type VehicleStats = {
  spd: number;
  acc: number;
  pwr: number;
  hnd: number;
  brk: number;
};

export type Vehicle = {
  id: number;
  make: string;
  name: string;
  yr: number;
  cat: VehicleCat;
  tier: VehicleTier;
  hp: number;
  tor: string;
  eng: string;
  spd: string;
  wt: string;
  a0: string;
  pr: string;
  ctry: string;
  stats: VehicleStats;
  rt: number;
  desc: string;
};

export const VEHICLES: Vehicle[] = [
  {
    id: 1,
    make: 'Bugatti',
    name: 'Chiron Super Sport',
    yr: 2022,
    cat: 'hypercar',
    tier: 'hyper',
    hp: 1600,
    tor: '1600 Nm',
    eng: '8.0L W16 Quad-Turbo',
    spd: '440 km/h',
    wt: '1995 kg',
    a0: '2.3s',
    pr: '€3.2M',
    ctry: 'France',
    stats: { spd: 99, acc: 98, pwr: 100, hnd: 88, brk: 94 },
    rt: 99,
    desc: 'The most powerful production car ever — built by hand in Molsheim, France.',
  },
  {
    id: 2,
    make: 'Koenigsegg',
    name: 'Jesko Absolut',
    yr: 2022,
    cat: 'hypercar',
    tier: 'hyper',
    hp: 1600,
    tor: '1500 Nm',
    eng: '5.0L V8 Twin-Turbo',
    spd: '330 km/h',
    wt: '1420 kg',
    a0: '2.5s',
    pr: '$3M',
    ctry: 'Sweden',
    stats: { spd: 100, acc: 99, pwr: 100, hnd: 95, brk: 97 },
    rt: 99,
    desc: 'Designed purely to be the fastest production car ever made. Swedish perfection.',
  },
  {
    id: 3,
    make: 'Rimac',
    name: 'Nevera',
    yr: 2023,
    cat: 'hypercar',
    tier: 'hyper',
    hp: 1914,
    tor: '2360 Nm',
    eng: '4-Motor Electric',
    spd: '412 km/h',
    wt: '2150 kg',
    a0: '1.85s',
    pr: '€2.1M',
    ctry: 'Croatia',
    stats: { spd: 99, acc: 100, pwr: 100, hnd: 97, brk: 99 },
    rt: 99,
    desc: 'All-electric hypercar that rewrote every record. 1,914hp from four motors.',
  },
  {
    id: 8,
    make: 'Ferrari',
    name: 'SF90 Stradale',
    yr: 2023,
    cat: 'supercar',
    tier: 'super',
    hp: 1000,
    tor: '900 Nm',
    eng: '4.0L V8 + 3 Motors',
    spd: '340 km/h',
    wt: '1570 kg',
    a0: '2.5s',
    pr: '€500K',
    ctry: 'Italy',
    stats: { spd: 97, acc: 97, pwr: 95, hnd: 95, brk: 96 },
    rt: 96,
    desc: "Ferrari's most powerful road car ever — hybrid V8 that blurs F1 and road.",
  },
  {
    id: 37,
    make: 'Tesla',
    name: 'Model S Plaid',
    yr: 2023,
    cat: 'ev',
    tier: 'ev',
    hp: 1020,
    tor: '1420 Nm',
    eng: '3-Motor Electric',
    spd: '322 km/h',
    wt: '2162 kg',
    a0: '1.99s',
    pr: '$110K',
    ctry: 'USA',
    stats: { spd: 94, acc: 100, pwr: 95, hnd: 85, brk: 90 },
    rt: 93,
    desc: 'The quickest production sedan ever. 0–60 in 1.99s. The future arrived.',
  },
];

export const CATEGORY_BUTTONS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'hypercar', label: 'Hypercars' },
  { key: 'supercar', label: 'Supercars' },
  { key: 'sport', label: 'Sports' },
  { key: 'luxury', label: 'Luxury' },
  { key: 'suv', label: 'SUVs' },
  { key: 'sedan', label: 'Sedans' },
  { key: 'ev', label: 'Electric' },
  { key: 'bike', label: 'Motorcycles' },
  { key: 'classic', label: 'Classics' },
  { key: 'bronze', label: 'Legends' },
];

const SVG = {
  hypercar: `<svg viewBox="0 0 500 140" xmlns="http://www.w3.org/2000/svg" fill="#c9a84c"><path d="M8 105 L28 105 L28 90 L65 42 L290 30 L390 58 L440 82 L450 105 L435 105 Q435 128 416 128 Q397 128 397 105 L95 105 Q95 128 76 128 Q57 128 57 105 Z"/><ellipse cx="76" cy="105" rx="24" ry="24" fill="none" stroke-width="6"/><ellipse cx="416" cy="105" rx="24" ry="24" fill="none" stroke-width="6"/><ellipse cx="76" cy="105" rx="9" ry="9"/><ellipse cx="416" cy="105" rx="9" ry="9"/><rect x="85" y="38" width="175" height="36" rx="4" opacity=".5"/></svg>`,
  car: `<svg viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg" fill="#c9a84c"><path d="M18 118 L42 118 L42 100 L80 52 L305 42 L380 68 L435 98 L445 118 L428 118 Q428 144 407 144 Q386 144 386 118 L108 118 Q108 144 87 144 Q66 144 66 118 Z"/><ellipse cx="87" cy="118" rx="28" ry="28" fill="none" stroke-width="6"/><ellipse cx="407" cy="118" rx="28" ry="28" fill="none" stroke-width="6"/><ellipse cx="87" cy="118" rx="10" ry="10"/><ellipse cx="407" cy="118" rx="10" ry="10"/><rect x="90" y="52" width="190" height="42" rx="4" opacity=".45"/></svg>`,
  suv: `<svg viewBox="0 0 500 170" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="45" width="440" height="90" rx="8" fill="#c9a84c"/><rect x="50" y="22" width="400" height="32" rx="6" opacity=".65" fill="#c9a84c"/><ellipse cx="100" cy="140" rx="32" ry="32" fill="none" stroke-width="7" stroke="#c9a84c"/><ellipse cx="400" cy="140" rx="32" ry="32" fill="none" stroke-width="7" stroke="#c9a84c"/><ellipse cx="100" cy="140" rx="12" ry="12" fill="#c9a84c"/><ellipse cx="400" cy="140" rx="12" ry="12" fill="#c9a84c"/><rect x="22" y="118" width="456" height="24" rx="4" fill="#c9a84c"/></svg>`,
  bike: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg"><circle cx="130" cy="140" r="65" fill="none" stroke-width="12" stroke="#c9a84c"/><circle cx="370" cy="140" r="65" fill="none" stroke-width="12" stroke="#c9a84c"/><circle cx="130" cy="140" r="18" fill="#c9a84c"/><circle cx="370" cy="140" r="18" fill="#c9a84c"/><path d="M130 140 L200 80 L270 95 L370 140" fill="none" stroke-width="14" stroke-linecap="round" stroke="#c9a84c"/><path d="M200 80 L220 45 L310 55 L300 100" fill="none" stroke-width="11" stroke-linecap="round" stroke="#c9a84c"/></svg>`,
  classic: `<svg viewBox="0 0 500 170" xmlns="http://www.w3.org/2000/svg" fill="#c9a84c"><path d="M22 130 L50 130 L50 112 L90 62 L290 50 L355 75 L420 108 L428 130 L410 130 Q410 158 388 158 Q366 158 366 130 L118 130 Q118 158 96 158 Q74 158 74 130 Z"/><ellipse cx="96" cy="130" rx="30" ry="30" fill="none" stroke-width="6" stroke="#c9a84c"/><ellipse cx="388" cy="130" rx="30" ry="30" fill="none" stroke-width="6" stroke="#c9a84c"/><ellipse cx="96" cy="130" rx="11" ry="11" fill="#c9a84c"/><ellipse cx="388" cy="130" rx="11" ry="11" fill="#c9a84c"/><rect x="96" y="60" width="178" height="48" rx="5" opacity=".5"/></svg>`,
} as const;

export function getSilhouette(cat: VehicleCat) {
  if (cat === 'hypercar') return SVG.hypercar;
  if (cat === 'suv') return SVG.suv;
  if (cat === 'bike') return SVG.bike;
  if (cat === 'classic') return SVG.classic;
  // Map sedan/sport/luxury/ev to generic car silhouette.
  return SVG.car;
}

export function tierCssClass(tier: Vehicle['tier']) {
  return `tier-${tier}`;
}

