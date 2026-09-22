import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  Activity,
  ArrowUpRight,
  Beaker,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  Database,
  Download,
  FileUp,
  Filter,
  FlaskConical,
  Gauge,
  GitBranch,
  Layers3,
  Map,
  MoreHorizontal,
  Orbit,
  Play,
  Plus,
  Radio,
  Search,
  Settings2,
  Sparkles,
  Target,
  Trophy,
  Upload,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { downloadResultBundle, HousePlacementPanel, ManualFixtureDialog, MethodExplorer, TransparencyPanel, type FixtureInput, ResearchWorkspaceHeader, RunHistoryPanel } from "@/components/ResearchWorkbench";
import { AIChatBox, type Message } from "@/components/AIChatBox";

type Template = {
  id: string;
  sport: string;
  code: string;
  label: string;
  events: number;
  range: string;
  status: "ready" | "draft";
  accent: string;
};

const templates: Template[] = [
  { id: "mlb-2024", sport: "MLB", code: "MLB", label: "2024 regular season", events: 2430, range: "Mar 28 — Sep 29, 2024", status: "ready", accent: "orange" },
  { id: "nfl-2023", sport: "NFL", code: "NFL", label: "2023 regular season", events: 272, range: "Sep 7, 2023 — Jan 7, 2024", status: "ready", accent: "blue" },
  { id: "nba-2024", sport: "NBA", code: "NBA", label: "2023–24 regular season", events: 1230, range: "Oct 24, 2023 — Apr 14, 2024", status: "ready", accent: "purple" },
  { id: "custom", sport: "Custom", code: "CSV", label: "Imported event set", events: 0, range: "Awaiting upload", status: "draft", accent: "slate" },
];

const constellation = [
  { label: "ASC", value: 72, x: "9%", y: "46%", tone: "cyan" },
  { label: "Hamal", value: 88, x: "29%", y: "20%", tone: "gold" },
  { label: "Moon", value: 58, x: "52%", y: "62%", tone: "violet" },
  { label: "KP", value: 81, x: "77%", y: "29%", tone: "cyan" },
  { label: "DESC", value: 41, x: "90%", y: "70%", tone: "rose" },
];

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "cyan" | "gold" | "emerald" | "amber" | "purple" }) {
  const styles = {
    slate: "border-white/10 bg-white/[0.045] text-slate-300",
    cyan: "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200",
    gold: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
    emerald: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200",
    amber: "border-orange-300/20 bg-orange-300/[0.08] text-orange-200",
    purple: "border-violet-300/20 bg-violet-300/[0.08] text-violet-200",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${styles[tone]}`}>{children}</span>;
}

function StatCard({ icon: Icon, eyebrow, value, detail, accent }: { icon: typeof Activity; eyebrow: string; value: string; detail: string; accent: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111a2b]/80 p-5 shadow-[0_16px_50px_rgba(0,0,0,.16)] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.16]">
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${accent}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          <p className="mt-3 font-display text-3xl tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-300"><Icon size={17} strokeWidth={1.6} /></div>
      </div>
    </div>
  );
}

function FrameMap({ frame, mode }: { frame: string; mode: "god" | "agent" }) {
  const isGod = mode === "god";
  return (
    <div className="relative h-[212px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#09111f]">
      <div className={`absolute inset-0 opacity-80 ${isGod ? "map-grid-god" : "map-grid-agent"}`} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 260" preserveAspectRatio="none" aria-hidden="true">
        <path d={isGod ? "M-20 188 C75 98 105 242 190 137 S330 43 420 124 S490 155 550 61" : "M-20 56 C80 158 143 10 230 110 S350 228 430 113 S510 80 550 186"} fill="none" stroke={isGod ? "#4fe2ff" : "#b99aff"} strokeOpacity=".7" strokeWidth="1.2" />
        <path d={isGod ? "M-20 217 C60 180 132 214 202 178 S336 136 412 182 S504 210 550 160" : "M-20 92 C64 45 123 88 196 69 S340 28 415 82 S500 136 550 113"} fill="none" stroke="#ffffff" strokeOpacity=".12" strokeWidth=".8" />
        <circle cx={isGod ? "194" : "312"} cy={isGod ? "137" : "110"} r="3.5" fill={isGod ? "#f2be67" : "#d6b4ff"} />
        <circle cx={isGod ? "194" : "312"} cy={isGod ? "137" : "110"} r="14" fill="none" stroke={isGod ? "#f2be67" : "#d6b4ff"} strokeOpacity=".32" />
      </svg>
      <div className="absolute left-4 top-4 flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${isGod ? "bg-cyan-300" : "bg-violet-300"}`} /><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">{frame}</span></div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Coordinate frame</p><p className="mt-1 text-xs text-slate-300">{isGod ? "Ancient fixed background" : "Event-local topography"}</p></div>
        <Pill tone={isGod ? "cyan" : "purple"}>{isGod ? "Hamal / 13° Aries" : "Observer horizon"}</Pill>
      </div>
    </div>
  );
}

