import { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: '#080808',
  bgCard: '#0f0f0f',
  bgInput: '#111111',
  border: '#2a1a1a',
  crimson: '#8B1A1A',
  crimsonBright: '#c0392b',
  gold: '#C9A84C',
  goldDim: '#8a6d24',
  white: '#e8e8e8',
  green: '#2ecc71',
  red: '#e74c3c',
  yellow: '#f39c12',
  gray: '#444',
};

// ─── SHARED STYLE OBJECTS ─────────────────────────────────────────────────────
const STYLES = {
  app: {
    minHeight: '100vh',
    background: C.bg,
    color: C.gold,
    fontFamily: "'Share Tech Mono', monospace",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#0a0000',
    borderBottom: `2px solid ${C.crimson}`,
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
  },
  headerTitle: {
    fontSize: 'clamp(18px, 4vw, 26px)',
    color: C.gold,
    letterSpacing: '4px',
    textShadow: `0 0 12px ${C.goldDim}`,
    fontWeight: 'normal',
  },
  countdown: {
    fontSize: 'clamp(11px, 2.5vw, 14px)',
    color: C.crimsonBright,
    letterSpacing: '2px',
    border: `1px solid ${C.crimson}`,
    padding: '4px 10px',
    background: '#1a0000',
  },
  tabBar: {
    display: 'flex',
    borderBottom: `2px solid ${C.crimson}`,
    background: '#0a0000',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    flexShrink: 0,
  },
  tab: (active) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    color: active ? C.gold : C.goldDim,
    background: active ? '#1a0000' : 'transparent',
    border: 'none',
    borderBottom: active ? `3px solid ${C.gold}` : '3px solid transparent',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 'clamp(10px, 2.5vw, 13px)',
    letterSpacing: '2px',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    transition: 'all 0.2s',
  }),
  content: {
    flex: 1,
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
  },
  card: {
    background: C.bgCard,
    border: `1px solid ${C.crimson}`,
    padding: '16px',
    marginBottom: '16px',
  },
  btn: (color) => ({
    padding: '10px 20px',
    background: 'transparent',
    border: `1px solid ${color || C.crimson}`,
    color: color || C.crimson,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    letterSpacing: '2px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'all 0.15s',
  }),
  btnActive: (color) => ({
    padding: '10px 20px',
    background: color || C.crimson,
    border: `1px solid ${color || C.crimson}`,
    color: C.bg,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    letterSpacing: '2px',
    cursor: 'pointer',
    minHeight: '44px',
  }),
  input: {
    background: C.bgInput,
    border: `1px solid ${C.crimson}`,
    color: C.gold,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '13px',
    padding: '8px',
    width: '100%',
  },
  label: {
    fontSize: '11px',
    letterSpacing: '2px',
    color: C.goldDim,
    display: 'block',
    marginBottom: '4px',
  },
  sectionTitle: {
    fontSize: '13px',
    letterSpacing: '3px',
    color: C.crimsonBright,
    borderBottom: `1px solid ${C.crimson}`,
    paddingBottom: '6px',
    marginBottom: '14px',
    textTransform: 'uppercase',
  },
};

