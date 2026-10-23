import { Fragment, useEffect, useId, useState } from "react";
import { CONFIG as C } from "./config.js";

const enc = encodeURIComponent;
const names = `${C.partner1} & ${C.partner2}`;

// Each event is an all-day entry; dates come from config as YYYY-MM-DD
const toDate = (iso) => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const fmt = (d, opts) => d.toLocaleDateString("en-GB", opts);
const ymd = (d) => fmt(d, { year: "numeric" }) + String(d.getMonth() + 1).padStart(2, "0") +
  String(d.getDate()).padStart(2, "0");

const EVENTS = C.events.map((e) => {
  const date = toDate(e.date);
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const where = e.address || e.place;
  return {
    ...e,
    date,
    mapUrl: e.mapLink || "https://www.google.com/maps/search/?api=1&query=" + enc(where),
    calUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${enc(names + "’s wedding, " + e.place)}&dates=${ymd(date)}/${ymd(next)}` +
      `&location=${enc(where)}` +
      `&details=${enc("Invitation to " + names + "’s wedding at the " + e.host.toLowerCase() + ".")}`,
  };
});

function Sprig() {
  return (
    <svg className="sprig" viewBox="0 0 92 120" fill="none" aria-hidden="true">
      <path d="M46 118V42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <g fill="currentColor" opacity=".85">
        <ellipse cx="34" cy="96" rx="12" ry="5" transform="rotate(-35 34 96)" />
        <ellipse cx="58" cy="84" rx="12" ry="5" transform="rotate(35 58 84)" />
        <ellipse cx="33" cy="72" rx="11" ry="4.5" transform="rotate(-35 33 72)" />
        <ellipse cx="59" cy="60" rx="11" ry="4.5" transform="rotate(35 59 60)" />
      </g>
      <g className="bloom" fill="currentColor" opacity=".9">
        <circle cx="46" cy="14" r="8" /><circle cx="58" cy="23" r="8" /><circle cx="53" cy="37" r="8" />
        <circle cx="39" cy="37" r="8" /><circle cx="34" cy="23" r="8" />
      </g>
      <circle cx="46" cy="26" r="5" fill="var(--paper)" />
    </svg>
  );
}

/* ---------- Cover: gatefold doors tied with a ribbon ---------- */
const SKIN = "#C68A64";
const HAIR = "#2E1F26";
const WINE = "#8A4051";
const GOLD = "#C29A55";
// Dimasa wedding attire
const WHITE = "#FBF8F2";
const LINEN = "#DCD2C0";
const RED = "#C24545";
const YELLOW = "#E6B84A";
const GREEN = "#7E9F4E";
const ORANGE = "#DD8440";
const DARK = "#3A2630";
const VEIL = "#D24E4E";

function Flower({ x, y, r = 8, c = "var(--rose)" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} r={r * 0.55} fill={c}
          cx={Math.sin((a * Math.PI) / 180) * r * 0.55}
          cy={-Math.cos((a * Math.PI) / 180) * r * 0.55} />
      ))}
      <circle r={r * 0.3} fill={GOLD} />
    </g>
  );
}

function Bloom({ x, y, r = 9 }) {
  return (
    <g>
      <ellipse cx={x - r * 1.1} cy={y + r * 0.5} rx={r * 0.9} ry={r * 0.38}
        fill="var(--sage)" transform={`rotate(-30 ${x - r * 1.1} ${y + r * 0.5})`} />
      <ellipse cx={x + r * 1.1} cy={y + r * 0.5} rx={r * 0.9} ry={r * 0.38}
        fill="var(--sage)" transform={`rotate(30 ${x + r * 1.1} ${y + r * 0.5})`} />
      <Flower x={x - r * 0.9} y={y + r * 0.2} r={r * 0.62} c="#E3A9AE" />
      <Flower x={x + r * 0.9} y={y + r * 0.2} r={r * 0.62} c="#E3A9AE" />
      <Flower x={x} y={y} r={r} />
    </g>
  );
}

// Marigold string hanging from the arch
function Toran({ x, y, n }) {
  return (
    <g>
      <path d={`M${x} ${y}V${y + n * 8}`} stroke={GOLD} strokeWidth=".8" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x} cy={y + 6 + i * 8} r="3.2" fill={i % 2 ? "#E0A64F" : "#D98C3F"} />
      ))}
      <Flower x={x} y={y + n * 8 + 6} r={5} />
    </g>
  );
}

// Bride and groom in Dimasa wedding attire; `children` is the arm that changes per scene
// Skirt bands from waist to hem: [top, height, colour]
const SKIRT_BANDS = [
  [236, 14, RED], [250, 10, YELLOW], [260, 26, GREEN], [272, 1.5, YELLOW], [286, 4, DARK],
  [290, 12, RED], [302, 8, ORANGE], [310, 22, GREEN], [320, 1.5, YELLOW], [332, 4, DARK],
  [336, 10, YELLOW], [346, 6, RED], [352, 36, YELLOW], [388, 20, DARK],
];
const WRAP_BANDS = [[194, 10, RED], [204, 3, YELLOW], [207, 9, GREEN], [216, 3, YELLOW], [219, 19, RED]];

function Bride({ children }) {
  const id = useId().replace(/:/g, "");
  const skirt = "M102 236c-6 60-14 116-26 164q52 12 104 0c-12-48-20-104-26-164z";
  const torso = "M108 176c6-6 34-6 42 0l6 62h-54z";
  const bands = (list, x, w) => list.map(([y, h, c]) => <rect key={y} x={x} y={y} width={w} height={h} fill={c} />);
  return (
    <g transform="translate(-14 0)">
      <defs>
        <clipPath id={id + "s"}><path d={skirt} /></clipPath>
        <clipPath id={id + "t"}><path d={torso} /></clipPath>
      </defs>
      <path d="M112 122C88 130 80 170 78 220c-4 70-12 130-26 184h32c8-74 14-144 20-204z" fill={VEIL} opacity=".5" />
      <g clipPath={`url(#${id}s)`}>{bands(SKIRT_BANDS, 60, 140)}</g>
      <path d="M80 388q50 9 98 0" stroke={GOLD} strokeWidth="1.2" />
      <path d={torso} fill={YELLOW} />
      <g clipPath={`url(#${id}t)`}>{bands(WRAP_BANDS, 100, 60)}</g>
      <path d="M108 182c-10 23-14 43-12 66" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
      <path d="M108 182c-4 9-7 17-9 25" stroke={YELLOW} strokeWidth="11" strokeLinecap="round" />
      <path d="M96 236v6" stroke={GOLD} strokeWidth="10" />
      <circle cx="96" cy="252" r="5" fill={SKIN} />
      {children}
      <path d="M150 182l4 14" stroke={YELLOW} strokeWidth="11" strokeLinecap="round" />
      <rect x="122" y="154" width="12" height="22" fill={SKIN} />
      <path d="M116 174q12 14 24 0M114 176q14 22 28 0" stroke={GOLD} strokeWidth="2.4" />
      <circle cx="128" cy="194" r="3" fill={GOLD} />
      <circle cx="128" cy="140" r="19" fill={SKIN} />
      <path d="M109 145c-4-25 19-35 38-15-11-6-27-4-35 18z" fill={HAIR} />
      <circle cx="106" cy="146" r="10" fill={HAIR} />
      <path d="M104 150c-4-30 16-42 36-36 10 4 14 12 12 18-12-12-32-12-40 8-2 20-6 35-4 50z" fill={VEIL} opacity=".55" />
      <path d="M152 132c-12-12-32-12-40 8" stroke={GOLD} strokeWidth="1.5" />
      <path d="M138 120l2 8" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="140" cy="129" r="2.4" fill={GOLD} />
      <circle cx="121" cy="156" r="2" fill={GOLD} />
    </g>
  );
}

// A sleeve drawn as an outline stroke under a white stroke, so it reads against the white shirt
function Sleeve({ d }) {
  return (
    <>
      <path d={d} stroke={LINEN} strokeWidth="14.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={WHITE} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// One side of the groom's stole: red with yellow edges and an orange centre stripe
function StoleSide({ x1, x2, x3, x4 }) {
  const top = 170, bottom = 320;
  return (
    <g>
      <path d={`M${x1} ${top}L${x2} ${top}L${x4} ${bottom}L${x3} ${bottom}z`} fill={RED} />
      <path d={`M${x1 + 1.5} ${top}L${x3 + 1.5} ${bottom}M${x2 - 1.5} ${top}L${x4 - 1.5} ${bottom}`}
        stroke={YELLOW} strokeWidth="1.6" />
      <path d={`M${(x1 + x2) / 2} ${top}L${(x3 + x4) / 2} ${bottom}`} stroke={ORANGE} strokeWidth="2" />
      <path d={`M${x3 + 2} ${bottom}v5M${x3 + 6} ${bottom}v6M${x4 - 6} ${bottom}v6M${x4 - 2} ${bottom}v5`}
        stroke={RED} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function Groom({ children }) {
  return (
    <g transform="translate(14 0)">
      <rect x="250" y="326" width="17" height="72" rx="6" fill={WHITE} stroke={LINEN} strokeWidth=".8" />
      <rect x="277" y="326" width="17" height="72" rx="6" fill={WHITE} stroke={LINEN} strokeWidth=".8" />
      <ellipse cx="256" cy="400" rx="11" ry="5" fill={WHITE} stroke={LINEN} />
      <ellipse cx="288" cy="400" rx="11" ry="5" fill={WHITE} stroke={LINEN} />
      <path d="M248 172c8-6 40-6 48 0l12 166q-36 8-72 0z" fill={WHITE} stroke={LINEN} />
      <path d="M272 178v150" stroke={LINEN} />
      <path d="M254 170q18-10 36 0" stroke={RED} strokeWidth="6" />
      <StoleSide x1={252} x2={265} x3={247} x4={260} />
      <StoleSide x1={279} x2={292} x3={284} x4={297} />
      <Sleeve d="M294 178c8 27 12 52 10 84" />
      <circle cx="304" cy="268" r="5.5" fill={SKIN} />
      {children}
      <rect x="266" y="152" width="12" height="18" fill={SKIN} />
      <path d="M261 166h22l-2 8h-18z" fill={WHITE} stroke={LINEN} />
      <circle cx="272" cy="138" r="19" fill={SKIN} />
      <path d="M256 146c4 16 28 16 32 0-4 8-28 8-32 0z" fill={HAIR} />
      <path d="M249 138c-4-34 50-38 47 0-9-9-38-9-47 0z" fill={WHITE} stroke={LINEN} />
      <path d="M252 128c12-12 32-12 42-2M256 118c10-8 26-8 34 0" stroke={LINEN} strokeWidth="1.2" />
    </g>
  );
}

function Couple() {
  return (
    <svg className="couple" viewBox="0 0 400 430" fill="none">
      {/* Floral arch */}
      <path d="M30 430V175a170 170 0 0 1 340 0v255" stroke="var(--sage)" strokeWidth="2.5" />
      <path d="M42 430V175a158 158 0 0 1 316 0v255" stroke={GOLD} strokeWidth=".8" strokeDasharray="2 5" />
      <Toran x={78} y={68} n={6} />
      <Toran x={128} y={30} n={4} />
      <Toran x={272} y={30} n={4} />
      <Toran x={322} y={68} n={6} />
      {[[30, 175], [370, 175], [53, 90], [347, 90], [115, 28], [285, 28], [30, 285], [370, 285]].map(([x, y]) => (
        <Bloom key={x + "-" + y} x={x} y={y} />
      ))}
      <Bloom x={200} y={6} r={12} />

      {/* Ground */}
      <ellipse cx="200" cy="404" rx="150" ry="9" fill="var(--rose-soft)" />
      <ellipse cx="120" cy="410" rx="5" ry="2" fill="#E3A9AE" transform="rotate(20 120 410)" />
      <ellipse cx="236" cy="412" rx="5" ry="2" fill="#E3A9AE" transform="rotate(-25 236 412)" />
      <ellipse cx="318" cy="408" rx="4" ry="1.8" fill="var(--rose)" transform="rotate(10 318 408)" />

      <Bride>
        <Hold x={150} y={182} cls="arm-b">
          <path d="M150 182c3 9 5 17 5.5 25" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <Hold x={155.5} y={207} cls="fore-b">
            <path d="M155.5 207c1.5 8 1.8 17 1.5 25" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <path d="M157 220v6" stroke={GOLD} strokeWidth="10" />
            <path d="M157 217v2" stroke="var(--rose)" strokeWidth="10" />
          </Hold>
        </Hold>
      </Bride>

      <Groom>
        <Hold x={250} y={180} cls="arm-g">
          <Hold x={245.5} y={203} cls="fore-g">
            <Sleeve d="M245.5 203c-1.5 8-2.5 15-2.5 23" />
          </Hold>
          <Sleeve d="M250 180c-2.5 9-4 16-4.5 23" />
        </Hold>
      </Groom>
      <Ribbon />
    </svg>
  );
}

// Gold glints drift out from the bow as it comes undone: [dx, dy]
const GLINTS = [[-26, -18], [-14, -30], [4, -34], [20, -26], [30, -12], [-30, 4], [26, 8]];

// Rotates part of a ribbon-holding arm about a joint at (x, y) as the ribbon is untied:
// the upper arm about the shoulder, the forearm about the elbow, and the loose ribbon end
// about the hand so it keeps hanging down. The arm and the hand with its ribbon sit in
// different layers, so each layer gets its own Holds with joints in its coordinates.
function Hold({ x, y, cls, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={"hold " + cls}><g transform={`translate(${-x} ${-y})`}>{children}</g></g>
    </g>
  );
}

// Ribbon held by the bride (left) and groom (right), tied in a bow between them
function Ribbon() {
  const half = (cls, x) => (
    <g className={"rb " + cls}>
      <rect x={x} y="230" width="57" height="12" fill="var(--ribbon)" />
      <rect x={x} y="234" width="57" height="2.5" fill="var(--ribbon-light)" />
    </g>
  );
  return (
    <g>
      <Hold x={136} y={182} cls="arm-b"><Hold x={141.5} y={207} cls="fore-b">
        <Hold x={143} y={236} cls="tail-b">
          <path d="M139 240c-3 18-7 38-14 58l7-2 3 7c6-20 10-42 11-61z" fill="var(--ribbon-dark)"
            stroke="var(--ribbon-light)" strokeWidth="1.2" strokeLinejoin="round" />
        </Hold>
        {half("rb-l", 143)}
        <circle cx="143" cy="236" r="6" fill={SKIN} />
      </Hold></Hold>
      <Hold x={264} y={180} cls="arm-g"><Hold x={259.5} y={203} cls="fore-g">
        <Hold x={257} y={236} cls="tail-g">
          <path d="M261 240c3 18 7 38 14 58l-7-2-3 7c-6-20-10-42-11-61z" fill="var(--ribbon-dark)"
            stroke="var(--ribbon-light)" strokeWidth="1.2" strokeLinejoin="round" />
        </Hold>
        {half("rb-r", 200)}
        <circle cx="257" cy="236" r="6" fill={SKIN} />
      </Hold></Hold>
      <g transform="translate(200 236) scale(.64) translate(-60 -40)">
        <g className="knot">
          <g className="bow bow-l">
            <path d="M55 44c-6 14-15 26-25 38l8-3 5 7c8-14 14-28 18-41z" fill="var(--ribbon)" />
            <path d="M60 40C44 18 14 6 8 26c-5 18 22 26 52 14z" fill="var(--ribbon)" />
            <path d="M60 40c-14-10-34-16-40-10 8 4 24 8 40 10z" fill="var(--ribbon-dark)" opacity=".55" />
            <path d="M56 36C42 20 20 12 14 24" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" fill="none" />
          </g>
          <g className="bow bow-r">
            <path d="M65 44c6 14 15 26 25 38l-8-3-5 7c-8-14-14-28-18-41z" fill="var(--ribbon)" />
            <path d="M60 40c16-22 46-34 52-14 5 18-22 26-52 14z" fill="var(--ribbon)" />
            <path d="M60 40c14-10 34-16 40-10-8 4-24 8-40 10z" fill="var(--ribbon-dark)" opacity=".55" />
            <path d="M64 36c14-16 36-24 42-12" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" fill="none" />
          </g>
          <g className="wrap">
            <rect x="51" y="30" width="18" height="21" rx="6" fill="var(--ribbon-dark)" />
            <rect x="55" y="33" width="4" height="14" rx="2" fill="#fff" opacity=".18" />
          </g>
        </g>
      </g>
      {GLINTS.map(([dx, dy], i) => (
        <circle key={i} className="glint" cx="200" cy="236" r={i % 2 ? 1.6 : 2.2} fill={GOLD}
          style={{ "--dx": dx + "px", "--dy": dy + "px", animationDelay: 0.5 + i * 0.06 + "s" }} />
      ))}
    </g>
  );
}

// Couple's initials in gold inside a laurel wreath, sitting above the arch on the cover
const LAUREL = [110, 125, 140, 155, 170, 185, 200, 215];

function Monogram() {
  const leaf = (a, i) => {
    const r = i % 2 ? 49 : 55;
    const x = r * Math.cos((a * Math.PI) / 180), y = r * Math.sin((a * Math.PI) / 180);
    return <ellipse key={a} cx={x} cy={y} rx="5.5" ry="2.2" transform={`rotate(${a + 90 + (i % 2 ? -25 : 25)} ${x} ${y})`} />;
  };
  return (
    <div className="mono">
      <svg viewBox="-60 -60 120 120" fill="none">
        <circle r="44" stroke={GOLD} strokeWidth=".7" />
        <circle r="40.5" stroke={GOLD} strokeWidth=".6" strokeDasharray="1 3" />
        <path d="M-36 30a52 52 0 0 1-8-68M36 30a52 52 0 0 0 8-68" stroke={GOLD} strokeWidth=".8" />
        <g fill={GOLD} fillOpacity=".75">
          {LAUREL.map(leaf)}
          {LAUREL.map((a, i) => leaf(180 - a, i))}
        </g>
        <path d="M-5 56c2-3 4-4 5-4s3 1 5 4M0 52l-4 8M0 52l4 8" stroke={GOLD} strokeWidth=".9" strokeLinecap="round" />
        <circle cy="52" r="2.4" fill={GOLD} />
        <Flower x={0} y={-52} r={7} />
      </svg>
      <p><span>{C.partner1[0]}</span><i>&amp;</i><span>{C.partner2[0]}</span></p>
    </div>
  );
}

function CoverArt() {
  return (
    <div className="cover" aria-hidden="true">
      <div className="cover-bg"><span className="shine" /></div>
      <div className="hero-frame" />
      <Corner at="tl" /><Corner at="tr" /><Corner at="bl" /><Corner at="br" />
      <Monogram />
      <Couple />
    </div>
  );
}

function Cover({ onDone }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      setGone(true);
      onDone();
      window.scrollTo(0, 0);
      document.getElementById("screen")?.scrollTo(0, 0);
    }, reduce ? 50 : 4800);
    return () => clearTimeout(t);
  }, [open, onDone]);

  return (
    <div id="intro" className={[open && "open", gone && "gone"].filter(Boolean).join(" ")}
      role="dialog" aria-label="Wedding invitation">
      <div className="door left"><CoverArt /></div>
      <div className="door right"><CoverArt /></div>
      <span className="seam" />
      <button className="untie" disabled={open} onClick={() => setOpen(true)}
        aria-label={`Untie the ribbon to open ${names}’s wedding invitation`} />
      <p className="tap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a5 5 0 0 1-3.9-1.9L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15" />
        </svg>
        Tap to untie ribbon
      </p>
    </div>
  );
}

/* ---------- Sections ---------- */
// Marigold beads along a quadratic curve from p0 to p2 (control point p1)
const beadsAlong = ([x0, y0], [x1, y1], [x2, y2], n) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), u = 1 - t;
    return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2];
  });
