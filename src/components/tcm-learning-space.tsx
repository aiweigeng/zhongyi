"use client";

import {
  BookOpenText,
  BrainCircuit,
  FlaskConical,
  Languages,
  Leaf,
  Network,
  Send,
  Sparkles,
  Waves,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { i18n, type I18nKey, type Language } from "@/data/i18n";

type ModuleId = "herbs" | "meridians" | "formula" | "diagnosis" | "classic";
type SystemState = "balanced" | "qiDeficiency" | "heat" | "stagnation";
type MeridianId = "lung" | "spleen" | "liver" | "kidney" | "ren";
type BodyRegionId = "head" | "chest" | "abdomen" | "arms" | "legs";

type ModuleConfig = {
  id: ModuleId;
  labelKey: I18nKey;
  descKey: I18nKey;
  panelKey: I18nKey;
  icon: typeof Leaf;
};

type MeridianConfig = {
  id: MeridianId;
  labelKey: I18nKey;
  path: string;
};

type BodyRegionConfig = {
  id: BodyRegionId;
  labelKey: I18nKey;
  meridian: MeridianId;
  style: CSSProperties;
};

type AiBlock = {
  title: string;
  body: string;
};

const moduleConfigs: ModuleConfig[] = [
  { id: "herbs", labelKey: "herbs", descKey: "herbsDesc", panelKey: "herbsPanel", icon: Leaf },
  { id: "meridians", labelKey: "meridians", descKey: "meridiansDesc", panelKey: "meridiansPanel", icon: Network },
  { id: "formula", labelKey: "formula", descKey: "formulaDesc", panelKey: "formulaPanel", icon: FlaskConical },
  { id: "diagnosis", labelKey: "diagnosis", descKey: "diagnosisDesc", panelKey: "diagnosisPanel", icon: BrainCircuit },
  { id: "classic", labelKey: "classic", descKey: "classicDesc", panelKey: "classicPanel", icon: BookOpenText },
];

const stateKeys: Array<{ id: SystemState; labelKey: I18nKey; descKey: I18nKey }> = [
  { id: "balanced", labelKey: "balanced", descKey: "balancedDesc" },
  { id: "qiDeficiency", labelKey: "qiDeficiency", descKey: "qiDeficiencyDesc" },
  { id: "heat", labelKey: "heat", descKey: "heatDesc" },
  { id: "stagnation", labelKey: "stagnation", descKey: "stagnationDesc" },
];

const meridianConfigs: MeridianConfig[] = [
  {
    id: "lung",
    labelKey: "lungMeridian",
    path: "M208 128 C176 140 139 179 118 238 C98 295 96 355 122 424",
  },
  {
    id: "spleen",
    labelKey: "spleenMeridian",
    path: "M178 664 C171 589 151 526 141 461 C133 402 151 353 193 313 C222 285 233 236 218 184",
  },
  {
    id: "liver",
    labelKey: "liverMeridian",
    path: "M236 665 C230 591 240 531 268 471 C294 414 289 354 246 312 C220 287 205 248 212 206",
  },
  {
    id: "kidney",
    labelKey: "kidneyMeridian",
    path: "M216 674 C217 585 224 507 246 440 C267 374 264 306 225 252 C203 222 198 184 211 145",
  },
  {
    id: "ren",
    labelKey: "renMeridian",
    path: "M211 116 C212 198 212 286 211 374 C210 482 210 574 211 674",
  },
];

const bodyRegions: BodyRegionConfig[] = [
  { id: "head", labelKey: "regionHead", meridian: "ren", style: { left: "42%", top: "5%", width: "16%", height: "11%" } },
  { id: "chest", labelKey: "regionChest", meridian: "lung", style: { left: "35%", top: "23%", width: "30%", height: "16%" } },
  { id: "abdomen", labelKey: "regionAbdomen", meridian: "spleen", style: { left: "36%", top: "41%", width: "28%", height: "18%" } },
  { id: "arms", labelKey: "regionArms", meridian: "lung", style: { left: "17%", top: "30%", width: "66%", height: "14%" } },
  { id: "legs", labelKey: "regionLegs", meridian: "kidney", style: { left: "34%", top: "61%", width: "32%", height: "28%" } },
];

const stateVisuals: Record<SystemState, { primary: string; secondary: string; speed: number; opacity: number; irregular: number }> = {
  balanced: { primary: "#42d39d", secondary: "#d6a84f", speed: 0.054, opacity: 0.9, irregular: 0 },
  qiDeficiency: { primary: "#7acfa9", secondary: "#b8a76c", speed: 0.027, opacity: 0.45, irregular: 0.05 },
  heat: { primary: "#ff664d", secondary: "#ffbf5a", speed: 0.086, opacity: 0.95, irregular: 0.08 },
  stagnation: { primary: "#42d39d", secondary: "#d6a84f", speed: 0.041, opacity: 0.72, irregular: 0.42 },
};

const aiContentKeys: Record<
  SystemState,
  { analysis: I18nKey; pattern: I18nKey; meridians: I18nKey; herbs: I18nKey; direction: I18nKey }
> = {
  balanced: {
    analysis: "aiBalancedAnalysis",
    pattern: "aiBalancedPattern",
    meridians: "aiBalancedMeridians",
    herbs: "aiBalancedHerbs",
    direction: "aiBalancedDirection",
  },
  qiDeficiency: {
    analysis: "aiQiAnalysis",
    pattern: "aiQiPattern",
    meridians: "aiQiMeridians",
    herbs: "aiQiHerbs",
    direction: "aiQiDirection",
  },
  heat: {
    analysis: "aiHeatAnalysis",
    pattern: "aiHeatPattern",
    meridians: "aiHeatMeridians",
    herbs: "aiHeatHerbs",
    direction: "aiHeatDirection",
  },
  stagnation: {
    analysis: "aiStagnationAnalysis",
    pattern: "aiStagnationPattern",
    meridians: "aiStagnationMeridians",
    herbs: "aiStagnationHerbs",
    direction: "aiStagnationDirection",
  },
};

const initialQuestion: string = i18n.zh.initialQuestion;

export function TcmLearningSpace() {
  const [language, setLanguage] = useStoredLanguage();
  const [activeModule, setActiveModule] = useState<ModuleId>("meridians");
  const [systemState, setSystemState] = useState<SystemState>("balanced");
  const [activeMeridian, setActiveMeridian] = useState<MeridianId>("ren");
  const [activeRegion, setActiveRegion] = useState<BodyRegionId | null>(null);
  const [question, setQuestion] = useState(initialQuestion);
  const [submittedQuestion, setSubmittedQuestion] = useState(initialQuestion);
  const [aiBlocks, setAiBlocks] = useState<AiBlock[]>(() => createAiAnswer("zh", initialQuestion, "balanced"));
  const t = i18n[language];

  const activeModuleData = useMemo(
    () => moduleConfigs.find((module) => module.id === activeModule) ?? moduleConfigs[0],
    [activeModule],
  );

  const submitAi = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const detectedState = detectSystemState(question, systemState);
      setSystemState(detectedState);
      setSubmittedQuestion(question);
      setAiBlocks(createAiAnswer(language, question, detectedState));
    },
    [language, question, systemState],
  );

  useEffect(() => {
    setAiBlocks(createAiAnswer(language, submittedQuestion, systemState));
  }, [language, submittedQuestion, systemState]);

  const ActiveIcon = activeModuleData.icon;

  return (
    <main className="tcm-os">
      <div className="os-background layer-background" />

      <button
        type="button"
        className="language-switch"
        onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
        aria-label={t.languageSwitch}
      >
        <Languages size={17} aria-hidden="true" />
        <span>{t.languageSwitch}</span>
      </button>

      <header className="os-header layer-ui">
        <a href="#system" className="brand-lockup" aria-label={t.title}>
          <span className="brand-mark">
            <Leaf size={19} aria-hidden="true" />
          </span>
          <span>
            <strong>{t.title}</strong>
            <small>{t.systemSubtitle}</small>
          </span>
        </a>
        <nav className="os-nav" aria-label={t.title}>
          <a href="#system">{t.navSystem}</a>
          <a href="#modules">{t.navModules}</a>
          <a href="#ai">{t.navAI}</a>
        </nav>
      </header>

      <section id="system" className="os-shell">
        <aside id="modules" className="module-rail glass-surface layer-ui">
          <div className="rail-heading">
            <Sparkles size={18} aria-hidden="true" />
            <span>{t.booting}</span>
          </div>
          <div className="module-list">
            {moduleConfigs.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  type="button"
                  className={`module-card ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <span className="module-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{t[module.labelKey]}</strong>
                    <small>{t[module.descKey]}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="state-controls">
            <span className="control-label">{t.stateLabel}</span>
            {stateKeys.map((state) => (
              <button
                key={state.id}
                type="button"
                className={`state-button ${systemState === state.id ? "is-active" : ""}`}
                onClick={() => setSystemState(state.id)}
              >
                <span>{t[state.labelKey]}</span>
                <small>{t[state.descKey]}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="visual-core layer-ui" aria-label={t.meridians}>
          <div className="stage-status glass-surface">
            <div>
              <span>{t.activeMeridian}</span>
              <strong>{t[meridianConfigs.find((item) => item.id === activeMeridian)?.labelKey ?? "renMeridian"]}</strong>
            </div>
            <div>
              <span>{t.activeRegion}</span>
              <strong>{activeRegion ? t[bodyRegions.find((item) => item.id === activeRegion)?.labelKey ?? "regionChest"] : t.noneSelected}</strong>
            </div>
          </div>

          <MeridianStage
            language={language}
            systemState={systemState}
            activeMeridian={activeMeridian}
            activeRegion={activeRegion}
            onMeridianSelect={setActiveMeridian}
            onRegionSelect={setActiveRegion}
          />

          <div className="module-panel glass-surface">
            <div className="panel-title">
              <span className="module-icon">
                <ActiveIcon size={20} aria-hidden="true" />
              </span>
              <span>
                <small>{t.panelOpen}</small>
                <strong>{t[activeModuleData.labelKey]}</strong>
              </span>
            </div>
            <p>{t[activeModuleData.panelKey]}</p>
            <div className="signal-row" aria-label={t.panelSignals}>
              <span>{t.signalQi}</span>
              <span>{t.signalBlood}</span>
              <span>{t.signalFluids}</span>
              <span>{t.signalSpirit}</span>
            </div>
          </div>
        </section>

        <aside id="ai" className="ai-panel glass-surface layer-ai">
          <div className="ai-heading">
            <span className="ai-mark">
              <BrainCircuit size={22} aria-hidden="true" />
            </span>
            <span>
              <strong>{t.aiTitle}</strong>
              <small>{t.aiSubtitle}</small>
            </span>
          </div>

          <form onSubmit={submitAi} className="ai-form">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t.aiInput}
              aria-label={t.aiInput}
            />
            <button type="submit">
              <Send size={16} aria-hidden="true" />
              <span>{t.aiSubmit}</span>
            </button>
          </form>

          <div className="ai-output">
            {aiBlocks.map((block) => (
              <article key={block.title}>
                <strong>{block.title}</strong>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <footer className="os-footer layer-ui">
        <span>{t.disclaimer}</span>
      </footer>
    </main>
  );
}

const MeridianStage = memo(function MeridianStage({
  language,
  systemState,
  activeMeridian,
  activeRegion,
  onMeridianSelect,
  onRegionSelect,
}: {
  language: Language;
  systemState: SystemState;
  activeMeridian: MeridianId;
  activeRegion: BodyRegionId | null;
  onMeridianSelect: (id: MeridianId) => void;
  onRegionSelect: (id: BodyRegionId | null) => void;
}) {
  const t = i18n[language];
  const visual = stateVisuals[systemState];

  return (
    <div className="meridian-stage glass-surface">
      <svg className="meridian-svg-layer layer-meridian" viewBox="0 0 420 720" aria-label={t.meridians}>
        <defs>
          <filter id="meridianGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {meridianConfigs.map((meridian) => (
          <path
            key={meridian.id}
            d={meridian.path}
            className={`meridian-path ${activeMeridian === meridian.id ? "is-active" : ""}`}
            stroke={activeMeridian === meridian.id ? visual.secondary : visual.primary}
            filter="url(#meridianGlow)"
          />
        ))}
      </svg>

      <MeridianParticleLayer systemState={systemState} activeMeridian={activeMeridian} />

      <svg className="body-silhouette layer-body" viewBox="0 0 420 720" aria-hidden="true">
        <path
          className="body-core"
          d="M211 60 C251 60 279 90 279 128 C279 154 264 177 240 188 C276 211 298 257 300 316 C303 401 278 452 270 520 C263 582 282 642 260 687 C248 711 225 710 214 678 C211 668 208 668 205 678 C194 710 171 711 160 687 C138 642 157 582 150 520 C142 452 117 401 120 316 C122 257 144 211 180 188 C156 177 141 154 141 128 C141 90 171 60 211 60 Z"
        />
        <path
          className={`region-glow ${activeRegion ? "is-visible" : ""}`}
          d={regionGlowPath(activeRegion)}
        />
      </svg>

      <div className="body-region-layer layer-ui" aria-label={t.activeRegion}>
        {bodyRegions.map((region) => (
          <button
            key={region.id}
            type="button"
            className={`body-region ${activeRegion === region.id ? "is-active" : ""}`}
            style={region.style}
            onMouseEnter={() => {
              onRegionSelect(region.id);
              onMeridianSelect(region.meridian);
            }}
            onFocus={() => {
              onRegionSelect(region.id);
              onMeridianSelect(region.meridian);
            }}
            onMouseLeave={() => onRegionSelect(null)}
            onBlur={() => onRegionSelect(null)}
            onClick={() => {
              onRegionSelect(region.id);
              onMeridianSelect(region.meridian);
            }}
          >
            {t[region.labelKey]}
          </button>
        ))}
      </div>

      <svg className="meridian-hit-layer layer-ui" viewBox="0 0 420 720" aria-label={t.activeMeridian}>
        {meridianConfigs.map((meridian) => (
          <path
            key={meridian.id}
            d={meridian.path}
            role="button"
            tabIndex={0}
            aria-label={t[meridian.labelKey]}
            className="meridian-hit-path"
            onMouseEnter={() => onMeridianSelect(meridian.id)}
            onFocus={() => onMeridianSelect(meridian.id)}
            onClick={() => onMeridianSelect(meridian.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onMeridianSelect(meridian.id);
              }
            }}
          />
        ))}
      </svg>

      <div className="stage-caption layer-ui">
        <Waves size={17} aria-hidden="true" />
        <span>{t[stateKeys.find((state) => state.id === systemState)?.descKey ?? "balancedDesc"]}</span>
      </div>
    </div>
  );
});

const MeridianParticleLayer = memo(function MeridianParticleLayer({
  systemState,
  activeMeridian,
}: {
  systemState: SystemState;
  activeMeridian: MeridianId;
}) {
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const particleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const particles = useMemo(
    () =>
      Array.from({ length: 64 }, (_, index) => ({
        pathIndex: index % meridianConfigs.length,
        offset: ((index * 0.137) % 1) + 0.01,
        speed: 0.72 + (index % 9) * 0.07,
        size: 2.2 + (index % 5) * 0.45,
      })),
    [],
  );

  useEffect(() => {
    let frame = 0;

    const animate = (time: number) => {
      const visual = stateVisuals[systemState];

      particles.forEach((particle, index) => {
        const path = pathRefs.current[particle.pathIndex];
        const circle = particleRefs.current[index];
        if (!path || !circle) {
          return;
        }

        const length = path.getTotalLength();
        const meridian = meridianConfigs[particle.pathIndex];
        const broken = systemState === "stagnation" ? Math.sin(time * 0.012 + index * 1.7) > 0.26 : true;
        const irregularShift = visual.irregular * Math.sin(time * 0.004 + index * 0.91) * 38;
        const distance = (time * visual.speed * particle.speed + particle.offset * length + irregularShift) % length;
        const point = path.getPointAtLength(distance < 0 ? distance + length : distance);
        const phase = distance / length;
        const fade = Math.max(0.18, Math.sin(phase * Math.PI));
        const selectedBoost = activeMeridian === meridian.id ? 1 : 0.48;
        const opacity = broken ? visual.opacity * fade * selectedBoost : 0.08;

        circle.setAttribute("cx", point.x.toFixed(2));
        circle.setAttribute("cy", point.y.toFixed(2));
        circle.setAttribute("r", String(particle.size));
        circle.setAttribute("opacity", opacity.toFixed(3));
        circle.setAttribute("fill", index % 3 === 0 ? visual.secondary : visual.primary);
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [activeMeridian, particles, systemState]);

  return (
    <svg className="particle-flow-layer layer-particles" viewBox="0 0 420 720" aria-hidden="true">
      <defs>
        <filter id="particleGlow">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {meridianConfigs.map((meridian, index) => (
        <path
          key={meridian.id}
          ref={(node) => {
            pathRefs.current[index] = node;
          }}
          d={meridian.path}
          className="particle-guide"
        />
      ))}
      {particles.map((particle, index) => (
        <circle
          key={`${particle.pathIndex}-${index}`}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
          filter="url(#particleGlow)"
        />
      ))}
    </svg>
  );
});

function useStoredLanguage(): [Language, (language: Language) => void] {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    const stored = window.localStorage.getItem("tcm-os-language");
    if (stored === "zh" || stored === "en") {
      setLanguageState(stored);
      document.documentElement.lang = stored === "zh" ? "zh-CN" : "en";
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("tcm-os-language", nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
  }, []);

  return [language, setLanguage];
}

function detectSystemState(question: string, fallback: SystemState): SystemState {
  const normalized = question.toLowerCase();
  if (/疲|累|乏|短气|weak|tired|fatigue|energy/.test(normalized)) {
    return "qiDeficiency";
  }
  if (/热|上火|口苦|烦|red|heat|bitter|irritable/.test(normalized)) {
    return "heat";
  }
  if (/郁|胀|压力|情绪|stress|anger|stuck|distention/.test(normalized)) {
    return "stagnation";
  }
  return fallback;
}

function createAiAnswer(language: Language, question: string, state: SystemState): AiBlock[] {
  const t = i18n[language];
  const detectedState = detectSystemState(question, state);
  const content = aiContentKeys[detectedState];

  return [
    { title: t.aiSystemAnalysis, body: t[content.analysis] },
    { title: t.aiPattern, body: t[content.pattern] },
    { title: t.aiMeridians, body: t[content.meridians] },
    { title: t.aiHerbs, body: t[content.herbs] },
    { title: t.aiDirection, body: t[content.direction] },
  ];
}

function regionGlowPath(region: BodyRegionId | null) {
  if (region === "head") {
    return "M172 111 C174 77 248 77 250 111 C253 151 232 174 211 174 C190 174 169 151 172 111 Z";
  }
  if (region === "chest") {
    return "M151 218 C177 185 245 185 272 218 C286 252 276 303 211 304 C146 303 137 252 151 218 Z";
  }
  if (region === "abdomen") {
    return "M160 326 C191 302 232 302 262 326 C278 365 264 430 211 435 C158 430 144 365 160 326 Z";
  }
  if (region === "arms") {
    return "M109 255 C139 239 170 253 177 287 C145 302 121 340 114 395 C91 367 83 292 109 255 Z M311 255 C281 239 250 253 243 287 C275 302 299 340 306 395 C329 367 337 292 311 255 Z";
  }
  if (region === "legs") {
    return "M166 472 C196 463 207 486 207 534 L205 661 C194 704 158 704 158 652 C158 580 148 526 166 472 Z M254 472 C224 463 213 486 213 534 L215 661 C226 704 262 704 262 652 C262 580 272 526 254 472 Z";
  }
  return "";
}