// ─── FLASHCARD DATA — 30 cards of VMI knowledge ───────────────────────────────
const CARDS = [
  { id: 1, q: 'Who is the Superintendent of VMI?', a: 'General Wins Arbuckle' },
  { id: 2, q: 'What is the VMI Honor Code?', a: 'A cadet will not lie, cheat, steal, nor tolerate those who do.' },
  { id: 3, q: 'What year was VMI founded?', a: '1839' },
  { id: 4, q: 'What is the Rat Bible also known as?', a: 'The Bullet — the official Rat handbook.' },
  { id: 5, q: "What is VMI's nickname?", a: 'The West Point of the South' },
  { id: 6, q: 'Who is the Commandant of Cadets?', a: 'Brigadier General Wayne Feather' },
  { id: 7, q: 'What does "Rat" refer to at VMI?', a: 'A first-year cadet — the lowest rank in the Corps.' },
  { id: 8, q: "What is VMI's motto?", a: '"I Would Rather Die Than Be Dishonored"' },
  { id: 9, q: 'What is the Rat Line?', a: 'The first-semester initiation system for new cadets (Rats).' },
  { id: 10, q: "What is VMI's school song?", a: '"Sons of VMI"' },
  { id: 11, q: 'What is Matriculation Day?', a: 'The day Rats officially join the Corps — typically mid-August.' },
  { id: 12, q: 'What does BDU stand for?', a: 'Battle Dress Uniform' },
  { id: 13, q: 'What is the rank of a 4th classman (Rat)?', a: 'Private — no rank insignia.' },
  { id: 14, q: 'What is "Breakout" at VMI?', a: 'The ceremony ending the Rat Line — typically in March — where Rats become full members of the Corps.' },
  { id: 15, q: 'How many companies are in the Corps of Cadets?', a: '15 companies — Alpha through Oscar.' },
  { id: 16, q: 'What is a "Dyke" at VMI?', a: 'An upperclassman assigned to mentor and guide a specific Rat.' },
  { id: 17, q: 'What is the chain of command above Rats at VMI?', a: '1st Class (Cadre/Seniors) → 2nd Class → 3rd Class → Rats (4th Class).' },
  { id: 18, q: 'What is "OPORD" short for?', a: 'Operations Order — a structured military briefing format.' },
  { id: 19, q: 'Phonetic alphabet: A, B, C, D, E, F', a: 'Alpha, Bravo, Charlie, Delta, Echo, Foxtrot' },
  { id: 20, q: 'Phonetic alphabet: G, H, I, J, K, L', a: 'Golf, Hotel, India, Juliet, Kilo, Lima' },
  { id: 21, q: 'Phonetic alphabet: M, N, O, P, Q, R', a: 'Mike, November, Oscar, Papa, Quebec, Romeo' },
  { id: 22, q: 'Phonetic alphabet: S, T, U, V, W, X, Y, Z', a: 'Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu' },
  { id: 23, q: 'What is the ASVAB?', a: 'Armed Services Vocational Aptitude Battery — used to determine military job eligibility.' },
  { id: 24, q: "What is VMI's location?", a: 'Lexington, Virginia — in the Shenandoah Valley.' },
  { id: 25, q: 'What is "Dress Parade"?', a: 'A formal formation where the full Corps marches in review in full dress uniform.' },
  { id: 26, q: 'What is "Stoops" at VMI?', a: 'The stoops (walkways/porticoes) of the barracks — a central social and command space.' },
  { id: 27, q: 'Define LDRSHIP (Army Values)', a: 'Loyalty, Duty, Respect, Selfless Service, Honor, Integrity, Personal Courage.' },
  { id: 28, q: "What is the name of VMI's barracks?", a: 'New Barracks and Old Barracks (The Barracks).' },
  { id: 29, q: 'Famous VMI alumnus who also taught there?', a: 'Stonewall Jackson — taught at VMI before the Civil War.' },
  { id: 30, q: 'What does "at ease" mean in military context?', a: 'Relax from attention but remain quiet and in place.' },
];

