import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode, faReceipt, faVideo, faTv, faServer, faLock, faRobot, faFilePdf,
  faWandMagicSparkles, faDatabase, faBolt, faUsers, faShop,
} from "@fortawesome/free-solid-svg-icons";
import { faEtsy, faShopify } from "@fortawesome/free-brands-svg-icons";
import "../css/visuals.scss";

// Drawn illustrations for projects without a screenshot. Each is a small
// scene built from HTML and CSS so it stays sharp at any size and can move.
// Content is illustrative, not real data.

const Admin = () => (
  <div className="vz vz-admin">
    <div className="vz-window">
      <div className="vz-bar"><i /><i /><i /><span>admin</span></div>
      <div className="vz-admin-body">
        <aside>
          {["Sales", "Products", "Stock", "Payments", "Regions"].map((t, i) => <span key={t} className={i === 0 ? "on" : ""}>{t}</span>)}
        </aside>
        <div className="vz-admin-main">
          <div className="vz-admin-head">
            <b>Sales</b>
            <span className="vz-pill">CA</span><span className="vz-pill ghost">IN</span>
          </div>
          <div className="vz-bars">
            {[40, 62, 48, 80, 66, 92, 74].map((h, i) => <span key={i} style={{ "--h": `${h}%`, "--d": `${i * 0.08}s` }} />)}
          </div>
          <div className="vz-channels">
            <span><FontAwesomeIcon icon={faShop} /> Shop</span>
            <span><FontAwesomeIcon icon={faEtsy} /> Etsy</span>
            <span><FontAwesomeIcon icon={faShopify} /> Shopify</span>
            <em>in sync</em>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Pos = () => (
  <div className="vz vz-pos">
    <div className="vz-phone">
      <div className="vz-phone-notch" />
      <div className="vz-scan">
        <FontAwesomeIcon icon={faQrcode} className="vz-qr" />
        <span className="vz-scan-line" />
        <span className="vz-corner tl" /><span className="vz-corner tr" /><span className="vz-corner bl" /><span className="vz-corner br" />
      </div>
      <div className="vz-unit">
        <b>Unit A-1042</b>
        <span>Gold ring, 22k</span>
        <em>In stock at Shop</em>
      </div>
      <div className="vz-actions"><span>Sell</span><span>Transfer</span><span>Rent</span></div>
      <div className="vz-offline"><i /> Offline, will sync</div>
    </div>
    <div className="vz-receipt">
      <FontAwesomeIcon icon={faReceipt} />
      <span /><span /><span /><span className="short" />
    </div>
  </div>
);

const Cctv = () => (
  <div className="vz vz-cctv">
    <div className="vz-node">
      <small>Shop</small>
      <div className="vz-row"><FontAwesomeIcon icon={faVideo} /><FontAwesomeIcon icon={faVideo} /><FontAwesomeIcon icon={faVideo} /></div>
      <span className="vz-chip">NVR</span>
      <span className="vz-chip pi">Raspberry Pi</span>
    </div>
    <div className="vz-tunnel">
      <span className="vz-nat">carrier-grade NAT</span>
      <div className="vz-pipe"><i /><i /><i /><i /></div>
      <span className="vz-ts"><FontAwesomeIcon icon={faLock} /> Tailscale</span>
    </div>
    <div className="vz-node">
      <small>Home</small>
      <span className="vz-chip pi">Raspberry Pi</span>
      <div className="vz-tv"><FontAwesomeIcon icon={faTv} /><span className="vz-live">LIVE</span></div>
    </div>
  </div>
);

const Review = () => (
  <div className="vz vz-review">
    <div className="vz-window">
      <div className="vz-bar"><i /><i /><i /><span>Pull request</span></div>
      <pre className="vz-diff">
        <span className="del">- catch (e) {"{ }"}</span>
        <span className="add">+ catch (e) {"{"}</span>
        <span className="add">+   logger.error(e, ctx);</span>
        <span className="add">+   throw new DomainError(e);</span>
        <span>  {"}"}</span>
      </pre>
      <div className="vz-comment">
        <span className="vz-bot"><FontAwesomeIcon icon={faRobot} /></span>
        <div>
          <b>AI reviewer</b>
          <p>Swallowed exceptions break the error-handling standard. Log with context and rethrow.</p>
          <cite>Engineering wiki: Error handling</cite>
        </div>
      </div>
    </div>
  </div>
);

const LANGS = [
  ["en", "Welcome back"], ["fr", "Bon retour"], ["de", "Willkommen zurück"], ["es", "Bienvenido de nuevo"],
  ["ar", "مرحبًا بعودتك"], ["cy", "Croeso nôl"], ["he", "ברוך שובך"], ["vi", "Chào mừng trở lại"],
  ["tr", "Tekrar hoş geldin"], ["ca", "Benvingut de nou"], ["gd", "Fàilte air ais"],
];
const RTL = new Set(["ar", "he"]);

const I18n = ({ live }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % LANGS.length), 1400);
    return () => clearInterval(t);
  }, [live]);
  const [code, text] = LANGS[i];
  const rtl = RTL.has(code);
  return (
    <div className="vz vz-i18n">
      <div className={`vz-window ${rtl ? "is-rtl" : ""}`} dir={rtl ? "rtl" : "ltr"}>
        <div className="vz-bar"><i /><i /><i /><span>{code.toUpperCase()} {rtl ? "· RTL" : ""}</span></div>
        <div className="vz-i18n-body">
          <h3 key={code}>{text}</h3>
          <div className="vz-lines"><span /><span /><span className="short" /></div>
          <div className="vz-a11y"><span>Focus visible</span><span>Contrast AA</span><span>Screen reader labels</span></div>
        </div>
      </div>
      <div className="vz-langs">
        {LANGS.map(([c], k) => <span key={c} className={k === i ? "on" : ""}>{c}</span>)}
        <span className="more">+2</span>
      </div>
    </div>
  );
};

