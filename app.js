'use strict';

/* =========================================================
   Plan data
   ========================================================= */

// Meals that are the same every day
const COMMON = {
  early: { time: '6:30', name: 'Early morning', food: 'Warm ajwain/jeera water · 5 soaked almonds · 2 walnuts', kcal: 90, p: 3 },
  mid:   { time: '11:00', name: 'Mid-morning', food: '1 banana + 1 tbsp peanut butter', kcal: 200, p: 5 },
  post:  { time: 'After gym', name: 'Protein shake', food: 'Whey shake (25 g protein) + 1 banana', kcal: 230, p: 26 },
  bed:   { time: '10:00', name: 'Bedtime', food: 'Warm haldi milk + 2 dates', kcal: 200, p: 8 },
};

// Index = JS Date.getDay() (0 = Sunday). kcal / p are rough estimates.
const WEEK = [
  { // Sunday
    bf:     { food: 'Besan chilla (small) with paneer stuffing · glass of milk', kcal: 550, p: 28 },
    lunch:  { food: 'Quinoa or dalia veg pulao · paneer curry · raita', kcal: 700, p: 26 },
    eve:    { food: 'Fruit bowl (papaya, banana, chikoo) + seeds', kcal: 250, p: 6 },
    dinner: { food: '2 roti · moong dal makhani · sabzi', kcal: 600, p: 22 },
  },
  { // Monday
    bf:     { food: 'Oats cooked in milk · banana · 1 tbsp peanut butter · seeds', kcal: 600, p: 22 },
    lunch:  { food: '3 roti · moong dal · lauki sabzi · curd', kcal: 650, p: 24 },
    eve:    { food: 'Paneer tikka (100 g)', kcal: 300, p: 19 },
    dinner: { food: '2 roti · palak paneer', kcal: 600, p: 24 },
  },
  { // Tuesday
    bf:     { food: '2 paneer paratha · curd', kcal: 650, p: 26 },
    lunch:  { food: '3 roti · masoor dal · tori sabzi · raita', kcal: 650, p: 24 },
    eve:    { food: 'Hung curd with fruit + honey', kcal: 250, p: 12 },
    dinner: { food: 'Vegetable dalia · stir-fried tofu', kcal: 550, p: 24 },
  },
  { // Wednesday
    bf:     { food: 'Sooji upma with peanuts · glass of milk', kcal: 550, p: 18 },
    lunch:  { food: '3 roti · tofu bhurji · pumpkin sabzi · curd', kcal: 700, p: 30 },
    eve:    { food: 'Boiled sweet potato with chaat masala · buttermilk', kcal: 250, p: 6 },
    dinner: { food: '2 roti · moong dal tadka · beans sabzi', kcal: 550, p: 20 },
  },
  { // Thursday
    bf:     { food: 'Moong dal chilla (2–3) with paneer filling · curd', kcal: 550, p: 30 },
    lunch:  { food: 'Quinoa veg pulao · paneer curry', kcal: 700, p: 28 },
    eve:    { food: 'Chikoo or mango shake with nuts', kcal: 400, p: 12 },
    dinner: { food: '2 roti · masoor dal · carrot-capsicum sabzi', kcal: 550, p: 20 },
  },
  { // Friday
    bf:     { food: 'Peanut butter toast (2 slices) · banana · milk', kcal: 600, p: 22 },
    lunch:  { food: '3 roti · paneer bhurji · tinda · curd', kcal: 750, p: 30 },
    eve:    { food: 'Roasted makhana (1 bowl) + dates', kcal: 250, p: 6 },
    dinner: { food: 'Dalia–moong khichdi with ghee · curd', kcal: 600, p: 20 },
  },
  { // Saturday
    bf:     { food: '2 aloo paratha · curd · a little butter', kcal: 650, p: 16 },
    lunch:  { food: '3 roti · moong dal · palak · raita', kcal: 650, p: 24 },
    eve:    { food: 'Smoothie: banana + oats + peanut butter + milk', kcal: 500, p: 18 },
    dinner: { food: '2 tofu / paneer veg wraps', kcal: 600, p: 26 },
  },
];

const SCHEDULE = ['rest', 'upper', 'lower', 'rest', 'upper', 'lower', 'walk']; // by getDay()

// u = what the number box logs: kg, reps or sec
const EX = {
  gym: {
    upper: [
      { id: 'g-bench', n: 'Bench press', s: '4 × 8', u: 'kg' },
      { id: 'g-pulldown', n: 'Lat pulldown / pull-ups', s: '4 × 8–10', u: 'kg' },
      { id: 'g-ohp', n: 'Overhead press', s: '3 × 10', u: 'kg' },
      { id: 'g-row', n: 'Seated cable row', s: '3 × 10', u: 'kg' },
      { id: 'g-curl', n: 'Bicep curls', s: '3 × 12', u: 'kg' },
      { id: 'g-pushdown', n: 'Tricep pushdowns', s: '3 × 12', u: 'kg' },
    ],
    lower: [
      { id: 'g-squat', n: 'Squat', s: '4 × 8', u: 'kg' },
      { id: 'g-rdl', n: 'Romanian deadlift', s: '3 × 10', u: 'kg' },
      { id: 'g-legpress', n: 'Leg press', s: '3 × 12', u: 'kg' },
      { id: 'g-lunge', n: 'Walking lunges', s: '3 × 10 / leg', u: 'kg' },
      { id: 'g-calf', n: 'Calf raises', s: '3 × 15', u: 'kg' },
      { id: 'g-plank', n: 'Plank', s: '3 × 45 s', u: 'sec' },
    ],
  },
  home: {
    upper: [
      { id: 'h-pushup', n: 'Push-ups', s: '4 × max', u: 'reps' },
      { id: 'h-pike', n: 'Pike push-ups', s: '3 × 8–10', u: 'reps' },
      { id: 'h-row', n: 'Backpack rows', s: '4 × 10–12', u: 'kg' },
      { id: 'h-dips', n: 'Chair dips', s: '3 × 10–12', u: 'reps' },
      { id: 'h-curl', n: 'Backpack / band curls', s: '3 × 12', u: 'kg' },
      { id: 'h-plank', n: 'Plank', s: '3 × 45 s', u: 'sec' },
    ],
    lower: [
      { id: 'h-squat', n: 'Backpack squats', s: '4 × 12–15', u: 'kg' },
      { id: 'h-bss', n: 'Bulgarian split squats', s: '3 × 10 / leg', u: 'reps' },
      { id: 'h-bridge', n: 'Glute bridges', s: '3 × 15', u: 'reps' },
      { id: 'h-lunge', n: 'Reverse lunges', s: '3 × 10 / leg', u: 'reps' },
      { id: 'h-calf', n: 'Single-leg calf raises', s: '3 × 15', u: 'reps' },
      { id: 'h-sideplank', n: 'Side plank', s: '3 × 30 s / side', u: 'sec' },
    ],
  },
};

const GOOD_FOODS = ['Paneer', 'Curd / hung curd', 'Milk', 'Tofu', 'Whey', 'Moong dal (split)', 'Masoor dal', 'Roti', 'Oats', 'Dalia', 'Sooji', 'Quinoa', 'Potato', 'Sweet potato', 'Banana', 'Papaya', 'Chikoo', 'Mango', 'Dates', 'Peanut butter', 'Almonds', 'Walnuts', 'Pumpkin seeds', 'Makhana', 'Ghee', 'Lauki', 'Tori', 'Tinda', 'Pumpkin', 'Carrot', 'Spinach', 'Beans', 'Capsicum'];
const AVOID_FOODS = ['Rice', 'Poha', 'Idli / dosa', 'Murmura', 'Rajma', 'Chole / whole chana', 'Whole urad', 'Lobia', 'Cabbage', 'Cauliflower', 'Broccoli', 'Raw onion', 'Lots of garlic', 'Soya chunks', 'Fizzy drinks', 'Sugar-free sweeteners'];
const TIPS = [
  'Cook dals and sabzis with jeera, ajwain, hing and ginger — they cut bloating.',
  'Soak dals 1–2 hours before cooking.',
  'Six smaller meals beat three big ones.',
  'Weigh yourself in the morning, after the toilet, before food.',
  'Look at the weekly average, not single days — water swings 0.5–1 kg.',
  'No change for 2 weeks? Add ~200 kcal/day (an extra glass of milk + banana).',
  'Add a little weight or 1–2 reps every week in the gym.',
  'Sleep 7–8 hours — muscle is built while you rest.',
];

