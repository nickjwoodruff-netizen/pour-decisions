import { useState, useRef } from "react";

if (typeof document !== "undefined" && !document.getElementById("pd-fonts")) {
  const l = document.createElement("link");
  l.id = "pd-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Inter:ital,wght@0,400;0,500;1,400&display=swap";
  document.head.appendChild(l);
}

const C = {
  bg: "#0A0510",
  bgSoft: "#0F0B17",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.1)",
  accent: "#FF2D78",
  gold: "#F5A623",
  cyan: "#00CFFF",
  purple: "#B36BFF",
  green: "#00E676",
  text: "#FFFFFF",
  muted: "#A89FC4",
  dim: "#7D7C8F",
};

const display = "'Playfair Display', serif";
const sans = "'Space Grotesk', sans-serif";
const body = "'Inter', sans-serif";

const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");

// ─── Shared UI ────────────────────────────────────────────────

function Btn({ children, onClick, variant = "primary", disabled = false }) {
  const bgs = {
    primary: `linear-gradient(135deg,${C.accent},#FF6B6B)`,
    gold: `linear-gradient(135deg,${C.gold},#FF8C00)`,
    secondary: "transparent",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bgs[variant],
        color: "#fff",
        border: variant === "secondary" ? `1px solid ${C.border}` : "none",
        padding: "13px 26px",
        borderRadius: 50,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: sans,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.3s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </button>
  );
}

