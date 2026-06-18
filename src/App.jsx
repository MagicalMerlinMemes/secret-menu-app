import { useState, useMemo } from "react";

const RED = "#DA2127";
const CREAM = "#FFF8F0";
const DARK = "#1A1A1A";
const GRAY = "#6B6B6B";
const LIGHT_GRAY = "#F0EBE3";
const WHITE = "#FFFFFF";
const GREEN = "#2D7D46";
const YELLOW = "#F5A623";

const PATTY_OPTIONS = [
  { id: "1x1", label: "1 Patty", order: "a Hamburger" },
  { id: "2x2", label: "2 Patties", order: "a Double-Double" },
  { id: "3x3", label: "3 Patties", order: "a 3x3" },
  { id: "4x4", label: "4 Patties", order: "a 4x4" },
];
const CHEESE_OPTIONS = [
  { id: "no_cheese", label: "No Cheese", order: "no cheese" },
  { id: "1_cheese", label: "1 Slice", order: null },
  { id: "2_cheese", label: "2 Slices", order: null },
  { id: "3_cheese", label: "3 Slices", order: "3 slices of cheese" },
  { id: "4_cheese", label: "4 Slices", order: "4 slices of cheese" },
];
const BUN_OPTIONS = [
  { id: "regular_bun", label: "Regular Bun", order: null },
  { id: "extra_toast", label: "Extra Toast", order: "extra toast" },
  { id: "light_toast", label: "Light Toast", order: "light toast" },
  { id: "protein_style", label: "Protein Style ★", order: "Protein Style", secret: true },
  { id: "tomato_wrap", label: "Tomato Wrap ★", order: "wrapped in tomato slices", secret: true },
  { id: "onion_wrap", label: "Onion Wrap ★", order: "wrapped in whole grilled onions", secret: true },
  { id: "no_bun", label: "No Bun ★", order: "Flying Dutchman — no bun", secret: true },
];
const PATTY_COOK = [
  { id: "regular_cook", label: "Regular", order: null },
  { id: "medium_rare", label: "Medium Rare ★", order: "medium rare", secret: true },
  { id: "mustard_fried", label: "Mustard-Fried ★", order: "mustard fried", secret: true },
  { id: "well_done_patty", label: "Well Done", order: "well done" },
  { id: "light_well", label: "Light Well", order: "light well" },
];
const TOPPINGS = [
  { id: "lettuce", label: "Lettuce", default: true, addOrder: "add lettuce", removeOrder: "no lettuce" },
  { id: "tomato", label: "Tomato", default: true, addOrder: "add tomato", removeOrder: "no tomato" },
  { id: "extra_tomato", label: "Extra Tomato", default: false, addOrder: "extra tomato", removeOrder: null },
  { id: "raw_onion", label: "Raw Onion", default: true, addOrder: "add onion", removeOrder: "no onion" },
  { id: "grilled_onion", label: "Grilled Onion", default: false, addOrder: "grilled onions", removeOrder: null },
  { id: "whole_grilled_onion", label: "Whole Grilled Onion", default: false, addOrder: "whole grilled onion", removeOrder: null },
  { id: "spread", label: "Spread", default: true, addOrder: "add spread", removeOrder: "no spread" },
  { id: "extra_spread", label: "Extra Spread", default: false, addOrder: "extra spread", removeOrder: null },
  { id: "pickles", label: "Pickles", default: false, addOrder: "add pickles", removeOrder: null },
  { id: "chopped_chilies", label: "Chopped Chilies", default: false, addOrder: "add chopped chilies", removeOrder: null },
];
const FRIES_STYLE = [
  { id: "regular_fries", label: "Regular", order: "fries" },
  { id: "light_fries", label: "Light / Soft", order: "light fries" },
  { id: "well_done_fries", label: "Well Done", order: "well done fries" },
  { id: "extra_crispy", label: "Extra Well Done", order: "extra well done fries" },
];
const FRIES_TOPPINGS = [
  { id: "no_fries_topping", label: "Plain", order: null },
  { id: "cheese_fries", label: "+ Cheese", order: "with cheese" },
  { id: "animal_fries", label: "+ Animal Style ★", order: "Animal Style", secret: true },
  { id: "ultimate_animal_fries", label: "+ Ultimate Animal Style ★", order: "Ultimate Animal Style", secret: true },
  { id: "roadkill_fries", label: "+ Roadkill ★", order: "Roadkill style", secret: true },
  { id: "lemon_fries", label: "+ Lemon Juice", order: "with lemon juice" },
  { id: "lemon_pepper_fries", label: "+ Lemon Pepper", order: "with lemon pepper" },
  { id: "chilies_fries", label: "+ Chopped Chilies", order: "with chopped chilies" },
];
const DRINK_TYPE = [
  { id: "soda", label: "Soda" },
  { id: "shake", label: "Milkshake" },
  { id: "float", label: "Float ★", secret: true },
  { id: "secret_mix", label: "Secret Mix ★", secret: true },
  { id: "no_drink", label: "No Drink" },
];
const SODAS = [
  { id: "coke", label: "Coca-Cola" }, { id: "diet_coke", label: "Diet Coke" },
  { id: "dr_pepper", label: "Dr Pepper" }, { id: "7up", label: "7-Up" },
  { id: "root_beer", label: "Root Beer" }, { id: "pink_lemonade", label: "Pink Lemonade" },
  { id: "iced_tea", label: "Iced Tea" }, { id: "water", label: "Water" },
];
const SHAKE_FLAVORS = [
  { id: "vanilla", label: "Vanilla" }, { id: "chocolate", label: "Chocolate" }, { id: "strawberry", label: "Strawberry" },
];
const SHAKE_SIZE = [
  { id: "regular", label: "Regular" }, { id: "large", label: "Large ★", secret: true }, { id: "xlarge", label: "X-Large ★", secret: true },
];
const FLOAT_OPTIONS = [
  { id: "root_beer_float", label: "Root Beer Float", order: "Root Beer Float — half root beer, half vanilla shake" },
  { id: "coke_float", label: "Coke Float", order: "Coke Float — half Coke, half vanilla shake" },
  { id: "dr_pepper_float", label: "Dr Pepper Float", order: "Dr Pepper Float — half Dr Pepper, half vanilla shake" },
  { id: "7up_float", label: "7-Up Float", order: "7-Up Float — half 7-Up, half vanilla shake" },
  { id: "lemonade_float", label: "Pink Lemonade Float", order: "Pink Lemonade Float — half pink lemonade, half vanilla shake" },
];
const SECRET_MIXES = [
  { id: "neapolitan", label: "Neapolitan Shake", order: "Neapolitan Shake — all three flavors blended" },
  { id: "black_white", label: "Black & White", order: "Black & White Shake — chocolate and vanilla" },
  { id: "choc_straw", label: "Choc-Strawberry", order: "Chocolate-Strawberry Shake" },
  { id: "van_straw", label: "Vanilla-Strawberry", order: "Vanilla-Strawberry Shake" },
  { id: "around_world", label: "Around the World", order: "Around the World — all three flavors layered" },
  { id: "arnold_palmer", label: "Arnold Palmer", order: "Arnold Palmer — half iced tea, half pink lemonade" },
  { id: "lemon_up", label: "Lemon-Up", order: "Lemon-Up — half 7-Up, half pink lemonade" },
];