// ─── ACADEMIC DOMAINS DATA ────────────────────────────────────────────────────
const ACADEMIC_DOMAINS = [
  {
    id: 'math',
    title: 'MATHEMATICS',
    icon: '∑',
    subtopics: [
      { name: 'Calculus I — Limits & Derivatives', note: "Review chain rule, product/quotient rules, L'Hopital." },
      { name: 'Calculus I — Integrals', note: 'u-substitution, definite integrals, FTC.' },
      { name: 'Precalculus / Trig', note: 'Unit circle, trig identities, inverse functions.' },
      { name: 'Statistics Basics', note: 'Mean, median, mode, standard deviation, probability.' },
      { name: 'Linear Algebra Intro', note: 'Matrix operations, determinants, systems of equations.' },
    ],
  },
  {
    id: 'english',
    title: 'ENGLISH / COMPOSITION',
    icon: '✍',
    subtopics: [
      { name: 'Argument & Thesis Construction', note: 'Strong thesis = claim + reason. Practice MCAT-style passages.' },
      { name: 'Grammar & Mechanics', note: 'Semicolons, comma splices, parallel structure.' },
      { name: 'Technical / Military Writing', note: 'Concise active-voice sentences. No jargon without definition.' },
      { name: 'Research & Citation (MLA/APA)', note: 'MLA for humanities; APA common in sciences.' },
    ],
  },
  {
    id: 'history',
    title: 'AMERICAN / MILITARY HISTORY',
    icon: '⚑',
    subtopics: [
      { name: 'Civil War — VMI Context', note: 'Battle of New Market (May 15, 1864), VMI cadets as combatants.' },
      { name: 'World War II Overview', note: 'Key theaters, turning points, Marshall Plan aftermath.' },
      { name: 'Constitutional Foundations', note: 'Articles, Amendments 1-10 (Bill of Rights), separation of powers.' },
      { name: 'Military History & Doctrine', note: 'Sun Tzu, Clausewitz basics, AirLand Battle doctrine.' },
    ],
  },
  {
    id: 'science',
    title: 'SCIENCE',
    icon: '⚗',
    subtopics: [
      { name: 'General Chemistry', note: 'Stoichiometry, molarity, acid-base equilibria, periodic trends.' },
      { name: 'Physics — Mechanics', note: "Newton's laws, kinematics, work-energy theorem." },
      { name: 'Physics — E&M Basics', note: "Coulomb's law, circuits (Ohm's), magnetic fields." },
      { name: 'Biology Fundamentals', note: 'Cell structure, genetics basics, evolution overview.' },
    ],
  },
  {
    id: 'language',
    title: 'FOREIGN LANGUAGE',
    icon: '◎',
    subtopics: [
      { name: 'Spanish — Conversational', note: 'Present/past/future conjugations, common military vocab.' },
      { name: 'Arabic / Farsi — Orientation', note: 'Script basics, key phrases — high value for officers.' },
      { name: 'DLAB Prep', note: 'Defense Language Aptitude Battery — logic, pattern recognition.' },
    ],
  },
  {
    id: 'leadership',
    title: 'LEADERSHIP & ETHICS',
    icon: '◈',
    subtopics: [
      { name: 'Army Leadership (ADP 6-22)', note: 'Be, Know, Do model. LDRSHIP values.' },
      { name: 'Ethics — Just War Theory', note: 'Jus ad bellum, jus in bello. LOAC basics.' },
      { name: 'Critical Thinking & Decision Making', note: 'OODA Loop (Observe, Orient, Decide, Act).' },
      { name: 'VMI Honor Court Process', note: 'How violations are reported, investigated, adjudicated.' },
    ],
  },
];