function PlacementTable({ planets }: { planets: Array<{ planet: string; sign: string; house: number; degreeInHouse: number; nakshatra: string; starLord: string; subLord: string; isRetrograde: boolean }> }) {
  return <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.018]">
    <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3"><div><p className="eyebrow">Planetary placements</p><p className="mt-1 text-[11px] text-slate-500">Fixed-background chart snapshot · tropical ephemeris input</p></div><Pill tone="gold">{planets.length} bodies</Pill></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-white/[0.05] text-[9px] uppercase tracking-[0.15em] text-slate-600"><th className="px-4 py-2.5">Body</th><th>Sign</th><th>House</th><th>Degree</th><th>Lunar mansion</th><th>Star → Sub</th><th>State</th></tr></thead><tbody>{planets.map((planet) => <tr key={planet.planet} className="border-b border-white/[0.04] last:border-0 text-[11px] text-slate-400"><td className="px-4 py-2.5 font-semibold text-slate-200">{planet.planet}</td><td>{planet.sign}</td><td>H{planet.house}</td><td>{planet.degreeInHouse.toFixed(2)}°</td><td>{planet.nakshatra}</td><td>{planet.starLord} <span className="text-slate-700">→</span> {planet.subLord}</td><td>{planet.isRetrograde ? <span className="text-amber-200">Retrograde</span> : <span className="text-emerald-200/70">Direct</span>}</td></tr>)}</tbody></table></div>
  </div>;
}

function GameBrief({ result }: { result: any }) {
  const teamName = (side: string | null | undefined) => side === "A" ? result.input.teamA : side === "B" ? result.input.teamB : side === "TIE" ? "No clear winner" : "Not available";
  const actual = result.comparison.actualWinner as string | null;
  const god = result.godView.synthesis.winner as string;
  const agent = result.agentView.synthesis.winner as string;
  const baseline = result.baseline.winner as string;
  const hits = result.godView.summary.hits + result.agentView.summary.hits;
  const total = result.godView.allLayers.length + result.agentView.allLayers.length;
  const agreement = god === agent && god !== "TIE" ? "Strong agreement" : god === "TIE" || agent === "TIE" ? "No clear call" : "Split decision";
  const evidence = hits / Math.max(total, 1) >= 0.7 && agreement === "Strong agreement" ? "Strong evidence" : hits / Math.max(total, 1) >= 0.45 ? "Moderate evidence" : "Conflicted evidence";
  const supporting = [
    ...result.godView.allLayers.map((layer: any) => ({ ...layer, frame: "God View" })),
    ...result.agentView.allLayers.map((layer: any) => ({ ...layer, frame: "AgentView" })),
  ].filter((layer: any) => layer.verdict === "hit");
  const conflicting = [
    ...result.godView.allLayers.map((layer: any) => ({ ...layer, frame: "God View" })),
    ...result.agentView.allLayers.map((layer: any) => ({ ...layer, frame: "AgentView" })),
  ].filter((layer: any) => layer.verdict === "miss");
  const explanation = agreement === "Strong agreement"
    ? `Both analysis views selected ${teamName(god)}. The system saw a consistent signal across the fixed-background and event-local perspectives.`
    : `The analysis views did not agree. God View selected ${teamName(god)}, while AgentView selected ${teamName(agent)}. This is useful research evidence, but it should not be treated as a unified call.`;
  return <section className="mt-6 panel game-brief"><div className="panel-header"><div><p className="eyebrow text-cyan-200/80">Plain-language result</p><h2 className="section-title">Game Brief</h2><p className="mt-1 text-xs text-slate-500">A simple explanation of what the simulator found before the technical details.</p></div><Pill tone={evidence === "Strong evidence" ? "emerald" : evidence === "Moderate evidence" ? "gold" : "amber"}>{evidence}</Pill></div><div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_.8fr_.8fr]"><div className="brief-call"><p className="eyebrow">System call</p><p className="mt-2 font-display text-3xl text-white">{teamName(baseline)}</p><p className="mt-1 text-xs text-slate-500">Baseline synthesis</p><div className="mt-4 flex flex-wrap gap-2"><span className={`brief-result ${actual && baseline === actual ? "brief-result-hit" : "brief-result-miss"}`}>{actual ? (baseline === actual ? "HIT" : "MISS") : "AWAITING FINAL RESULT"}</span><span className="brief-result">{agreement}</span></div></div><div className="brief-stat"><p className="eyebrow">Actual result</p><p className="mt-2 font-display text-2xl text-white">{teamName(actual)}</p><p className="mt-1 text-xs text-slate-500">{actual ? "Verified historical outcome" : "This game has not been scored yet"}</p><div className="mt-4 grid grid-cols-2 gap-2"><div><span className="brief-label">God View</span><strong>{teamName(god)}</strong></div><div><span className="brief-label">AgentView</span><strong>{teamName(agent)}</strong></div></div></div><div className="brief-stat"><p className="eyebrow">Evidence score</p><p className="mt-2 font-display text-2xl text-white">{hits}<span className="text-base text-slate-500"> / {total}</span></p><p className="mt-1 text-xs text-slate-500">Frame evaluations matching the verified result</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" style={{ width: `${Math.min(100, (hits / Math.max(total, 1)) * 100)}%` }} /></div></div></div><div className="brief-explanation"><div><p className="eyebrow">Why did the system say that?</p><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{explanation}</p><p className="mt-2 text-xs leading-5 text-slate-500">God View uses the permanent fixed background. AgentView uses the event-local horizon. Comparing them shows whether the result is stable or environment-dependent.</p></div><div className="brief-grid"><div><div className="flex items-center justify-between"><p className="brief-list-title text-emerald-200">Hits / supported layers</p><span className="brief-count brief-count-hit">{supporting.length}</span></div>{supporting.length ? supporting.map((layer: any) => <div key={`support-${layer.frame}-${layer.name}`} className="brief-list-item"><span className="verdict-dot verdict-hit" /><span>{layer.name}</span><em>{layer.frame}</em></div>) : <p className="mt-2 text-xs text-slate-600">No verified supporting layers.</p>}</div><div><div className="flex items-center justify-between"><p className="brief-list-title text-rose-200">Misses / conflicting layers</p><span className="brief-count brief-count-miss">{conflicting.length}</span></div>{conflicting.length ? conflicting.map((layer: any) => <div key={`conflict-${layer.frame}-${layer.name}`} className="brief-list-item"><span className="verdict-dot verdict-miss" /><span>{layer.name}</span><em>{layer.frame}</em></div>) : <p className="mt-2 text-xs text-slate-600">No conflicting layers.</p>}</div></div></div></section>;
}

