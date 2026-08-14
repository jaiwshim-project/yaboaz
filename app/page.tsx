"use client";

import { useMemo, useState } from "react";

type View = "command" | "projects" | "field" | "questions" | "ontology" | "approvals" | "kpi" | "assets";
type Suggestion = { id: number; kind: string; title: string; reason: string; confidence: number; risk: string; status: "pending" | "accepted" | "rejected" };

const nav: { id: View; label: string; icon: string; badge?: string }[] = [
  { id: "command", label: "미션 컨트롤", icon: "⌁" },
  { id: "projects", label: "프로젝트", icon: "▦", badge: "4" },
  { id: "field", label: "현장 기록", icon: "◎", badge: "12" },
  { id: "questions", label: "질문 플래너", icon: "?", badge: "5" },
  { id: "ontology", label: "온톨로지 스튜디오", icon: "◇" },
  { id: "approvals", label: "승인 센터", icon: "✓", badge: "3" },
  { id: "kpi", label: "성과 · KPI", icon: "↗" },
  { id: "assets", label: "원시요소 라이브러리", icon: "▣" },
];

const stages = ["온보딩", "목표·문제", "자료 정규화", "현장 탐색", "인터뷰", "온톨로지", "의사결정", "MVP", "승인·실행", "KPI", "자산화"];
const stageDetails = [
  ["고객 브리프 확정", "보안등급·담당자 등록", "프로젝트 범위 동의"],
  ["핵심 목표 3건 등록", "문제 진술 검토", "기준 KPI 연결"],
  ["원자료 출처 연결", "민감정보 분류", "추출 신뢰도 확인"],
  ["현장 관찰 8건", "이해관계자 맵", "병목 증거 확보"],
  ["핵심 인터뷰 5회", "상충 답변 확인", "후속 질문 생성"],
  ["7요소 구조화", "고아 객체 탐지", "규칙 충돌 해소"],
  ["대안 3개 비교", "Payoff Matrix", "고객 선택 기록"],
  ["요구사항 변환", "테스트 시나리오", "배포 백로그"],
  ["보안 검토", "실행 승인", "결과·재시도 기록"],
  ["목표값 측정", "허용편차 분석", "성과 보고"],
  ["회고·코칭", "원시요소 후보", "재사용 검증"],
];

const projects = [
  { name: "FireNavi 현장대응 고도화", customer: "에스비컨설팅", industry: "안전", stage: 5, health: 78, status: "진행 중", tone: "coral" },
  { name: "스마트병원 환자경험 개선", customer: "메드보", industry: "의료", stage: 8, health: 91, status: "승인 대기", tone: "mint" },
  { name: "생산라인 비가동 분석", customer: "K-팩토리", industry: "제조", stage: 4, health: 67, status: "주의", tone: "amber" },
  { name: "Academy 실습 표준화", customer: "K-FDE Academy", industry: "교육", stage: 10, health: 96, status: "성과 측정", tone: "blue" },
];

const evidenceSeed = [
  { type: "관찰", title: "야간 교대 시 인수인계 공백", source: "현장 A구역 · 김FDE", confidence: 92, time: "오늘 09:42", tag: "사실" },
  { type: "인터뷰", title: "알림 우선순위 기준이 팀마다 다름", source: "안전관리자 인터뷰", confidence: 84, time: "어제 16:20", tag: "가설" },
  { type: "로그", title: "초동 보고 평균 14.2분 소요", source: "대응로그 248건", confidence: 98, time: "8월 13일", tag: "사실" },
  { type: "요청", title: "모바일 체크리스트 간소화 필요", source: "현장 작업자 6명", confidence: 76, time: "8월 12일", tag: "요청" },
];