const TOTAL_BURGER = 4 * 5 * 7 * 5 * Math.pow(2, 10);
const TOTAL_FRIES = 4 * 8;
const TOTAL_DRINKS = 8 + 9 + 5 + 7 + 1;
const TOTAL = TOTAL_BURGER * TOTAL_FRIES * TOTAL_DRINKS;
const defaultToppings = TOPPINGS.reduce((a, t) => { a[t.id] = t.default; return a; }, {});

function buildScript({ patty, cheese, bun, cook, toppings, friesStyle, friesTop, drinkType, soda, shakeBase, shakeSize, floatChoice, secretMix }) {
  const pd = PATTY_OPTIONS.find(x => x.id === patty);
  const cd = CHEESE_OPTIONS.find(x => x.id === cheese);
  const bd = BUN_OPTIONS.find(x => x.id === bun);
  const ck = PATTY_COOK.find(x => x.id === cook);
  const fd = FRIES_STYLE.find(x => x.id === friesStyle);
  const ft = FRIES_TOPPINGS.find(x => x.id === friesTop);
  let parts = [pd.order];
  if (cd.id === "no_cheese") parts.push("no cheese");
  else if (cd.order) parts.push(cd.order);
  if (bd.order) parts.push(bd.order);
  if (ck.order) parts.push(ck.order);
  const def = TOPPINGS.reduce((a, t) => { a[t.id] = t.default; return a; }, {});
  TOPPINGS.forEach(t => {
    const on = toppings[t.id], was = def[t.id];
    if (on && !was && t.addOrder) parts.push(t.addOrder);
    if (!on && was && t.removeOrder) parts.push(t.removeOrder);
  });
  let friesStr = fd.order + (ft.order ? ` — ${ft.order}` : "");
  let drinkStr = "";
  if (drinkType === "soda") drinkStr = SODAS.find(x => x.id === soda)?.label;
  else if (drinkType === "shake") {
    const sz = SHAKE_SIZE.find(x => x.id === shakeSize);
    drinkStr = `${sz.id !== "regular" ? sz.label.replace(" ★","") + " " : ""}${SHAKE_FLAVORS.find(x => x.id === shakeBase)?.label} milkshake`;
  } else if (drinkType === "float") drinkStr = FLOAT_OPTIONS.find(x => x.id === floatChoice)?.order;
  else if (drinkType === "secret_mix") drinkStr = SECRET_MIXES.find(x => x.id === secretMix)?.order;
  const burgerLine = parts.join(", ");
  const lines = drinkStr && drinkType !== "no_drink"
    ? [`"Can I get ${burgerLine},`, `${friesStr},`, `and a ${drinkStr}?"`]
    : [`"Can I get ${burgerLine}`, `and ${friesStr}?"`];
  const tips = [];
  if (bun === "onion_wrap") tips.push("Whole grilled onion wrap takes ~9 extra minutes — give them a heads up.");
  if (bun === "no_bun") tips.push("Flying Dutchman = two patties, two cheese, no bun. Most locations know it.");
  if (cook === "mustard_fried") tips.push("Mustard fried — they squeeze mustard onto the patty while it cooks.");
  if (cook === "medium_rare") tips.push("Medium rare is possible but some locations decline — ask politely.");
  if (friesTop === "roadkill_fries") tips.push("Roadkill = Animal Style fries with a Flying Dutchman crumbled on top.");
  if (drinkType === "float") tips.push("Ask for a half cup of soda first so it doesn't overflow.");
  if (drinkType === "shake" && shakeSize !== "regular") tips.push("Large and X-Large shakes are off-menu — just ask by size name.");
  return { lines, tips };
}