const MEAL_ORDER = ['early', 'bf', 'mid', 'lunch', 'eve', 'post', 'dinner', 'bed'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// Small top-ups offered when a day falls short. kcal / p are rough estimates.
const CATCHUP = [
  { id: 'milk-dates', name: 'Glass of milk + 2 dates', kcal: 200, p: 8 },
  { id: 'paneer', name: 'Paneer 100 g (tikka or bhurji)', kcal: 270, p: 18 },
  { id: 'nuts-banana', name: 'Handful of nuts + 1 banana', kcal: 300, p: 7 },
  { id: 'bpb-shake', name: 'Banana–peanut butter milkshake', kcal: 420, p: 16 },
  { id: 'whey', name: 'Extra whey scoop in milk', kcal: 250, p: 32 },
];

const THEMES = {
  indigo: { name: 'Indigo', color: '#4F46E5' },
  ocean: { name: 'Ocean', color: '#1F6FB5' },
  plum: { name: 'Plum', color: '#8B3A8F' },
  terracotta: { name: 'Clay', color: '#BF5530' },
  forest: { name: 'Forest', color: '#2E7D5B' },
};

/* =========================================================
   Date helpers (local dates as YYYY-MM-DD keys)
   ========================================================= */
const pad = n => String(n).padStart(2, '0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const todayKey = () => keyOf(new Date());
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
const diffDays = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);
const fmtDate = (k, opts = { day: 'numeric', month: 'short' }) => parseKey(k).toLocaleDateString('en-IN', opts);
const dowOf = k => parseKey(k).getDay();
const mondayOf = k => addDays(k, -((dowOf(k) + 6) % 7));

/* =========================================================
   Storage
   ========================================================= */
const KEY = 'road78:v1';
const UI_KEY = 'road78:ui';
const THEME_KEY = 'road78:theme';

function freshDb() {
  const t = todayKey();
  return {
    v: 1,
    settings: {
      startWeight: 71, targetWeight: 78, startDate: t, targetDate: addDays(t, 182),
      kcal: 2800, protein: 120, water: 12, mode: 'gym', theme: 'indigo', kcalChangedAt: t,
    },
    weights: {},
    days: {},
    lastBackup: null,
  };
}
function merge(d) {
  const f = freshDb();
  return { ...f, ...d, settings: { ...f.settings, ...(d.settings || {}) }, weights: d.weights || {}, days: d.days || {} };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(JSON.parse(raw));
  } catch (e) { /* fall through */ }
  return freshDb();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); }
  catch (e) { toast('Could not save — storage is blocked or full'); }
}
function loadUi() {
  try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (e) { return {}; }
}
function saveUi() {
  try { localStorage.setItem(UI_KEY, JSON.stringify({ tab: ui.tab, wRange: ui.wRange, nMetric: ui.nMetric })); } catch (e) { /* ignore */ }
}

let db = load();
const ui = { tab: 'home', wRange: 'goal', nMetric: 'kcal', cur: todayKey(), planDow: dowOf(todayKey()), sheet: null, ...pickUi(loadUi()) };
function pickUi(u) {
  const out = {};
  if (['home', 'today', 'plan', 'settings'].includes(u.tab)) out.tab = u.tab;
  if (['1m', '3m', 'goal'].includes(u.wRange)) out.wRange = u.wRange;
  if (['kcal', 'p'].includes(u.nMetric)) out.nMetric = u.nMetric;
  return out;
}

/* =========================================================
   Domain helpers
   ========================================================= */
const EMPTY_DAY = () => ({ meals: {}, extras: [], catch: [], water: 0, ex: {} });
function dayOf(k, create) {
  if (!db.days[k]) {
    if (!create) return EMPTY_DAY();
    db.days[k] = EMPTY_DAY();
  }
  const d = db.days[k];
  d.meals ||= {}; d.extras ||= []; d.catch ||= []; d.ex ||= {}; d.water ||= 0;
  return d;
}

function mealsFor(k) {
  const m = WEEK[dowOf(k)];
  const named = {
    early: { ...COMMON.early },
    bf: { time: '8:30', name: 'Breakfast', ...m.bf },
    mid: { ...COMMON.mid },
    lunch: { time: '1:30', name: 'Lunch', ...m.lunch },
    eve: { time: '5:00', name: 'Evening snack', ...m.eve },
    post: { ...COMMON.post },
    dinner: { time: '8:30', name: 'Dinner', ...m.dinner },
    bed: { ...COMMON.bed },
  };
  return MEAL_ORDER.map(id => ({ id, ...named[id] }));
}

function totals(k) {
  const d = db.days[k];
  if (!d) return { kcal: 0, p: 0, meals: 0, water: 0, logged: false };
  let kcal = 0, p = 0, n = 0;
  for (const m of mealsFor(k)) if (d.meals?.[m.id]) { kcal += m.kcal; p += m.p; n++; }
  for (const e of d.extras || []) { kcal += +e.kcal || 0; p += +e.p || 0; }
  let caught = 0;
  for (const c of d.catch || []) if (c.done) { kcal += c.kcal; p += c.p; caught++; }
  return { kcal, p, meals: n, water: d.water || 0, logged: n > 0 || (d.extras || []).length > 0 || caught > 0 };
}

// A rest day can host a make-up session (day.swap = 'upper' | 'lower')
function workoutFor(k) {
  const d = db.days[k];
  let type = SCHEDULE[dowOf(k)];
  let makeup = false;
  if ((type === 'rest' || type === 'walk') && (d?.swap === 'upper' || d?.swap === 'lower')) { type = d.swap; makeup = true; }
  const mode = db.settings.mode === 'home' ? 'home' : 'gym';
  if (type === 'upper' || type === 'lower') {
    return { type, gym: true, makeup, title: type === 'upper' ? 'Upper body' : 'Lower body', list: EX[mode][type] };
  }
  const walk = [{ id: 'walk', n: type === 'walk' ? 'Easy walk' : 'Easy walk (optional)', s: '20–30 min', u: 'min' }];
  return { type, gym: false, makeup: false, title: type === 'walk' ? 'Active rest' : 'Rest day', list: walk };
}

function workoutDone(k) {
  const w = workoutFor(k);
  if (!w.gym) return false;
  const d = db.days[k];
  if (!d?.ex) return false;
  const done = w.list.filter(e => d.ex[e.id]?.done).length;
  return done >= Math.ceil(w.list.length / 2);
}

// Gym sessions missed earlier in k's week that haven't been made up yet
function missedWorkouts(k) {
  const missed = [], made = { upper: 0, lower: 0 };
  for (let x = mondayOf(k); x < k; x = addDays(x, 1)) {
    if (x < db.settings.startDate) continue;
    const w = workoutFor(x);
    if (w.makeup) { if (workoutDone(x)) made[w.type]++; continue; }
    if (w.gym && !workoutDone(x)) missed.push({ k: x, type: w.type });
  }
  // also count a make-up planned for today (k) so the offer disappears once accepted
  const wk = workoutFor(k);
  if (wk.makeup) made[wk.type]++;
  return missed.filter(m => (made[m.type] > 0 ? (made[m.type]--, false) : true));
}

function nextRestDay(k) {
  for (let x = addDays(k, 1); dowOf(x) !== 1; x = addDays(x, 1)) {
    if (!workoutFor(x).gym) return x;
  }
  return null;
}

// How a day went against its targets
function evalDay(k) {
  const s = db.settings, t = totals(k), d = db.days[k], wo = workoutFor(k);
  const checks = [
    { id: 'kcal', label: 'Calories', have: t.kcal, need: s.kcal, unit: 'kcal', ok: t.kcal >= s.kcal * 0.9 },
    { id: 'p', label: 'Protein', have: t.p, need: s.protein, unit: 'g', ok: t.p >= s.protein * 0.9 },
    { id: 'water', label: 'Water', have: t.water, need: s.water, unit: 'glasses', ok: t.water >= Math.ceil(s.water * 0.8) },
  ];
  if (wo.gym) {
    const done = wo.list.filter(e => d?.ex?.[e.id]?.done).length;
    checks.push({ id: 'gym', label: wo.title, have: done, need: wo.list.length, unit: 'exercises', ok: workoutDone(k) });
  }
  const okN = checks.filter(c => c.ok).length;
  const any = t.logged || t.water > 0 || Object.values(d?.ex || {}).some(e => e.done);
  let state;
  if (k === todayKey()) state = okN === checks.length ? 'hit' : 'today';
  else if (!any) state = 'empty';
  else if (okN === checks.length) state = 'hit';
  else if (okN >= checks.length / 2) state = 'partial';
  else state = 'missed';
  return { state, checks, okN, any };
}