const MARIGOLD = ["#D98C3F", "#E0A64F", "#E8B85A"];

function Garland() {
  const swag = [
    ...beadsAlong([32, 32], [116, 96], [200, 26], 21),
    ...beadsAlong([200, 26], [284, 96], [368, 32], 21).slice(1),
  ];
  const strand = (x, y) => (
    <g className="str">
      <path d={`M${x} ${y}v62`} stroke={GOLD} strokeWidth=".8" />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={x} cy={y + 8 + i * 8} r="3.6" fill={MARIGOLD[i % 3]} />
      ))}
      <path d={`M${x - 5} ${y + 74}q0-9 5-9t5 9z`} fill={GOLD} />
      <circle cx={x} cy={y + 76} r="1.6" fill={GOLD} />
    </g>
  );
  return (
    <svg className="garland" viewBox="0 0 400 150">
      <path d="M32 32Q116 96 200 26Q284 96 368 32" fill="none" stroke={GOLD} strokeWidth=".8" />
      {swag.map(([x, y], i) =>
        i % 5 === 2 ? (
          <ellipse key={i} cx={x} cy={y + 4} rx="5" ry="2.2" fill="var(--sage)" />
        ) : (
          <circle key={i} cx={x} cy={y} r="4.4" fill={MARIGOLD[i % 3]} />
        )
      )}
      {strand(116, 62)}
      {strand(284, 62)}
      <Flower x={200} y={26} r={9} />
    </svg>
  );
}