// ─── ADMIN CHECKLIST DATA ─────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 'med1', group: 'MEDICAL', label: 'Complete DoDMERB physical exam' },
  { id: 'med2', group: 'MEDICAL', label: 'Gather vaccination records & ensure up to date' },
  { id: 'med3', group: 'MEDICAL', label: 'Dental clearance completed' },
  { id: 'med4', group: 'MEDICAL', label: 'Vision/glasses/contacts prescription on file' },
  { id: 'med5', group: 'MEDICAL', label: 'Prescription medications — 90-day supply + plan' },
  { id: 'doc1', group: 'DOCUMENTS', label: 'Official transcripts submitted to VMI admissions' },
  { id: 'doc2', group: 'DOCUMENTS', label: 'SAT/ACT scores sent to VMI' },
  { id: 'doc3', group: 'DOCUMENTS', label: 'Birth certificate (certified copy)' },
  { id: 'doc4', group: 'DOCUMENTS', label: 'Social Security card — location known, copy on file' },
  { id: 'doc5', group: 'DOCUMENTS', label: 'FAFSA completed / financial aid confirmed' },
  { id: 'doc6', group: 'DOCUMENTS', label: 'ROTC scholarship paperwork finalized' },
  { id: 'gear1', group: 'GEAR', label: 'VMI-issued gear list reviewed — do NOT buy ahead' },
  { id: 'gear2', group: 'GEAR', label: 'Running shoes (plain white, low-profile) ready' },
  { id: 'gear3', group: 'GEAR', label: 'Personal hygiene supplies — unscented, military-compliant' },
  { id: 'gear4', group: 'GEAR', label: 'Laundry supplies (no-fragrance) packed' },
  { id: 'gear5', group: 'GEAR', label: 'Laptop purchased / charged / updated' },
  { id: 'mp1', group: 'MENTAL PREP', label: 'Read the Rat Bible at least twice' },
  { id: 'mp2', group: 'MENTAL PREP', label: 'Memorize Chain of Command (Supe to Commandant to 1st Class)' },
  { id: 'mp3', group: 'MENTAL PREP', label: 'Memorize VMI Honor Code word for word' },
  { id: 'mp4', group: 'MENTAL PREP', label: 'Phonetic alphabet memorized cold' },
  { id: 'mp5', group: 'MENTAL PREP', label: 'Research your dyke — contact made if possible' },
  { id: 'fam1', group: 'FAMILY LOGISTICS', label: 'Family Drop-off Day logistics confirmed (Aug 13)' },
  { id: 'fam2', group: 'FAMILY LOGISTICS', label: 'Family contact expectations set — limited contact Rat year' },
  { id: 'fam3', group: 'FAMILY LOGISTICS', label: 'Banking / financial account setup (Cadet Canteen)' },
  { id: 'fam4', group: 'FAMILY LOGISTICS', label: 'USPS mail address for barracks obtained' },
  { id: 'fam5', group: 'FAMILY LOGISTICS', label: 'Emergency contact info registered with VMI' },
];

// ─── PT EVENT DATA ────────────────────────────────────────────────────────────
const PT_EVENTS = [
  { id: 'pushups',  label: 'PUSH-UPS (2 MIN)',  min: 42,     max: 71,     unit: 'reps',  lowerIsBetter: false },
  { id: 'situps',   label: 'SIT-UPS (2 MIN)',   min: 53,     max: 78,     unit: 'reps',  lowerIsBetter: false },
  { id: 'run2',     label: '2-MILE RUN',         min: '15:54', max: '13:00', unit: 'mm:ss', lowerIsBetter: true  },
  { id: 'pullups',  label: 'PULL-UPS',           min: 6,      max: 15,     unit: 'reps',  lowerIsBetter: false },
  { id: 'run1',     label: '1-MILE RUN',          min: '7:30', max: '6:00', unit: 'mm:ss', lowerIsBetter: true  },
];

// ─── PT HELPERS ───────────────────────────────────────────────────────────────

const parseTime = (val) => {
  if (!val || !String(val).includes(':')) return null;
  const [m, s] = String(val).split(':').map(Number);
  if (isNaN(m) || isNaN(s)) return null;
  return m * 60 + s;
};

const getPTStatus = (event, value) => {
  if (value === '' || value === null || value === undefined) return null;
  if (event.lowerIsBetter) {
    const val = parseTime(value);
    const minSec = parseTime(event.min);
    const maxSec = parseTime(event.max);
    if (val === null) return null;
    if (val > minSec) return 'BELOW STANDARD';
    if (val <= maxSec) return 'ABOVE STANDARD';
    return 'MEETS STANDARD';
  } else {
    const val = parseFloat(value);
    if (isNaN(val)) return null;
    if (val < event.min) return 'BELOW STANDARD';
    if (val >= event.max) return 'ABOVE STANDARD';
    return 'MEETS STANDARD';
  }
};