const Forms = () => (
  <div className="vz vz-forms">
    <div className="vz-prompt">
      <span className="vz-bubble"><FontAwesomeIcon icon={faWandMagicSparkles} /> A site inspection form with a signature</span>
      <span className="vz-file"><FontAwesomeIcon icon={faFilePdf} /> old-inspection.pdf</span>
    </div>
    <div className="vz-arrow" />
    <div className="vz-form">
      {["Inspector name", "Site", "Hazards found", "Photos", "Signature"].map((l, k) => (
        <div className="vz-field" key={l} style={{ "--d": `${k * 0.35}s` }}><label>{l}</label><span /></div>
      ))}
    </div>
  </div>
);

const Library = () => (
  <div className="vz vz-library">
    <aside>
      <b>Storybook</b>
      {["Button", "Input", "Toggle", "Card", "Tabs", "Badge"].map((t, k) => <span key={t} className={k === 0 ? "on" : ""}>{t}</span>)}
    </aside>
    <div className="vz-grid">
      <div className="vz-tile"><span className="vz-btn">Primary</span><span className="vz-btn ghost">Ghost</span></div>
      <div className="vz-tile"><span className="vz-input">Search locations</span></div>
      <div className="vz-tile"><span className="vz-toggle"><i /></span><span className="vz-toggle off"><i /></span></div>
      <div className="vz-tile"><span className="vz-badge">New</span><span className="vz-badge warn">Due</span></div>
      <div className="vz-tile wide"><span className="vz-tabs"><b>Overview</b><span>History</span><span>Files</span></span></div>
      <div className="vz-tile wide"><span className="vz-npm">npm i @bis/ui</span></div>
    </div>
  </div>
);

const Realtime = () => (
  <div className="vz vz-realtime">
    <div className="vz-col">
      <small>Clients</small>
      {[0, 1, 2, 3].map((k) => <span key={k} className="vz-client"><FontAwesomeIcon icon={faUsers} /></span>)}
    </div>
    <div className="vz-wires">
      {[0, 1, 2, 3].map((k) => <span key={k} className="vz-wire" style={{ "--d": `${k * 0.3}s` }}><i /></span>)}
      <small>WebSocket</small>
    </div>
    <div className="vz-col center">
      <span className="vz-server"><FontAwesomeIcon icon={faServer} /><b>Node.js</b><em>AWS EC2</em></span>
    </div>
    <div className="vz-wires single"><span className="vz-wire slow"><i /></span></div>
    <div className="vz-col">
      <span className="vz-db"><FontAwesomeIcon icon={faDatabase} /><b>Database</b></span>
      <span className="vz-cache"><FontAwesomeIcon icon={faBolt} /><b>Redis</b></span>
    </div>
  </div>
);

const DRAWN = { admin: Admin, pos: Pos, cctv: Cctv, review: Review, i18n: I18n, forms: Forms, library: Library, realtime: Realtime };

// Plays the loop only while its card is live.
const LoopVideo = ({ visual, live }) => {
  const ref = React.useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (live) v.play().catch(() => {}); else v.pause();
  }, [live]);
  return (
    <video ref={ref} muted loop playsInline preload="metadata" poster={visual.poster} aria-label={visual.alt}>
      <source src={visual.video[0]} type="video/webm" />
      <source src={visual.video[1]} type="video/mp4" />
    </video>
  );
};

export const Visual = ({ visual, live = true }) => {
  if (visual.drawn) {
    const Drawn = DRAWN[visual.drawn];
    // drawn scenes are landscape: keep them in a 4:3 frame whatever the column shape
    return <div className={`vz-frame${live ? "" : " is-paused"}`}><div className="vz-frame-box"><Drawn live={live} /></div></div>;
  }
  if (visual.video) {
    // a short muted loop (was a 261 kB GIF); the still frame for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return <img src={visual.poster} alt={visual.alt} loading="lazy" decoding="async" />;
    }
    return <LoopVideo visual={visual} live={live} />;
  }
  return (
    <picture>
      {visual.staticImage && <source media="(prefers-reduced-motion: reduce)" srcSet={visual.staticImage} />}
      <img src={visual.image} alt={visual.alt} loading="lazy" decoding="async" />
    </picture>
  );
};


