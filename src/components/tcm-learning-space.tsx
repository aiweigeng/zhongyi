"use client";

import {
  Activity,
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CircleDot,
  FlaskConical,
  Leaf,
  Network,
  Search,
  Send,
  Sparkles,
  Waves,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import learningData from "@/data/tcm-learning-space.json";
import type { KnowledgeCard, LearningModule, TcmCategory, TcmLearningData } from "@/lib/types";

const data = learningData as TcmLearningData;

const categoryMeta: Record<
  TcmCategory,
  { label: string; cn: string; icon: typeof Leaf; accent: string; glow: string }
> = {
  herbs: { label: "Herbs", cn: "本草", icon: Leaf, accent: "#42d39d", glow: "rgba(66, 211, 157, 0.32)" },
  meridians: { label: "Meridians", cn: "经络", icon: Network, accent: "#9bd4ff", glow: "rgba(155, 212, 255, 0.26)" },
  formulas: { label: "Formulas", cn: "方剂", icon: FlaskConical, accent: "#d6a84f", glow: "rgba(214, 168, 79, 0.3)" },
  diagnosis: { label: "Diagnosis", cn: "辨证", icon: BrainCircuit, accent: "#e08d6f", glow: "rgba(224, 141, 111, 0.28)" },
  classics: { label: "Classics", cn: "经典", icon: BookOpenText, accent: "#f7e4b4", glow: "rgba(247, 228, 180, 0.24)" },
};

const moduleIcons: Record<TcmCategory, typeof Leaf> = {
  herbs: Leaf,
  meridians: Network,
  formulas: FlaskConical,
  diagnosis: BrainCircuit,
  classics: BookOpenText,
};

const particleStyles = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  "--x": `${(index % 5) * 9 - 18}px`,
  "--duration": `${16 + (index % 7) * 2}s`,
  "--rotate": `${index * 28}deg`,
  animationDelay: `${index * -1.7}s`,
})) as Array<CSSProperties>;