// ─── UI COMPONENTS ───────────────────────────────────────────────────────────
const RadioGrid = ({ options, value, onChange, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "6px" }}>
    {options.map(o => (
      <button key={o.id} onClick={() => onChange(o.id)} style={{
        padding: "10px 8px", borderRadius: "8px", lineHeight: "1.3",
        border: value === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`,
        background: value === o.id ? "#FFF0F0" : WHITE,
        color: value === o.id ? RED : DARK,
        fontWeight: value === o.id ? "700" : "400",
        fontSize: "13px", cursor: "pointer", textAlign: "center",
      }}>{o.label}</button>
    ))}
  </div>
);

const CheckGrid = ({ options, values, onToggle }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
    {options.map(t => {
      const checked = values[t.id];
      return (
        <button key={t.id} onClick={() => onToggle(t.id)} style={{
          padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px",
          border: checked ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`,
          background: checked ? "#FFF0F0" : WHITE,
          color: checked ? RED : DARK,
          fontWeight: checked ? "700" : "400",
          fontSize: "13px", cursor: "pointer", textAlign: "left",
        }}>
          <span style={{ width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0, background: checked ? RED : LIGHT_GRAY, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          {t.label}
        </button>
      );
    })}
  </div>
);

const Section = ({ emoji, title }) => (
  <div style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", color: RED, margin: "24px 0 10px", paddingBottom: "6px", borderBottom: `2px solid ${RED}`, display: "flex", alignItems: "center", gap: "6px" }}>
    <span>{emoji}</span><span>{title}</span>
  </div>
);

const Card = ({ label, children }) => (
  <div style={{ background: WHITE, borderRadius: "10px", padding: "14px", marginBottom: "10px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
    {label && <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: GRAY, marginBottom: "10px" }}>{label}</div>}
    {children}
  </div>
);