const workspaceNav: Array<[ComponentType<{ size?: number; strokeWidth?: number }>, string, boolean]> = [
  [Activity, "Overview", true],
  [FlaskConical, "Simulation runs", false],
  [Map, "Frame inspector", false],
  [Sparkles, "AI Pattern Lab", false],
];

const dataNav: Array<[ComponentType<{ size?: number; strokeWidth?: number }>, string]> = [
  [Database, "Event library"],
  [GitBranch, "Engine versions"],
  [Target, "Validation rules"],
];

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState("mlb-2024");
  const [selectedSport, setSelectedSport] = useState("All sports");
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [showManualFixture, setShowManualFixture] = useState(false);
  const [agentViewModel, setAgentViewModel] = useState<"astronomical" | "fixed-earth-dawn-anchored">("astronomical");
  const [sunriseTime, setSunriseTime] = useState("2024-04-01T12:10:13.153Z");
  const [sunriseSource, setSunriseSource] = useState("Weather Channel");
  const [search, setSearch] = useState("");
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [scheduleSport, setScheduleSport] = useState<"ALL" | "MLB" | "NBA" | "NFL">("ALL");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [importedDataset, setImportedDataset] = useState<{ id: number; name: string; rowCount: number; validRowCount: number; invalidRowCount: number } | null>(null);
  const [activeRunId, setActiveRunId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gameBriefRef = useRef<HTMLDivElement>(null);
  const simulateEvent = trpc.simulate.event.useMutation();
  const importCsv = trpc.datasets.importCsv.useMutation();
  const startRun = trpc.runs.start.useMutation();
  const runStatus = trpc.runs.get.useQuery({ runId: activeRunId ?? 0 }, { enabled: Boolean(activeRunId), refetchInterval: activeRunId ? 1000 : false });
  const runHistory = trpc.runs.list.useQuery({ limit: 8 });
  const scheduleQuery = trpc.schedules.list.useQuery({ date: scheduleDate, sport: scheduleSport });
  const [chatMessages, setChatMessages] = useState<Message[]>([{ role: "system", content: "You are the Firmament research assistant." }]);
  const chatMutation = trpc.ai.chat.useMutation({ onSuccess: (response) => setChatMessages((current) => [...current, { role: "assistant", content: response.content }]), onError: () => toast.error("The research assistant could not respond right now.") });

  const filteredTemplates = useMemo(() => templates.filter((template) => {
    const matchesSport = selectedSport === "All sports" || template.sport === selectedSport;
    const matchesSearch = `${template.label} ${template.sport}`.toLowerCase().includes(search.toLowerCase());
    return matchesSport && matchesSearch;
  }), [search, selectedSport]);

  useEffect(() => {
    if (runStatus.data?.status === "complete" || runStatus.data?.status === "partial" || runStatus.data?.status === "failed") {
      setIsRunning(false);
      setRunProgress(runStatus.data.progressPercent);
      void runHistory.refetch();
      if (runStatus.data.status === "complete") toast.success("Batch replay complete", { description: `${runStatus.data.completedEvents.toLocaleString()} events persisted with per-event engine output.` });
      if (runStatus.data.status === "partial") toast.warning("Batch replay completed with rejected events", { description: `${runStatus.data.failedEvents} events failed during calculation.` });
    }
  }, [runStatus.data]);

  useEffect(() => {
    if (simulationResult) {
      window.setTimeout(() => gameBriefRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [simulationResult]);

  const importFile = async (file: File) => {
    try {
      setIsRunning(true);
      const response = await importCsv.mutateAsync({ name: file.name.replace(/\.csv$/i, "") || "Imported event set", sourceFileName: file.name, csv: await file.text() });
      setImportedDataset({ id: response.datasetId, name: file.name, rowCount: response.rowCount, validRowCount: response.validRowCount, invalidRowCount: response.invalidRowCount });
      setIsRunning(false);
      toast.success("Dataset validated and versioned", { description: `${response.validRowCount.toLocaleString()} valid rows${response.invalidRowCount ? ` · ${response.invalidRowCount} rejected` : ""}.` });
    } catch (error) {
      setIsRunning(false);
      toast.error("CSV import failed", { description: error instanceof Error ? error.message : "The dataset could not be validated." });
    }
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunProgress(14);
    if (importedDataset) {
      try {
        const response = await startRun.mutateAsync({ datasetId: importedDataset.id });
        setActiveRunId(response.runId);
        setRunProgress(1);
        toast.success("Batch replay started", { description: `${response.totalEvents.toLocaleString()} validated events are running through the engine.` });
      } catch (error) {
        setIsRunning(false);
        toast.error("Batch start failed", { description: error instanceof Error ? error.message : "The persisted run could not be started." });
      }
      return;
    }
    const increments = [34, 59, 78, 92, 100];
    increments.forEach((value, index) => setTimeout(() => {
      setRunProgress(value);
      if (value === 100) setIsRunning(false);
    }, (index + 1) * 420));
    try {
      const result = await simulateEvent.mutateAsync({
        id: "engine-smoke-test-mlb-002",
        teamA: "New York Yankees",
        teamB: "Houston Astros",
        sport: "MLB",
        location: "Houston, TX",
        latitude: 29.7604,
        longitude: -95.3698,
        // 7:10 PM CDT in Houston = 2024-04-02 00:10 UTC.
        startTime: "2024-04-02T00:10:00.000Z",
        actualWinner: "B",
        agentViewModel,
        ...(agentViewModel === "fixed-earth-dawn-anchored" ? { sunriseTime: new Date(sunriseTime).toISOString(), sunriseSource } : {}),
      });
      setSimulationResult(result);
      toast.success("Firmament calculation complete", { description: "Chart placements, frame outputs, and layer verdicts are ready below." });
    } catch (error) {
      setIsRunning(false);
      toast.error("Calculation failed", { description: error instanceof Error ? error.message : "The engine adapter returned an error." });
    }
  };

  const runManualFixture = async (fixture: FixtureInput) => {
    if (isRunning) return;
    setIsRunning(true);
    setRunProgress(18);
    try {
      const result = await simulateEvent.mutateAsync({
        ...fixture,
        agentViewModel,
        ...(agentViewModel === "fixed-earth-dawn-anchored" ? { sunriseTime: new Date(sunriseTime).toISOString(), sunriseSource } : {}),
      });
      setSimulationResult(result);
      setRunProgress(100);
      toast.success("Manual fixture complete", { description: `${fixture.teamA} vs ${fixture.teamB} is ready for evidence review.` });
    } catch (error) {
      toast.error("Manual fixture failed", { description: error instanceof Error ? error.message : "The engine adapter returned an error." });
    } finally {
      setIsRunning(false);
    }
  };

  const runScheduledGame = async (game: any) => {
    await runManualFixture({
      id: game.id,
      teamA: game.teamA,
      teamB: game.teamB,
      sport: game.sport,
      location: game.location,
      latitude: game.latitude,
      longitude: game.longitude,
      startTime: game.startTime,
    });
  };

  const showResults = () => {
    if (simulationResult) {
      gameBriefRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    void runSimulation();
  };

  const downloadSampleCsv = () => {
    const csv = [
      "id,teamA,teamB,sport,location,latitude,longitude,startTime,actualWinner",
      "sample-mlb-001,New York Yankees,Houston Astros,MLB,Houston TX,29.7604,-95.3698,2024-04-02T00:10:00.000Z,B",
      "sample-nfl-001,Kansas City Chiefs,San Francisco 49ers,NFL,Las Vegas NV,36.1699,-115.1398,2024-02-11T23:30:00.000Z,A",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "firmament-simulation-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Sample CSV downloaded", { description: "Edit the rows, save the file, then upload it to the Lab." });
  };

  const comingSoon = (feature: string) => toast.info(`${feature} is staged for a later phase.`, { description: "The core import, calculation, and batch replay workflow is active." });
  const explainMethod = (layer: any) => {
    const question = `Explain the ${layer.frame} method “${layer.name}”. Its status is ${layer.verdict}, it selected Side ${layer.winner}, and its raw scores are A ${Number(layer.scoreA).toFixed(1)} / B ${Number(layer.scoreB).toFixed(1)}. Explain what that means and whether it is evaluable.`;
    const next = [...chatMessages, { role: "user" as const, content: question }];
    setChatMessages(next);
    const context = simulationResult ? JSON.stringify({ event: simulationResult.input, actualWinner: simulationResult.comparison.actualWinner, selectedLayer: layer }) : undefined;
    chatMutation.mutate({ messages: next, context });
    window.setTimeout(() => document.getElementById("research-assistant")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };


  return (
    <div className="min-h-screen bg-[#07101d] text-slate-200">
      <div className="fixed inset-0 pointer-events-none overflow-hidden"><div className="ambient-orb ambient-orb-one" /><div className="ambient-orb ambient-orb-two" /><div className="grain" /></div>
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[238px] shrink-0 border-r border-white/[0.07] bg-[#08111f]/70 px-5 py-7 lg:block">
          <div className="flex items-center gap-3 px-2"><div className="brand-mark"><Orbit size={20} strokeWidth={1.4} /></div><div><p className="font-display text-[15px] tracking-[0.02em] text-white">Firmament</p><p className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/70">Simulation Lab</p></div></div>
          <div className="mt-12"><p className="px-2 text-[9px] font-bold uppercase tracking-[0.24em] text-slate-600">Workspace</p><nav className="mt-3 space-y-1">
            {workspaceNav.map(([Icon, label, active]) => <button key={label} onClick={() => !active && comingSoon(label)} className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}><Icon size={16} strokeWidth={1.7} /><span>{label}</span>{label === "AI Pattern Lab" && <span className="ml-auto rounded bg-white/[0.06] px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-slate-500">Soon</span>}</button>)}
          </nav></div>
          <div className="mt-10"><p className="px-2 text-[9px] font-bold uppercase tracking-[0.24em] text-slate-600">Data</p><nav className="mt-3 space-y-1">{dataNav.map(([Icon, label]) => <button key={label} onClick={() => comingSoon(label)} className="sidebar-link"><Icon size={16} strokeWidth={1.7} /><span>{label}</span></button>)}</nav></div>
          <div className="absolute bottom-7 left-5 right-5 rounded-2xl border border-amber-200/10 bg-amber-200/[0.035] p-4"><div className="flex items-center gap-2 text-amber-200"><CircleHelp size={15} /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Integration boundary</span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">The adapter is pinned to the separate Firmament engine source; live formulas remain untouched.</p></div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-5 sm:px-8 lg:px-10 lg:py-8">
          <ManualFixtureDialog open={showManualFixture} onClose={() => setShowManualFixture(false)} onRun={runManualFixture} isRunning={isRunning} />
          <header className="flex flex-col gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3 lg:hidden"><div className="brand-mark"><Orbit size={18} /></div><span className="font-display text-sm text-white">Firmament / Lab</span></div><div><div className="flex items-center gap-2"><span className="status-dot" /><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300/80">Research environment · shell v0.2</p></div><h1 className="mt-3 font-display text-3xl tracking-[-0.03em] text-white sm:text-4xl">Sports market monitor</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Find scheduled games and see which team the current market favors. Every quote shows its source, timestamp, and whether odds are available.</p></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => comingSoon("Documentation")} className="icon-button" aria-label="Documentation"><CircleHelp size={17} /></button><button onClick={() => setShowConfig(!showConfig)} className={`button-secondary ${showConfig ? "button-secondary-active" : ""}`}><Settings2 size={15} /> Run configuration</button><ResearchWorkspaceHeader onNewFixture={() => setShowManualFixture(true)} /><button onClick={() => simulationResult ? downloadResultBundle(simulationResult) : comingSoon("Export report")} className="icon-button" aria-label="Export report"><Download size={17} /></button></div></header>

          <section className="mt-6 rounded-2xl border border-cyan-300/15 bg-gradient-to-r from-cyan-300/[0.08] via-white/[0.025] to-violet-300/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,.18)]"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="eyebrow text-cyan-200/80">Start here · no setup required</p><h2 className="mt-2 font-display text-xl text-white">Check the market first</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">Choose a date and sport in the schedule board below. The advanced engine remains available for research, but it is no longer the primary forecast.</p></div><div className="flex flex-wrap gap-2"><button onClick={showResults} disabled={isRunning || Boolean(importedDataset)} className="button-primary shrink-0"><Target size={15} /> {simulationResult ? "Show me the results" : "Open advanced engine test"}</button><button onClick={downloadSampleCsv} className="button-secondary shrink-0"><Download size={15} /> Download sample CSV</button></div></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="guide-step"><span>01</span><div><strong>Test now</strong><p>Runs Yankees vs Astros, a saved historical fixture, without uploading anything.</p></div></div><div className="guide-step"><span>02</span><div><strong>Choose a model</strong><p>Run configuration lets you compare astronomical AgentView with dawn-anchored AgentView.</p></div></div><div className="guide-step"><span>03</span><div><strong>Read the result</strong><p>Game Brief explains the call; the audit lists every method as HIT, MISS, or NOT EVALUABLE.</p></div></div></div><div className="mt-4 border-t border-white/[0.07] pt-4 text-[11px] leading-5 text-slate-500"><strong className="text-slate-300">What the two views mean:</strong> God View keeps houses fixed to the ancient background. AgentView uses the game’s event time and location—or the dawn-anchored model you select.</div></section>

          {showConfig && <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.045] p-4 shadow-[0_0_60px_rgba(65,215,255,.04)]"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-cyan-300/10 p-2 text-cyan-200"><Settings2 size={16} /></div><div><p className="text-xs font-semibold text-white">Run configuration</p><p className="mt-0.5 text-[11px] text-slate-500">Choose which ascendant model AgentView uses. God View remains fixed.</p></div></div><button onClick={() => setShowConfig(false)} className="text-slate-500 transition hover:text-white"><X size={16} /></button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="config-cell"><span>Background</span><strong>Ancient / Hamal</strong></div><div className="config-cell"><span>Anchor</span><strong>13° Aries</strong></div><label className="config-cell"><span>AgentView ascendant</span><select value={agentViewModel} onChange={(event) => setAgentViewModel(event.target.value as typeof agentViewModel)} className="mt-1 bg-transparent text-sm text-white outline-none"><option value="astronomical">Spherical-Earth astronomical</option><option value="fixed-earth-dawn-anchored">Fixed-Earth dawn-anchored</option></select></label><div className="config-cell"><span>Engine</span><strong className="text-emerald-200">Connected</strong></div></div>{agentViewModel === "fixed-earth-dawn-anchored" && <div className="mt-3 grid gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-3 sm:grid-cols-2"><label className="text-[11px] text-slate-400">Sunrise time (ISO / UTC)<input value={sunriseTime} onChange={(event) => setSunriseTime(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white" /></label><label className="text-[11px] text-slate-400">Sunrise source<input value={sunriseSource} onChange={(event) => setSunriseSource(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white" /></label><p className="text-[11px] leading-5 text-slate-500 sm:col-span-2">The dawn model uses the supplied sunrise as the anchor. The source is recorded in the result; it is not silently replaced by the astronomical horizon calculation.</p></div>}</div>}

          {simulationResult && <div ref={gameBriefRef}><GameBrief result={simulationResult} /></div>}
          <section id="research-assistant" className="mt-6 panel overflow-hidden"><div className="panel-header"><div><p className="eyebrow text-cyan-200/80">Research assistant</p><h2 className="section-title">Ask about this workspace</h2><p className="mt-1 text-xs text-slate-500">Ask what “not evaluated” means, how a frame differs, or how to read a market quote. The assistant explains recorded data; it does not invent missing inputs.</p></div><Pill tone="cyan">Context-aware</Pill></div><div className="p-4"><AIChatBox messages={chatMessages} onSendMessage={(content) => { const next = [...chatMessages, { role: "user" as const, content }]; setChatMessages(next); const context = simulationResult ? JSON.stringify({ event: simulationResult.input, comparison: simulationResult.comparison, baseline: simulationResult.baseline, godView: { winner: simulationResult.godView.synthesis.winner, hits: simulationResult.godView.summary.hits, layers: simulationResult.godView.allLayers.map((layer: any) => ({ name: layer.name, verdict: layer.verdict, winner: layer.winner, scoreA: layer.scoreA, scoreB: layer.scoreB })) }, agentView: { winner: simulationResult.agentView.synthesis.winner, hits: simulationResult.agentView.summary.hits, layers: simulationResult.agentView.allLayers.map((layer: any) => ({ name: layer.name, verdict: layer.verdict, winner: layer.winner, scoreA: layer.scoreA, scoreB: layer.scoreB })) } }) : undefined; chatMutation.mutate({ messages: next, context }); }} isLoading={chatMutation.isPending} height="360px" emptyStateMessage="Ask a question about the schedule, audit, or calculation transparency." suggestedPrompts={["Why does this audit say not evaluated?", "What inputs are recorded for the current result?", "Explain God View versus AgentView."]} /></div></section>


          {simulationResult && <><TransparencyPanel result={simulationResult} /><HousePlacementPanel result={simulationResult} /><section className="mt-6 panel"><div className="panel-header"><div><p className="eyebrow">Detailed evidence</p><h2 className="section-title">Chart and layer audit</h2></div><div className="flex items-center gap-2"><Pill tone="emerald">Technical view</Pill><button onClick={() => setSimulationResult(null)} className="icon-button"><X size={16} /></button></div></div><div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_1fr_1fr]"><div><p className="eyebrow">Calculation output · engine smoke test</p><h2 className="section-title">Chart and layer audit</h2></div><div className="flex items-center gap-2"><Pill tone={simulationResult.comparison.verified ? "emerald" : "gold"}>{simulationResult.comparison.verified ? "Verified fixture" : "Prospective fixture"}</Pill><button onClick={() => setSimulationResult(null)} className="icon-button" aria-label="Clear result"><X size={16} /></button></div></div><div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_1fr_1fr]"><div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><p className="eyebrow">Baseline result</p><p className="mt-3 font-display text-3xl text-white">Team {simulationResult.baseline.winner}</p><p className="mt-1 text-xs text-slate-500">{simulationResult.input.teamA} vs {simulationResult.input.teamB}</p><div className="mt-4 grid grid-cols-2 gap-2"><div className="mini-metric"><span>Territorial</span><strong>{simulationResult.baseline.territorial.winner}</strong></div><div className="mini-metric"><span>KP Stellar</span><strong>{simulationResult.baseline.kpStellar.winner}</strong></div><div className="mini-metric"><span>Actual</span><strong>{simulationResult.comparison.actualWinner}</strong></div><div className="mini-metric"><span>Baseline</span><strong className="text-emerald-200">{simulationResult.baseline.verdict}</strong></div></div></div><div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><div className="flex items-center justify-between"><p className="eyebrow">God View layer audit</p><Pill tone={simulationResult.comparison.verified ? "emerald" : "amber"}>{simulationResult.comparison.verified ? `${simulationResult.godView.summary.hits} hits` : "Outcome pending"}</Pill></div><p className="mt-3 font-display text-2xl text-white">{simulationResult.godView.synthesis.winner}</p><p className="mt-1 text-xs text-slate-500">Permanent fixed-background frame · {simulationResult.comparison.verified ? "Scored against actual result" : "No HIT/MISS scoring until actual winner is supplied"}</p><div className="mt-4 space-y-2">{simulationResult.godView.allLayers.slice(0, 5).map((layer: any) => <div key={layer.name} className="layer-row"><span className={`verdict-dot verdict-${layer.verdict}`} /><span>{layer.name}</span><strong>{layer.verdict}</strong></div>)}</div></div><div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><div className="flex items-center justify-between"><p className="eyebrow">AgentView layer audit</p><Pill tone={simulationResult.comparison.verified ? "emerald" : "amber"}>{simulationResult.comparison.verified ? `${simulationResult.agentView.summary.hits} hits` : "Outcome pending"}</Pill></div><p className="mt-3 font-display text-2xl text-white">{simulationResult.agentView.synthesis.winner}</p><p className="mt-1 text-xs text-slate-500">Local moving-Ascendant frame · {simulationResult.comparison.verified ? "Scored against actual result" : "No HIT/MISS scoring until actual winner is supplied"}</p><div className="mt-4 space-y-2">{simulationResult.agentView.allLayers.slice(0, 5).map((layer: any) => <div key={layer.name} className="layer-row"><span className={`verdict-dot verdict-${layer.verdict}`} /><span>{layer.name}</span><strong>{layer.verdict}</strong></div>)}</div></div></div><PlacementTable planets={simulationResult.chart.godView.planets} /><div className="border-t border-white/[0.07] px-5 py-4"><div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500"><span className="flex items-center gap-2"><Orbit size={13} className="text-cyan-300" /> Ascendant {simulationResult.chart.godView.ascendantLongitude.toFixed(2)}°</span><span className="flex items-center gap-2"><Layers3 size={13} className="text-violet-300" /> {simulationResult.chart.godView.planets.length} planetary placements</span><span className="flex items-center gap-2"><Target size={13} className="text-emerald-300" /> {simulationResult.comparison.actualWinner ? `Actual result: Team ${simulationResult.comparison.actualWinner}` : "Actual result: not supplied yet"}</span><button onClick={() => comingSoon("Full chart inspector")} className="button-quiet sm:ml-auto">Open full placement inspector <ArrowUpRight size={13} /></button></div></div></section><MethodExplorer result={simulationResult} onExplain={explainMethod} /></>}

          <section className="mt-7 panel overflow-hidden"><div className="panel-header"><div><p className="eyebrow text-cyan-200/80">Market favorite lookup</p><h2 className="section-title">See who the market favors</h2><p className="mt-1 text-xs leading-5 text-slate-500">Scheduled games are loaded by date and sport. The market favorite is shown from the latest available moneyline; no ascendant or descendant assignment is required.</p></div><span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-100">{scheduleQuery.isFetching ? "Refreshing" : `${scheduleQuery.data?.length ?? 0} games loaded`}</span></div><div className="grid gap-3 border-b border-white/[0.07] p-5 sm:grid-cols-[180px_140px_auto]"><label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Date<input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs normal-case tracking-normal text-slate-200 outline-none" /></label><label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Sport<select value={scheduleSport} onChange={(event) => setScheduleSport(event.target.value as typeof scheduleSport)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs normal-case tracking-normal text-slate-200 outline-none"><option value="ALL">All sports</option><option value="MLB">MLB</option><option value="NBA">NBA</option><option value="NFL">NFL</option></select></label><div className="flex items-end"><span className="text-[11px] leading-5 text-slate-500">Schedule: official league feed where available. Favorite: sportsbook moneyline via ESPN odds feed. Every quote shows its source and availability.</span></div></div><div className="divide-y divide-white/[0.06]">{scheduleQuery.isLoading && <div className="px-5 py-6 text-xs text-slate-500">Loading scheduled games…</div>}{!scheduleQuery.isLoading && !scheduleQuery.data?.length && <div className="px-5 py-7 text-center text-xs text-slate-500">No games returned for this date and sport. Try another date or sport.</div>}{scheduleQuery.data?.map((game: any) => <div key={game.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="sport-badge sport-slate">{game.sport}</span><p className="text-sm font-semibold text-slate-100">{game.teamA} <span className="font-normal text-slate-600">at</span> {game.teamB}</p></div><p className="mt-1 text-[11px] text-slate-500">{new Date(game.startTime).toLocaleString()} · {game.venue} · {game.location}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Market favorite</span>{game.favoriteTeam ? <strong className="text-sm text-emerald-200">{game.favoriteTeam}</strong> : <span className="text-xs text-amber-200">Odds unavailable</span>}{game.favoriteTeam && <span className="text-[10px] text-slate-500">{game.oddsProvider ?? "Odds feed"} · Home {game.homeMoneyline ?? "—"} / Away {game.awayMoneyline ?? "—"}</span>}</div><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">{game.source} · {game.status}{game.oddsUpdatedAt ? ` · odds updated ${new Date(game.oddsUpdatedAt).toLocaleTimeString()}` : ""}</p></div><button onClick={() => void runScheduledGame(game)} disabled={isRunning} className="button-primary shrink-0"><Play size={14} fill="currentColor" /> Open advanced analysis</button></div>)}</div></section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Database} eyebrow="Historical events" value="3,932" detail="3 templates staged for replay" accent="bg-cyan-300/20" /><StatCard icon={Gauge} eyebrow="Last baseline accuracy" value="54.7%" detail="MLB 2024 · preview metric" accent="bg-emerald-300/20" /><StatCard icon={Layers3} eyebrow="Analysis frames" value="02" detail="God View + AgentView" accent="bg-violet-300/20" /><StatCard icon={Zap} eyebrow="Engine status" value="Staged" detail="Adapter boundary ready" accent="bg-amber-300/20" /></section>

          <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.42fr)_minmax(360px,.9fr)]">
            <div className="panel overflow-hidden"><div className="panel-header"><div><p className="eyebrow">01 / Your data</p><h2 className="section-title">Choose or import events</h2></div><ResearchWorkspaceHeader onNewFixture={() => setShowManualFixture(true)} /></div><div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-4 sm:flex-row"><div className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search event sets" /></div><div className="relative"><select value={selectedSport} onChange={(event) => setSelectedSport(event.target.value)} className="select-field"><option>All sports</option><option>MLB</option><option>NFL</option><option>NBA</option><option>Custom</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-500" size={14} /></div><button onClick={() => comingSoon("Advanced filters")} className="button-secondary sm:ml-auto"><Filter size={14} /> Filters</button></div><div className="divide-y divide-white/[0.055]">{filteredTemplates.map((template) => <button key={template.id} onClick={() => setActiveTemplate(template.id)} className={`template-row ${activeTemplate === template.id ? "template-row-active" : ""}`}><div className={`sport-badge sport-${template.accent}`}>{template.code}</div><div className="min-w-0 flex-1 text-left"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold text-slate-200">{template.label}</p>{template.status === "ready" ? <Pill tone="emerald">Ready</Pill> : <Pill>Draft</Pill>}</div><p className="mt-1 text-xs text-slate-500">{template.range} <span className="mx-1.5 text-slate-700">·</span> {template.events ? `${template.events.toLocaleString()} events` : "No events loaded"}</p></div><div className="text-right"><span className="text-xs font-semibold text-slate-400">{template.events ? "Replayable" : "Upload data"}</span><ArrowUpRight size={15} className="ml-auto mt-2 text-slate-600" /></div></button>)}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4"><p className="text-[11px] text-slate-600">Need your own games? Download the template, edit the rows, then upload it.</p><div className="flex items-center gap-3"><button onClick={downloadSampleCsv} className="button-quiet"><Download size={14} /> Sample CSV</button><input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); event.currentTarget.value = ""; }} /><button onClick={() => fileInputRef.current?.click()} className="button-quiet"><Upload size={14} /> Import CSV</button></div></div></div>

            <div className="panel"><div className="panel-header"><div><p className="eyebrow">02 / What the engine reads</p><h2 className="section-title">Two calculation frames</h2></div><button onClick={() => comingSoon("Frame inspector")} className="icon-button"><MoreHorizontal size={17} /></button></div><div className="space-y-3 px-5 pb-5"><FrameMap frame="God View" mode="god" /><FrameMap frame="AgentView" mode="agent" /><div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3"><div className="flex items-center gap-2 text-amber-200"><Waves size={14} /><span className="text-[11px] font-semibold">Topography maps are reserved for engine output</span></div><p className="mt-1 text-[11px] leading-5 text-slate-500">These visual maps will show the engine evidence for each frame. The audit below is the source of truth for hits and misses.</p></div></div></div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.42fr)_minmax(360px,.9fr)]">
            <div className="panel"><div className="panel-header"><div><p className="eyebrow">03 / Run it</p><h2 className="section-title">Start a historical replay</h2><p className="mt-1 text-xs text-slate-500">For your first test, leave the dataset empty and click the button below.</p></div><Pill tone="emerald">Engine connected</Pill></div><div className="grid gap-4 px-5 pb-5 md:grid-cols-[1fr_1fr_auto]"><div className="runner-cell"><div className="runner-icon"><CalendarDays size={16} /></div><div><p className="runner-label">Selected data</p><p className="runner-value">{importedDataset?.name ?? "Built-in Yankees vs Astros test"}</p><p className="runner-meta">{importedDataset ? `${importedDataset.validRowCount.toLocaleString()} valid / ${importedDataset.rowCount.toLocaleString()} rows · dataset v${importedDataset.id}` : "No upload needed for the built-in test"}</p></div></div><div className="runner-cell"><div className="runner-icon"><Layers3 size={16} /></div><div><p className="runner-label">What will be compared</p><p className="runner-value">God View + AgentView</p><p className="runner-meta">God View = fixed background · AgentView = selected ascendant model</p></div></div><div className="flex items-center"><button onClick={runSimulation} disabled={isRunning || !importedDataset && simulateEvent.isPending} className="button-run"><Play size={15} fill="currentColor" />{isRunning ? `${activeRunId ? `Running ${runProgress}%` : `Preparing ${runProgress}%`}` : importedDataset ? "Run uploaded games" : "Run built-in test game"}</button></div></div>{isRunning && <div className="mx-5 mb-3 h-1 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 transition-all duration-300" style={{ width: `${runProgress}%` }} /></div>}{activeRunId && <div className="mx-5 mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-slate-600"><span>Run {activeRunId} · {runStatus.data?.status ?? "starting"}</span><span>{runStatus.data ? `${runStatus.data.completedEvents + runStatus.data.failedEvents}/${runStatus.data.totalEvents} processed` : "Initializing"}</span></div>}<div className="mx-5 mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-4 text-[11px] text-slate-500"><span className="flex items-center gap-2"><Clock3 size={13} /> Historical replay only</span><span className="flex items-center gap-2"><Radio size={13} /> No live promotion</span><span className="flex items-center gap-2"><Target size={13} /> Outcome comparison persisted</span></div></div>

            <div className="panel"><div className="panel-header"><div><p className="eyebrow">04 / System contract</p><h2 className="section-title">Ready for the engine</h2></div><GitBranch size={18} className="text-cyan-300" /></div><div className="space-y-2 px-5 pb-5">{[["Input", "Date · time · venue · sport"], ["Transform", "Tropical ephemeris → ancient fixed background"], ["Frames", "God View + local AgentView"], ["Output", "Evidence · winner · verified outcome"]].map(([label, value], index) => <div key={label} className="contract-row"><span className="contract-index">0{index + 1}</span><div><p className="text-[11px] font-semibold text-slate-300">{label}</p><p className="mt-0.5 text-[11px] leading-5 text-slate-500">{value}</p></div><span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300/70" /></div>)}</div></div>
          </section>

          <RunHistoryPanel runs={runHistory.data} isLoading={runHistory.isLoading} onRefresh={() => void runHistory.refetch()} />

          <footer className="flex flex-col gap-3 py-8 text-[10px] uppercase tracking-[0.16em] text-slate-700 sm:flex-row sm:items-center sm:justify-between"><span>Firmament Simulation Lab · Separate research environment</span><span>Ancient fixed-background baseline · 13° Aries / Hamal</span></footer>
        </main>
      </div>
    </div>
  );
}