const STATE_LABEL = { hit: 'All targets hit', partial: 'Partly hit', missed: 'Missed', empty: 'Not logged', today: 'In progress' };

function lastLogged(id, before) {
  const keys = Object.keys(db.days).filter(k => k < before).sort().reverse();
  for (const k of keys) {
    const v = db.days[k].ex?.[id]?.v;
    if (v !== undefined && v !== null && v !== '') return { v, k };
  }
  return null;
}

const weightsSorted = () => Object.entries(db.weights).filter(([, v]) => isFinite(v)).sort((a, b) => (a[0] < b[0] ? -1 : 1));

function hitStreaks() {
  const t = todayKey();
  let cur = 0, k = t;
  if (evalDay(t).state === 'hit') cur++;
  k = addDays(t, -1);
  while (k >= db.settings.startDate && evalDay(k).state === 'hit') { cur++; k = addDays(k, -1); }
  let best = cur, run = 0;
  for (let x = db.settings.startDate; x <= t; x = addDays(x, 1)) {
    run = evalDay(x).state === 'hit' ? run + 1 : 0;
    if (run > best) best = run;
  }
  return { cur, best };
}

const mean = a => a.reduce((s, x) => s + x, 0) / a.length;

function planAt(k) {
  const s = db.settings;
  const total = Math.max(1, diffDays(s.startDate, s.targetDate));
  const f = Math.max(0, Math.min(1, diffDays(s.startDate, k) / total));
  return s.startWeight + (s.targetWeight - s.startWeight) * f;
}

function stats() {
  const s = db.settings;
  const t = todayKey();
  const W = weightsSorted();
  const has = W.length > 0;
  const lastK = has ? W[W.length - 1][0] : null;
  const current = has ? W[W.length - 1][1] : s.startWeight;
  const span = s.targetWeight - s.startWeight;

  const recent = has ? W.filter(([k]) => diffDays(k, lastK) < 7).map(([, v]) => v) : [];
  const avg7 = recent.length ? mean(recent) : null;
  const ref = avg7 ?? current;
  const gained = ref - s.startWeight;
  const pct = span ? Math.max(0, Math.min(1, gained / span)) : 0;

  // Weekly rate: least-squares slope over the last 28 days of weigh-ins
  let rate = null, rateSpan = 0;
  const win = has ? W.filter(([k]) => diffDays(k, lastK) < 28) : [];
  if (win.length >= 3 && diffDays(win[0][0], lastK) >= 6) {
    const xs = win.map(([k]) => diffDays(win[0][0], k)), ys = win.map(([, v]) => v);
    const mx = mean(xs), my = mean(ys);
    let num = 0, den = 0;
    xs.forEach((x, i) => { num += (x - mx) * (ys[i] - my); den += (x - mx) ** 2; });
    if (den) { rate = (num / den) * 7; rateSpan = diffDays(win[0][0], lastK); }
  }

  const totalDays = Math.max(1, diffDays(s.startDate, s.targetDate));
  const neededRate = span / (totalDays / 7);
  const expected = planAt(t);
  const remaining = Math.max(0, s.targetWeight - ref);

  let eta = null;
  if (remaining <= 0) eta = 'done';
  else if (rate && rate > 0.03) eta = addDays(t, Math.round((remaining / rate) * 7));

  let status = { cls: '', text: 'Log a weigh-in' };
  if (remaining <= 0) status = { cls: 'ok', text: 'Goal reached' };
  else if (has) status = ref >= expected - 0.3 ? { cls: 'ok', text: 'On track' } : { cls: 'warn', text: 'Behind plan' };

  const mon = mondayOf(t);
  let wkDone = 0;
  for (let i = 0; i < 7; i++) { const k = addDays(mon, i); if (k <= t && workoutDone(k)) wkDone++; }

  return { has, current, avg7, gained, pct, rate, rateSpan, neededRate, expected, remaining, eta, status, wkDone, lastK, streaks: hitStreaks() };
}

// The 7 finished days before today (only from the start date on)
function last7() {
  const t = todayKey();
  const days = [...Array(7)].map((_, i) => addDays(t, i - 7)).filter(k => k >= db.settings.startDate);
  const evs = days.map(k => ({ k, ...evalDay(k) }));
  const count = id => {
    let hit = 0, of = 0;
    for (const e of evs) { const c = e.checks.find(c => c.id === id); if (!c) continue; of++; if (c.ok) hit++; }
    return { hit, of };
  };
  return {
    evs, n: evs.length,
    hit: evs.filter(e => e.state === 'hit').length,
    missed: evs.filter(e => e.state === 'missed' || e.state === 'empty').length,
    kcal: count('kcal'), p: count('p'), water: count('water'), gym: count('gym'),
  };
}

// Coaching messages for the dashboard
function advice(st, wk) {
  const s = db.settings, t = todayKey(), out = [];
  if (st.has) {
    const gap = diffDays(st.lastK, t);
    if (gap >= 4) out.push({ tone: 'warn', title: `No weigh-in for ${gap} days`, text: 'Weigh yourself tomorrow morning so your trend stays accurate.' });
  }
  const settled = diffDays(s.kcalChangedAt || s.startDate, t) >= 14;
  if (st.rate != null && st.rateSpan >= 13 && settled && st.remaining > 0) {
    if (st.rate < Math.max(0.1, st.neededRate * 0.5)) {
      out.push({ tone: 'warn', title: st.rate < 0.05 ? 'Weight has stalled' : 'Gaining too slowly', text: `${signed(st.rate)} kg a week over the last ${st.rateSpan} days — your plan needs +${f1(st.neededRate)}. If you're hitting your meals, it's time to eat a little more.`, action: { label: `Raise to ${int(s.kcal + 200)} kcal/day`, kcal: s.kcal + 200 } });
    } else if (st.rate > 0.6) {
      out.push({ tone: 'warn', title: 'Gaining quite fast', text: `${signed(st.rate)} kg a week is likely adding extra fat. A small cut keeps the gain lean.`, action: { label: `Lower to ${int(s.kcal - 200)} kcal/day`, kcal: s.kcal - 200 } });
    }
  }
  if (wk.n >= 4 && wk.missed >= 3) {
    out.push({ tone: 'warn', title: `Targets missed on ${wk.missed} of the last ${wk.n} days`, text: 'Consistency matters more than any single day. Prep the evening snack and shake in advance — they are the easiest calories to skip.' });
  }
  return out;
}

/* =========================================================
   Small utils
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const f1 = v => (Math.round(v * 10) / 10).toFixed(1);
const fmtW = v => (Number.isInteger(+v) ? String(+v) : f1(v));
const signed = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + f1(Math.abs(v));
const int = v => Math.round(v).toLocaleString('en-IN');
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; };
const appName = () => `Road to ${fmtW(db.settings.targetWeight)}`;

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

const CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
const GLASS = '<svg viewBox="0 0 24 24"><path class="fill" d="M6.6 11h10.8l-1 9H7.6z" stroke="none"/><path d="M5 4h14l-1.8 16.2a1 1 0 0 1-1 .8H7.8a1 1 0 0 1-1-.8z"/></svg>';
const PENCIL = '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';

/* =========================================================
   Charts (plain SVG, no libraries)
   ========================================================= */