const questionSeed = [
  { title: "알림을 받은 뒤 실제 행동을 시작하기까지 무엇을 확인합니까?", target: "현장 작업자", value: 94, purpose: "행동 전환 병목 확인", sensitivity: "낮음" },
  { title: "긴급도를 판단하는 공식 기준과 암묵적 기준은 어떻게 다릅니까?", target: "안전관리자", value: 89, purpose: "판단 규칙 구조화", sensitivity: "중간" },
  { title: "보고가 지연됐지만 결과가 좋았던 사례에는 어떤 공통점이 있습니까?", target: "교대 책임자", value: 81, purpose: "예외 패턴 탐색", sensitivity: "낮음" },
  { title: "현재 데이터 중 의사결정에 가장 신뢰하기 어려운 값은 무엇입니까?", target: "IT 관리자", value: 78, purpose: "증거 신뢰도 검증", sensitivity: "중간" },
];

const ontologyNodes = [
  { id: "incident", label: "화재 이벤트", type: "이벤트", x: 50, y: 16 },
  { id: "site", label: "현장 A구역", type: "객체", x: 17, y: 42 },
  { id: "alert", label: "위험 알림", type: "상태", x: 48, y: 48 },
  { id: "rule", label: "등급 판정 규칙", type: "규칙", x: 78, y: 39 },
  { id: "fde", label: "현장 FDE", type: "객체", x: 25, y: 75 },
  { id: "action", label: "초동 대응", type: "행동", x: 61, y: 78 },
];