function ShareButtons({ orderText }) {
  const [copied, setCopied] = useState(false);
  const url = "https://secretmenubuilder.app";
  const msg = encodeURIComponent(`My secret order: ${orderText} — build yours at ${url}`);
  const copyLink = () => { navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const platforms = [
    { name: "X / Twitter", color: "#000", url: `https://twitter.com/intent/tweet?text=${msg}` },
    { name: "Facebook", color: "#1877F2", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "WhatsApp", color: "#25D366", url: `https://wa.me/?text=${msg}` },
    { name: "iMessage", color: "#34C759", url: `sms:&body=${msg}` },
  ];
  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>Share your order</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {platforms.map(p => <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "11px", borderRadius: "8px", background: p.color, color: WHITE, textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>{p.name}</a>)}
        <button onClick={copyLink} style={{ gridColumn: "span 2", padding: "11px", borderRadius: "8px", background: copied ? GREEN : "#333", color: WHITE, border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>{copied ? "✓ Link Copied!" : "Copy Link"}</button>
      </div>
    </div>
  );
}

function OrderPanel(props) {
  const { lines, tips } = useMemo(() => buildScript(props), [JSON.stringify(props)]);
  return (
    <div style={{ background: DARK, borderRadius: "12px", padding: "20px", color: WHITE }}>
      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>Say this at the window</div>
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px", borderLeft: `4px solid ${RED}` }}>
        {lines.map((l, i) => <div key={i} style={{ fontSize: i === 0 ? "18px" : "15px", fontWeight: i === 0 ? "800" : "400", lineHeight: "1.6", marginBottom: i < lines.length - 1 ? "2px" : 0 }}>{l}</div>)}
      </div>
      {tips.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>Tips</div>
          {tips.map((t, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.5" }}><span style={{ color: RED, flexShrink: 0, fontWeight: "800" }}>→</span>{t}</div>)}
        </div>
      )}
      <ShareButtons orderText={lines.join(" ")} />
    </div>
  );
}

export default function App() {
  const [patty, setPatty] = useState("2x2");
  const [cheese, setCheese] = useState("2_cheese");
  const [bun, setBun] = useState("regular_bun");
  const [cook, setCook] = useState("regular_cook");
  const [toppings, setToppings] = useState(defaultToppings);
  const [friesStyle, setFriesStyle] = useState("regular_fries");
  const [friesTop, setFriesTop] = useState("no_fries_topping");
  const [drinkType, setDrinkType] = useState("shake");
  const [soda, setSoda] = useState("coke");
  const [shakeBase, setShakeBase] = useState("vanilla");
  const [shakeSize, setShakeSize] = useState("regular");
  const [floatChoice, setFloatChoice] = useState("root_beer_float");
  const [secretMix, setSecretMix] = useState("neapolitan");
  const toggleTop = id => setToppings(p => ({ ...p, [id]: !p[id] }));
  const reset = () => { setPatty("2x2"); setCheese("2_cheese"); setBun("regular_bun"); setCook("regular_cook"); setToppings(defaultToppings); setFriesStyle("regular_fries"); setFriesTop("no_fries_topping"); setDrinkType("shake"); setSoda("coke"); setShakeBase("vanilla"); setShakeSize("regular"); setFloatChoice("root_beer_float"); setSecretMix("neapolitan"); };

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: CREAM, minHeight: "100vh", color: DARK }}>
      {/* Header */}
      <div style={{ background: RED, padding: "20px 16px 16px", textAlign: "center" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: WHITE, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Secret Menu Builder</h1>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: "6px 0 0", letterSpacing: "0.5px" }}>Pick your order. We'll tell you what to say.</p>
      </div>

      {/* Stats */}
      <div style={{ background: DARK, padding: "12px 16px", display: "flex", justifyContent: "space-around" }}>
        {[{ n: TOTAL_BURGER.toLocaleString(), l: "Burger Combos" }, { n: TOTAL_FRIES, l: "Fry Combos" }, { n: TOTAL_DRINKS, l: "Drink Combos" }, { n: TOTAL.toLocaleString(), l: "Total Possible" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "900", color: RED, display: "block" }}>{s.n}</span>
            <span style={{ fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase", color: WHITE, opacity: 0.6, display: "block", marginTop: "2px" }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ background: "#FFF8E8", borderBottom: `1px solid ${YELLOW}`, padding: "8px 16px", fontSize: "11px", color: "#8B6914", display: "flex", gap: "6px", alignItems: "center" }}>
        <span style={{ color: YELLOW }}>★</span> = Secret menu — not on the board, but totally orderable
      </div>

      {/* Builder */}
      <div style={{ padding: "0 16px 40px", maxWidth: "480px", margin: "0 auto" }}>
        <Section emoji="🍔" title="Your Burger" />
        <Card label="Patties"><RadioGrid options={PATTY_OPTIONS} value={patty} onChange={setPatty} /></Card>
        <Card label="Cheese"><RadioGrid options={CHEESE_OPTIONS} value={cheese} onChange={setCheese} /></Card>
        <Card label="Bun / Wrap"><RadioGrid options={BUN_OPTIONS} value={bun} onChange={setBun} /></Card>
        <Card label="Cook Style"><RadioGrid options={PATTY_COOK} value={cook} onChange={setCook} /></Card>
        <Card label={`Toppings — ${Object.values(toppings).filter(Boolean).length} selected`}>
          <CheckGrid options={TOPPINGS} values={toppings} onToggle={toggleTop} />
        </Card>

        <Section emoji="🍟" title="Your Fries" />
        <Card label="Cook Style"><RadioGrid options={FRIES_STYLE} value={friesStyle} onChange={setFriesStyle} /></Card>
        <Card label="Toppings">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {FRIES_TOPPINGS.map(o => (
              <button key={o.id} onClick={() => setFriesTop(o.id)} style={{ padding: "11px 14px", borderRadius: "8px", textAlign: "left", border: friesTop === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`, background: friesTop === o.id ? "#FFF0F0" : WHITE, color: friesTop === o.id ? RED : DARK, fontWeight: friesTop === o.id ? "700" : "400", fontSize: "13px", cursor: "pointer" }}>{o.label}</button>
            ))}
          </div>
        </Card>

        <Section emoji="🥤" title="Your Drink" />
        <Card label="Type"><RadioGrid options={DRINK_TYPE} value={drinkType} onChange={setDrinkType} cols={3} /></Card>
        {drinkType === "soda" && <Card label="Soda"><RadioGrid options={SODAS} value={soda} onChange={setSoda} /></Card>}
        {drinkType === "shake" && <>
          <Card label="Flavor"><RadioGrid options={SHAKE_FLAVORS} value={shakeBase} onChange={setShakeBase} cols={3} /></Card>
          <Card label="Size"><RadioGrid options={SHAKE_SIZE} value={shakeSize} onChange={setShakeSize} cols={3} /></Card>
        </>}
        {drinkType === "float" && <Card label="Float">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {FLOAT_OPTIONS.map(o => <button key={o.id} onClick={() => setFloatChoice(o.id)} style={{ padding: "11px 14px", borderRadius: "8px", textAlign: "left", border: floatChoice === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`, background: floatChoice === o.id ? "#FFF0F0" : WHITE, color: floatChoice === o.id ? RED : DARK, fontWeight: floatChoice === o.id ? "700" : "400", fontSize: "13px", cursor: "pointer" }}>{o.label}</button>)}
          </div>
        </Card>}
        {drinkType === "secret_mix" && <Card label="Secret Mix">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {SECRET_MIXES.map(o => <button key={o.id} onClick={() => setSecretMix(o.id)} style={{ padding: "11px 14px", borderRadius: "8px", textAlign: "left", border: secretMix === o.id ? `2px solid ${RED}` : `2px solid ${LIGHT_GRAY}`, background: secretMix === o.id ? "#FFF0F0" : WHITE, color: secretMix === o.id ? RED : DARK, fontWeight: secretMix === o.id ? "700" : "400", fontSize: "13px", cursor: "pointer" }}>{o.label}</button>)}
          </div>
        </Card>}

        <Section emoji="🗣️" title="Your Order" />
        <OrderPanel patty={patty} cheese={cheese} bun={bun} cook={cook} toppings={toppings} friesStyle={friesStyle} friesTop={friesTop} drinkType={drinkType} soda={soda} shakeBase={shakeBase} shakeSize={shakeSize} floatChoice={floatChoice} secretMix={secretMix} />

        <button onClick={reset} style={{ width: "100%", marginTop: "14px", padding: "14px", borderRadius: "10px", background: RED, color: WHITE, fontWeight: "900", fontSize: "15px", letterSpacing: "1px", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
          Reset & Start Over
        </button>
      </div>

      {/* Footer */}
      <div style={{ background: DARK, padding: "20px 16px", textAlign: "center" }}>
        <a href="https://secretmenubuilder.com" style={{ color: RED, fontWeight: "700", fontSize: "13px", textDecoration: "none" }}>
          Full guides & secret menu explainers →
        </a>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "10px 0 0", lineHeight: "1.5" }}>
          Independent fan site. Not affiliated with any restaurant chain.
        </p>
      </div>
    </div>
  );
}