function weightChart(range) {
  const s = db.settings, t = todayKey();
  let pts = weightsSorted();
  if (!db.weights[s.startDate]) pts = [[s.startDate, s.startWeight], ...pts].sort((a, b) => (a[0] < b[0] ? -1 : 1));

  let x0, x1;
  if (range === 'goal') {
    x0 = pts[0][0] < s.startDate ? pts[0][0] : s.startDate;
    x1 = s.targetDate > t ? s.targetDate : t;
  } else {
    x1 = t;
    x0 = addDays(t, range === '1m' ? -29 : -89);
  }
  const span = Math.max(1, diffDays(x0, x1));
  const vis = pts.filter(([k]) => k >= x0 && k <= x1);

  const avg = vis.map(([k], i) => {
    const w = vis.slice(0, i + 1).filter(([kk]) => diffDays(kk, k) < 7).map(([, v]) => v);
    return [k, mean(w)];
  });

  const planKeys = [...new Set([x0, s.startDate, s.targetDate, x1])].filter(k => k >= x0 && k <= x1).sort();
  const ys = [...vis.map(p => p[1]), ...planKeys.map(planAt), s.targetWeight, s.startWeight];
  let yMin = Math.floor(Math.min(...ys) - 0.5), yMax = Math.ceil(Math.max(...ys) + 0.5);
  if (yMax - yMin < 3) yMax = yMin + 3;

  const W = 340, H = 200, L = 30, R = 8, T = 10, B = 22;
  const X = k => L + (diffDays(x0, k) / span) * (W - L - R);
  const Y = v => T + ((yMax - v) / (yMax - yMin)) * (H - T - B);

  const step = yMax - yMin > 10 ? 2 : 1;
  let g = '';
  for (let v = yMin; v <= yMax; v += step) {
    g += `<line class="grid" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end">${v}</text>`;
  }
  [x0, addDays(x0, Math.round(span / 2)), x1].forEach((k, i) => {
    g += `<text x="${X(k)}" y="${H - 5}" text-anchor="${['start', 'middle', 'end'][i]}">${fmtDate(k)}</text>`;
  });

  const goalY = Y(s.targetWeight);
  const goal = `<line x1="${L}" x2="${W - R}" y1="${goalY}" y2="${goalY}" stroke="var(--gold)" stroke-width="1" stroke-dasharray="2 3" opacity=".8"/>
    <text x="${W - R}" y="${goalY - 4}" text-anchor="end" style="fill:var(--gold);font-weight:600">Goal ${fmtW(s.targetWeight)}</text>`;

  const plan = planKeys.length > 1
    ? `<polyline points="${planKeys.map(k => `${X(k)},${Y(planAt(k))}`).join(' ')}" fill="none" stroke="var(--ink-3)" stroke-width="1.5" stroke-dasharray="5 4"/>` : '';

  const todayLine = t > x0 && t < x1 && range === 'goal'
    ? `<line x1="${X(t)}" x2="${X(t)}" y1="${T}" y2="${H - B}" stroke="var(--ink-3)" stroke-width="1" opacity=".35"/>` : '';

  const r = vis.length > 45 ? 1.8 : 2.8;
  const dots = vis.map(([k, v]) => `<circle cx="${X(k)}" cy="${Y(v)}" r="${r}" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.4" opacity=".75"/>`).join('');
  const line = avg.length > 1
    ? `<polyline points="${avg.map(([k, v]) => `${X(k)},${Y(v)}`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : '';
  const last = vis.length ? vis[vis.length - 1] : null;
  const lastDot = last ? `<circle cx="${X(last[0])}" cy="${Y(last[1])}" r="4.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/>` : '';

  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight chart">${g}${goal}${plan}${todayLine}${line}${dots}${lastDot}</svg>`;
}

function nutritionChart(metric) {
  const s = db.settings, t = todayKey();
  const target = metric === 'kcal' ? s.kcal : s.protein;
  const days = [...Array(14)].map((_, i) => addDays(t, i - 13));
  const vals = days.map(k => totals(k)[metric]);
  const max = Math.max(target * 1.2, ...vals);
  const W = 340, H = 150, L = 4, R = 4, T = 14, B = 20;
  const bw = (W - L - R) / 14;
  const Y = v => T + (1 - v / max) * (H - T - B);
  let bars = '';
  days.forEach((k, i) => {
    const v = vals[i];
    const x = L + i * bw + bw * 0.18, w = bw * 0.64;
    if (v > 0) {
      const col = v >= target * 0.9 ? 'var(--accent)' : 'var(--gold)';
      bars += `<rect x="${x}" y="${Y(v)}" width="${w}" height="${H - B - Y(v)}" rx="4" fill="${col}"/>`;
    } else {
      bars += `<rect x="${x}" y="${H - B - 3}" width="${w}" height="3" rx="1.5" fill="var(--line)"/>`;
    }
    const isT = k === t;
    bars += `<text x="${x + w / 2}" y="${H - 6}" text-anchor="middle" style="${isT ? 'fill:var(--ink);font-weight:700' : ''}">${DOW[dowOf(k)][0]}</text>`;
  });
  const ty = Y(target);
  const tl = `<line x1="${L}" x2="${W - R}" y1="${ty}" y2="${ty}" stroke="var(--ink-2)" stroke-dasharray="4 4" stroke-width="1"/>
    <text x="${W - R}" y="${ty - 4}" text-anchor="end">Target ${int(target)}${metric === 'p' ? ' g' : ''}</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Nutrition last 14 days">${tl}${bars}</svg>`;
}