// [left %, top %, size px, delay seconds]
const SPARKLES = [
  [10, 30, 14, 0], [88, 26, 18, -1.2], [16, 52, 10, -2.1], [84, 48, 13, -.6],
  [9, 74, 16, -1.7], [90, 70, 11, -2.6], [24, 22, 9, -.9], [76, 86, 12, -1.4],
];

function Sparkles() {
  return SPARKLES.map(([x, y, size, delay]) => (
    <svg key={x + "-" + y} className="sparkle" viewBox="-10 -10 20 20"
      style={{ "--x": x + "%", "--y": y + "%", "--s": size + "px", "--delay": delay + "s" }}>
      <path d="M0-10C1-2 2-1 10 0 2 1 1 2 0 10-1 2-2 1-10 0-2-1-1-2 0-10z" fill="currentColor" />
    </svg>
  ));
}

function Corner({ at }) {
  return (
    <svg className={"corner " + at} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.1"
      strokeLinecap="round">
      <path d="M10 74V28Q10 10 28 10h46" />
      <path d="M74 10c9 0 12 8 6 11-4 2-8-2-5-5M10 74c0 9 8 12 11 6 2-4-2-8-5-5" />
      <path d="M30 30c10-2 20 2 24 10 2 5-2 9-6 7M30 30c-2 10 2 20 10 24 5 2 9-2 7-6" />
      <g fill="currentColor" fillOpacity=".4">
        <path d="M38 19c6-6 14-6 19 0-5 5-13 5-19 0zM19 38c-6 6-6 14 0 19 5-5 5-13 0-19z" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="62" cy="19" r="1.5" /><circle cx="68" cy="19" r="1" />
        <circle cx="19" cy="62" r="1.5" /><circle cx="19" cy="68" r="1" />
      </g>
      <g stroke="none"><Flower x={27} y={27} r={8} /></g>
    </svg>
  );
}