const getPTPercent = (event, value) => {
  if (value === '' || value === null || value === undefined) return 0;
  if (event.lowerIsBetter) {
    const val = parseTime(value);
    const minSec = parseTime(event.min);
    const maxSec = parseTime(event.max);
    if (val === null) return 0;
    const clamped = Math.max(maxSec, Math.min(minSec, val));
    return Math.round(((minSec - clamped) / (minSec - maxSec)) * 100);
  } else {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    const clamped = Math.max(0, Math.min(event.max, val));
    return Math.round((clamped / event.max) * 100);
  }
};

const STATUS_COLOR = {
  'BELOW STANDARD': C.red,
  'MEETS STANDARD': C.yellow,
  'ABOVE STANDARD': C.green,
};

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
const useCountdown = () => {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const target = new Date('2025-08-13T00:00:00');
    const tick = () => {
      const diff = target - new Date();
      setDays(diff > 0 ? Math.ceil(diff / 86400000) : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return days;
};

// ─── TAB 1: RAT DRILL ─────────────────────────────────────────────────────────
const RatDrill = () => {
  const [mastery, setMastery] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vmi_mastery_state') || '{}'); }
    catch { return {}; }
  });
  const [filter, setFilter] = useState('ALL');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem('vmi_mastery_state', JSON.stringify(mastery));
  }, [mastery]);

  const filteredCards = useMemo(() => {
    if (filter === 'ALL') return CARDS;
    if (filter === 'UNSEEN') return CARDS.filter(c => !mastery[c.id]);
    if (filter === 'MISSED') return CARDS.filter(c => mastery[c.id] === 'missed');
    if (filter === 'KNOWN') return CARDS.filter(c => mastery[c.id] === 'known');
    return CARDS;
  }, [filter, mastery]);

  const scores = useMemo(() => ({
    known: CARDS.filter(c => mastery[c.id] === 'known').length,
    missed: CARDS.filter(c => mastery[c.id] === 'missed').length,
    unseen: CARDS.filter(c => !mastery[c.id]).length,
  }), [mastery]);

  const currentCard = filteredCards[index] || null;

  const safeIndex = useCallback((newIdx, len) => {
    if (len === 0) return;
    setIndex(((newIdx % len) + len) % len);
    setFlipped(false);
  }, []);

  const handlePrev = useCallback(() => safeIndex(index - 1, filteredCards.length), [index, filteredCards.length, safeIndex]);
  const handleNext = useCallback(() => safeIndex(index + 1, filteredCards.length), [index, filteredCards.length, safeIndex]);
  const handleFlip = useCallback(() => setFlipped(f => !f), []);

  const handleMark = useCallback((result) => {
    if (!currentCard) return;
    setMastery(prev => ({ ...prev, [currentCard.id]: result }));
    setFlipped(false);
    setIndex(prev => {
      const nextLen = filteredCards.length;
      return nextLen > 1 ? ((prev + 1) % nextLen) : 0;
    });
  }, [currentCard, filteredCards.length]);

  const handleReset = useCallback(() => {
    setMastery({});
    setIndex(0);
    setFlipped(false);
    setFilter('ALL');
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === ' ') { e.preventDefault(); handleFlip(); }
      else if (e.key === 'k' || e.key === 'K') handleMark('known');
      else if (e.key === 'm' || e.key === 'M') handleMark('missed');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePrev, handleNext, handleFlip, handleMark]);

  useEffect(() => { setIndex(0); setFlipped(false); }, [filter]);

  const FILTERS = [
    { key: 'ALL', label: 'ALL' },
    { key: 'UNSEEN', label: 'UNSEEN' },
    { key: 'MISSED', label: 'MISSED ONLY' },
    { key: 'KNOWN', label: 'KNOWN' },
  ];

  return (
    <div>
      {/* Scoreboard */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: C.green, fontSize: '12px', letterSpacing: '1px' }}>KNOWN: {scores.known}</span>
        <span style={{ color: C.red, fontSize: '12px', letterSpacing: '1px' }}>MISSED: {scores.missed}</span>
        <span style={{ color: C.goldDim, fontSize: '12px', letterSpacing: '1px' }}>UNSEEN: {scores.unseen}</span>
        <span style={{ color: C.gray, fontSize: '12px', letterSpacing: '1px' }}>/ {CARDS.length}</span>
      </div>

      {/* Filter + Reset */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={filter === f.key ? STYLES.btnActive(C.crimson) : STYLES.btn(C.crimson)}>
            {f.label}
          </button>
        ))}
        <button onClick={handleReset} style={STYLES.btn(C.goldDim)}>
          <RotateCcw size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />RESET SESSION
        </button>
      </div>

      {filteredCards.length > 0 && (
        <div style={{ fontSize: '11px', color: C.goldDim, marginBottom: '10px', letterSpacing: '2px' }}>
          CARD {index + 1} / {filteredCards.length}
        </div>
      )}

      {/* 3D Flip card */}
      {currentCard ? (
        <div onClick={handleFlip} style={{ perspective: '1000px', cursor: 'pointer', marginBottom: '20px' }}>
          <div style={{
            position: 'relative',
            minHeight: '200px',
            width: '100%',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.45s ease',
          }}>
            {/* Front */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: '#0f0000',
              border: `1px solid ${C.crimson}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px', minHeight: '200px',
            }}>
              <div style={{ fontSize: '10px', color: C.crimsonBright, letterSpacing: '3px', marginBottom: '16px' }}>
                QUESTION — TAP OR PRESS SPACE TO FLIP
              </div>
              <div style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: C.gold, textAlign: 'center', lineHeight: 1.6 }}>
                {currentCard.q}
              </div>
            </div>
            {/* Back */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#001a00',
              border: `1px solid ${C.green}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px', minHeight: '200px',
            }}>
              <div style={{ fontSize: '10px', color: C.green, letterSpacing: '3px', marginBottom: '16px' }}>
                ANSWER
              </div>
              <div style={{ fontSize: 'clamp(13px, 2.8vw, 16px)', color: C.white, textAlign: 'center', lineHeight: 1.6 }}>
                {currentCard.a}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...STYLES.card, textAlign: 'center', padding: '40px', color: C.goldDim }}>
          NO CARDS IN THIS FILTER
        </div>
      )}

      {/* Mark buttons after flip */}
      {flipped && currentCard && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={(e) => { e.stopPropagation(); handleMark('known'); }}
            style={STYLES.btnActive(C.green)}>
            ✓ GOT IT [K]
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleMark('missed'); }}
            style={STYLES.btnActive(C.red)}>
            ✗ MISSED IT [M]
          </button>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={handlePrev} style={STYLES.btn(C.goldDim)}>◀ PREV</button>
        <button onClick={handleFlip} style={STYLES.btn(C.gold)}>FLIP [SPACE]</button>
        <button onClick={handleNext} style={STYLES.btn(C.goldDim)}>NEXT ▶</button>
      </div>

      {/* Shortcut legend */}
      <div style={{ marginTop: '20px', padding: '10px 14px', border: `1px solid ${C.border}`, fontSize: '11px', color: C.gray, lineHeight: 2 }}>
        <span style={{ color: C.goldDim }}>KEYBOARD:</span>{' '}
        ◀ / ▶ NAVIGATE &nbsp;|&nbsp; SPACE FLIP &nbsp;|&nbsp; K GOT IT &nbsp;|&nbsp; M MISSED IT
      </div>
    </div>
  );
};