function heatmap() {
  const t = todayKey();
  const start = addDays(mondayOf(t), -28);
  let h = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<div class="dow">${d}</div>`).join('');
  for (let i = 0; i < 35; i++) {
    const k = addDays(start, i);
    if (k > t) { h += `<div class="cell future"></div>`; continue; }
    if (k < db.settings.startDate) { h += `<div class="cell before"></div>`; continue; }
    const ev = evalDay(k);
    const gym = workoutDone(k) ? '<span class="gym"></span>' : '';
    h += `<button class="cell s-${ev.state} ${k === t ? 'today' : ''}" data-action="goto-day" data-k="${k}" aria-label="${fmtDate(k)}: ${STATE_LABEL[ev.state]}">${gym}</button>`;
  }
  return `<div class="heat">${h}</div>
    <div class="heat-legend">
      <span><span class="sw s-hit"></span>All hit</span>
      <span><span class="sw s-partial"></span>Partly</span>
      <span><span class="sw s-missed"></span>Missed</span>
      <span><span class="sw s-empty"></span>Not logged</span>
      <span><span class="sw gymdot"></span>Workout</span>
    </div>`;
}

/* =========================================================
   Views
   ========================================================= */
function viewHome() {
  const s = db.settings, st = stats(), wk = last7();
  const span = s.targetWeight - s.startWeight;
  const expectedPct = span ? Math.max(0, Math.min(1, (st.expected - s.startWeight) / span)) : 0;
  const shown = st.avg7 ?? st.current;

  const rateTxt = st.rate == null ? '—' : signed(st.rate);
  const rateHint = st.rate == null ? 'Needs ~1 week of weigh-ins' : `Plan needs +${f1(st.neededRate)} / wk`;
  const etaTxt = st.eta === 'done' ? 'Done 🎉' : st.eta ? fmtDate(st.eta, { month: 'short', year: 'numeric' }) : '—';
  const etaHint = st.eta && st.eta !== 'done'
    ? (st.eta <= s.targetDate ? 'Ahead of goal date' : `Goal date ${fmtDate(s.targetDate, { month: 'short', year: 'numeric' })}`)
    : `Goal date ${fmtDate(s.targetDate, { month: 'short', year: 'numeric' })}`;

  const needBackup = Object.keys(db.days).length + Object.keys(db.weights).length > 3 &&
    (!db.lastBackup || diffDays(db.lastBackup, todayKey()) >= 7);

  const tips = advice(st, wk).map(a => `
    <section class="advice ${a.tone}">
      <div class="advice-title">${esc(a.title)}</div>
      <div class="small">${esc(a.text)}</div>
      ${a.action ? `<button class="btn sm" style="margin-top:10px" data-action="set-kcal" data-v="${a.action.kcal}">${esc(a.action.label)}</button>` : ''}
    </section>`).join('');

  const noWeight = !st.has ? `
    <section class="card">
      <h2>Start here</h2>
      <p class="muted small" style="margin:6px 0 12px">Log your morning weight today. After about a week of weigh-ins, your weekly rate and finish date appear here.</p>
      <button class="btn block" data-action="tab" data-tab="today">Log today</button>
    </section>` : '';

  const trow = (label, c) => c.of ? `
    <div class="trow">
      <span>${label}</span>
      <span class="minibar"><span style="width:${(c.hit / c.of * 100).toFixed(0)}%"></span></span>
      <b class="num">${c.hit}/${c.of}</b>
    </div>` : '';

  const weekCard = wk.n ? `
    <section class="card">
      <div class="card-head"><h2>Last ${wk.n} days</h2><span class="small faint">${wk.hit} of ${wk.n} days all hit</span></div>
      ${trow('Calories', wk.kcal)}${trow('Protein', wk.p)}${trow('Water', wk.water)}${trow('Gym sessions', wk.gym)}
      <p class="small muted" style="margin:10px 0 0">A day counts as hit at 90% of your calorie and protein targets and 80% of your water.</p>
    </section>` : '';

  return `
    ${needBackup ? `<div class="banner"><span>It's been a while since your last backup.</span><button class="btn sm" data-action="export">Back up</button></div>` : ''}
    <section class="card hero">
      <div class="hero-top">
        <div>
          <div class="eyebrow">${st.avg7 != null ? '7-day average' : 'Starting weight'}</div>
          <div class="big">${f1(shown)}<span>kg</span></div>
          <div class="sub">${st.has ? `${signed(st.gained)} kg since start · ${f1(st.remaining)} kg to go` : `Goal: ${fmtW(s.targetWeight)} kg`}</div>
        </div>
        <span class="pill ${st.status.cls}">${st.status.text}</span>
      </div>
      <div class="progress" aria-label="Progress to goal">
        <div class="bar" style="width:${(st.pct * 100).toFixed(1)}%"></div>
        ${st.has && st.remaining > 0 ? `<div class="mark" style="left:${(expectedPct * 100).toFixed(1)}%" title="Where the plan expects you today"></div>` : ''}
      </div>
      <div class="progress-labels"><span>${fmtW(s.startWeight)} kg</span><span><b>${Math.round(st.pct * 100)}%</b> of the way${st.has && st.remaining > 0 ? ` · plan today ${f1(st.expected)}` : ''}</span><span>${fmtW(s.targetWeight)} kg</span></div>
      <button class="goal-edit" data-action="open-goal">${PENCIL}<span>Goal: <b>${fmtW(s.targetWeight)} kg</b> by ${fmtDate(s.targetDate, { day: 'numeric', month: 'short', year: 'numeric' })}</span><span class="chev">Edit</span></button>
    </section>

    ${tips}
    ${noWeight}

    <div class="tiles">
      <div class="tile"><div class="label">Weekly rate</div><div class="value">${rateTxt}<small>kg</small></div><div class="hint">${rateHint}</div></div>
      <div class="tile"><div class="label">Finish date</div><div class="value">${etaTxt}</div><div class="hint">${etaHint}</div></div>
      <div class="tile"><div class="label">Target streak</div><div class="value">${st.streaks.cur}<small>${st.streaks.cur === 1 ? 'day' : 'days'}</small></div><div class="hint">Best: ${st.streaks.best} · all targets hit</div></div>
      <div class="tile"><div class="label">Workouts this week</div><div class="value">${st.wkDone}<small>/ 4</small></div><div class="hint">Upper + lower × 2</div></div>
    </div>

    <section class="card">
      <div class="card-head">
        <h2>Weight</h2>
        <div class="seg" role="tablist">
          ${['1m', '3m', 'goal'].map(r => `<button class="${ui.wRange === r ? 'on' : ''}" data-action="wrange" data-r="${r}">${r === 'goal' ? 'Goal' : r.toUpperCase()}</button>`).join('')}
        </div>
      </div>
      ${weightChart(ui.wRange)}
      <div class="legend">
        <span><i style="border-color:var(--accent)"></i>7-day average</span>
        <span><i class="dot" style="background:var(--accent);opacity:.6"></i>Weigh-ins</span>
        <span><i style="border-color:var(--ink-3);border-top-style:dashed"></i>Plan</span>
      </div>
    </section>

    ${weekCard}

    <section class="card">
      <div class="card-head">
        <h2>Last 14 days</h2>
        <div class="seg">
          <button class="${ui.nMetric === 'kcal' ? 'on' : ''}" data-action="nmetric" data-m="kcal">Calories</button>
          <button class="${ui.nMetric === 'p' ? 'on' : ''}" data-action="nmetric" data-m="p">Protein</button>
        </div>
      </div>
      ${nutritionChart(ui.nMetric)}
    </section>

    <section class="card">
      <div class="card-head"><h2>Consistency</h2><span class="small faint">Last 5 weeks · tap a day</span></div>
      ${heatmap()}
    </section>`;
}

// "Missed something?" card on Today: yesterday's shortfall + missed gym sessions
function catchUpCard(k) {
  const s = db.settings, y = addDays(k, -1), d = dayOf(k);
  const ev = y >= s.startDate ? evalDay(y) : null;
  const parts = [];

  if (ev && ev.state === 'empty') {
    parts.push(`<p><b>Yesterday wasn't logged.</b> No problem — one day doesn't change your trend. Just log today.</p>`);
  } else if (ev && ev.state !== 'hit') {
    const kc = ev.checks.find(c => c.id === 'kcal'), pr = ev.checks.find(c => c.id === 'p');
    let snack = null, why = '';
    if (!kc.ok) {
      const short = kc.need - kc.have;
      const add = Math.min(500, Math.max(200, Math.round((short * 0.5) / 50) * 50));
      snack = CATCHUP.filter(c => c.id !== 'whey').reduce((a, b) => (Math.abs(b.kcal - add) < Math.abs(a.kcal - add) ? b : a));
      why = `Yesterday you were <b>${int(short)} kcal short</b>.`;
    } else if (!pr.ok) {
      snack = CATCHUP.find(c => c.id === (pr.need - pr.have >= 20 ? 'whey' : 'paneer'));
      why = `Yesterday you were <b>${int(pr.need - pr.have)} g short on protein</b>.`;
    }
    if (snack) {
      const added = d.catch.some(c => c.from === y);
      parts.push(`<p>${why} Don't try to eat double today — make up about half with one extra snack:</p>
        <div class="catch-offer">
          <div><div class="name">${esc(snack.name)}</div><div class="small faint num">+${snack.kcal} kcal · ${snack.p} g protein</div></div>
          ${added ? '<span class="tag">Added ✓</span>' : `<button class="btn sm" data-action="add-catch" data-id="${snack.id}" data-from="${y}">Add to today</button>`}
        </div>`);
    }
    const wc = ev.checks.find(c => c.id === 'water');
    if (wc && !wc.ok && !snack) parts.push(`<p>Water was low yesterday (${wc.have}/${wc.need}). Keep a bottle on your desk today.</p>`);
  }

  const miss = missedWorkouts(k);
  const wo = workoutFor(k);
  if (miss.length) {
    const m = miss[0];
    const name = `${DOW_LONG[dowOf(m.k)]}'s ${m.type === 'upper' ? 'Upper body' : 'Lower body'}`;
    if (!wo.gym) {
      parts.push(`<p>You missed <b>${name}</b>. Today is a rest day — you can do it now.</p>
        <button class="btn sm" data-action="swap" data-type="${m.type}">Do ${m.type === 'upper' ? 'Upper' : 'Lower'} body today</button>`);
    } else if (!wo.makeup) {
      const rest = nextRestDay(k);
      parts.push(`<p>You missed <b>${name}</b>. Don't do two sessions in one day — stick to today's plan${rest ? ` and make it up on <b>${DOW_LONG[dowOf(rest)]}</b> (rest day)` : ''}.</p>`);
    }
  }

  if (!parts.length) return '';
  return `
    <section class="card catch">
      <div class="card-head"><h2>Missed something?</h2><span class="tag warn">Catch-up</span></div>
      ${parts.join('')}
    </section>`;
}