function Lotus() {
  const side = (d) => <><path d={d} /><path d={d} transform="scale(-1 1)" /></>;
  return (
    <svg className="lotus" viewBox="-100 -100 200 150" fill="var(--gold)" fillOpacity=".06"
      stroke="currentColor" strokeWidth=".9" strokeLinecap="round">
      {side("M0 20C-40 14-76-6-84-26c28 2 60 16 84 46z")}
      {side("M0 20C-30 0-46-30-40-52c20 12 32 36 40 72z")}
      <path d="M0 20C-18-10-12-50 0-70c12 20 18 60 0 90z" />
      <path d="M0 14V-56M-6 12C-20-6-28-26-30-42M6 12c14-18 22-38 24-54" fill="none" strokeOpacity=".6" />
      <path d="M-70 32h140M-46 41h92" fill="none" strokeDasharray="2 5" />
      {[-60, -40, -20, 0, 20, 40, 60].map((a) => (
        <circle key={a} r="1.6" cy="-84" fill="currentColor" fillOpacity="1" stroke="none" transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}

// [left %, size px, fall seconds, delay seconds]
const PETALS = [
  [8, 20, 18, -2], [22, 15, 22, -9], [38, 18, 16, -5], [55, 14, 24, -14], [70, 19, 19, -3],
  [84, 16, 21, -11], [93, 21, 17, -7], [15, 13, 26, -18], [62, 17, 20, -16], [46, 15, 23, -20],
  [30, 12, 25, -12], [77, 13, 27, -22],
];

function Petals() {
  return PETALS.map(([x, size, d, delay]) => (
    <span key={x} className="petal"
      style={{ "--x": x + "%", "--s": size + "px", "--d": d + "s", "--delay": delay + "s" }}>
      <svg viewBox="0 0 20 20"><path d="M10 1c6 4 8 11 0 18C2 12 4 5 10 1z" /></svg>
    </span>
  ));
}

function Cloud({ className }) {
  return (
    <svg className={"cloud " + className} viewBox="0 0 120 40" fill="var(--bg)" fillOpacity=".7"
      stroke="currentColor" strokeWidth="1">
      <path d="M10 32h96c8 0 10-12 0-13-2-10-16-12-22-4-4-10-22-12-28 0-10-4-20 2-18 9-10 0-14 8-8 8z" />
    </svg>
  );
}

// [left %, size px, rise seconds, delay seconds]
const LANTERNS = [
  [12, 20, 22, -3], [28, 14, 26, -14], [46, 24, 20, -9], [64, 16, 24, -1],
  [80, 22, 21, -16], [90, 13, 27, -7], [20, 12, 28, -21], [56, 12, 25, -19],
];

function Lanterns() {
  return LANTERNS.map(([x, size, d, delay]) => (
    <span key={x} className="lantern"
      style={{ "--x": x + "%", "--s": size + "px", "--d": d + "s", "--delay": delay + "s" }}>
      <svg viewBox="0 0 20 28">
        <path d="M3 4q7-6 14 0l-2 18H5z" fill="#E9B85A" />
        <path d="M6 5q4-3 8 0l-1 14H7z" fill="#F6DFA0" />
        <path d="M5 22h10" stroke="#C29A55" strokeWidth="1.2" />
        <ellipse cx="10" cy="24.5" rx="1.6" ry="2.4" fill="#E07B39" />
      </svg>
    </span>
  ));
}

const MOTIFS = {
  garland: () => <><Garland /><Sparkles /></>, lotus: () => <><Lotus /><Petals /></>,
  clouds: () => <><Cloud className="c1" /><Cloud className="c2" /></>,
  lanterns: Lanterns,
};

function PageBg({ motif }) {
  const Motif = MOTIFS[motif];
  return (
    <div className="page-bg" aria-hidden="true">
      <Motif />
      <div className="hero-frame" />
      <Corner at="tl" /><Corner at="tr" /><Corner at="bl" /><Corner at="br" />
    </div>
  );
}

// The bride (first day) or groom (second day) pointing up at their day's calendar button
function SaveTheDate({ who }) {
  const bride = who === "bride";
  // Bubble drawn for the bride, with its tail towards her on the left; flipped for the groom
  const flip = bride ? undefined : "translate(120 0) scale(-1 1)";
  const x = bride ? 20 : 100;
  return (
    <svg className={"says " + who} viewBox="0 0 120 70" fill="none" aria-hidden="true">
      <g className="says-bubble">
        <g transform={flip}>
          <rect x="40" y="6" width="76" height="26" rx="13" fill="var(--paper)" stroke={GOLD} strokeWidth=".9" />
          <path d="M51 31 38 38 60 31z" fill="var(--paper)" />
          <path d="M51 32 38 38 60 32" stroke={GOLD} strokeWidth=".9" strokeLinejoin="round" />
        </g>
        <text x={bride ? 78 : 42} y="23" textAnchor="middle" fill="var(--rose)"
          fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="11">Save the date!</text>
      </g>
      <g className="says-fig">
        <g transform={`translate(${x} 68) scale(1.6) translate(${-x} -68)`}>
          <Mini x={x} y={68} kind={who} arms={bride ? [[-2, 11], [6, -12]] : [[-6, -12], [2, 11]]} />
        </g>
      </g>
    </svg>
  );
}

function Hero() {
  return (
    <section className="page hero" id="top">
      <PageBg motif="garland" />
      <Sprig />
      <p className="lead">We’re getting married</p>
      <h1>
        {C.partner1}
        <span className="amp">and</span>
        {C.partner2}
      </h1>
      <div className="save">
        {/* <p className="save-title">Save the date</p> */}
        <p className="save-month">{fmt(EVENTS[0].date, { month: "long", year: "numeric" })}</p>
        <ul className="save-days">
          {EVENTS.map((e, i) => (
            <li key={e.place}>
              <span className="save-wd">{fmt(e.date, { weekday: "long" })}</span>
              <strong>{fmt(e.date, { day: "numeric" })}</strong>
              <span className="save-place">{e.place}</span>
              <span className="save-host">{e.host}</span>
              <a className="cal-btn" href={e.calUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                  <path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
                </svg>
                Add to calendar
              </a>
              <SaveTheDate who={i ? "groom" : "bride"} />
            </li>
          ))}
        </ul>
      </div>
      {/* <p className="hint">Scroll for the details</p> */}
    </section>
  );
}

const UNITS = [["Days", 86400], ["Hours", 3600], ["Minutes", 60], ["Seconds", 1]];

function Countdown() {
  const target = new Date(C.countdownTo).getTime();
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  let left = Math.max(0, Math.floor((target - now) / 1000));
  if (!left) return <p className="countdown-done">The celebrations have begun</p>;

  return (
    <div className="countdown" role="timer">
      <p className="countdown-title">Counting down to {fmt(EVENTS[0].date, { day: "numeric", month: "long" })}</p>
      <div className="countdown-row">
        {UNITS.map(([label, secs], i) => {
          const n = Math.floor(left / secs);
          left -= n * secs;
          return (
            <div key={label}>
              <strong>{i ? String(n).padStart(2, "0") : n}</strong>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <Photobomb />
    </div>
  );
}

// Arm end points relative to each shoulder: [[left dx, dy], [right dx, dy]]
const ARMS = {
  down: [[-2, 11], [2, 11]], up: [[-5, -11], [5, -11]], out: [[-7, 3], [7, 3]],
  wave: [[-5, -11], [2, 11]], mic: [[-2, 11], [-1, -5]],
};

// A tiny standing figure, feet at (x, y). kind: bride | groom | woman | man
function Mini({ x, y = 88, kind, top, skirt, hair = HAIR, arms = "down", cls = "" }) {
  const female = kind === "bride" || kind === "woman";
  const [[lx, ly], [rx, ry]] = typeof arms === "string" ? ARMS[arms] : arms;
  const sh = y - 23;
  return (
    <g className={"mini " + cls}>
      {kind === "bride" && <path d={`M${x - 2} ${y - 34}c-6 2-8 12-8 24h4c0-9 1-16 5-20z`} fill={VEIL} opacity=".55" />}
      {female ? (
        <>
          <path d={`M${x - 4} ${y - 16}h8l3.5 16h-15z`} fill={kind === "bride" ? GREEN : skirt} />
          {kind === "bride" && (
            <path d={`M${x - 5} ${y - 12}h10M${x - 6} ${y - 7}h12M${x - 7} ${y - 2}h14`} stroke={YELLOW} strokeWidth="1.6" />
          )}
          <rect x={x - 4} y={y - 24} width="8" height="8" rx="1.5" fill={kind === "bride" ? YELLOW : top} />
          {kind === "bride" && <path d={`M${x - 4} ${y - 19}h8`} stroke={RED} strokeWidth="2" />}
        </>
      ) : (
        <>
          <path d={`M${x - 2} ${y - 9}v9M${x + 2} ${y - 9}v9`} stroke={kind === "groom" ? WHITE : "#EFE6D6"}
            strokeWidth="2.8" strokeLinecap="round" />
          <rect x={x - 4} y={y - 24} width="8" height="16" rx="1.5" fill={kind === "groom" ? WHITE : top}
            stroke={kind === "groom" ? LINEN : "none"} strokeWidth=".5" />
          {kind === "groom" && <path d={`M${x - 2} ${y - 24}v12M${x + 2} ${y - 24}v12`} stroke={RED} strokeWidth="1.4" />}
        </>
      )}
      <path d={`M${x - 4} ${sh}l${lx} ${ly}M${x + 4} ${sh}l${rx} ${ry}`} stroke={SKIN} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={x} cy={y - 29} r="4.5" fill={SKIN} />
      {female && <circle cx={x - 4} cy={y - 30} r="2.2" fill={hair} />}
      {kind === "groom" ? (
        <path d={`M${x - 5.5} ${y - 30}a5.5 5.5 0 0 1 11 0c-2-3-9-3-11 0z`} fill={WHITE} stroke={LINEN} strokeWidth=".5" />
      ) : (
        <path d={`M${x - 4.6} ${y - 29}a4.6 4.6 0 0 1 9.2 0c-2-3-7-3-9.2 0z`} fill={kind === "bride" ? VEIL : hair}
          opacity={kind === "bride" ? 0.75 : 1} />
      )}
    </g>
  );
}

// The couple poses for a photo and the family piles in: two cousins make bunny ears, an uncle
// toots a trumpet, and an aunty drags a sulking kid in by the ear. Then everyone wanders off.
// [caption, duration ms, walk ms, cousin offset, trumpeter offset, aunty offset]; cousin
// offsets are for the left one and mirrored on the right
const SCENE = [
  ["Say cheese!", 1800, 0, -80, -70, 70],
  ["Wait… who’s that?", 1700, 1500, 0, -70, 70],
  ["Photobombed!", 2000, 0, 0, -70, 70],
  ["Po poooo!", 2000, 1400, 0, 0, 70],
  ["One more for the photo!", 2000, 1500, 0, 0, 0],
  ["Picture perfect", 2600, 0, 0, 0, 0],
  ["Picture perfect", 1600, 1400, -80, -70, 70],
];
const BLUE = "#6D8FB0";

// Moves a figure sideways; it bobs while walking
function Actor({ cls, dx, walk, children }) {
  return (
    <g className={`actor ${cls}${walk ? " walk" : ""}`} style={{ transform: `translateX(${dx}px)` }}>
      <g className="bob">{children}</g>
    </g>
  );
}

const Say = ({ x, y, anchor = "middle", size = 7, cls = "", children }) => (
  <text className={"say " + cls} x={x} y={y} textAnchor={anchor} fill="var(--rose)"
    fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize={size}>{children}</text>
);

const Note = ({ x, y, cls }) => (
  <g className={"note " + cls}>
    <path d={`M${x + 2} ${y}v-7l3.5 1.4`} stroke={WINE} strokeWidth="1" />
    <ellipse cx={x} cy={y} rx="2.3" ry="1.8" fill="var(--rose)" transform={`rotate(-20 ${x} ${y})`} />
  </g>
);

const Fingers = ({ x, y = 52 }) => (
  <path d={`M${x} ${y}l-1.8-5M${x} ${y}l1.8-5`} stroke={SKIN} strokeWidth="1.4" strokeLinecap="round" />
);

// The photographer in the foreground, seen from behind as he shoots the group, reacting to
// each beat of the scene. Drawn with his feet at (0, 0) and placed by Photobomb.
// Poses: [camera offset, left arm [elbow, hand], right arm [elbow, hand] or null to wave]
const SHOTS = {
  aim: [[0, 0], [[-8.5, -26], [-6.6, -30]], [[8.5, -26], [6.6, -30]]],
  low: [[0, 13], [[-6, -19.5], [-6.6, -17]], [[6, -19.5], [6.6, -17]]],
  toss: [[0, 0], [[-7, -30], [-7.5, -35]], [[7, -30], [7.5, -35]]],
  ears: [[0, 13], [[-8.5, -25], [-5, -28.5]], [[8.5, -25], [5, -28.5]]],
  wave: [[0, 13], [[-6, -19.5], [-6.6, -17]], null],
};
// Pose per scene beat: aim, peek round the camera, juggle it in shock, cover ears from the
// trumpet, wave everyone in, take the shot, then check the photo
const SHOT_BY_BEAT = ["aim", "low", "toss", "ears", "wave", "aim", "low"];

function Photographer({ p }) {
  const [[cx, cy], left, right] = SHOTS[SHOT_BY_BEAT[p]];
  const arm = ([[ex, ey], [hx, hy]], x) => (
    <>
      <path d={`M${x} -22L${ex} ${ey}L${hx} ${hy}`} stroke={SKIN} strokeWidth="2.4" strokeLinecap="round"
        strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r="1.5" fill={SKIN} />
    </>
  );
  return (
    <g transform="translate(120 128) scale(1.15)">
      <g className="ph">
        <ellipse cy="0.5" rx="10" ry="1.8" fill="var(--rose-soft)" />
        <path d="M-2 -9v9M2 -9v9" stroke={DARK} strokeWidth="2.8" strokeLinecap="round" />
        <g style={{ transform: `translate(${cx}px, ${cy}px)` }}>
          <g className="cam">
            <rect x="-7" y="-33" width="14" height="6.5" rx="1.2" fill={DARK} />
            <rect x="-2" y="-37.5" width="4" height="4.5" rx=".6" fill={DARK} />
            <path className="burst" d="M0 -39v-3M-2.2 -38.6l-2-2M2.2 -38.6l2-2" stroke={GOLD} strokeWidth=".8"
              strokeLinecap="round" />
          </g>
        </g>
        <rect x="-4.5" y="-24" width="9" height="16" rx="2" fill="#55606E" />
        <path d="M-3.6 -23L3.4 -12" stroke={DARK} strokeWidth=".7" />
        <g className="ph-head">
          <circle cx="-4.5" cy="-28.5" r="1.1" fill={SKIN} />
          <circle cx="4.5" cy="-28.5" r="1.1" fill={SKIN} />
          <circle cy="-29" r="4.5" fill={HAIR} />
          <g className="ph-cap">
            <path d="M-4.6 -30a4.6 4.6 0 0 1 9.2 0z" fill="var(--rose)" />
            <path d="M-4.9 -30.2q4.9 3.6 9.8 0z" fill={WINE} />
          </g>
        </g>
        {arm(left, -4)}
        {right ? arm(right, 4) : <g className="ph-wave">{arm([[7.5, -28], [9, -35]], 4)}</g>}
      </g>
    </g>
  );
}

const HEART = "M0 3s-4-2.6-4-5.2a2.2 2.2 0 0 1 4-1.2 2.2 2.2 0 0 1 4 1.2c0 2.6-4 5.2-4 5.2z";

function Photobomb() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setP((n) => (n + 1) % SCENE.length), SCENE[p][1]);
    return () => clearTimeout(t);
  }, [p]);

  const [caption, , move, cousin, trumpeter, aunty] = SCENE[p];
  const prev = SCENE[(p + SCENE.length - 1) % SCENE.length];
  const walks = (i) => move > 0 && SCENE[p][i] !== prev[i];
  const toot = p === 3 || p === 4;
  const bunny = p === 2 || p === 4 || p === 5;
  const ears = p === 3 && [[-2, -6], [2, -6]];

  return (
    <svg className={"photo p" + p} viewBox="52 32 136 108" fill="none" aria-hidden="true"
      style={{ "--move": move + "ms" }}>
      <ellipse cx="120" cy="89" rx="62" ry="3" fill="var(--rose-soft)" />
      <path className="finder" d="M92 48v-8h8M148 48v-8h-8M92 86v8h8M148 86v8h-8" stroke={GOLD} strokeLinecap="round" />

      {/* Cousins, behind the couple */}
      <Actor cls="cousin" dx={cousin} walk={walks(3)}>
        <Mini x={100} kind="man" top={ORANGE} arms={ears || (bunny ? [[-5, -11], [9, -13]] : "down")} />
        {bunny && <Fingers x={113} />}
      </Actor>
      <Actor cls="cousin c-r" dx={-cousin} walk={walks(3)}>
        <Mini x={140} kind="woman" top={WINE} skirt="var(--rose)" arms={ears || (bunny ? [[-9, -13], [5, -11]] : "down")} />
        {bunny && <Fingers x={127} />}
      </Actor>

      <Mini x={113} kind="bride" arms={ears ? [[-2, -6], [3, 7]] : [[-2, 11], [3, 7]]} />
      <Mini x={127} kind="groom" arms={ears ? [[-3, 7], [2, -6]] : [[-3, 7], [2, 11]]} />

      {/* An uncle playing the trumpet */}
      <Actor cls="trumpeter" dx={trumpeter} walk={walks(4)}>
        <Mini x={80} kind="man" top={RED} arms={[[10, -6], [6, -7]]} />
        <g fill={GOLD}>
          <path d="M83 59.5l11-4" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M93 56l5-4.5 1.6 6.4z" />
          <rect x="87" y="55.2" width="1.2" height="2.6" transform="rotate(-20 87 56)" />
          <rect x="89.5" y="54.3" width="1.2" height="2.6" transform="rotate(-20 89.5 55)" />
        </g>
      </Actor>
      {toot && <><Note x={101} y={51} cls="n1" /><Note x={105} y={48} cls="n2" /><Note x={98} y={46} cls="n3" /></>}

      {/* An aunty bringing a sulking kid by the ear */}
      <Actor cls="aunty" dx={aunty} walk={walks(5)}>
        <g className="kid">
          <g transform="translate(150 88) scale(.7) translate(-150 -88)">
            <Mini x={150} kind="man" top={BLUE} arms={[[-1, 9], [1, 9]]} />
          </g>
        </g>
        <Mini x={164} kind="woman" top="var(--sage)" skirt={YELLOW} arms={[[-6.5, 2.5], [4, 6]]} />
      </Actor>

      {p === 2 && <><Say x={89} y={47} anchor="end">hee hee</Say><Say x={151} y={47} anchor="start">hee hee</Say></>}
      {p === 4 && <Say x={152} y={63} size={5.5} cls="late">ow!</Say>}
      {p === 5 && <rect className="flash" x="92" y="40" width="56" height="54" rx="2" fill="#FFFFFF" />}

      <Photographer p={p} />
      {p === 0 && <Say x={133} y={99} anchor="start" size={5.5} cls="late">click</Say>}
      {p === 1 && <Say x={133} y={99} anchor="start">?</Say>}
      {p === 2 && <Say x={133} y={99} anchor="start">!?</Say>}
      {p === 5 && <Say x={133} y={99} anchor="start" size={5.5}>click!</Say>}
      {p === 6 && <path className="say" transform="translate(136 95) scale(.9)" fill="var(--rose)" d={HEART} />}

      <text key={caption} className="caption" x="120" y="137" textAnchor="middle" fill="var(--rose)"
        fontFamily="DM Sans, sans-serif" fontSize="5.4" fontWeight="500" letterSpacing="1.2">{caption.toUpperCase()}</text>
    </svg>
  );
}

function Welcome() {
  return (
    <section className="page welcome">
      <PageBg motif="lotus" />
      <h2>{C.welcomeTitle}</h2>
      {/* <p className="sub">A note from us</p> */}
      <p className="body">{C.welcomeText}</p>
      <Countdown />
    </section>
  );
}

// The road from the bride's home in Haflong to the groom's in Maibang: the couple's car leads,
// the family's bus follows, and the hill train runs through its tunnels behind them
const ROAD = "M4 71H24C40 71 48 83 72 82S110 66 134 71S166 66 178 66";
const JOURNEY_S = 11;
// [keyPoints, keyTimes] along the road (wait at the start, drive, wait at the end), and the
// [opacity, keyTime] frames that fade each vehicle in and out; the bus stays hidden behind the
// bride's home until it pulls away
const SHOWN = [[0, 0], [1, 0.05], [1, 0.9], [0, 0.96], [0, 1]];
const DRIVES = {
  car: ["0.17;0.17;0.95;0.95", "0;0.1;0.6;1", SHOWN],
  bus: ["0;0;0.74;0.74", "0;0.17;0.68;1", [[0, 0], [0, 0.16], [1, 0.21], [1, 0.9], [0, 0.96], [0, 1]]],
};
const EASE = "0 0 1 1;.45 0 .55 1;0 0 1 1";

// Animates an attribute on the journey's shared clock: [value, keyTime] pairs, eased like the
// drives when `eased`
const Clock = ({ attr, frames, type, eased }) => {
  const props = {
    attributeName: attr, dur: JOURNEY_S + "s", repeatCount: "indefinite",
    values: frames.map((f) => f[0]).join(";"), keyTimes: frames.map((f) => f[1]).join(";"),
    ...(eased && { calcMode: "spline", keySplines: EASE }),
  };
  return type ? <animateTransform {...props} type={type} /> : <animate {...props} />;
};
function Drive({ who, still, children }) {
  const [points, times, shown] = DRIVES[who];
  return (
    <g>
      {!still && <Clock attr="opacity" frames={shown} />}
      {children}
      <animateMotion dur={JOURNEY_S + "s"} repeatCount="indefinite" rotate="auto"
        {...(still ? { keyPoints: "0.95;0.95", keyTimes: "0;1", calcMode: "linear" }
          : { keyPoints: points, keyTimes: times, calcMode: "spline", keySplines: EASE })}>
        <mpath xlinkHref="#road" />
      </animateMotion>
    </g>
  );
}

// Wheels turn only while their vehicle is moving: `spin` is [start, end] keyTimes of its drive
const Wheel = ({ x, spin, still }) => (
  <g transform={`translate(${x} -3.2)`}>
    <g>
      {!still && <Clock attr="transform" type="rotate" eased
        frames={[[0, 0], [0, spin[0]], [3600, spin[1]], [3600, 1]]} />}
      <circle r="2.3" fill={DARK} />
      <path d="M-1.5 0h3M0 -1.5v3" stroke={LINEN} strokeWidth=".5" />
      <circle r=".8" fill={GOLD} />
    </g>
  </g>
);

// The wedding car, facing right with its wheels on the road
function Car({ still }) {
  return (
    <g>
      <path d="M-11 -5l-3.5 3M-11 -4.5l-5 1" stroke={LINEN} strokeWidth=".4" />
      <rect x="-15.6" y="-3.4" width="1.8" height="2.2" rx=".3" fill={GOLD} />
      <rect x="-17.4" y="-4.2" width="1.8" height="2.2" rx=".3" fill={LINEN} />
      <path d="M-6 -9L-4 -13.5H3.5L6.5 -9z" fill={WHITE} stroke={LINEN} strokeWidth=".5" />
      <path d="M-4.8 -9.4L-3.4 -12.8H-.6V-9.4zM.4 -9.4V-12.8H3.1L5.4 -9.4z" fill="#CFE0EA" />
      <circle cx="-2.2" cy="-10.4" r="1.3" fill={SKIN} />
      <path d="M-3.6 -10.5a1.4 1.4 0 0 1 2.8 0" stroke={VEIL} strokeWidth="1" />
      <circle cx="1.9" cy="-10.4" r="1.3" fill={SKIN} />
      <path d="M.5 -10.9a1.4 1.4 0 0 1 2.8 0z" fill={WHITE} />
      <rect x="-11" y="-9" width="22" height="5.6" rx="2" fill={WHITE} stroke={LINEN} strokeWidth=".5" />
      {[-9, -6.8, -4.6, -2.4, -.2, 2, 4.2, 6.4, 8.6].map((x, i) => (
        <circle key={x} cx={x} cy="-8.3" r=".75" fill={MARIGOLD[i % 3]} />
      ))}
      <path fill="var(--rose)" transform="translate(-1 -6.4) scale(.32)" d={HEART} />
      <circle cx="10.4" cy="-6.6" r=".8" fill={YELLOW} />
      <circle cx="9" cy="-9.6" r="1.3" fill="var(--rose)" />
      <circle cx="9" cy="-9.6" r=".5" fill={YELLOW} />
      <Wheel x={-6.5} spin={[0.1, 0.6]} still={still} /><Wheel x={6.5} spin={[0.1, 0.6]} still={still} />
    </g>
  );
}

// The family's bus, with hands waving out of the windows and a honk on the way
function Bus({ still }) {
  const windows = [-12, -6.5, -1, 4.5];
  return (
    <g>
      <rect x="-9" y="-16.5" width="12" height="3" rx=".8" fill={ORANGE} />
      <path d="M-8 -15h10" stroke={WINE} strokeWidth=".4" />
      {[-9.8, 2.6].map((x) => (
        <path key={x} className={"wave-hand" + (x > 0 ? " w2" : "")} d={`M${x} -12l-.6-4.6`} stroke={SKIN}
          strokeWidth="1" strokeLinecap="round" />
      ))}
      <rect x="-15" y="-13" width="30" height="9.5" rx="2" fill={YELLOW} />
      <rect x="-15" y="-6.6" width="30" height="1.2" fill={RED} />
      {windows.map((x) => <rect key={x} x={x} y="-11.8" width="4.5" height="3.6" rx=".6" fill="#CFE0EA" />)}
      {windows.map((x) => (
        <g key={x}>
          <circle cx={x + 2.25} cy="-9.3" r="1.15" fill={SKIN} />
          <path d={`M${x + 1.05} -9.6a1.2 1.2 0 0 1 2.4 0z`} fill={HAIR} />
        </g>
      ))}
      <path d="M10.5 -11.8h2.6l1.4 3.4v.6h-4z" fill="#CFE0EA" />
      <circle cx="14.6" cy="-5" r=".8" fill={WHITE} />
      <Wheel x={-9} spin={[0.17, 0.68]} still={still} /><Wheel x={9} spin={[0.17, 0.68]} still={still} />
      {!still && (
        <text x="2" y="-19.5" textAnchor="middle" fill="var(--rose)" fontFamily="Cormorant Garamond, serif"
          fontStyle="italic" fontSize="5" opacity="0">
          beep beep!
          <Clock attr="opacity" frames={[[0, 0], [0, 0.3], [1, 0.33], [1, 0.46], [0, 0.49], [0, 1]]} />
        </text>
      )}
    </g>
  );
}

// A home with a sloped roof, a marigold string and a map pin, labelled with its place and day
function Home({ x, y, place, day }) {
  return (
    <g>
      <path d={`M${x - 10} ${y - 9}L${x} ${y - 17}L${x + 10} ${y - 9}z`} fill={WINE} />
      <rect x={x - 8} y={y - 9.5} width="16" height="9.5" fill="#F3E6D0" stroke={LINEN} strokeWidth=".5" />
      <rect x={x - 2} y={y - 6} width="4" height="6" rx="1.6" fill={GOLD} />
      <rect x={x - 6.5} y={y - 7} width="3" height="3" fill="#CFE0EA" />
      <rect x={x + 3.5} y={y - 7} width="3" height="3" fill="#CFE0EA" />
      <path d={`M${x - 8} ${y - 9}q8 3.5 16 0`} stroke={ORANGE} strokeWidth=".6" />
      {[-5, -1.6, 1.6, 5].map((dx, i) => <circle key={dx} cx={x + dx} cy={y - 8 + (i % 3 ? 0.9 : 0)} r=".8" fill={MARIGOLD[i % 3]} />)}
      <g transform={`translate(${x} ${y - 19})`}>
        <path d="M0 0c-2.5-3-4-5-4-7a4 4 0 0 1 8 0c0 2-1.5 4-4 7z" fill="var(--rose)" />
        <circle cy="-7" r="1.5" fill="var(--paper)" />
      </g>
      <text x={x} y={y + 12} textAnchor="middle" fill="var(--ink)" fontFamily="DM Sans, sans-serif" fontSize="4.6"
        fontWeight="500" letterSpacing=".8">{place.toUpperCase()}</text>
      <text x={x} y={y + 17.5} textAnchor="middle" fill="var(--muted)" fontFamily="DM Sans, sans-serif"
        fontSize="3.8" letterSpacing=".5">{day}</text>
    </g>
  );
}

function Train() {
  return (
    <g className="train">
      <g className="steam" fill="#FFFFFF" stroke={LINEN} strokeWidth=".3">
        <circle className="s1" cx="49.5" cy="38" r="1.3" /><circle className="s2" cx="48" cy="36" r="1.7" />
      </g>
      {[24, 34].map((x, i) => (
        <g key={x}>
          <rect x={x} y="39.6" width="9" height="4.2" rx=".8" fill={i ? GOLD : "var(--sage)"} />
          <path d={`M${x + 1.5} 41h2M${x + 5} 41h2`} stroke="#FFFFFF" strokeWidth="1.1" />
        </g>
      ))}
      <rect x="44" y="39" width="8" height="4.8" rx="1" fill={WINE} />
      <rect x="48.5" y="37.2" width="1.6" height="2.4" fill={WINE} />
      <path d="M52 43.8l1.6-.4v-1.6" stroke={WINE} strokeWidth=".7" />
    </g>
  );
}

function Journey() {
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [first, second] = EVENTS;
  const day = (e) => fmt(e.date, { day: "numeric", month: "short" });
  return (
    <svg className="journey" viewBox="0 0 200 92" fill="none" aria-hidden="true">
      <defs>
        <path id="road" d={ROAD} />
        <clipPath id="tunnels"><rect x="57" y="20" width="86" height="30" /></clipPath>
        {/* The landscape fades out at the sides and bottom instead of ending in a hard edge */}
        <linearGradient id="fade-x"><stop offset="0" stopColor="#000" /><stop offset=".1" stopColor="#fff" />
          <stop offset=".9" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
        <linearGradient id="fade-y" x2="0" y2="1"><stop offset=".72" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
        <mask id="land-x"><rect width="200" height="92" fill="url(#fade-x)" /></mask>
        <mask id="land-y"><rect width="200" height="92" fill="url(#fade-y)" /></mask>
      </defs>
      <circle cx="160" cy="26" r="9" fill={GOLD} fillOpacity=".16" />

      <g mask="url(#land-x)"><g mask="url(#land-y)">

      {/* The hill railway: out of one tunnel, over the viaduct and into the next */}
      <path d="M0 58C16 42 32 34 48 38S56 44 62 50 80 62 100 62 132 54 140 48 152 36 166 36 190 46 200 52V92H0z"
        fill="var(--sage)" fillOpacity=".16" />
      <g stroke={GOLD} strokeOpacity=".55" strokeWidth=".7">
        <path d="M54 44H146" strokeWidth=".9" />
        {[62, 76, 90, 104, 118].map((x) => <path key={x} d={`M${x} 72V50a7 6 0 0 1 14 0V72`} />)}
      </g>
      <g clipPath="url(#tunnels)"><Train /></g>
      <path d="M53 44.4v-3.4a4 4 0 0 1 8 0v3.4zM139 44.4v-3.4a4 4 0 0 1 8 0v3.4z" fill={DARK} fillOpacity=".55" />

      <path d="M0 68C30 58 62 62 92 70S152 60 200 62V92H0z" fill="var(--rose-soft)" fillOpacity=".7" />
      {[[34, 66], [41, 65], [112, 66], [150, 61], [158, 62]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y}l3-8 3 8z`} fill="var(--sage)" fillOpacity=".6" />
      ))}

      {/* The road between the two homes */}
      <path d={"M0 71L" + ROAD.slice(1) + "L200 66V92H0z"} fill="var(--sage)" fillOpacity=".22" />
      <path d={ROAD} stroke="#E3D6C1" strokeWidth="3.2" strokeLinecap="round" />
      <path d={ROAD} stroke="#FFFFFF" strokeWidth=".5" strokeDasharray="2 2.4" />
      </g></g>
      {/* The bus pulls out from behind the bride's home; both park in front of the groom's */}
      <Home x={186} y={66} place={second.place} day={day(second)} />
      <Drive who="bus" still={still}><Bus still={still} /></Drive>
      <Home x={16} y={71} place={first.place} day={day(first)} />
      <Drive who="car" still={still}><Car still={still} /></Drive>

      {/* Hearts float up from the groom's home when everyone arrives */}
      {!still && [[180, 44, 0], [186, 40, 0.03], [192, 45, 0.06]].map(([x, y, d]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <g opacity="0">
            <Clock attr="opacity" frames={[[0, 0], [0, 0.6 + d], [1, 0.64 + d], [0, 0.84 + d], [0, 1]]} />
            <Clock attr="transform" type="translate" frames={[["0 0", 0], ["0 0", 0.6 + d], ["0 -12", 0.84 + d], ["0 -12", 1]]} />
            <path fill="var(--rose)" transform="scale(.6)" d={HEART} />
          </g>
        </g>
      ))}
    </svg>
  );
}

// The bride (first venue) or groom (second) puzzling over a paper map beside the Maps button.
// Drawn at 1.3x around her or his feet; the map's panels, hills, river and route are in front
// of the body, with the hands on its edges.
function MapReader({ who }) {
  const bride = who === "bride";
  return (
    <svg className={"mapper " + who} viewBox="0 0 50 64" fill="none" aria-hidden="true">
      <g transform="translate(25 62) scale(1.3) translate(-25 -62)">
        <g className="mapper-fig">
          <g className="mapper-head">
            <Mini x={25} y={62} kind={who} arms={[[-5, 3], [5, 3]]} />
          </g>
          <g className="paper">
            {[[16, "#F3E6D0"], [22, "#E8D8BC"], [28, "#F3E6D0"]].map(([x, fill]) => (
              <rect key={x} x={x} y="37" width="6" height="11" fill={fill} stroke={LINEN} strokeWidth=".3" />
            ))}
            <path d="M16 46c3-3 5-3 8-1s5 0 10-4v7H16z" fill="var(--sage)" fillOpacity=".5" />
            <path d="M19 37c1 3-2 5 0 8" stroke="#8FB3C9" strokeWidth=".8" />
            <path d="M18 44c4-1 6-5 9-4s3-1 5-1" stroke={RED} strokeWidth=".5" strokeDasharray="1 .8" />
            <g className="paper-pin">
              <path d="M32 39.5c-.9-1-1.4-1.7-1.4-2.4a1.4 1.4 0 0 1 2.8 0c0 .7-.5 1.4-1.4 2.4z" fill={RED} />
            </g>
          </g>
          <circle cx="16" cy="42" r="1.3" fill={SKIN} />
          <circle cx="34" cy="42" r="1.3" fill={SKIN} />
        </g>
      </g>
      {(bride ? [["?", "q"], ["!", "a"]] : [["hmm…", "q"], ["aha!", "a"]]).map(([t, k]) => (
        <text key={k} className={"mapper-say " + k} x={bride ? 9 : 42} y="24" textAnchor="middle" fill="var(--rose)"
          fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize={t.length > 1 ? 8 : 11}>{t}</text>
      ))}
    </svg>
  );
}

function Venue() {
  return (
    <section className="page">
      <PageBg motif="clouds" />
      <h2>The venues</h2>
      <p className="sub">Where to find us</p>
      <div className="venues">
        {EVENTS.map((e, i) => (
          <Fragment key={e.place}>
            {i > 0 && <Journey />}
            <div className="venue">
              <p className="venue-name">{e.place}</p>
              <p className="addr">
                {e.host} · {fmt(e.date, { weekday: "long", day: "numeric", month: "long" })}
                {e.address && <><br />{e.address}</>}
              </p>
              <a className="btn" href={e.mapUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
              <MapReader who={i ? "groom" : "bride"} />
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

// Curtain call on the closing page: the family from the earlier scenes lines up to wave
// goodbye while the couple let a sky lantern go, which rises up the page. Feet at y = 70.
const GREY = "#B8AEA4";

// A guest waving one arm (`side` l or r) from the shoulder; `arm` is the other arm
function Waver({ x, side, arm = [2, 11], ...look }) {
  const l = side === "l";
  return (
    <g>
      <Mini x={x} y={70} {...look} arms={l ? [[0, 0], arm] : [arm, [0, 0]]} />
      <g className={"wave-arm " + side}>
        <path d={`M${x + (l ? -4 : 4)} 47l${l ? -5 : 5} -11`} stroke={SKIN} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Farewell() {
  return (
    <svg className="farewell" viewBox="0 18 200 56" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="70.5" rx="88" ry="2.6" fill="var(--rose-soft)" />

      {/* Grandma and grandpa (with his cane), waving */}
      <Waver x={26} side="r" kind="woman" top="var(--rose)" skirt={DARK} hair={GREY} />
      <Waver x={42} side="r" arm={[-3, 10]} kind="man" top={GOLD} hair={GREY} />
      <path d="M35 56l-1 14" stroke="#8B5A3C" strokeWidth="1.3" strokeLinecap="round" />

      {/* The uncle playing up to the sky */}
      <Mini x={58} y={70} kind="man" top={RED} arms={[[9, -7], [4, -10]]} />
      <path d="M61 41l9-9" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M69 31.5l4.5-4.5 1.5 4.6z" fill={GOLD} />
      <Note x={75} y={27} cls="n1" /><Note x={79} y={24} cls="n2" /><Note x={72} y={22} cls="n3" />

      {/* The kid, hopping with both arms up */}
      <g className="kid-hop">
        <g transform="translate(74 70) scale(.7) translate(-74 -70)">
          <Mini x={74} y={70} kind="man" top={BLUE} arms="up" />
        </g>
      </g>

      {/* The couple, letting a sky lantern go */}
      <g className="cheer">
        <Mini x={92} y={70} kind="bride" arms={[[-2, 11], [3, -12]]} />
        <Mini x={108} y={70} kind="groom" arms={[[-3, -12], [2, 11]]} />
      </g>
      <g className="sky-lantern">
        <g className="sky-sway">
          <path d="M95 24q5-4 10 0l-1.5 10h-7z" fill="#E9B85A" />
          <path d="M97 25q3-2 6 0l-.8 7.6h-4.4z" fill="#F6DFA0" />
          <path d="M96.5 34h7" stroke={GOLD} strokeWidth=".8" />
          <ellipse cx="100" cy="35.6" rx=".9" ry="1.4" fill="#E07B39" />
        </g>
      </g>

      {/* The cousins: one waving, the other sneaking bunny ears behind her */}
      <Mini x={142} y={70} kind="man" top={ORANGE} arms={[[-11, -13], [2, 11]]} />
      <Fingers x={127} y={34} />
      <Waver x={126} side="l" arm={[2, 11]} kind="woman" top={WINE} skirt="var(--rose)" />

      {/* The photographer, facing us for one last shot */}
      <Mini x={158} y={70} kind="man" top="#55606E" arms={[[-1, -6], [1, -6]]} />
      <path d="M153.4 41a4.6 4.6 0 0 1 9.2 0c-2-3-7-3-9.2 0z" fill="var(--rose)" />
      <rect x="153.5" y="38.5" width="9" height="6" rx="1.2" fill={DARK} />
      <rect x="155" y="36.4" width="3" height="2.2" rx=".4" fill={DARK} />
      <circle cx="158" cy="41.5" r="2" fill="#5B5F6B" />
      <circle cx="158" cy="41.5" r="1" fill="#A9C2D6" />
      <path className="snap" d="M156.5 35v-3M154.2 35.4l-2-2M158.8 35.4l2-2" stroke={GOLD} strokeWidth=".8" strokeLinecap="round" />

      {/* The aunty, waving from the end of the line */}
      <Waver x={174} side="l" arm={[4, 6]} kind="woman" top="var(--sage)" skirt={YELLOW} />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="page closing">
      <PageBg motif="lanterns" />
      <Monogram />
      <p className="closing-with">{C.closing}</p>
      <p className="closing-names">
        {C.partner1}<i>&amp;</i>{C.partner2}
      </p>
      <svg className="divider" viewBox="0 0 200 20" fill="none" aria-hidden="true">
        <path d="M10 10h66M124 10h66" stroke={GOLD} strokeWidth=".9" />
        <path d="M80 10l5-4 5 4-5 4zM110 10l5-4 5 4-5 4z" fill={GOLD} />
        <Flower x={100} y={10} r={8} />
      </svg>
      <p className="closing-date">{C.dateLabel}</p>
      <p className="closing-places">{EVENTS.map((e) => e.place).join(" · ")}</p>
      {C.closingNote && <p className="closing-note">{C.closingNote}</p>}
      <Farewell />
    </footer>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    document.title = `M&M – Wedding invitation`;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", !unlocked);
  }, [unlocked]);

  return (
    <div className="device">
      <Cover onDone={() => setUnlocked(true)} />
      <div className="screen" id="screen">
        <main className="app">
          <Hero />
          <Welcome />
          <Venue />
          <Footer />
        </main>
      </div>
    </div>
  );
}