// ─── TAB 2: ACADEMIC MAP ──────────────────────────────────────────────────────
const AcademicMap = () => {
  const [open, setOpen] = useState({});

  const toggle = useCallback((id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div>
      <div style={STYLES.sectionTitle}>ACADEMIC PREPARATION DOMAINS</div>
      {ACADEMIC_DOMAINS.map(domain => (
        <div key={domain.id} style={{ marginBottom: '8px' }}>
          <button
            onClick={() => toggle(domain.id)}
            style={{
              width: '100%', textAlign: 'left', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              background: open[domain.id] ? '#1a0000' : C.bgCard,
              border: `1px solid ${open[domain.id] ? C.gold : C.crimson}`,
              color: open[domain.id] ? C.gold : C.goldDim,
              padding: '14px 16px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '13px', letterSpacing: '2px', cursor: 'pointer',
              minHeight: '44px', transition: 'all 0.2s',
            }}
          >
            <span>{domain.icon} &nbsp;{domain.title}</span>
            {open[domain.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <div style={{
            overflow: 'hidden',
            maxHeight: open[domain.id] ? '600px' : '0px',
            transition: 'max-height 0.35s ease',
          }}>
            <div style={{
              background: '#0a0000',
              border: `1px solid ${C.crimson}`,
              borderTop: 'none',
              padding: '12px 16px',
            }}>
              {domain.subtopics.map((sub, i) => (
                <div key={i} style={{
                  padding: '10px 0',
                  borderBottom: i < domain.subtopics.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div style={{ color: C.gold, fontSize: '12px', letterSpacing: '1px', marginBottom: '4px' }}>
                    ▸ {sub.name}
                  </div>
                  <div style={{ color: C.gray, fontSize: '11px', lineHeight: 1.6 }}>
                    {sub.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── TAB 3: ADMIN TRACK ───────────────────────────────────────────────────────

/** SVG donut progress ring — pure SVG, no library */
const DonutRing = ({ percent }) => {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`${percent}% complete`}>
      <circle cx="55" cy="55" r={r} fill="none" stroke={C.border} strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke={percent === 100 ? C.green : C.gold}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x="55" y="61" textAnchor="middle"
        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '16px', fill: C.gold, dominantBaseline: 'middle' }}>
        {percent}%
      </text>
    </svg>
  );
};

const AdminTrack = () => {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vmi_checklist_state') || '{}'); }
    catch { return {}; }
  });
  const [saved, setSaved] = useState(false);

  const toggle = useCallback((id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('vmi_checklist_state', JSON.stringify(next));
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, []);

  const percent = useMemo(() => {
    const done = CHECKLIST_ITEMS.filter(i => checked[i.id]).length;
    return Math.round((done / CHECKLIST_ITEMS.length) * 100);
  }, [checked]);

  const groups = useMemo(() => CHECKLIST_ITEMS.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {}), []);

  return (
    <div>
      {/* Progress ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <DonutRing percent={percent} />
        <div>
          <div style={{ fontSize: '13px', letterSpacing: '2px', color: C.goldDim }}>
            {CHECKLIST_ITEMS.filter(i => checked[i.id]).length} / {CHECKLIST_ITEMS.length} COMPLETE
          </div>
          <div style={{
            marginTop: '8px', fontSize: '11px', letterSpacing: '2px',
            color: saved ? C.green : 'transparent',
            transition: 'color 0.3s',
          }}>
            ● SAVED
          </div>
        </div>
      </div>

      {/* Grouped checklist */}
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} style={{ marginBottom: '20px' }}>
          <div style={STYLES.sectionTitle}>{group}</div>
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              role="checkbox"
              aria-checked={!!checked[item.id]}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? toggle(item.id) : null}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', cursor: 'pointer',
                background: checked[item.id] ? '#001500' : C.bgCard,
                border: `1px solid ${checked[item.id] ? C.green : C.border}`,
                marginBottom: '6px',
                transition: 'all 0.2s', minHeight: '44px',
              }}
            >
              <div style={{
                width: '18px', height: '18px', flexShrink: 0,
                border: `1px solid ${checked[item.id] ? C.green : C.crimson}`,
                background: checked[item.id] ? C.green : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: C.bg,
              }}>
                {checked[item.id] ? '✓' : ''}
              </div>
              <span style={{
                fontSize: '12px', letterSpacing: '1px',
                color: checked[item.id] ? C.green : C.gold,
                textDecoration: checked[item.id] ? 'line-through' : 'none',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── TAB 4: PT STANDARDS ──────────────────────────────────────────────────────
const PTStandards = () => {
  const [prs, setPrs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vmi_pt_prs') || '{}'); }
    catch { return {}; }
  });
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vmi_pt_log') || '{}'); }
    catch { return {}; }
  });

  const updatePR = useCallback((id, val) => {
    setPrs(prev => {
      const next = { ...prev, [id]: val };
      localStorage.setItem('vmi_pt_prs', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateLog = useCallback((id, val) => {
    setLogs(prev => {
      const next = { ...prev, [id]: val };
      localStorage.setItem('vmi_pt_log', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <div>
      <div style={STYLES.sectionTitle}>PT STANDARDS — MALE 17-21 VMI/ROTC BASELINE</div>
      {PT_EVENTS.map(event => {
        const val = prs[event.id] !== undefined ? prs[event.id] : '';
        const status = getPTStatus(event, val);
        const pct = getPTPercent(event, val);
        const barColor = status ? STATUS_COLOR[status] : C.gray;

        return (
          <div key={event.id} style={STYLES.card}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '13px', letterSpacing: '2px', color: C.gold }}>{event.label}</div>
              {status && (
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: STATUS_COLOR[status], border: `1px solid ${STATUS_COLOR[status]}`, padding: '2px 8px' }}>
                  {status}
                </div>
              )}
            </div>

            {/* Standard range */}
            <div style={{ fontSize: '11px', color: C.gray, marginBottom: '10px', letterSpacing: '1px' }}>
              MIN: {event.min}{event.unit !== 'mm:ss' ? ` ${event.unit}` : ''} &nbsp;|&nbsp;
              MAX: {event.max}{event.unit !== 'mm:ss' ? ` ${event.unit}` : ''}
              {event.lowerIsBetter ? ' (lower is better)' : ''}
            </div>

            {/* Input */}
            <div style={{ marginBottom: '10px' }}>
              <span style={STYLES.label}>YOUR PR ({event.unit})</span>
              <input
                type={event.lowerIsBetter ? 'text' : 'number'}
                placeholder={event.lowerIsBetter ? 'e.g. 13:45' : '0'}
                value={val}
                onChange={e => updatePR(event.id, e.target.value)}
                style={{ ...STYLES.input, width: '160px' }}
              />
            </div>

            {/* Status bar */}
            <div style={{ background: '#1a1a1a', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: barColor,
                transition: 'width 0.4s ease, background 0.3s',
                borderRadius: '4px',
              }} />
            </div>

            {/* Training log */}
            <span style={STYLES.label}>TRAINING LOG</span>
            <textarea
              rows={3}
              placeholder="Last workout, notes, result..."
              value={logs[event.id] || ''}
              onChange={e => updateLog(event.id, e.target.value)}
              style={{ ...STYLES.input, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'drill',    label: '◈ RAT DRILL'    },
  { id: 'academic', label: '◈ ACADEMIC MAP' },
  { id: 'admin',    label: '◈ ADMIN TRACK'  },
  { id: 'pt',       label: '◈ PT STANDARDS' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('drill');
  const days = useCountdown();

  const handleTab = useCallback((id) => setActiveTab(id), []);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'drill':    return <RatDrill />;
      case 'academic': return <AcademicMap />;
      case 'admin':    return <AdminTrack />;
      case 'pt':       return <PTStandards />;
      default:         return null;
    }
  }, [activeTab]);

  return (
    <div style={STYLES.app}>
      <header style={STYLES.header}>
        <div style={STYLES.headerTitle}>⚑ VMI RAT PREP</div>
        <div style={STYLES.countdown}>
          {days > 0 ? `${days} DAYS UNTIL MATRICULATION` : 'MATRICULATION DAY'}
        </div>
      </header>

      <nav style={STYLES.tabBar}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => handleTab(tab.id)}
            style={STYLES.tab(activeTab === tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={STYLES.content}>
        {tabContent}
      </main>
    </div>
  );
}