function viewToday() {
  const s = db.settings, k = ui.cur, t = todayKey();
  const d = dayOf(k);
  const tot = totals(k);
  const ev = evalDay(k);
  const w = db.weights[k];
  const prev = weightsSorted().filter(([kk]) => kk < k).pop();
  const meals = mealsFor(k);
  const wo = workoutFor(k);
  const isToday = k === t;
  const label = isToday ? 'Today' : k === addDays(t, -1) ? 'Yesterday' : fmtDate(k, { day: 'numeric', month: 'short' });

  const delta = w != null && prev
    ? `<div class="delta">${(() => { const dv = w - prev[1]; return `<b class="${dv >= 0 ? 'up' : 'down'}">${signed(dv)} kg</b> vs ${fmtDate(prev[0])} (${f1(prev[1])} kg)`; })()}</div>`
    : w == null && prev ? `<div class="delta">Last weigh-in: <b>${f1(prev[1])} kg</b> on ${fmtDate(prev[0])}</div>` : '';

  const target = c => {
    const left = Math.max(0, c.need - c.have);
    const note = c.ok ? '<span class="ok-note">✓ Hit</span>'
      : isToday ? `${int(left)} ${c.unit} to go` : `<span class="miss-note">${int(left)} ${c.unit} short</span>`;
    return `
      <div class="target">
        <div class="meter-top"><span>${c.label}</span><span><b>${int(c.have)}</b> <span class="faint">/ ${int(c.need)} ${c.unit}</span></span></div>
        <div class="meter m-${c.id}"><div style="width:${Math.min(100, (c.have / c.need) * 100).toFixed(1)}%"></div></div>
        <div class="tnote">${note}</div>
      </div>`;
  };

  // Evening nudge: after 6 pm, still well short on calories
  const kc = ev.checks[0];
  let nudge = '';
  if (isToday && new Date().getHours() >= 18 && !kc.ok) {
    const left = meals.filter(m => !d.meals[m.id] && ['eve', 'post', 'dinner', 'bed'].includes(m.id));
    const sum = left.reduce((a, m) => a + m.kcal, 0);
    nudge = `<div class="nudge">🌙 <b>${int(kc.need - kc.have)} kcal to go tonight.</b> ${left.length
      ? `Still open: ${left.map(m => esc(m.name.toLowerCase())).join(', ')} (≈${int(sum)} kcal).`
      : 'Add a glass of milk + banana, or a peanut butter shake.'}</div>`;
  }

  const pillCls = ev.state === 'hit' ? 'ok' : ev.state === 'today' ? '' : 'warn';
  const pillTxt = isToday && ev.state !== 'hit' ? `${ev.okN}/${ev.checks.length} hit` : STATE_LABEL[ev.state];

  const mealRows = meals.map(m => `
    <li><button class="check-item ${d.meals[m.id] ? 'done' : ''}" data-action="meal" data-id="${m.id}" aria-pressed="${!!d.meals[m.id]}">
      <span class="box">${CHECK}</span>
      <span><span class="title">${esc(m.name)} <span class="time">${esc(m.time)}</span></span><span class="food">${esc(m.food)}</span></span>
      <span class="macro"><b>${m.kcal} kcal</b>${m.p} g protein</span>
    </button></li>`).join('');

  const catchRows = d.catch.map((c, i) => `
    <li><button class="check-item ${c.done ? 'done' : ''}" data-action="catch" data-i="${i}" aria-pressed="${!!c.done}">
      <span class="box">${CHECK}</span>
      <span><span class="title">Catch-up <span class="tag warn">extra</span></span><span class="food">${esc(c.name)}</span></span>
      <span class="macro"><b>${c.kcal} kcal</b>${c.p} g protein</span>
    </button></li>`).join('');

  const extras = d.extras.map((e, i) => `
    <div class="extra-row"><span>${esc(e.name)} <span class="faint small num">· ${int(+e.kcal || 0)} kcal · ${int(+e.p || 0)} g</span></span>
    <button class="x" data-action="del-extra" data-i="${i}" aria-label="Remove">✕</button></div>`).join('');

  const glasses = [...Array(Math.max(1, s.water))].map((_, i) =>
    `<button class="glass ${i < d.water ? 'full' : ''}" data-action="water" data-i="${i}" aria-label="${i + 1} glasses">${GLASS}</button>`).join('');

  const exRows = wo.list.map(e => {
    const st = d.ex[e.id] || {};
    const last = lastLogged(e.id, k);
    return `<li><div class="ex-item ${st.done ? 'done' : ''}">
      <button class="ex-tick" data-action="ex" data-id="${e.id}" aria-pressed="${!!st.done}" aria-label="Mark ${esc(e.n)} done"><span class="box">${CHECK}</span></button>
      <button class="ex-text" data-action="ex" data-id="${e.id}" tabindex="-1">
        <div class="name">${esc(e.n)}</div>
        <div class="sets">${esc(e.s)}${last ? ` · <span class="last">last ${esc(last.v)} ${e.u}</span>` : ''}</div>
      </button>
      <input class="input num" inputmode="decimal" placeholder="${e.u}" value="${esc(st.v ?? '')}" data-action="ex-val" data-id="${e.id}" aria-label="${esc(e.n)} ${e.u}">
    </div></li>`;
  }).join('');

  return `
    <div class="daynav">
      <button class="iconbtn" data-action="day" data-n="-1" aria-label="Previous day"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="center">
        <div class="eyebrow">${DOW_LONG[dowOf(k)]}</div>
        <div class="dtitle">${label}</div>
      </div>
      <button class="iconbtn" data-action="day" data-n="1" ${isToday ? 'disabled' : ''} aria-label="Next day"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
    ${!isToday ? `<div style="text-align:center;margin:-4px 0 12px"><button class="btn sm ghost" data-action="goto-day" data-k="${t}">Back to today</button></div>` : ''}

    <section class="card">
      <h2>Morning weight</h2>
      <form class="weight-form" data-form="weight">
        <input class="input num" name="w" inputmode="decimal" placeholder="${prev ? f1(prev[1]) : f1(s.startWeight)} kg" value="${w != null ? f1(w) : ''}" aria-label="Weight in kg">
        <button class="btn" type="submit">${w != null ? 'Update' : 'Save'}</button>
      </form>
      ${delta}
      ${w != null ? `<button class="btn sm ghost" style="margin-top:10px" data-action="clear-weight">Remove this weigh-in</button>` : ''}
    </section>

    ${isToday ? catchUpCard(k) : ''}

    <section class="card">
      <div class="card-head"><h2>Daily targets</h2><span class="pill ${pillCls}">${pillTxt}</span></div>
      <div class="meters">${ev.checks.filter(c => c.id !== 'gym').map(target).join('')}</div>
      ${nudge}
    </section>

    <section class="card">
      <div class="card-head"><h2>Meals</h2><span class="small faint num">${tot.meals} / 8 done</span></div>
      <ul class="list">${mealRows}${catchRows}</ul>
      <div class="extras">
        <h3>Anything extra?</h3>
        ${extras}
        <form class="extra-form" data-form="extra">
          <input class="input" name="name" placeholder="e.g. Lassi" aria-label="Food" autocomplete="off">
          <input class="input num" name="kcal" inputmode="numeric" placeholder="kcal" aria-label="Calories">
          <input class="input num" name="p" inputmode="numeric" placeholder="prot" aria-label="Protein grams">
          <button class="btn sm" type="submit" aria-label="Add">Add</button>
        </form>
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>Water</h2><span class="small faint num">${d.water} × 250 ml</span></div>
      <div class="glasses">${glasses}</div>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>${wo.title}</h2>
        <span class="tag ${wo.gym ? (wo.makeup ? 'warn' : '') : 'rest'}">${wo.makeup ? 'Make-up' : wo.gym ? (s.mode === 'home' ? 'Home' : 'Gym') : 'Recovery'}</span>
      </div>
      ${wo.gym ? `<p class="small muted" style="margin:-4px 0 10px">Tick each exercise and log your working ${s.mode === 'home' ? 'weight / reps' : 'weight'}. Try to beat "last" a little each week.</p>` : ''}
      <ul class="list">${exRows}</ul>
      ${wo.makeup ? `<button class="btn sm ghost" style="margin-top:10px" data-action="unswap">Back to rest day</button>` : ''}
    </section>`;
}

function viewPlan() {
  const dow = ui.planDow;
  const mon = mondayOf(todayKey());
  const k = addDays(mon, (dow + 6) % 7);
  const meals = mealsFor(k);
  const type = SCHEDULE[dow];
  const mode = db.settings.mode === 'home' ? 'home' : 'gym';
  const wo = type === 'upper' || type === 'lower'
    ? { gym: true, title: type === 'upper' ? 'Upper body' : 'Lower body', list: EX[mode][type] }
    : { gym: false, title: type === 'walk' ? 'Active rest' : 'Rest day', list: [{ n: 'Easy walk', s: '20–30 min' }] };
  const order = [1, 2, 3, 4, 5, 6, 0];
  const kcal = meals.reduce((a, m) => a + m.kcal, 0), p = meals.reduce((a, m) => a + m.p, 0);

  return `
    <div class="chips">
      ${order.map(i => {
        const ty = SCHEDULE[i];
        const sub = ty === 'upper' ? 'Upper' : ty === 'lower' ? 'Lower' : ty === 'walk' ? 'Walk' : 'Rest';
        return `<button class="chip ${i === dow ? 'on' : ''}" data-action="plan-dow" data-d="${i}">${DOW[i]}<small>${sub}</small></button>`;
      }).join('')}
    </div>

    <section class="card">
      <div class="card-head"><h2>${DOW_LONG[dow]} meals</h2><span class="small faint num">≈ ${int(kcal)} kcal · ${p} g</span></div>
      ${meals.map(m => `<div class="plan-meal"><div class="time">${esc(m.time)}</div><div><div class="name">${esc(m.name)}</div><div class="food">${esc(m.food)}</div></div></div>`).join('')}
    </section>

    <section class="card">
      <div class="card-head"><h2>${wo.title}</h2><span class="tag ${wo.gym ? '' : 'rest'}">${wo.gym ? (mode === 'home' ? 'Home' : 'Gym') : 'Recovery'}</span></div>
      ${wo.list.map(e => `<div class="plan-meal"><div class="time">${esc(e.s)}</div><div class="name">${esc(e.n)}</div></div>`).join('')}
    </section>

    <details class="card">
      <summary><h2>If you miss a day</h2></summary>
      <ul class="tips">
        <li><b>Short on calories?</b> Don't eat double the next day. Make up about half with one extra snack. The app suggests one on the Today tab.</li>
        <li><b>Missed a gym day?</b> Do it on the next rest day (Wed, Sat or Sun). Never do two sessions in one day.</li>
        <li><b>Missed a whole day?</b> Just carry on. Your weekly average is what matters, not one day.</li>
        <li><b>Weight flat for 2 weeks?</b> The dashboard will suggest adding 200 kcal a day.</li>
        <li><b>Several misses in a week?</b> Prep the evening snack and shake in advance. They're the easiest to skip.</li>
      </ul>
    </details>

    <details class="card">
      <summary><h2>Foods that suit you</h2></summary>
      <div class="foodlist">${GOOD_FOODS.map(f => `<span>${esc(f)}</span>`).join('')}</div>
    </details>

    <details class="card">
      <summary><h2>Skip these</h2></summary>
      <p class="small muted" style="margin:-4px 0 10px">Gas-forming foods, and anything made from rice.</p>
      <div class="foodlist bad">${AVOID_FOODS.map(f => `<span>${esc(f)}</span>`).join('')}</div>
    </details>

    <details class="card">
      <summary><h2>Tips</h2></summary>
      <ul class="tips">${TIPS.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    </details>`;
}