function Tabs({ opts, val, onChange, accent = C.accent }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          style={{
            flex: 1,
            padding: "11px 6px",
            borderRadius: 10,
            border: `1.5px solid ${val === o.v ? accent : C.border}`,
            background: val === o.v ? `rgba(${hexRgb(accent)},0.12)` : "transparent",
            color: val === o.v ? "#fff" : C.muted,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Lbl({ children }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: C.dim,
        letterSpacing: "0.12em",
        margin: "0 0 12px",
        fontFamily: sans,
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function StepIndicator({ step }) {
  const steps = ["Menu", "People", "Vibe", "Results"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "16px 0", marginBottom: 8 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: i < step ? C.accent : i === step - 1 ? `rgba(${hexRgb(C.accent)},0.3)` : "transparent",
              border: `1px solid ${i < step || i === step - 1 ? C.accent : C.dim}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: i < step ? "#000" : C.muted,
              fontFamily: sans,
              transition: "all 0.3s",
            }}
          >
            {i + 1}
          </div>
          <span style={{ fontSize: 12, color: i <= step - 1 ? C.text : C.dim, fontFamily: sans, fontWeight: i === step - 1 ? 600 : 400 }}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div style={{ width: 20, height: "1px", background: i < step - 1 ? C.accent : C.border }} />
          )}
        </div>
      ))}
    </div>
  );
}

const inp = (extra = {}) => ({
  width: "100%",
  background: `rgba(255,255,255,0.05)`,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "12px 16px",
  color: "#fff",
  fontFamily: body,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s",
  ...extra,
});

// ─── Photo Upload Component ────────────────────────────────────

function PhotoUploadButton({ onPhoto, label = "📷 Upload photo", loading = false }) {
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const MAX = 1024;
        let { width, height } = img;
        if (width > height && width > MAX) { height = (height * MAX) / width; width = MAX; }
        else if (height > MAX) { width = (width * MAX) / height; height = MAX; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
      };
      img.onerror = () => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ base64: e.target.result.split(",")[1], mediaType: "image/jpeg" });
        reader.readAsDataURL(file);
      };
      img.src = url;
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { base64, mediaType } = await compressImage(file);
    if (base64) onPhoto(base64, mediaType);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        style={{
          flex: 1,
          padding: "12px 6px",
          borderRadius: 10,
          border: `1.5px dashed ${C.cyan}`,
          background: "transparent",
          color: C.cyan,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 13,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "all 0.2s",
        }}
      >
        {loading ? "Analyzing..." : label}
      </button>
    </>
  );
}

// ─── Person Card ──────────────────────────────────────────────

function PersonCard({ p, index, showRemove, onChange, onRemove, showLastDrink, onPhotoAnalyzed, analyzingPhoto }) {
  const [analyzing, setAnalyzing] = useState(false);

  const alcOpts = [
    { v: true, l: "🍺 Alcoholic" },
    { v: false, l: "🥤 Non-alcoholic" },
  ];

  const handlePhotoAnalysis = async (base64, mediaType = "image/jpeg") => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Photo analysis failed: " + (data.error || "Unknown error"));
        return;
      }

      if (data.description) {
        onPhotoAnalyzed(data.description, base64);
      }
    } catch (err) {
      console.error("Photo analysis error:", err);
      alert("Photo error: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div
      style={{
        background: C.bgSoft,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.3s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.dim, fontFamily: sans, letterSpacing: "0.1em" }}>
          PERSON {index + 1}
        </span>
        {showRemove && (
          <button
            onClick={onRemove}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 18,
              cursor: "pointer",
              padding: "0 4px",
              opacity: 0.6,
              transition: "opacity 0.2s",
            }}
          >
            ✕
          </button>
        )}
      </div>

      <input
        value={p.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Name (optional)"
        style={inp()}
      />

      <textarea
        value={p.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="What are they like? Personality, vibe, style..."
        style={inp({
          resize: "none",
          minHeight: 70,
          lineHeight: 1.5,
          fontFamily: body,
        })}
      />

      {analyzing ? (
        <div
          style={{
            background: `rgba(${hexRgb(C.cyan)},0.07)`,
            border: `1.5px dashed ${C.cyan}`,
            borderRadius: 12,
            padding: "18px 14px",
            textAlign: "center",
          }}
        >
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 28, marginBottom: 8, display: "inline-block", animation: "spin 1.2s linear infinite" }}>📷</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, fontFamily: sans, marginBottom: 4 }}>
            Reading the vibe...
          </div>
          <div style={{ fontSize: 11, color: C.dim, fontFamily: body }}>Usually 5–10 seconds</div>
          <div style={{ marginTop: 10, height: 3, background: `rgba(${hexRgb(C.cyan)},0.15)`, borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg,${C.cyan},${C.purple})`,
              borderRadius: 2,
              animation: "bar 8s ease-out forwards",
            }} />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <PhotoUploadButton
            onPhoto={handlePhotoAnalysis}
            label={p.photoAnalysis ? "📷 Retake photo" : "📷 Add photo"}
            loading={false}
          />
        </div>
      )}

      {!analyzing && p.photoAnalysis && (
        <div
          style={{
            background: `rgba(${hexRgb(C.cyan)},0.1)`,
            border: `1px solid rgba(${hexRgb(C.cyan)},0.3)`,
            borderRadius: 10,
            padding: 10,
            fontSize: 12,
            color: C.muted,
            fontFamily: body,
            lineHeight: 1.5,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          {p.photoPreview && (
            <img
              src={`data:image/jpeg;base64,${p.photoPreview}`}
              alt="person"
              style={{
                width: 52,
                height: 52,
                borderRadius: 10,
                objectFit: "cover",
                flexShrink: 0,
                border: `1.5px solid rgba(${hexRgb(C.cyan)},0.4)`,
              }}
            />
          )}
          <div>
            <div style={{ fontSize: 10, color: C.cyan, fontWeight: 700, marginBottom: 4 }}>FROM PHOTO</div>
            {p.photoAnalysis}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {alcOpts.map((o) => (
          <button
            key={String(o.v)}
            onClick={() => onChange("alcoholic", o.v)}
            style={{
              flex: 1,
              padding: "10px 6px",
              borderRadius: 10,
              border: `1.5px solid ${p.alcoholic === o.v ? C.cyan : C.border}`,
              background: p.alcoholic === o.v ? `rgba(${hexRgb(C.cyan)},0.12)` : "transparent",
              color: p.alcoholic === o.v ? "#fff" : C.muted,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {o.l}
          </button>
        ))}
      </div>

      <input
        value={p.cantDrink}
        onChange={(e) => onChange("cantDrink", e.target.value)}
        placeholder="Anything they can't drink? (e.g., no tequila, nut allergy)"
        style={inp()}
      />

      {showLastDrink && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <input
            value={p.lastDrink}
            onChange={(e) => onChange("lastDrink", e.target.value)}
            placeholder="What was their last drink?"
            style={inp()}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { v: false, l: "🔁 Again" },
              { v: true, l: "🚫 Avoid" },
            ].map((o) => (
              <button
                key={String(o.v)}
                onClick={() => onChange("avoidLast", o.v)}
                style={{
                  flex: 1,
                  padding: "9px 6px",
                  borderRadius: 10,
                  border: `1.5px solid ${p.avoidLast === o.v ? C.gold : C.border}`,
                  background: p.avoidLast === o.v ? `rgba(${hexRgb(C.gold)},0.12)` : "transparent",
                  color: p.avoidLast === o.v ? "#fff" : C.muted,
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 1: Menu ─────────────────────────────────────────────

function MenuStep({ onNext }) {
  const [mode, setMode] = useState("type");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [analyzingMenu, setAnalyzingMenu] = useState(false);

  const handleMenuPhoto = async (base64, mediaType = "image/jpeg") => {
    setAnalyzingMenu(true);
    try {
      const res = await fetch("/api/analyze-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert("Menu analysis failed: " + (data.error || "Unknown error"));
        setAnalyzingMenu(false);
        return;
      }

      const data = await res.json();
      setText(data.menu);
      setMode("type");
    } catch (err) {
      console.error("Menu photo error:", err);
      alert("Failed to analyze menu photo");
    } finally {
      setAnalyzingMenu(false);
    }
  };

  const ok = mode === "type" ? !!text.trim() : !!url.trim();

  return (
    <div style={{ padding: "8px 20px 36px" }}>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          margin: "20px 0 6px",
          fontFamily: display,
          letterSpacing: "-0.02em",
        }}
      >
        What's on the menu? 🍹
      </h2>
      <p style={{ color: C.muted, margin: "0 0 28px", fontSize: 15, fontFamily: body }}>
        Tell us what drinks are available.
      </p>

      <Tabs
        opts={[
          { v: "type", l: "✍️ Type it" },
          { v: "photo", l: "📸 Photo" },
          { v: "url", l: "🔗 Link" },
        ]}
        val={mode}
        onChange={setMode}
      />

      {mode === "type" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "What's available?\n\nGin & Tonic, Mojito, House Red, Aperol Spritz, Espresso Martini, Old Fashioned..."
            }
            style={{
              width: "100%",
              minHeight: 160,
              background: C.bgSoft,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: 16,
              color: "#fff",
              fontFamily: body,
              fontSize: 15,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              lineHeight: 1.6,
            }}
          />
          {analyzingMenu ? (
            <div style={{
              background: `rgba(${hexRgb(C.cyan)},0.07)`,
              border: `1.5px dashed ${C.cyan}`,
              borderRadius: 12, padding: "18px 14px", textAlign: "center",
            }}>
              <style>{`@keyframes spinMenu { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } @keyframes barMenu { 0%{width:0%} 60%{width:72%} 100%{width:90%} }`}</style>
              <div style={{ fontSize: 28, marginBottom: 8, display: "inline-block", animation: "spinMenu 1.2s linear infinite" }}>🍹</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, fontFamily: sans, marginBottom: 4 }}>Reading the menu...</div>
              <div style={{ fontSize: 11, color: C.dim, fontFamily: body, marginBottom: 10 }}>Usually 5–10 seconds</div>
              <div style={{ height: 3, background: `rgba(${hexRgb(C.cyan)},0.15)`, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: `linear-gradient(90deg,${C.cyan},${C.gold})`, borderRadius: 2, animation: "barMenu 8s ease-out forwards" }} />
              </div>
            </div>
          ) : (
            <PhotoUploadButton onPhoto={handleMenuPhoto} label="📸 Scan menu photo" loading={false} />
          )}
        </div>
      )}

      {mode === "photo" && (
        analyzingMenu ? (
          <div style={{
            background: `rgba(${hexRgb(C.cyan)},0.07)`,
            border: `1.5px dashed ${C.cyan}`,
            borderRadius: 14, padding: "28px 16px", textAlign: "center",
          }}>
            <style>{`@keyframes spinMenu { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } @keyframes barMenu { 0%{width:0%} 60%{width:72%} 100%{width:90%} }`}</style>
            <div style={{ fontSize: 36, marginBottom: 10, display: "inline-block", animation: "spinMenu 1.2s linear infinite" }}>🍹</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.cyan, fontFamily: sans, marginBottom: 4 }}>Reading the menu...</div>
            <div style={{ fontSize: 12, color: C.dim, fontFamily: body, marginBottom: 12 }}>Usually 5–10 seconds</div>
            <div style={{ height: 3, background: `rgba(${hexRgb(C.cyan)},0.15)`, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg,${C.cyan},${C.gold})`, borderRadius: 2, animation: "barMenu 8s ease-out forwards" }} />
            </div>
          </div>
        ) : (
          <div style={{
            background: C.bgSoft,
            border: `2px dashed ${C.cyan}`,
            borderRadius: 14, padding: 32, textAlign: "center",
            display: "flex", flexDirection: "column", gap: 16, alignItems: "center",
          }}>
            <div style={{ fontSize: 40 }}>📸</div>
            <PhotoUploadButton onPhoto={handleMenuPhoto} label="📷 Choose menu photo" loading={false} />
            <p style={{ color: C.dim, fontSize: 12, margin: 0, fontFamily: body }}>Takes 5–10 seconds to analyze</p>
            {text && (
              <div style={{
                background: `rgba(${hexRgb(C.cyan)},0.1)`,
                border: `1px solid rgba(${hexRgb(C.cyan)},0.3)`,
                borderRadius: 10, padding: 12, width: "100%",
                fontSize: 12, color: C.text, fontFamily: body,
                textAlign: "left", maxHeight: 120, overflowY: "auto",
              }}>
                {text}
              </div>
            )}
          </div>
        )
      )}

      {mode === "url" && (
        <div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://thebaronbroadway.com/drinks"
            style={inp({ borderRadius: 50, padding: "14px 20px" })}
          />
          <p style={{ color: C.dim, fontSize: 12, margin: "10px 0 0", fontFamily: body }}>
            We'll search for this venue's drinks menu.
          </p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
        <Btn disabled={!ok} onClick={() => onNext({ mode, text, url })}>
          Next →
        </Btn>
      </div>
    </div>
  );
}

// ─── Step 2: People ───────────────────────────────────────────

const newPerson = (id) => ({
  id,
  name: "",
  description: "",
  photoAnalysis: "",
  photoPreview: "",   // base64 jpeg for display in results
  alcoholic: true,
  cantDrink: "",
  lastDrink: "",
  avoidLast: false,
});

// ─── Group Photo Uploader ─────────────────────────────────────

function GroupPhotoUploader({ onGroupAnalyzed }) {
  const fileInputRef = useRef(null);
  const [analyzing, setAnalyzing] = useState(false);

  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const MAX = 1024;
      let { width, height } = img;
      if (width > height && width > MAX) { height = (height * MAX) / width; width = MAX; }
      else if (height > MAX) { width = (width * MAX) / height; height = MAX; }
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve({ base64: canvas.toDataURL("image/jpeg", 0.85).split(",")[1], mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      const r = new FileReader();
      r.onload = (e) => resolve({ base64: e.target.result.split(",")[1], mediaType: "image/jpeg" });
      r.readAsDataURL(file);
    };
    img.src = url;
  });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    try {
      const { base64, mediaType } = await compressImage(file);
      const res = await fetch("/api/analyze-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok) { alert("Group photo failed: " + (data.error || "Unknown")); return; }
      onGroupAnalyzed(data.people, base64);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) return (
    <div style={{
      background: `rgba(${hexRgb(C.purple)},0.07)`,
      border: `1.5px dashed ${C.purple}`,
      borderRadius: 14, padding: "24px 16px", textAlign: "center",
    }}>
      <style>{`@keyframes spin2 { from { transform:rotate(0deg) } to { transform:rotate(360deg) } } @keyframes bar { 0%{width:0%} 60%{width:70%} 100%{width:88%} }`}</style>
      <div style={{ fontSize: 36, marginBottom: 10, display: "inline-block", animation: "spin2 1.2s linear infinite" }}>👥</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.purple, fontFamily: sans, marginBottom: 4 }}>Spotting the crew...</div>
      <div style={{ fontSize: 12, color: C.dim, fontFamily: body, marginBottom: 12 }}>Usually 5–10 seconds</div>
      <div style={{ height: 3, background: `rgba(${hexRgb(C.purple)},0.15)`, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg,${C.purple},${C.accent})`, borderRadius: 2, animation: "bar 8s ease-out forwards" }} />
      </div>
    </div>
  );

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <button onClick={() => fileInputRef.current?.click()} style={{
        width: "100%", padding: "18px 16px", borderRadius: 14,
        border: `1.5px dashed ${C.purple}`,
        background: `rgba(${hexRgb(C.purple)},0.07)`,
        color: C.purple, fontFamily: sans, fontWeight: 600, fontSize: 15,
        cursor: "pointer", textAlign: "center", transition: "all 0.2s",
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>👥</div>
        <div>Upload group photo</div>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 4, fontWeight: 400 }}>We'll detect everyone automatically</div>
      </button>
    </>
  );
}

function PeopleStep({ onNext, onBack }) {
  const [people, setPeople] = useState([newPerson(1)]);
  const [tone, setTone] = useState("witty");
  const [avoidMode, setAvoidMode] = useState("no");
  const [groupPhotoPreview, setGroupPhotoPreview] = useState(null);
  const [inputMode, setInputMode] = useState("manual");

  const update = (id, field, value) =>
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const canNext = people.some((p) => p.name || p.description || p.photoAnalysis);

  const handleGroupAnalyzed = (detectedPeople, base64) => {
    setGroupPhotoPreview(base64);
    const newPeople = detectedPeople.map((dp, i) => ({
      ...newPerson(Date.now() + i),
      name: dp.funName,
      photoAnalysis: dp.vibe,
      photoPreview: base64,
    }));
    setPeople(newPeople);
    setInputMode("manual");
  };

  const tones = [
    { id: "witty", l: "😏 Witty", d: "Clever & charming" },
    { id: "roast", l: "🔥 Roast", d: "Playful & spicy" },
    { id: "dramatic", l: "🎭 Dramatic", d: "Over the top" },
    { id: "kind", l: "💛 Kind", d: "Warm & wholesome" },
  ];

  return (
    <div style={{ padding: "8px 20px 36px" }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, margin: "20px 0 6px", fontFamily: display, letterSpacing: "-0.02em" }}>
        Who's drinking? 🥳
      </h2>
      <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 15, fontFamily: body }}>
        Tell the bartender about each person.
      </p>

      <Tabs
        opts={[{ v: "manual", l: "👤 Add people" }, { v: "group", l: "👥 Group photo" }]}
        val={inputMode}
        onChange={setInputMode}
        accent={C.purple}
      />

      {inputMode === "group" && (
        <GroupPhotoUploader onGroupAnalyzed={handleGroupAnalyzed} />
      )}

      {inputMode === "manual" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {groupPhotoPreview && (
            <div style={{
              background: `rgba(${hexRgb(C.purple)},0.08)`,
              border: `1px solid rgba(${hexRgb(C.purple)},0.3)`,
              borderRadius: 12, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <img src={`data:image/jpeg;base64,${groupPhotoPreview}`} alt="group"
                style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, fontFamily: sans }}>✅ Group photo scanned</div>
                <div style={{ fontSize: 11, color: C.dim, fontFamily: body }}>{people.length} people detected — vibes revealed at results</div>
              </div>
            </div>
          )}

          {people.map((p, i) => (
            <PersonCard
              key={p.id}
              p={p}
              index={i}
              showRemove={people.length > 1}
              showLastDrink={avoidMode === "individual"}
              onChange={(field, val) => update(p.id, field, val)}
              onRemove={() => setPeople((prev) => prev.filter((pp) => pp.id !== p.id))}
              onPhotoAnalyzed={(desc, preview) => {
                update(p.id, "photoAnalysis", desc);
                if (preview) update(p.id, "photoPreview", preview);
              }}
              analyzingPhoto={false}
              fromGroupPhoto={!!groupPhotoPreview}
            />
          ))}
          <button
            onClick={() => setPeople((prev) => [...prev, newPerson(Date.now())])}
            style={{
              background: "transparent", border: `1.5px dashed ${C.dim}`,
              borderRadius: 12, padding: 14, color: C.muted, fontFamily: sans,
              cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
            }}
          >
            + Add person
          </button>
        </div>
      )}

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
        <Lbl>Avoid their last drink?</Lbl>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { v: "no", l: "🔁 No" },
            { v: "everyone", l: "🚫 Yes, everyone" },
            { v: "individual", l: "👤 Per person" },
          ].map((o) => (
            <button key={o.v} onClick={() => setAvoidMode(o.v)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 12,
              border: `1.5px solid ${avoidMode === o.v ? C.gold : C.border}`,
              background: avoidMode === o.v ? `rgba(${hexRgb(C.gold)},0.12)` : "transparent",
              color: avoidMode === o.v ? "#fff" : C.muted,
              fontFamily: sans, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
            }}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Lbl>Bartender vibe</Lbl>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {tones.map((t) => (
            <button key={t.id} onClick={() => setTone(t.id)} style={{
              padding: 14, borderRadius: 12,
              border: `1.5px solid ${tone === t.id ? C.accent : C.border}`,
              background: tone === t.id ? `rgba(${hexRgb(C.accent)},0.12)` : "transparent",
              color: tone === t.id ? "#fff" : C.muted,
              fontFamily: sans, fontWeight: 600, fontSize: 14,
              cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            }}>
              <div>{t.l}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: C.dim, marginTop: 4 }}>{t.d}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        <Btn variant="secondary" onClick={onBack}>← Back</Btn>
        <Btn disabled={!canNext} onClick={() => onNext({ people, tone, avoidMode })}>Next →</Btn>
      </div>
    </div>
  );
}
// ─── Step 3: Vibe ─────────────────────────────────────────────

function VibeStep({ onNext, onBack }) {
  const [play, setPlay] = useState("fun");
  const [time, setTime] = useState("few");

  return (
    <div style={{ padding: "8px 20px 36px" }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, margin: "20px 0 6px", fontFamily: display, letterSpacing: "-0.02em" }}>
        Set the vibe ✨
      </h2>
      <p style={{ color: C.muted, margin: "0 0 28px", fontSize: 15, fontFamily: body }}>
        Two quick questions.
      </p>

      <div style={{ marginBottom: 28 }}>
        <Lbl>Playfulness level</Lbl>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "chill", l: "😌 Chill" },
            { id: "fun", l: "🎉 Fun" },
            { id: "wild", l: "🔥 Wild" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPlay(p.id)}
              style={{
                flex: 1,
                padding: "14px 6px",
                borderRadius: 10,
                border: `1.5px solid ${play === p.id ? C.gold : C.border}`,
                background: play === p.id ? `rgba(${hexRgb(C.gold)},0.12)` : "transparent",
                color: play === p.id ? "#fff" : C.muted,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Lbl>How long are you staying?</Lbl>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "one", l: "1️⃣ One drink" },
            { id: "few", l: "🔄 A few" },
            { id: "night", l: "🌙 All night" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTime(t.id)}
              style={{
                flex: 1,
                padding: "14px 6px",
                borderRadius: 10,
                border: `1.5px solid ${time === t.id ? C.purple : C.border}`,
                background: time === t.id ? `rgba(${hexRgb(C.purple)},0.12)` : "transparent",
                color: time === t.id ? "#fff" : C.muted,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
        <Btn variant="secondary" onClick={onBack}>
          ← Back
        </Btn>
        <Btn variant="gold" onClick={() => onNext({ play, time })}>
          🍹 Pour me a drink!
        </Btn>
      </div>
    </div>
  );
}

// ─── Step 4: Results ──────────────────────────────────────────

function ResultsStep({ results, loading, error, onRestart }) {
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 420,
          padding: 40,
          textAlign: "center",
        }}
      >
        <style>
          {`
            @keyframes shake { 0%,100% { transform: rotate(-12deg) scale(1) } 50% { transform: rotate(12deg) scale(1.15) } }
            @keyframes bar { 0% { width: 0% } 60% { width: 75% } 100% { width: 90% } }
          `}
        </style>
        <div style={{ fontSize: 60, animation: "shake 0.7s ease-in-out infinite", marginBottom: 20 }}>
          🍹
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px", fontFamily: display }}>
          Crafting your order...
        </h3>
        <p style={{ color: C.muted, fontSize: 15, margin: "0 0 24px", fontFamily: body }}>
          The bartender is mixing something special 👀
        </p>
        <div style={{ width: "100%", maxWidth: 240, height: 3, background: `rgba(${hexRgb(C.accent)},0.15)`, borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: `linear-gradient(90deg,${C.accent},${C.gold})`,
              borderRadius: 2,
              animation: "bar 8s ease-out forwards",
            }}
          />
        </div>
        <p style={{ color: C.dim, fontSize: 12, marginTop: 12, fontFamily: body }}>
          Usually 5–15 seconds
        </p>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😅</div>
        <h3 style={{ color: C.accent, marginBottom: 8, fontFamily: display, fontSize: 20 }}>
          Something went sideways
        </h3>
        <p
          style={{
            color: C.muted,
            marginBottom: 24,
            fontFamily: body,
            fontSize: 13,
            wordBreak: "break-word",
          }}
        >
          {error}
        </p>
        <Btn onClick={onRestart}>Try again</Btn>
      </div>
    );

  const ACCENTS = [C.accent, C.gold, C.cyan, C.purple, C.green, "#FF6B35"];

  return (
    <div style={{ padding: "8px 20px 56px" }}>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          margin: "20px 0 8px",
          background: `linear-gradient(135deg,${C.accent},${C.gold})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: display,
          letterSpacing: "-0.02em",
        }}
      >
        Drinks are served! 🎉
      </h2>
      <p style={{ color: C.muted, margin: "0 0 28px", fontSize: 15, fontFamily: body }}>
        Perfectly tailored for your crew.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {results.map((r, i) => {
          const a = ACCENTS[i % ACCENTS.length];
          const headline = r.personName ? `${r.personName}, the ${r.archetype}` : `The ${r.archetype}`;

          return (
            <div
              key={i}
              style={{
                background: `linear-gradient(135deg,rgba(${hexRgb(a)},0.1),rgba(${hexRgb(a)},0.03))`,
                border: `1px solid rgba(${hexRgb(a)},0.25)`,
                borderLeft: `3px solid ${a}`,
                borderRadius: 18,
                padding: 20,
                transition: "all 0.3s ease",
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              <style>
                {`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}
              </style>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                {r.photoPreview ? (
                  <img
                    src={`data:image/jpeg;base64,${r.photoPreview}`}
                    alt={r.personName || "person"}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      objectFit: "cover",
                      flexShrink: 0,
                      border: `2px solid rgba(${hexRgb(a)},0.5)`,
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{r.drinkEmoji || "🍹"}</span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      fontFamily: display,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {headline}
                  </div>
                  {r.photoPreview && (
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{r.drinkEmoji || "🍹"}</span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 700, color: a, fontFamily: sans, marginBottom: 12, letterSpacing: "0.01em" }}>
                Order a {r.drinkName}
              </div>

              {r.description && (
                <p
                  style={{
                    color: C.muted,
                    fontSize: 14,
                    margin: "0 0 14px",
                    fontFamily: body,
                    lineHeight: 1.6,
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  "{r.description}"
                </p>
              )}

              <div
                style={{
                  background: `rgba(${hexRgb(a)},0.08)`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  borderLeft: `2px solid ${a}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: a,
                    marginBottom: 6,
                    letterSpacing: "0.1em",
                    fontFamily: sans,
                    textTransform: "uppercase",
                  }}
                >
                  Why this one
                </div>
                <p style={{ margin: 0, fontSize: 13, fontFamily: body, lineHeight: 1.6, color: C.text }}>
                  {r.whyChosen}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 36, textAlign: "center" }}>
        <Btn variant="secondary" onClick={onRestart}>
          🔄 Order again
        </Btn>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────

export default function PourDecisions() {
  const [step, setStep] = useState(1);
  const [menu, setMenu] = useState(null);
  const [peopleData, setPeopleData] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (vibeData) => {
    setLoading(true);
    setError(null);
    setStep(4);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu,
          peopleData,
          vibeData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate recommendations");
      }

      // Merge photo previews from people into results (AI can't return photos)
      const enriched = data.results.map((r, i) => {
        const person = peopleData?.people?.[i];
        return { ...r, photoPreview: person?.photoPreview || "" };
      });
      setResults(enriched);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(1);
    setMenu(null);
    setPeopleData(null);
    setResults([]);
    setError(null);
    setLoading(false);
  };

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: sans,
        color: "#fff",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div style={{ padding: "32px 20px 8px", textAlign: "center" }}>
        <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>🍹</div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            background: `linear-gradient(135deg,${C.accent} 0%,${C.gold} 50%,${C.cyan} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 4px",
            fontFamily: display,
          }}
        >
          Pour Decisions
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.dim,
            letterSpacing: "0.06em",
            fontFamily: sans,
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          Bartender AI
        </div>
      </div>

      {step < 4 && <StepIndicator step={step} />}

      {step === 1 && <MenuStep onNext={(d) => { setMenu(d); setStep(2); }} />}
      {step === 2 && (
        <PeopleStep
          onNext={(d) => { setPeopleData(d); setStep(3); }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <VibeStep onNext={generate} onBack={() => setStep(2)} />}
      {step === 4 && (
        <ResultsStep results={results} loading={loading} error={error} onRestart={restart} />
      )}
    </div>
  );
}