const fadeUp = {
  hidden: { opacity: 0, y: 34, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function TcmLearningSpace() {
  const [activeModule, setActiveModule] = useState<TcmCategory>("herbs");
  const [activeCategory, setActiveCategory] = useState<TcmCategory>("herbs");
  const [question, setQuestion] = useState("最近总觉得疲倦，应该怎样从中医系统角度理解？");
  const [mentorAnswer, setMentorAnswer] = useState(createMentorAnswer(question));
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -130]);
  const diagramY = useTransform(scrollYProgress, [0.05, 0.38], [60, -40]);

  const activeModuleData = useMemo(
    () => data.modules.find((module) => module.id === activeModule) ?? data.modules[0],
    [activeModule],
  );

  const activeCards = useMemo(
    () => data.cards.filter((card) => card.type === activeModule).slice(0, 4),
    [activeModule],
  );

  const filteredCards = useMemo(
    () => data.cards.filter((card) => card.type === activeCategory),
    [activeCategory],
  );

  function handleMentorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMentorAnswer(createMentorAnswer(question));
  }

  return (
    <main className="ssr-visible relative min-h-screen overflow-hidden">
      <div className="aurora-field" />
      <div className="grain" />
      {particleStyles.map((style, index) => (
        <span key={index} className="herb-particle" style={style} />
      ))}

      <nav className="fixed left-1/2 top-4 z-50 w-[min(1060px,calc(100%-24px))] -translate-x-1/2 rounded-full border border-white/15 bg-[#08140f]/70 px-3 py-2 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <a href="#top" className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#fff7e6] outline-none transition focus-visible:ring-2 focus-visible:ring-[#42d39d]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#42d39d]/15 text-[#42d39d]">
              <Leaf size={18} aria-hidden="true" />
            </span>
            TCM Space
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {["系统", "模块", "知识", "AI"].map((item, index) => (
              <a
                key={item}
                href={["#system", "#modules", "#knowledge", "#mentor"][index]}
                className="min-h-10 rounded-full px-4 py-2 text-sm text-[#fff7e6]/72 outline-none transition hover:bg-white/10 hover:text-[#fff7e6] focus-visible:ring-2 focus-visible:ring-[#42d39d]"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#modules"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fff7e6] px-4 py-2 text-sm font-semibold text-[#08140f] shadow-[0_0_36px_rgba(66,211,157,0.28)] outline-none transition hover:bg-[#d6a84f] focus-visible:ring-2 focus-visible:ring-[#42d39d]"
          >
            开始探索 <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <section id="top" className="relative flex min-h-screen items-center pt-28">
        <motion.div style={{ y: heroY }} className="section-shell grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#42d39d]/30 bg-[#42d39d]/10 px-4 py-2 text-sm text-[#c7ffe7]">
              <Sparkles size={16} aria-hidden="true" />
              Ancient wisdom meets AI intelligence
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-normal text-[#fff7e6] md:text-7xl">
              中医知识的另一种打开方式
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-[#fff7e6]/74 md:text-2xl">
              把千年经验，转化为可交互的认知系统
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#modules"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#42d39d] px-6 py-3 font-semibold text-[#06110d] shadow-[0_0_48px_rgba(66,211,157,0.35)] outline-none transition hover:-translate-y-0.5 hover:bg-[#fff7e6] focus-visible:ring-2 focus-visible:ring-[#fff7e6]"
              >
                开始探索 <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href="#system"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#fff7e6]/18 bg-white/5 px-6 py-3 font-semibold text-[#fff7e6] outline-none backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-[#42d39d]"
              >
                查看系统图 <Network size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["5", "learning modules"],
                ["12", "knowledge cards"],
                ["7", "concept links"],
              ].map(([value, label]) => (
                <div key={label} className="glass-panel rounded-[8px] p-4">
                  <div className="text-2xl font-semibold text-[#d6a84f]">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#fff7e6]/54">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="glass-panel soft-depth relative min-h-[520px] overflow-hidden rounded-[8px] p-5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(66,211,157,0.20),transparent_30%),radial-gradient(circle_at_76%_80%,rgba(214,168,79,0.18),transparent_32%)]" />
            <div className="relative grid h-full min-h-[480px] place-items-center">
              <SystemOrb compact />
            </div>
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3">
              {data.modules.slice(0, 4).map((module) => {
                const Icon = moduleIcons[module.id];
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className="rounded-[8px] border border-white/15 bg-[#08140f]/54 p-3 text-left outline-none backdrop-blur transition hover:-translate-y-1 hover:border-[#42d39d]/50 focus-visible:ring-2 focus-visible:ring-[#42d39d]"
                  >
                    <Icon className="mb-2 text-[#42d39d]" size={17} aria-hidden="true" />
                    <div className="text-sm font-semibold text-[#fff7e6]">{module.cn}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <AnimatedSection id="system" eyebrow="Concept Overview" title="把中医理解成一个可视化系统">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div style={{ y: diagramY }} className="glass-panel min-h-[520px] overflow-hidden rounded-[8px] p-4 md:p-8">
            <SystemDiagram />
          </motion.div>
          <div className="grid gap-3">
            {[
              ["Herbs", "components", "每味药是有属性、有方向、有关系的组件。"],
              ["Formulas", "compositions", "方剂不是列表，而是有主次、约束与意图的组合。"],
              ["Meridians", "network", "经络提供身体系统中的路径、定位与连接。"],
              ["Syndromes", "system states", "证候是对当前状态的抽象，而非单一症状。"],
              ["Diagnosis", "inference engine", "辨证把脉象、舌象、冷热、虚实转为判断路径。"],
            ].map(([term, model, text], index) => (
              <motion.div
                key={term}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className="glass-panel rounded-[8px] p-5 transition hover:-translate-y-1 hover:border-[#42d39d]/45"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-[#42d39d]">{term}</div>
                    <div className="mt-1 text-xl font-semibold text-[#fff7e6]">{model}</div>
                  </div>
                  <CircleDot className="text-[#d6a84f]" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#fff7e6]/67">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="modules" eyebrow="Interactive Modules" title="五个入口，进入同一个知识宇宙">
        <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="grid gap-3">
            {data.modules.map((module) => {
              const Icon = moduleIcons[module.id];
              const selected = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`group rounded-[8px] border p-4 text-left outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#42d39d] ${
                    selected
                      ? "border-[#42d39d]/70 bg-[#42d39d]/14 shadow-[0_0_42px_rgba(66,211,157,0.18)]"
                      : "border-white/14 bg-white/[0.055] hover:-translate-y-1 hover:border-[#d6a84f]/45"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#fff7e6]/10 text-[#42d39d] transition group-hover:bg-[#d6a84f]/18">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-base font-semibold text-[#fff7e6]">{module.title}</span>
                      <span className="block text-sm text-[#fff7e6]/55">{module.cn}</span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#fff7e6]/62">{module.subtitle}</p>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModuleData.id}
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
              transition={{ duration: 0.36 }}
              className="glass-panel min-h-[620px] rounded-[8px] p-5 md:p-7"
            >
              <ModulePreview module={activeModuleData} cards={activeCards} />
            </motion.div>
          </AnimatePresence>
        </div>
      </AnimatedSection>

      <AnimatedSection id="knowledge" eyebrow="Knowledge Dashboard" title="Bento-grid preview, not textbook pages">
        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(categoryMeta) as TcmCategory[]).map((category) => {
            const meta = categoryMeta[category];
            const Icon = meta.icon;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#42d39d] ${
                  activeCategory === category
                    ? "border-[#42d39d]/70 bg-[#fff7e6] text-[#08140f]"
                    : "border-white/14 bg-white/[0.055] text-[#fff7e6]/72 hover:bg-white/12"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {meta.label}
              </button>
            );
          })}
        </div>
        <motion.div layout className="grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card, index) => (
              <KnowledgeBentoCard key={card.id} card={card} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="mentor" eyebrow="AI Learning Mode" title="Ask AI TCM Mentor">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleMentorSubmit} className="glass-panel rounded-[8px] p-5 md:p-7">
            <label htmlFor="mentor-question" className="text-sm uppercase tracking-[0.2em] text-[#42d39d]">
              mock prompt
            </label>
            <textarea
              id="mentor-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="mt-4 min-h-44 w-full resize-none rounded-[8px] border border-white/15 bg-[#06110d]/72 p-4 text-base leading-7 text-[#fff7e6] outline-none transition placeholder:text-[#fff7e6]/35 focus:border-[#42d39d]/70 focus:ring-2 focus:ring-[#42d39d]/20"
              placeholder="Ask a learning question about TCM theory..."
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-[#fff7e6]/55">
                <Search size={16} aria-hidden="true" />
                Educational concept demo only
              </span>
              <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#42d39d] px-5 font-semibold text-[#06110d] outline-none transition hover:bg-[#fff7e6] focus-visible:ring-2 focus-visible:ring-[#fff7e6]">
                Generate reasoning <Send size={16} aria-hidden="true" />
              </button>
            </div>
          </form>
          <AnimatePresence mode="wait">
            <motion.div
              key={mentorAnswer.seed}
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{ duration: 0.36 }}
              className="glass-panel rounded-[8px] p-5 md:p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d6a84f]/16 text-[#d6a84f]">
                  <BrainCircuit aria-hidden="true" />
                </span>
                <div>
                  <div className="font-semibold text-[#fff7e6]">Structured reasoning preview</div>
                  <div className="text-sm text-[#fff7e6]/55">Not a medical response. Learning model only.</div>
                </div>
              </div>
              <div className="space-y-4">
                {mentorAnswer.blocks.map((block) => (
                  <div key={block.title} className="rounded-[8px] border border-white/12 bg-white/[0.055] p-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#42d39d]">{block.title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#fff7e6]/72">{block.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </AnimatedSection>

      <footer className="section-shell pb-10 pt-8">
        <div className="glass-panel flex flex-col gap-4 rounded-[8px] p-5 text-sm text-[#fff7e6]/58 md:flex-row md:items-center md:justify-between">
          <span>TCM Learning Space is an educational interface prototype, not diagnosis or treatment guidance.</span>
          <span className="text-[#d6a84f]">Design: AI-Native + Organic Biophilic + Bento Grid</span>
        </div>
      </footer>
    </main>
  );
}

function AnimatedSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-20 md:py-28">
      <motion.div
        className="section-shell"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#42d39d]">{eyebrow}</div>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-[#fff7e6] md:text-5xl">{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

function SystemOrb({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative grid place-items-center ${compact ? "h-[330px] w-[330px]" : "h-[420px] w-[420px]"} max-w-full`}>
      <motion.div
        className="absolute inset-0 rounded-full border border-[#42d39d]/30 bg-[#42d39d]/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-10 rounded-full border border-dashed border-[#d6a84f]/34"
        animate={{ rotate: -360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
      />
      {data.modules.map((module, index) => {
        const angle = (index / data.modules.length) * Math.PI * 2 - Math.PI / 2;
        const radius = compact ? 142 : 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const Icon = moduleIcons[module.id];
        return (
          <motion.div
            key={module.id}
            className="absolute grid h-20 w-20 place-items-center rounded-full border border-white/15 bg-[#08140f]/72 text-center shadow-2xl backdrop-blur"
            style={{ x, y }}
            animate={{ y: [y, y - 8, y], boxShadow: [`0 0 22px ${categoryMeta[module.id].glow}`, `0 0 44px ${categoryMeta[module.id].glow}`, `0 0 22px ${categoryMeta[module.id].glow}`] }}
            transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon style={{ color: categoryMeta[module.id].accent }} size={22} aria-hidden="true" />
            <span className="mt-1 text-[11px] font-semibold text-[#fff7e6]/78">{module.cn}</span>
          </motion.div>
        );
      })}
      <div className="grid h-32 w-32 place-items-center rounded-full border border-[#fff7e6]/20 bg-[#fff7e6]/10 text-center shadow-[0_0_70px_rgba(66,211,157,0.26)] backdrop-blur">
        <div>
          <Waves className="mx-auto text-[#42d39d]" size={30} aria-hidden="true" />
          <div className="mt-2 text-sm font-semibold text-[#fff7e6]">TCM System</div>
          <div className="mt-1 text-[11px] text-[#fff7e6]/55">认知模型</div>
        </div>
      </div>
    </div>
  );
}

function SystemDiagram() {
  const nodes = [
    { label: "Herbs", sub: "components", x: 70, y: 100, type: "herbs" as TcmCategory },
    { label: "Formulas", sub: "compositions", x: 250, y: 76, type: "formulas" as TcmCategory },
    { label: "Meridians", sub: "network", x: 440, y: 128, type: "meridians" as TcmCategory },
    { label: "Syndromes", sub: "states", x: 382, y: 330, type: "diagnosis" as TcmCategory },
    { label: "Diagnosis", sub: "inference", x: 145, y: 344, type: "diagnosis" as TcmCategory },
    { label: "Classics", sub: "source", x: 270, y: 224, type: "classics" as TcmCategory },
  ];

  return (
    <div className="relative min-h-[470px] overflow-hidden rounded-[8px] bg-[#06110d]/36">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 430" role="img" aria-label="Animated TCM concept system diagram">
        <defs>
          <linearGradient id="diagramGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#42d39d" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#d6a84f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fff7e6" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {[
          ["70,100", "250,76"],
          ["250,76", "440,128"],
          ["440,128", "382,330"],
          ["382,330", "145,344"],
          ["145,344", "70,100"],
          ["270,224", "70,100"],
          ["270,224", "382,330"],
          ["270,224", "440,128"],
        ].map(([from, to]) => (
          <line key={`${from}-${to}`} x1={from.split(",")[0]} y1={from.split(",")[1]} x2={to.split(",")[0]} y2={to.split(",")[1]} stroke="url(#diagramGradient)" strokeWidth="2" className="diagram-line" />
        ))}
      </svg>
      {nodes.map((node, index) => {
        const meta = categoryMeta[node.type];
        return (
          <motion.div
            key={node.label}
            className="absolute w-36 rounded-[8px] border border-white/15 bg-[#08140f]/72 p-3 text-center backdrop-blur"
            style={{ left: `${(node.x / 540) * 100}%`, top: `${(node.y / 430) * 100}%`, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.86 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, boxShadow: `0 0 40px ${meta.glow}` }}
          >
            <div className="text-sm font-semibold" style={{ color: meta.accent }}>
              {node.label}
            </div>
            <div className="mt-1 text-xs text-[#fff7e6]/58">{node.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ModulePreview({ module, cards }: { module: LearningModule; cards: KnowledgeCard[] }) {
  const Icon = moduleIcons[module.id];
  return (
    <div className="h-full">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#42d39d]/14 text-[#42d39d]">
            <Icon aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-3xl font-semibold text-[#fff7e6]">{module.title}</h3>
          <div className="mt-1 text-xl text-[#d6a84f]">{module.cn}</div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#fff7e6]/68">{module.summary}</p>
        </div>
        <div className="rounded-[8px] border border-[#d6a84f]/26 bg-[#d6a84f]/10 p-4 text-sm leading-6 text-[#fff7e6]/72 md:w-60">
          <span className="ancient-serif text-[#fff7e6]">“方从法出，法随证立”</span>
          <span className="mt-2 block text-[#fff7e6]/48">A learning quote rendered as system logic.</span>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {module.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: index * 0.06 }}
            className="group min-h-48 rounded-[8px] border border-white/13 bg-white/[0.055] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#42d39d]/50 hover:shadow-[0_0_44px_rgba(66,211,157,0.14)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-[#fff7e6]">{card.cn}</h4>
                <div className="text-sm text-[#d6a84f]">{card.title}</div>
              </div>
              <span className="rounded-full bg-[#42d39d]/12 px-3 py-1 text-xs text-[#9cf0ca]">{card.visual}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#fff7e6]/65">{card.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {card.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-7 grid gap-3 rounded-[8px] border border-white/12 bg-[#06110d]/48 p-4 md:grid-cols-2">
        {module.sampleItems.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-[#fff7e6]/70">
            <Activity size={16} className="text-[#42d39d]" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeBentoCard({ card, index }: { card: KnowledgeCard; index: number }) {
  const meta = categoryMeta[card.type];
  const large = index === 0 || index === 3;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, boxShadow: `0 0 56px ${meta.glow}` }}
      className={`glass-panel group relative overflow-hidden rounded-[8px] p-5 ${large ? "md:col-span-2 md:row-span-2" : "md:col-span-1"}`}
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl transition group-hover:scale-125" style={{ background: meta.glow }} />
      <div className="relative flex h-full min-h-48 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.17em]" style={{ color: meta.accent }}>
              {meta.label}
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#fff7e6]">{card.cn}</h3>
            <div className="mt-1 text-sm text-[#fff7e6]/55">{card.title}</div>
          </div>
          <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs text-[#fff7e6]/66">{card.visual}</span>
        </div>
        <p className="mt-5 text-sm leading-6 text-[#fff7e6]/68">{card.summary}</p>
        {(card.nature || card.flavor || card.role) && (
          <div className="mt-5 grid gap-2 text-sm text-[#fff7e6]/62">
            {card.nature && <div>Nature: <span className="text-[#fff7e6]">{card.nature}</span></div>}
            {card.flavor && <div>Flavor: <span className="text-[#fff7e6]">{card.flavor}</span></div>}
            {card.role && <div>Role: <span className="text-[#fff7e6]">{card.role}</span></div>}
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {card.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function createMentorAnswer(question: string) {
  const normalized = question.toLowerCase();
  const fatigue = /疲|累|气|weak|tired|energy/.test(normalized);
  const heat = /热|上火|口苦|bitter|heat/.test(normalized);
  const stress = /郁|压力|stress|情绪|anger/.test(normalized);

  const focus = heat ? "damp-heat / heat-clearing map" : stress ? "liver qi movement map" : fatigue ? "qi deficiency learning map" : "balanced systems map";
  const herb = heat ? "黄连 Huang Lian" : stress ? "柴胡 Chai Hu as a concept anchor" : "人参 Ren Shen / 黄芪 Huang Qi";
  const meridian = heat ? "Heart-Stomach-Liver channels" : stress ? "Liver meridian" : "Spleen-Lung meridians";

  return {
    seed: `${focus}-${question.length}`,
    blocks: [
      {
        title: "1. Pattern lens",
        body: `From a learning perspective, this question can be mapped to the ${focus}. The goal is not to name a disease, but to observe how signs could cluster into a system state.`,
      },
      {
        title: "2. Relationship graph",
        body: `Relevant nodes: syndrome state -> ${meridian} -> representative herb concepts -> formula composition. This mirrors the graph style used by open TCM knowledge systems.`,
      },
      {
        title: "3. Concept references",
        body: `Study anchors: ${herb}, formula hierarchy, and the distinction between symptoms as signals and syndromes as inferred states.`,
      },
    ],
  };
}