function viewSettings() {
  const s = db.settings;
  const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  const count = Object.keys(db.weights).length;
  const f = (name, label, type, val, extra = '') =>
    `<div class="field"><label for="s-${name}">${label}</label><input class="input num" id="s-${name}" type="${type}" data-setting="${name}" value="${esc(val)}" ${extra}></div>`;

  return `
    <section class="card">
      <div class="card-head"><h2>Goal</h2><button class="btn sm ghost" data-action="open-goal">Edit goal</button></div>
      <div class="goal-summary">
        <div><div class="label">From</div><b>${fmtW(s.startWeight)} kg</b><div class="faint small">${fmtDate(s.startDate, { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
        <div class="arrow">→</div>
        <div><div class="label">To</div><b>${fmtW(s.targetWeight)} kg</b><div class="faint small">${fmtDate(s.targetDate, { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
      </div>
    </section>

    <section class="card">
      <h2 style="margin-bottom:12px">Daily targets</h2>
      <div class="settings-grid">
        ${f('kcal', 'Calories', 'text', s.kcal, 'inputmode="numeric"')}
        ${f('protein', 'Protein (g)', 'text', s.protein, 'inputmode="numeric"')}
        ${f('water', 'Water (glasses)', 'text', s.water, 'inputmode="numeric"')}
      </div>
    </section>

    <section class="card">
      <h2 style="margin-bottom:12px">Colour</h2>
      <div class="swatches">
        ${Object.entries(THEMES).map(([id, th]) => `
          <button class="swatch ${s.theme === id ? 'on' : ''}" data-action="theme" data-t="${id}" aria-label="${th.name}" aria-pressed="${s.theme === id}">
            <span style="background:${th.color}"></span>${th.name}
          </button>`).join('')}
      </div>
    </section>

    <section class="card">
      <div class="card-head"><h2>Where do you train?</h2></div>
      <div class="seg" style="width:100%;display:grid;grid-template-columns:1fr 1fr">
        <button class="${s.mode !== 'home' ? 'on' : ''}" data-action="mode" data-m="gym">Gym</button>
        <button class="${s.mode === 'home' ? 'on' : ''}" data-action="mode" data-m="home">Home</button>
      </div>
    </section>

    <section class="card stack">
      <h2>Backup</h2>
      <p class="small muted" style="margin:0">Your data lives only on this phone (${count} weigh-in${count === 1 ? '' : 's'} so far). Save a backup to Files every week or so.
      ${db.lastBackup ? `Last backup: <b>${fmtDate(db.lastBackup, { day: 'numeric', month: 'short', year: 'numeric' })}</b>.` : 'No backup yet.'}</p>
      <div class="grid2">
        <button class="btn" data-action="export">Back up</button>
        <button class="btn ghost" data-action="import">Restore</button>
      </div>
    </section>

    ${standalone ? '' : `
    <section class="card">
      <h2 style="margin-bottom:8px">Add to your iPhone Home Screen</h2>
      <ol class="steps">
        <li>Open this page in <b>Safari</b>.</li>
        <li>Tap the <b>Share</b> button.</li>
        <li>Choose <b>Add to Home Screen</b>, then <b>Add</b>.</li>
      </ol>
      <p class="note" style="margin:10px 0 0">Always open it from the Home Screen icon. Data saved there is kept separately from Safari.</p>
    </section>`}

    <section class="card stack">
      <h2>Reset</h2>
      <p class="small muted" style="margin:0">Deletes every weigh-in and log on this phone. Back up first.</p>
      <button class="btn danger" data-action="reset">Erase all data</button>
    </section>
    <p class="small faint" style="text-align:center">${esc(appName())} · works offline · no account</p>`;
}

/* ---------- Goal editor (bottom sheet) ---------- */
function goalSheet() {
  const s = db.settings;
  return `
    <div class="sheet-backdrop" data-action="close-sheet"></div>
    <form class="sheet" data-form="goal" role="dialog" aria-label="Edit goal">
      <div class="sheet-grip"></div>
      <div class="card-head"><h2>Your goal</h2><button type="button" class="btn sm ghost" data-action="close-sheet">Cancel</button></div>
      <div class="settings-grid">
        <div class="field"><label for="g-sw">Start weight (kg)</label><input class="input num" id="g-sw" name="sw" inputmode="decimal" value="${fmtW(s.startWeight)}"></div>
        <div class="field"><label for="g-tw">Goal weight (kg)</label><input class="input num" id="g-tw" name="tw" inputmode="decimal" value="${fmtW(s.targetWeight)}"></div>
        <div class="field"><label for="g-sd">Start date</label><input class="input num" id="g-sd" name="sd" type="date" value="${s.startDate}"></div>
        <div class="field"><label for="g-td">Goal date</label><input class="input num" id="g-td" name="td" type="date" value="${s.targetDate}"></div>
      </div>
      <div class="note" id="goal-pace" style="margin-top:12px"></div>
      <button type="button" class="btn sm ghost" style="margin-top:10px" data-action="suggest-date">Pick date for a lean 0.3 kg/week</button>
      <button type="submit" class="btn block" style="margin-top:14px">Save goal</button>
    </form>`;
}

function updatePace() {
  const form = $('[data-form="goal"]');
  const el = $('#goal-pace');
  if (!form || !el) return;
  const sw = num(form.sw.value), tw = num(form.tw.value), sd = form.sd.value, td = form.td.value;
  if (sw == null || tw == null || !sd || !td) { el.textContent = ''; return; }
  const weeks = diffDays(sd, td) / 7;
  const kg = tw - sw;
  if (kg <= 0) { el.innerHTML = 'Goal weight should be <b>higher</b> than your start weight.'; return; }
  if (weeks <= 0) { el.innerHTML = 'Goal date should be after the start date.'; return; }
  const rate = kg / weeks;
  const verdict = rate > 0.55 ? '⚠️ Too fast — expect a lot of fat gain.' : rate < 0.2 ? 'Very gradual — lean, but slow.' : '✓ A healthy, lean pace.';
  el.innerHTML = `<b>${f1(kg)} kg</b> in <b>${Math.round(weeks)} weeks</b> = <b>${rate.toFixed(2)} kg/week</b>. ${verdict}`;
}

/* =========================================================
   Render
   ========================================================= */
function applyBrand() {
  const s = db.settings;
  const theme = THEMES[s.theme] ? s.theme : 'indigo';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  document.title = appName();
  const meta = $('meta[name="apple-mobile-web-app-title"]');
  if (meta) meta.content = appName();
  $('#brand-target').textContent = fmtW(s.targetWeight);
}

function render() {
  const views = { home: viewHome, today: viewToday, plan: viewPlan, settings: viewSettings };
  $('#app').innerHTML = views[ui.tab]();
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === ui.tab));
  $('#topbar-date').textContent = fmtDate(todayKey(), { weekday: 'short', day: 'numeric', month: 'short' });
  applyBrand();
}

function openSheet() {
  $('#sheet').innerHTML = goalSheet();
  $('#sheet').classList.add('open');
  document.body.classList.add('locked');
  updatePace();
}
function closeSheet() {
  $('#sheet').classList.remove('open');
  $('#sheet').innerHTML = '';
  document.body.classList.remove('locked');
}