export default function Home() {
  const [view, setView] = useState<View>("command");
  const [stage, setStage] = useState(5);
  const [project, setProject] = useState(projects[0]);
  const [evidence, setEvidence] = useState(evidenceSeed);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedNode, setSelectedNode] = useState("alert");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: 1, kind: "다음 질문", title: "교대조별 판단 기준의 차이를 확인하세요", reason: "상충 답변 3건과 미확정 규칙 2건이 발견되었습니다.", confidence: 91, risk: "낮음", status: "pending" },
    { id: 2, kind: "다음 행동", title: "초동 보고 체크리스트를 5개 항목으로 축소", reason: "평균 보고시간 14.2분 중 중복 입력이 38%를 차지합니다.", confidence: 86, risk: "중간", status: "pending" },
    { id: 3, kind: "개발 제안", title: "오프라인 우선 현장 기록 PWA 프로토타입", reason: "네트워크 단절 7건이 증거 누락과 직접 연결됩니다.", confidence: 82, risk: "중간", status: "pending" },
  ]);

  const pending = suggestions.filter((item) => item.status === "pending").length;
  const title = nav.find((item) => item.id === view)?.label ?? "미션 컨트롤";
  const progress = Math.round(((stage + 1) / stages.length) * 100);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function decide(id: number, status: "accepted" | "rejected") {
    setSuggestions((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    notify(status === "accepted" ? "제안을 실행 백로그에 추가했습니다." : "거절 사유 기록을 준비했습니다.");
  }

  const selected = useMemo(() => ontologyNodes.find((node) => node.id === selectedNode)!, [selectedNode]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">K</span><span><strong>K-FDE</strong><small>FIELD OPERATING SYSTEM</small></span></div>
        <div className="project-switcher">
          <small>ACTIVE PROJECT</small>
          <button onClick={() => setView("projects")}><span className="project-dot" />{project.name}<b>⌄</b></button>
        </div>
        <nav aria-label="주 메뉴">
          {nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><i>{item.icon}</i><span>{item.label}</span>{item.badge && <em>{item.id === "approvals" ? pending : item.badge}</em>}</button>)}
        </nav>
        <div className="sidebar-foot">
          <div className="security"><span>●</span><div><strong>보안 연결됨</strong><small>마지막 동기화 1분 전</small></div></div>
          <button className="profile"><span>SJ</span><div><strong>심재우</strong><small>Platform Owner</small></div><b>•••</b></button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar"><div><span className="eyebrow">K-FDE / {project.customer}</span><h1>{title}</h1></div><div className="header-actions"><button className="icon-button" aria-label="검색">⌕</button><button className="icon-button alert" aria-label="알림">♢<em>3</em></button><button className="primary" onClick={() => setModal(true)}>＋ 현장 기록</button></div></header>

        {view === "command" && <CommandCenter stage={stage} setStage={setStage} progress={progress} suggestions={suggestions} decide={decide} setView={setView} />}
        {view === "projects" && <Projects current={project.name} onSelect={(next) => { setProject(next); setStage(next.stage); setView("command"); notify(`${next.name} 프로젝트로 전환했습니다.`); }} />}
        {view === "field" && <FieldRecords evidence={evidence} onAdd={() => setModal(true)} />}
        {view === "questions" && <Questions notify={notify} />}
        {view === "ontology" && <Ontology selected={selected} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />}
        {view === "approvals" && <Approvals suggestions={suggestions} decide={decide} />}
        {view === "kpi" && <Kpi />}
        {view === "assets" && <Assets notify={notify} />}
      </section>

      {modal && <EvidenceModal onClose={() => setModal(false)} onSave={(title, type) => { setEvidence([{ type, title, source: "모바일 현장 기록 · 심재우", confidence: 70, time: "방금 전", tag: "미확인" }, ...evidence]); setModal(false); notify("증거를 저장하고 검토 대기열에 추가했습니다."); }} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}

function CommandCenter({ stage, setStage, progress, suggestions, decide, setView }: { stage: number; setStage: (n: number) => void; progress: number; suggestions: Suggestion[]; decide: (id: number, status: "accepted" | "rejected") => void; setView: (v: View) => void }) {
  return <div className="page-content">
    <section className="mission-hero">
      <div className="mission-copy"><span className="live-label"><i /> MISSION IN PROGRESS</span><h2>현장의 신호를<br />실행 가능한 구조로.</h2><p>흩어진 증거를 연결하고, 다음 질문과 행동을 결정해<br />작은 실행으로 성과를 만드세요.</p><div className="mission-meta"><span><small>현재 단계</small><strong>06 · {stages[stage]}</strong></span><span><small>다음 게이트</small><strong>규칙 충돌 2건 해소</strong></span></div></div>
      <div className="radar-wrap"><div className="radar-ring ring-1" /><div className="radar-ring ring-2" /><div className="radar-ring ring-3" /><div className="radar-sweep" /><div className="radar-center"><strong>{progress}%</strong><small>MISSION</small></div><i className="ping p1" /><i className="ping p2" /><i className="ping p3" /></div>
    </section>

    <section className="stage-panel">
      <div className="section-heading"><div><span className="eyebrow">11-STAGE OPERATING LOOP</span><h3>표준 실행 흐름</h3></div><button className="text-button">전체 흐름 보기 →</button></div>
      <div className="stage-track">{stages.map((label, i) => <button key={label} onClick={() => setStage(i)} className={`${i < stage ? "done" : ""} ${i === stage ? "current" : ""}`}><span>{i < stage ? "✓" : String(i + 1).padStart(2, "0")}</span><small>{label}</small></button>)}</div>
      <div className="stage-detail"><div><span className="step-number">0{stage + 1}</span><div><small>ACTIVE GATE</small><h4>{stages[stage]}</h4></div></div><ul>{stageDetails[stage].map((item, i) => <li key={item}><span className={i === 2 ? "todo" : "checked"}>{i === 2 ? "○" : "✓"}</span>{item}</li>)}</ul><button onClick={() => setStage(Math.min(10, stage + 1))}>게이트 검토 <span>→</span></button></div>
    </section>

    <section className="metric-grid"><Metric label="확보된 증거" value="47" delta="+8 이번 주" note="사실 31 · 가설 10 · 요청 6" tone="blue" /><Metric label="온톨로지 완성도" value="78%" delta="+12%" note="객체 24 · 관계 37 · 규칙 9" tone="mint" /><Metric label="미확정 질문" value="5" delta="2건 긴급" note="정보가치 평균 86점" tone="amber" /><Metric label="실행 성과" value="1.8×" delta="목표 대비" note="초동시간 22% 단축" tone="coral" /></section>

    <div className="dashboard-grid">
      <section className="panel ai-panel"><div className="panel-title"><div><span className="ai-spark">✦</span><div><h3>AI 다음 제안</h3><small>증거 · 규칙 · 권한 기반</small></div></div><span className="model-pill">K-FDE Reasoner</span></div>{suggestions.filter((s) => s.status === "pending").slice(0, 2).map((item) => <article className="suggestion" key={item.id}><div className="suggestion-top"><span>{item.kind}</span><em>신뢰도 {item.confidence}%</em></div><h4>{item.title}</h4><p>{item.reason}</p><div className="evidence-line"><span>근거 4</span><span>적용 규칙 2</span><span>리스크 {item.risk}</span></div><div className="card-actions"><button onClick={() => decide(item.id, "rejected")}>거절</button><button onClick={() => decide(item.id, "accepted")}>검토 후 적용 →</button></div></article>)}<button className="panel-link" onClick={() => setView("approvals")}>모든 제안과 승인 보기 <span>→</span></button></section>
      <section className="panel activity-panel"><div className="panel-title"><div><h3>최근 현장 신호</h3><small>실시간 증거 스트림</small></div><button>•••</button></div><div className="timeline"><Timeline icon="◎" title="관찰 기록이 추가되었습니다" desc="A구역 · 야간 교대 인수인계" time="09:42" tone="blue" /><Timeline icon="⇄" title="상충 답변이 감지되었습니다" desc="긴급도 판단 기준 · 인터뷰 2건" time="08:15" tone="amber" /><Timeline icon="✓" title="행동 실행이 완료되었습니다" desc="모바일 알림 규칙 v1.3 적용" time="어제" tone="mint" /><Timeline icon="↗" title="KPI가 목표 범위에 진입했습니다" desc="초동 보고시간 14.2 → 11.1분" time="어제" tone="coral" /></div><button className="panel-link" onClick={() => setView("field")}>전체 현장 기록 보기 <span>→</span></button></section>
      <section className="panel risk-panel"><div className="panel-title"><div><h3>리스크 워치</h3><small>게이트 통과 전 확인</small></div><span className="risk-count">3</span></div><div className="risk-item high"><span>!</span><div><strong>규칙 충돌</strong><p>‘긴급도 판정’ 조건이 2개 부서에서 다릅니다.</p><small>게이트 차단 · 담당 김FDE</small></div></div><div className="risk-item mid"><span>!</span><div><strong>증거 최신성</strong><p>설비점검 로그가 14일간 갱신되지 않았습니다.</p><small>검토 필요 · IT 관리자</small></div></div><div className="risk-item low"><span>i</span><div><strong>승인 대기</strong><p>현장 알림 실험안이 18시간째 대기 중입니다.</p><small>승인자 박팀장</small></div></div><button className="panel-link" onClick={() => setView("approvals")}>해결 계획 열기 <span>→</span></button></section>
    </div>
  </div>;
}

function Metric({ label, value, delta, note, tone }: { label: string; value: string; delta: string; note: string; tone: string }) { return <article className={`metric ${tone}`}><div className="metric-kicker"><span>{label}</span><i /></div><div className="metric-value"><strong>{value}</strong><em>{delta}</em></div><p>{note}</p><div className="sparkbars">{[35, 52, 44, 68, 61, 79, 88].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></article>; }
function Timeline({ icon, title, desc, time, tone }: { icon: string; title: string; desc: string; time: string; tone: string }) { return <div className="timeline-item"><span className={`timeline-icon ${tone}`}>{icon}</span><div><strong>{title}</strong><p>{desc}</p></div><time>{time}</time></div>; }

function Projects({ current, onSelect }: { current: string; onSelect: (p: typeof projects[number]) => void }) { return <div className="page-content"><div className="page-intro"><div><span className="eyebrow">PORTFOLIO</span><h2>현장 프로젝트</h2><p>고객 목표와 실행 단계, 위험 신호를 한눈에 관리합니다.</p></div><button className="primary">＋ 새 프로젝트</button></div><div className="project-grid">{projects.map((p) => <article className={`project-card ${p.tone}`} key={p.name}><div className="project-card-top"><span>{p.industry}</span><em>{p.status}</em></div><h3>{p.name}</h3><p>{p.customer}</p><div className="health"><span>프로젝트 건강도 <b>{p.health}</b></span><div><i style={{ width: `${p.health}%` }} /></div></div><div className="project-foot"><span>단계 {String(p.stage + 1).padStart(2, "0")} · {stages[p.stage]}</span><button disabled={current === p.name} onClick={() => onSelect(p)}>{current === p.name ? "현재 프로젝트" : "열기 →"}</button></div></article>)}</div></div>; }

function FieldRecords({ evidence, onAdd }: { evidence: typeof evidenceSeed; onAdd: () => void }) { return <div className="page-content"><div className="page-intro"><div><span className="eyebrow">FIELD EVIDENCE</span><h2>현장 기록</h2><p>관찰, 발언, 로그를 출처와 신뢰도가 있는 증거로 전환합니다.</p></div><button className="primary" onClick={onAdd}>＋ 기록 추가</button></div><div className="filter-row"><button className="active">전체 {evidence.length}</button><button>관찰</button><button>인터뷰</button><button>문서·로그</button><label>⌕ <input aria-label="현장 기록 검색" placeholder="기록 검색" /></label></div><div className="evidence-list">{evidence.map((item, i) => <article key={`${item.title}-${i}`}><span className={`evidence-icon t${i % 4}`}>{item.type.slice(0, 1)}</span><div className="evidence-main"><div><em>{item.type}</em><span className={`tag ${item.tag}`}>{item.tag}</span></div><h3>{item.title}</h3><p>{item.source} · {item.time}</p></div><div className="confidence"><small>신뢰도</small><strong>{item.confidence}%</strong><div><i style={{ width: `${item.confidence}%` }} /></div></div><button className="more">•••</button></article>)}</div></div>; }

function Questions({ notify }: { notify: (s: string) => void }) { const [done, setDone] = useState<number[]>([]); return <div className="page-content"><div className="page-intro"><div><span className="eyebrow">NEXT BEST QUESTION</span><h2>질문 플래너</h2><p>불확실성을 가장 크게 줄이는 질문부터 현장 인터뷰를 설계합니다.</p></div><button className="primary" onClick={() => notify("현재 온톨로지를 바탕으로 질문을 다시 계산했습니다.")}>✦ 질문 재생성</button></div><div className="question-layout"><section className="panel question-list"><div className="panel-title"><div><h3>추천 질문</h3><small>정보가치 · 목표영향 · 답변가능성 순</small></div><span className="model-pill">4개 후보</span></div>{questionSeed.map((q, i) => <article className={done.includes(i) ? "completed" : ""} key={q.title}><div className="rank">{String(i + 1).padStart(2, "0")}</div><div><div className="question-meta"><span>{q.target}</span><em>정보가치 {q.value}</em></div><h4>{q.title}</h4><p>목적 · {q.purpose} · 민감도 {q.sensitivity}</p></div><button onClick={() => { setDone([...done, i]); notify("질문을 인터뷰 계획에 추가했습니다."); }}>{done.includes(i) ? "추가됨 ✓" : "계획에 추가"}</button></article>)}</section><aside className="panel interview-plan"><span className="eyebrow">TODAY</span><h3>인터뷰 런시트</h3><div className="run-time"><strong>42</strong><span>분 예상<br /><small>질문 7개</small></span></div><div className="run-bar"><i style={{ width: "62%" }} /></div><ul><li><span>10:00</span>현장 작업자 · A구역</li><li><span>13:30</span>안전관리자 · 상황실</li><li><span>16:00</span>IT 관리자 · 원격</li></ul><button>런시트 시작 →</button></aside></div></div>; }

function Ontology({ selected, selectedNode, setSelectedNode }: { selected: typeof ontologyNodes[number]; selectedNode: string; setSelectedNode: (s: string) => void }) { return <div className="ontology-page"><div className="page-intro compact"><div><span className="eyebrow">ONTOLOGY 7</span><h2>온톨로지 스튜디오</h2></div><div className="studio-tools"><button>−</button><button>100%</button><button>＋</button><button className="primary">＋ 요소 추가</button></div></div><div className="studio"><div className="graph-canvas"><div className="graph-grid" /><div className="graph-legend"><span><i className="object" />객체</span><span><i className="state" />상태</span><span><i className="event" />이벤트</span><span><i className="rule" />규칙</span><span><i className="action" />행동</span></div><div className="edge e1" /><div className="edge e2" /><div className="edge e3" /><div className="edge e4" /><div className="edge e5" />{ontologyNodes.map((node) => <button key={node.id} onClick={() => setSelectedNode(node.id)} className={`graph-node ${node.type} ${selectedNode === node.id ? "selected" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%` }}><small>{node.type}</small><strong>{node.label}</strong></button>)}</div><aside className="inspector"><div className="inspector-head"><div><small>{selected.type.toUpperCase()}</small><h3>{selected.label}</h3></div><button>×</button></div><div className="inspector-field">상태<span className="status-live">● 활성</span></div><div className="inspector-field">신뢰도<strong>88%</strong><div className="mini-bar"><i style={{ width: "88%" }} /></div></div><div className="inspector-field">연결된 증거<strong>7건</strong></div><div className="inspector-field">최근 변경<small>오늘 09:42 · 김FDE</small></div><div className="inspector-section"><span>관계</span><p><b>발생 위치</b> 현장 A구역</p><p><b>트리거</b> 위험 알림</p><p><b>수행 주체</b> 현장 FDE</p></div><div className="conflict-box"><span>!</span><div><strong>규칙 충돌 감지</strong><p>등급 판정 조건 2건을 검토하세요.</p></div></div><button className="wide-button">세부정보 열기 →</button></aside></div></div>; }

function Approvals({ suggestions, decide }: { suggestions: Suggestion[]; decide: (id: number, status: "accepted" | "rejected") => void }) { return <div className="page-content"><div className="page-intro"><div><span className="eyebrow">HUMAN IN THE LOOP</span><h2>승인 센터</h2><p>AI 제안과 고위험 행동을 근거·규칙·영향과 함께 검토합니다.</p></div><div className="approval-summary"><strong>{suggestions.filter(s => s.status === "pending").length}</strong><span>승인 대기</span></div></div><div className="approval-list">{suggestions.map((s) => <article key={s.id} className={s.status !== "pending" ? "resolved" : ""}><div className="approval-type"><span>✦</span><small>{s.kind}</small></div><div className="approval-main"><div><h3>{s.title}</h3><span className={`approval-status ${s.status}`}>{s.status === "pending" ? "검토 필요" : s.status === "accepted" ? "승인됨" : "거절됨"}</span></div><p>{s.reason}</p><div className="evidence-line"><span>신뢰도 {s.confidence}%</span><span>리스크 {s.risk}</span><span>근거 4건</span><span>적용 규칙 2개</span></div></div>{s.status === "pending" && <div className="approval-actions"><button onClick={() => decide(s.id, "rejected")}>거절</button><button onClick={() => decide(s.id, "accepted")}>승인</button></div>}</article>)}</div></div>; }

function Kpi() { const metrics = [{ n: "초동 보고시간", now: "11.1분", target: "≤ 12분", pct: 88, good: true }, { n: "질문 생성 정확도", now: "84%", target: "≥ 85%", pct: 84, good: false }, { n: "실행 성공률", now: "91%", target: "≥ 90%", pct: 91, good: true }, { n: "인간 수정률", now: "18%", target: "≤ 20%", pct: 82, good: true }]; return <div className="page-content"><div className="page-intro"><div><span className="eyebrow">OUTCOME SYSTEM</span><h2>성과 · KPI</h2><p>고객 결과, 과정, 선행 지표를 실행 기록과 연결해 추적합니다.</p></div><button className="primary">성과 보고서 생성</button></div><section className="kpi-hero"><div><small>MISSION OUTCOME</small><strong>1.8×</strong><p>기준 대비 고객 성과</p></div><div className="kpi-chart"><div className="chart-line"><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-labels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>NOW</span></div></div><div className="outcome-note"><span>↗</span><div><strong>22% 단축</strong><p>초동 대응 리드타임</p></div></div></section><div className="kpi-grid">{metrics.map(m => <article key={m.n}><div><span>{m.n}</span><em className={m.good ? "good" : "warn"}>{m.good ? "목표 범위" : "점검 필요"}</em></div><strong>{m.now}</strong><small>목표 {m.target}</small><div><i style={{ width: `${m.pct}%` }} /></div></article>)}</div></div>; }

function Assets({ notify }: { notify: (s: string) => void }) { const assets = [{ type: "워크플로", name: "현장 위험 초동대응", score: 94, uses: 8 }, { type: "온톨로지", name: "안전사고 7요소 모델", score: 91, uses: 12 }, { type: "질문세트", name: "교대 인수인계 진단", score: 87, uses: 5 }, { type: "KPI 모델", name: "대응시간·완결률 패키지", score: 84, uses: 7 }, { type: "액션템플릿", name: "고위험 알림 승인 플로우", score: 82, uses: 4 }, { type: "확장템플릿", name: "FireNavi 산업 확장", score: 79, uses: 3 }]; return <div className="page-content"><div className="page-intro"><div><span className="eyebrow">REUSABLE PRIMITIVES</span><h2>원시요소 라이브러리</h2><p>검증된 온톨로지, 질문, 행동, KPI를 다음 프로젝트의 출발점으로 재사용합니다.</p></div><button className="primary" onClick={() => notify("현재 프로젝트에서 원시요소 후보 3건을 추출했습니다.")}>✦ 후보 추출</button></div><div className="asset-grid">{assets.map((a, i) => <article key={a.name}><div className={`asset-symbol a${i}`}>{["⇄", "◇", "?", "↗", "✓", "＋"][i]}</div><span>{a.type}</span><h3>{a.name}</h3><p>적용조건과 실패사례가 검증된 K-FDE 표준 자산입니다.</p><div><span>품질점수 <b>{a.score}</b></span><span>재사용 {a.uses}회</span></div><button onClick={() => notify(`${a.name}을 현재 프로젝트에 적용했습니다.`)}>프로젝트에 적용 →</button></article>)}</div></div>; }

function EvidenceModal({ onClose, onSave }: { onClose: () => void; onSave: (title: string, type: string) => void }) { const [title, setTitle] = useState(""); const [type, setType] = useState("관찰"); return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="evidence-modal-title"><div className="modal-head"><div><span className="eyebrow">NEW FIELD SIGNAL</span><h2 id="evidence-modal-title">현장 기록 추가</h2></div><button aria-label="닫기" onClick={onClose}>×</button></div><label>기록 유형<select value={type} onChange={(e) => setType(e.target.value)}><option>관찰</option><option>인터뷰</option><option>로그</option><option>요청</option></select></label><label>핵심 내용<textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="무엇을 관찰했고, 왜 중요한가요?" /></label><div className="dropzone"><span>＋</span><div><strong>사진 · 음성 · 문서 연결</strong><small>민감정보는 저장 전에 자동 분류됩니다.</small></div></div><div className="modal-actions"><button onClick={onClose}>취소</button><button disabled={!title.trim()} onClick={() => onSave(title, type)}>증거로 저장</button></div></section></div>; }
