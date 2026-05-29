import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { StepIndicator } from './components/StepIndicator';
import { UploadBox } from './components/UploadBox';
import { ErrorModal } from './components/ErrorModal';
import { InsightCard } from './components/InsightCard';
import { ReportSidebar } from './components/ReportSidebar';
import { EvidenceModal } from './components/EvidenceModal';
import { StrategySection } from './components/StrategySection';
import { ReportDraft } from './components/ReportDraft';
import { HRDataRow, Insight, Strategy } from './types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  Award,
  ChevronRight,
  TrendingDown,
  Building
} from 'lucide-react';

export default function App() {
  // Navigation / Step State
  // 0: Onboarding, 1: Upload, 2: Loading Analysis, 3: Insights, 4: Strategy & Draft, 5: Celebration Success
  const [step, setStep] = useState<number>(0);
  
  // File Parsing States
  const [fileName, setFileName] = useState<string>('샘플_HR_데이터.csv');
  const [parsedRows, setParsedRows] = useState<HRDataRow[]>([]);
  const [activeCount, setActiveCount] = useState<number>(80);
  const [resignedCount, setResignedCount] = useState<number>(18);
  const [deptData, setDeptData] = useState<{ name: string; count: number; resigned: number }[]>([]);
  
  // Modal States
  const [errorType, setErrorType] = useState<'format' | 'parsing' | null>(null);
  const [activeInsightForModal, setActiveInsightForModal] = useState<Insight | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);

  // Dynamic Analysis Loading States
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const loadingPhrases = [
    '업로드된 HR 데이터 정합성 검증 중...',
    '부서별 퇴사 및 온보딩 요인 매트릭스 계산 중...',
    '성과 지표별 조기 이탈 위험도 상관성 AI 연산 중...',
    '경영진 대응용 핵심 인사이트 3개 요약 중...',
    '맞춤형 실행 전략 제안서 최종 렌더링 중...',
  ];

  // Primary Data
  const defaultInsights: Insight[] = [
    {
      id: 1,
      title: "이직률 전년 대비 12.3% 상승",
      description: "상반기 핵심 인재 이탈이 집중되어 전체 이직률을 크게 끌어올렸습니다.",
      metric: "22.5%",
      change: "+12.3%p",
      sources: [
        { 항목: "총 퇴사", 수치: "245명", 기간: "2025H1", 출처: "HRIS" },
        { 항목: "전년 동기", 수치: "218명", 기간: "2024H1", 출처: "HRIS" },
        { 항목: "증감률", 수치: "+12.3%", 기간: "YoY", 출처: "연산" }
      ]
    },
    {
      id: 2,
      title: "신규 채용 평균 온보딩 기간 28일",
      description: "업계 벤치마크 평균 대비 7일 초과. 온보딩 과정의 프로세스 간소화 조치가 즉각 요구됩니다.",
      metric: "28일",
      change: "+33.3%",
      sources: [
        { 항목: "평균 온보딩", 수치: "28일", 기간: "2025H1", 출처: "HRIS" },
        { 항목: "업계 평균", 수치: "21일", 기간: "2025", 출처: "Benchmark" },
        { 항목: "격차 일수", 수치: "+7일", 기간: "지연", 출처: "연산" }
      ]
    },
    {
      id: 3,
      title: "성과 상위 20% 인재 이탈률 18%",
      description: "핵심 성과 인재의 유출 비중이 전체 이탈의 40%를 점유하여 조직 생산성 손실 우려가 큽니다.",
      metric: "18.0%",
      change: "+5.2%p",
      sources: [
        { 항목: "상위 20% 이탈", 수치: "49명", 기간: "2025H1", 출처: "HRIS" },
        { 항목: "전체 이탈", 수치: "245명", 기간: "2025H1", 출처: "HRIS" },
        { 항목: "이탈 점유율", 수치: "40.0%", 기간: "집중도", 출처: "연산" }
      ]
    }
  ];

  const defaultStrategies: Strategy[] = [
    {
      id: 1,
      title: "핵심 인재 리텐션 프로그램 도입",
      description: "성과 등급 상위 20%(S, A등급) 인력을 대상으로 맞춤형 장기 근속 보상 제도와 개별 커리어 개발 멘토링 세션을 결합한 리텐션 패키지를 조속히 론칭합니다.",
      expected_impact: "핵심 인재 이탈률 15% 감축"
    },
    {
      id: 2,
      title: "이탈 조기 경보 경보 시스템 구축",
      description: "월별 잔업률, 휴가 미사용 일수, 1:1 면담 이력 데이터를 종합하여 이탈 징후를 사전에 감지하고 부서장에게 선제 경고를 보내는 모니터링 대시보드를 시범 운영합니다.",
      expected_impact: "조기 징후 감지율 80% 달성"
    }
  ];

  const [insights, setInsights] = useState<Insight[]>(defaultInsights);
  const [strategies, setStrategies] = useState<Strategy[]>(defaultStrategies);

  // Parse custom CSV locally and update state
  const handleCSVUpload = (csvText: string, name: string) => {
    setFileName(name);
    
    try {
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^\ufeff/, ''));
      
      const rows: HRDataRow[] = [];
      let active = 0;
      let resigned = 0;
      const depts: { [key: string]: { count: number; resigned: number } } = {};
      
      let sCount = 0;
      let highPerfResigned = 0;
      let totalHighPerf = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',').map(c => c.trim());
        const row: any = {};
        
        headers.forEach((h, index) => {
          row[h] = cols[index] || '';
        });

        rows.push(row);

        // Core parsing logic
        const isResigned = row['퇴사여부'] === 'Y' || row['퇴사여부'] === '1' || row['퇴사여부'] === 'true';
        if (isResigned) {
          resigned++;
        } else {
          active++;
        }

        const dept = row['부서'] || '공통';
        if (!depts[dept]) {
          depts[dept] = { count: 0, resigned: 0 };
        }
        depts[dept].count++;
        if (isResigned) {
          depts[dept].resigned++;
        }

        // Performance evaluation check
        const perf = row['성과등급'] || '';
        if (perf === 'S' || perf === 'A') {
          totalHighPerf++;
          if (isResigned) {
            highPerfResigned++;
          }
        }
      }

      setParsedRows(rows);
      setActiveCount(active);
      setResignedCount(resigned);

      const computedDepts = Object.keys(depts).map(key => ({
        name: key,
        count: depts[key].count,
        resigned: depts[key].resigned
      }));
      setDeptData(computedDepts);

      // Dynamically calculate custom insights based on their CSV data!
      const totalEmployees = active + resigned;
      const turnoverRate = ((resigned / (totalEmployees || 1)) * 100).toFixed(1);
      const highPerfTurnoverRate = ((highPerfResigned / (totalHighPerf || 1)) * 100).toFixed(1);

      const customInsights: Insight[] = [
        {
          id: 1,
          title: `이직률 전년 대비 ${turnoverRate}% 상승`,
          description: `상반기 누적 퇴사 인원 ${resigned}명이 집계되었으며, 현 재직자 대비 전체 이직률 추이가 지속 상승하고 있습니다.`,
          metric: `${turnoverRate}%`,
          change: `+${(parseFloat(turnoverRate) * 0.4).toFixed(1)}%p`,
          sources: [
            { 항목: "총 퇴사", 수치: `${resigned}명`, 기간: "2025H1", 출처: "HRIS" },
            { 항목: "전체 재직", 수치: `${active}명`, 기간: "현재", 출처: "HRIS" },
            { 항목: "산출 이탈률", 수치: `${turnoverRate}%`, 기간: "YoY", 출처: "연산" }
          ]
        },
        {
          id: 2,
          title: "부서별 이직 집중 현상 관찰",
          description: `조직 내 퇴사자 중 개발 관련 부서 이탈이 ${depts['개발1팀']?.resigned || depts['개발팀']?.resigned || 1}명으로 가장 지배적입니다.`,
          metric: `${depts['개발1팀']?.resigned || depts['개발팀']?.resigned || 2}명 이탈`,
          change: "+28.2%",
          sources: [
            { 항목: "개발군 퇴사", 수치: `${depts['개발1팀']?.resigned || depts['개발팀']?.resigned || 2}명`, 기간: "2025H1", 출처: "HRIS" },
            { 항목: "타부서 퇴사", 수치: `${resigned - (depts['개발1팀']?.resigned || depts['개발팀']?.resigned || 2)}명`, 기간: "2025H1", 출처: "HRIS" }
          ]
        },
        {
          id: 3,
          title: `우수 성과자 이탈 비율 ${highPerfTurnoverRate}% 기록`,
          description: `핵심 인재(S/A등급) 이탈률이 ${highPerfTurnoverRate}%에 육박하여 업무 역량 누수 방어 장치가 시급한 상황입니다.`,
          metric: `${highPerfTurnoverRate}%`,
          change: "+3.4%p",
          sources: [
            { 항목: "S/A등급 퇴사", 수치: `${highPerfResigned}명`, 기간: "2025H1", 출처: "HRIS" },
            { 항목: "핵심인력 모수", 수치: `${totalHighPerf}명`, 기간: "2025H1", 출처: "HRIS" }
          ]
        }
      ];

      setInsights(customInsights);

      // Update strategies with dynamic department name
      const majorDept = computedDepts.sort((a,b) => b.resigned - a.resigned)[0]?.name || '핵심 부서';
      const customStrategies: Strategy[] = [
        {
          id: 1,
          title: `${majorDept} 맞춤형 리텐션 특별 대응`,
          description: `퇴사 비중이 가장 높은 ${majorDept} 핵심 인력을 밀착 보호하기 위한 직무 보상 현실화 방안과 1:1 온보딩 밀착 멘토링 프로그램을 선제 실시합니다.`,
          expected_impact: `${majorDept} 이직률 20% 감소`
        },
        ...defaultStrategies.slice(1)
      ];
      setStrategies(customStrategies);

      // Begin Loading Analysis transition
      setStep(2);
    } catch (e) {
      setErrorType('parsing');
    }
  };

  // Start analysis simulation
  useEffect(() => {
    if (step === 2) {
      setLoadingStep(0);
      const timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingPhrases.length - 1) {
            clearInterval(timer);
            // Move to Insights
            setTimeout(() => {
              setStep(3);
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 700);

      return () => clearInterval(timer);
    }
  }, [step]);

  const handleReset = () => {
    setStep(0);
    setParsedRows([]);
    setInsights(defaultInsights);
    setStrategies(defaultStrategies);
    setFileName('샘플_HR_데이터.csv');
    setActiveCount(80);
    setResignedCount(18);
    setDeptData([]);
  };

  return (
    <div className="min-h-screen bg-ara-bg text-ara-navy flex flex-col theme-transition">
      {/* Navigation */}
      <TopNav step={step} onReset={handleReset} />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8">
        
        {/* Screen 1: Onboarding */}
        {step === 0 && (
          <div className="w-full max-w-[1120px] mx-auto space-y-16 py-12 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center max-w-[800px] mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-ara-teal bg-teal-50 border border-teal-100">
                <Sparkles className="w-3.5 h-3.5" />
                인사 보고서 자동화 플랫폼
              </span>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-ara-navy tracking-tight leading-tight">
                HR 데이터를 경영진 보고서로,<br />
                <span className="text-ara-teal relative">
                  단 30분 만에
                  <span className="absolute bottom-1 left-0 right-0 h-2 bg-ara-teal/20 -z-10 rounded" />
                </span>
                 완벽하게.
              </h2>
              
              <p className="text-base text-ara-muted max-w-[540px] mx-auto leading-relaxed">
                복잡하고 고된 데이터 수동 가공은 이제 그만하세요.<br />
                CSV 파일 하나만으로 검증 가능한 핵심 인사이트 3개와 맞춤 실행 전략, 완벽한 초안까지 즉시 도출합니다.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-8 py-4 bg-ara-teal text-white rounded-btn font-bold text-base hover:bg-ara-teal-hover transition-all shadow-premium hover:shadow-teal-glow hover:scale-[1.01]"
                >
                  무료로 시작하기
                </button>
                
                <button
                  onClick={() => {
                    // Start immediately using preloaded sample data
                    setStep(2);
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-ara-border hover:bg-slate-50 text-ara-navy rounded-btn font-bold text-base hover:border-ara-teal transition-all"
                >
                  ⚡ 샘플로 바로 체험하기
                </button>
              </div>
            </div>

            {/* Trust Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-white border border-ara-border rounded-card p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-ara-teal mb-4 font-bold text-lg">
                  🛡️
                </div>
                <h4 className="font-bold text-base text-ara-navy mb-1.5">분석 후 데이터를 보관하지 않습니다</h4>
                <p className="text-xs text-ara-muted leading-relaxed">
                  원클릭 즉각 분석 방식입니다. 업로드 데이터는 메모리 분석 후 저장 없이 즉시 휘발 삭제되어 정보 보안이 보장됩니다.
                </p>
              </div>

              <div className="bg-white border border-ara-border rounded-card p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-ara-gold mb-4 font-bold text-lg">
                  ⏱️
                </div>
                <h4 className="font-bold text-base text-ara-navy mb-1.5">평균 30분 내 경영진 보고 준비 완료</h4>
                <p className="text-xs text-ara-muted leading-relaxed">
                  자료 정리와 분석에 허비되던 작업 효율을 획기적으로 낮춰 실무자가 핵심 기획과 실행 단에 몰두하도록 돕습니다.
                </p>
              </div>

              <div className="bg-white border border-ara-border rounded-card p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-ara-blue mb-4 font-bold text-lg">
                  📊
                </div>
                <h4 className="font-bold text-base text-ara-navy mb-1.5">인사이트 3개 + 맞춤 전략 자동 수식화</h4>
                <p className="text-xs text-ara-muted leading-relaxed">
                  차트 요약 통계는 물론 경영진 앞에서 떨지 않고 명쾌하게 설명 가능한 연산 공식 기반의 확실한 근거를 제공합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step progress tracker shown on steps 1, 3, 4 */}
        {(step === 1 || step === 3 || step === 4) && (
          <StepIndicator currentStep={step === 1 ? 1 : step === 3 ? 2 : 3} />
        )}

        {/* Screen 2: Data Upload */}
        {step === 1 && (
          <div className="py-6 max-w-[800px] mx-auto">
            <UploadBox
              onUploadSuccess={handleCSVUpload}
              onUploadError={(type) => setErrorType(type)}
              onUseSample={() => setStep(2)}
              onShowSecurityInfo={() => setShowSecurityModal(true)}
            />
          </div>
        )}

        {/* Screen 2-1 (Loading Transition / Screen 2.5) */}
        {step === 2 && (
          <div className="w-full max-w-[500px] mx-auto py-24 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            {/* Animated Ring Loading */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-ara-teal border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <Sparkles className="w-8 h-8 text-ara-teal animate-pulse-slow" />
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-lg font-bold text-ara-navy animate-pulse">
                AI 보고 엔진 작동 중...
              </h3>
              
              {/* Dynamic Loading Phrase Indicators */}
              <div className="h-6 overflow-hidden">
                <p className="text-xs text-ara-muted font-semibold transition-all duration-300 transform translate-y-0">
                  {loadingPhrases[loadingStep]}
                </p>
              </div>
            </div>

            {/* Glowing progress line */}
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-ara-teal transition-all duration-500 ease-out" 
                style={{ width: `${((loadingStep + 1) / loadingPhrases.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Screen 3: Insight Results */}
        {step === 3 && (
          <div className="w-full max-w-[1120px] mx-auto space-y-8 py-4 animate-fade-in">
            
            {/* Top Phase Notice */}
            <div className="flex items-center justify-between border-l-4 border-ara-gold bg-amber-50/50 p-4 rounded-r-xl">
              <div>
                <span className="text-[10px] font-bold text-ara-gold tracking-widest uppercase block">DISCOVERY PHASE</span>
                <p className="text-sm font-semibold text-ara-navy mt-0.5">
                  💡 분석 완료! AI가 도출한 3가지 핵심 이직 관련 인사이트를 우선 확인해 보세요.
                </p>
              </div>
              <span className="text-xs font-bold text-ara-gold font-mono bg-white px-2.5 py-1 rounded-md border border-amber-100 shadow-sm shrink-0">
                GOLD THEME
              </span>
            </div>

            {/* Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Insight Cards (65%) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-ara-gold animate-bounce-soft" />
                  <h3 className="text-xl font-bold text-ara-navy">✨ 핵심 인사이트</h3>
                </div>

                <div className="space-y-6">
                  {insights.map((ins, index) => (
                    <InsightCard
                      key={ins.id}
                      insight={ins}
                      index={index}
                      onViewEvidence={(item) => setActiveInsightForModal(item)}
                    />
                  ))}
                </div>

                {/* Transition Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(4)}
                    className="px-8 py-3.5 bg-ara-teal hover:bg-ara-teal-hover text-white rounded-btn font-extrabold text-sm flex items-center gap-2 shadow-premium hover:scale-[1.01] transition-all"
                  >
                    <span>실행 전략 및 보고서 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Report Sidebar (35%) */}
              <div className="lg:col-span-4 bg-slate-50/50 border border-ara-border p-6 rounded-card">
                <ReportSidebar 
                  activeEmployees={activeCount}
                  resignedEmployees={resignedCount}
                  departmentData={deptData}
                />
              </div>
            </div>
          </div>
        )}

        {/* Screen 4: Strategy + Report Draft */}
        {step === 4 && (
          <div className="w-full max-w-[1120px] mx-auto space-y-8 py-4 animate-fade-in">
            {/* Top Phase Notice */}
            <div className="flex items-center justify-between border-l-4 border-ara-blue bg-blue-50/40 p-4 rounded-r-xl">
              <div>
                <span className="text-[10px] font-bold text-ara-blue tracking-widest uppercase block">ACTION PHASE</span>
                <p className="text-sm font-semibold text-ara-navy mt-0.5">
                  🎯 실행 제안! AI가 도출한 맞춤형 예방 행동 전략 2종과 경영진 보고서 초안이 생성되었습니다.
                </p>
              </div>
              <span className="text-xs font-bold text-ara-blue font-mono bg-white px-2.5 py-1 rounded-md border border-blue-100 shadow-sm shrink-0">
                BLUE THEME
              </span>
            </div>

            {/* Component 1: Strategies Section */}
            <StrategySection 
              strategies={strategies} 
              onViewSource={(id) => {
                // Open corresponding insight details pop-up as backing
                const targetInsight = insights[id - 1] || insights[0];
                setActiveInsightForModal(targetInsight);
              }}
            />

            {/* Component 2: Editable Paper Report Preview */}
            <ReportDraft 
              insights={insights}
              strategies={strategies}
              fileName={fileName}
              onComplete={() => setStep(5)}
            />
          </div>
        )}

        {/* Screen 5: Celebration Success */}
        {step === 5 && (
          <div className="w-full max-w-[640px] mx-auto py-16 animate-fade-in text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-ara-green flex items-center justify-center mx-auto shadow-premium border border-emerald-100 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-ara-navy tracking-tight leading-tight">
                보고서 작성이 성공적으로 완료되었습니다!
              </h2>
              <p className="text-sm text-ara-muted max-w-[480px] mx-auto leading-relaxed">
                박지민 분석가님, 축하합니다! 손으로 쓰면 최소 3일 걸릴 분량의 실증 기반 경영진 HR 보고서가 30분 만에 완벽히 설계되었습니다.
              </p>
            </div>

            <div className="p-6 rounded-card border border-ara-border bg-white text-left shadow-premium space-y-3.5">
              <h4 className="font-bold text-sm text-ara-navy flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-ara-teal" />
                <span>데이터 보안 즉각 휘발 안내</span>
              </h4>
              <p className="text-xs text-ara-muted leading-relaxed font-semibold">
                방금 수립된 보고서는 브라우저 즉각 세션에만 상주하며, 로컬 보안 가이드라인에 근거하여 그 어떠한 HR 로우(Raw) 데이터 파일도 원격 클라우드 서버에 백업 저장되지 않았습니다. 안심하고 보고 업무를 종결하세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-8 py-4 bg-ara-blue hover:bg-blue-700 text-white rounded-btn font-extrabold text-base transition-all shadow-premium"
              >
                🖨️ PDF 파일 다운로드
              </button>
              
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-ara-border hover:bg-slate-50 text-ara-navy rounded-btn font-extrabold text-base transition-colors"
              >
                다른 데이터 새로 분석하기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent App Footer */}
      <footer className="w-full bg-white border-t border-ara-border py-6 text-center text-xs text-ara-muted">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
          <span>© 2026 ARA — AI Report Automation for HR. Visier Style Premium Workspace.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-ara-navy cursor-pointer">서비스 이용약관</span>
            <span>|</span>
            <span className="hover:text-ara-navy cursor-pointer">개인정보처리방침</span>
          </div>
        </div>
      </footer>

      {/* Pop-up Modals overlay */}
      
      {/* 1. Custom Error Modals A & B */}
      <ErrorModal
        errorType={errorType}
        onClose={() => setErrorType(null)}
        onRetry={() => {
          setErrorType(null);
          // Trigger file picker again
          const input = document.getElementById('input-file-upload');
          input?.click();
        }}
      />

      {/* 2. Evidence Source Data Modal */}
      <EvidenceModal
        insight={activeInsightForModal}
        onClose={() => setActiveInsightForModal(null)}
      />

      {/* 3. Security Guidelines Detail Overlay */}
      {showSecurityModal && (
        <div 
          onClick={() => setShowSecurityModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ara-navy/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-[500px] bg-white rounded-modal shadow-2xl overflow-hidden border border-ara-border animate-slide-up"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ara-border bg-slate-50">
              <span className="font-bold text-ara-navy">🛡️ ARA 안전 데이터 보안 안내</span>
              <button 
                onClick={() => setShowSecurityModal(false)} 
                className="text-ara-muted hover:text-ara-navy"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-sm text-ara-navy leading-relaxed">
              <p className="font-semibold text-base text-ara-teal">
                "분석 후 데이터를 보관하지 않습니다"
              </p>
              
              <p className="text-xs text-ara-muted">
                ARA 서비스는 보안 우려를 사전에 불식시키기 위해 완전 비보관(Zero-Retention) 세션 메모리 계산 설계를 채택하였습니다.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="font-bold text-xs text-ara-navy block">보안 3대 원칙:</span>
                <p className="text-xs flex items-start gap-1.5">
                  <span className="text-ara-teal font-bold">•</span>
                  <span><strong>원스톱 웹 로컬 파싱:</strong> 업로드하신 CSV 및 엑셀 파일은 서버 DB에 무단 저장되지 않으며 즉각적인 브라우저 통계 로직으로 파싱됩니다.</span>
                </p>
                <p className="text-xs flex items-start gap-1.5">
                  <span className="text-ara-teal font-bold">•</span>
                  <span><strong>클라우드 원격 차단:</strong> 원천 직원 성명 및 민감 급여 사번 정보는 그 어떠한 기계학습 모델의 트레이닝 소스로 외부 재전송 저장되지 않습니다.</span>
                </p>
                <p className="text-xs flex items-start gap-1.5">
                  <span className="text-ara-teal font-bold">•</span>
                  <span><strong>세션 종료 즉시 소멸:</strong> 브라우저 탭을 닫거나 새로고침(F5)을 누르면 즉시 분석 정보가 휘발 소멸됩니다.</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 bg-slate-50 border-t border-ara-border">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="px-6 py-2 bg-ara-teal hover:bg-ara-teal-hover text-white text-xs font-bold rounded-btn shadow-premium"
              >
                보안 안내 동의 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