function go(tab) {
  ui.tab = tab;
  saveUi();
  render();
  window.scrollTo({ top: 0 });
}

/* =========================================================
   Actions
   ========================================================= */
document.querySelector('.tabbar').addEventListener('click', e => {
  const b = e.target.closest('button[data-tab]');
  if (!b) return;
  if (b.dataset.tab === 'today' && ui.tab !== 'today') ui.cur = todayKey();
  go(b.dataset.tab);
});

document.addEventListener('click', e => {
  const el = e.target.closest('#app [data-action], #sheet [data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const a = el.dataset.action;
  const k = ui.cur;

  switch (a) {
    case 'tab': ui.cur = todayKey(); go(el.dataset.tab); break;
    case 'wrange': ui.wRange = el.dataset.r; saveUi(); render(); break;
    case 'nmetric': ui.nMetric = el.dataset.m; saveUi(); render(); break;
    case 'goto-day': ui.cur = el.dataset.k; go('today'); break;
    case 'day': {
      const nk = addDays(k, +el.dataset.n);
      if (nk <= todayKey()) { ui.cur = nk; render(); }
      break;
    }
    case 'meal': {
      const d = dayOf(k, true);
      d.meals[el.dataset.id] = !d.meals[el.dataset.id];
      save(); render();
      break;
    }
    case 'catch': {
      const c = dayOf(k, true).catch[+el.dataset.i];
      if (c) { c.done = !c.done; save(); render(); }
      break;
    }
    case 'add-catch': {
      const snack = CATCHUP.find(c => c.id === el.dataset.id);
      const d = dayOf(k, true);
      if (snack && !d.catch.some(c => c.from === el.dataset.from)) {
        d.catch.push({ name: snack.name, kcal: snack.kcal, p: snack.p, from: el.dataset.from, done: false });
        save(); render(); toast('Added to today’s meals');
      }
      break;
    }
    case 'swap': dayOf(k, true).swap = el.dataset.type; save(); render(); toast('Make-up workout added to today'); break;
    case 'unswap': delete dayOf(k, true).swap; save(); render(); break;
    case 'del-extra': {
      dayOf(k, true).extras.splice(+el.dataset.i, 1);
      save(); render();
      break;
    }
    case 'water': {
      const d = dayOf(k, true);
      const i = +el.dataset.i;
      d.water = d.water === i + 1 ? i : i + 1; // tapping the last full glass empties it
      save(); render();
      break;
    }
    case 'ex': {
      const d = dayOf(k, true);
      const cur = d.ex[el.dataset.id] || {};
      d.ex[el.dataset.id] = { ...cur, done: !cur.done };
      save(); render();
      break;
    }
    case 'clear-weight':
      delete db.weights[k];
      save(); render(); toast('Weigh-in removed');
      break;
    case 'set-kcal':
      db.settings.kcal = +el.dataset.v;
      db.settings.kcalChangedAt = todayKey();
      save(); render(); toast(`Calorie target is now ${int(db.settings.kcal)}`);
      break;
    case 'open-goal': openSheet(); break;
    case 'close-sheet': closeSheet(); break;
    case 'suggest-date': {
      const form = $('[data-form="goal"]');
      const sw = num(form.sw.value), tw = num(form.tw.value);
      if (sw == null || tw == null || tw <= sw || !form.sd.value) { toast('Set start and goal weight first'); break; }
      form.td.value = addDays(form.sd.value, Math.ceil(((tw - sw) / 0.3) * 7));
      updatePace();
      break;
    }
    case 'plan-dow': ui.planDow = +el.dataset.d; render(); break;
    case 'mode': db.settings.mode = el.dataset.m; save(); render(); break;
    case 'theme': db.settings.theme = el.dataset.t; save(); render(); break;
    case 'export': exportData(); break;
    case 'import': $('#import-file').click(); break;
    case 'reset':
      if (confirm('Erase all weigh-ins and logs on this phone? This cannot be undone.')) {
        const theme = db.settings.theme;
        db = freshDb(); db.settings.theme = theme; save(); ui.cur = todayKey(); go('home'); toast('All data erased');
      }
      break;
  }
});

document.addEventListener('submit', e => {
  const form = e.target;
  if (!form.dataset.form) return;
  e.preventDefault();
  const k = ui.cur;
  if (form.dataset.form === 'weight') {
    const v = num(form.w.value);
    if (v == null || v < 30 || v > 250) { toast('Enter a weight in kg, e.g. 71.4'); return; }
    db.weights[k] = Math.round(v * 10) / 10;
    save(); render(); toast(`Saved ${f1(v)} kg`);
  }
  if (form.dataset.form === 'extra') {
    const name = form.name.value.trim();
    const kcal = num(form.kcal.value) ?? 0, p = num(form.p.value) ?? 0;
    if (!name && !kcal) { toast('Add a food name or calories'); return; }
    dayOf(k, true).extras.push({ name: name || 'Extra', kcal: Math.max(0, kcal), p: Math.max(0, p) });
    save(); render();
    setTimeout(() => $('[data-form="extra"] input[name="name"]')?.focus(), 0);
  }
  if (form.dataset.form === 'goal') {
    const sw = num(form.sw.value), tw = num(form.tw.value), sd = form.sd.value, td = form.td.value;
    if (sw == null || tw == null || sw < 30 || tw > 250) { toast('Enter weights in kg'); return; }
    if (tw <= sw) { toast('Goal weight must be higher than start weight'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sd) || !/^\d{4}-\d{2}-\d{2}$/.test(td) || td <= sd) { toast('Goal date must be after start date'); return; }
    Object.assign(db.settings, { startWeight: Math.round(sw * 10) / 10, targetWeight: Math.round(tw * 10) / 10, startDate: sd, targetDate: td });
    save(); closeSheet(); render(); toast(`Goal saved — ${appName()}`);
  }
});

document.addEventListener('input', e => {
  if (e.target.closest('[data-form="goal"]')) updatePace();
});

$('#app').addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.action === 'ex-val') {
    const d = dayOf(ui.cur, true);
    const cur = d.ex[el.dataset.id] || {};
    const v = el.value.trim() === '' ? '' : num(el.value);
    if (v === null) { toast('Numbers only'); el.value = cur.v ?? ''; return; }
    d.ex[el.dataset.id] = { ...cur, v, done: v !== '' ? true : cur.done };
    save();
    // Update in place (no re-render) so the keyboard stays up when moving to the next box
    const row = el.closest('.ex-item');
    row.classList.toggle('done', !!d.ex[el.dataset.id].done);
    row.querySelector('.ex-tick').setAttribute('aria-pressed', String(!!d.ex[el.dataset.id].done));
    return;
  }
  if (el.dataset.setting) {
    const key = el.dataset.setting;
    const s = db.settings;
    const limits = { kcal: [1000, 6000], protein: [20, 400], water: [1, 24] };
    const [lo, hi] = limits[key];
    const v = num(el.value);
    if (v == null || v < lo || v > hi) { toast(`Enter a value between ${lo} and ${hi}`); el.value = s[key]; return; }
    s[key] = Math.round(v);
    if (key === 'kcal') s.kcalChangedAt = todayKey();
    el.value = s[key];
    save(); toast('Saved');
  }
});

/* ---------- Backup / restore ---------- */
async function exportData() {
  const name = `road-to-${fmtW(db.settings.targetWeight)}-backup-${todayKey()}.json`;
  const stamp = () => { db.lastBackup = todayKey(); save(); render(); };
  const json = JSON.stringify({ ...db, lastBackup: todayKey() }, null, 2);
  const file = new File([json], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `${appName()} backup` });
      stamp(); toast('Backup saved');
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  stamp(); toast('Backup downloaded');
}

$('#import-file').addEventListener('change', e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== 'object' || !data.settings || !data.weights || !data.days) throw new Error('bad');
      const n = Object.keys(data.weights).length;
      if (!confirm(`Restore this backup (${n} weigh-ins)? It replaces what's on this phone now.`)) return;
      db = merge(data); save(); ui.cur = todayKey(); go('home'); toast('Backup restored');
    } catch (err) {
      toast('That file isn’t a tracker backup');
    }
  };
  reader.readAsText(file);
});

/* ---------- Keep "today" fresh when the app is reopened next day ---------- */
let lastSeenDay = todayKey();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && todayKey() !== lastSeenDay) {
    if (ui.cur === lastSeenDay) ui.cur = todayKey();
    lastSeenDay = todayKey();
    render();
  }
});

/* ---------- Boot ---------- */
render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
// Ask the browser not to evict our data under storage pressure
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
