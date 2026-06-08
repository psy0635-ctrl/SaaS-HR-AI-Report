import React, { useState } from 'react';
import { Insight, Strategy } from '../types';
import { Edit3, Check, Printer, FileDown, Copy, CheckSquare, Sparkles } from 'lucide-react';

interface ReportDraftProps {
  insights: Insight[];
  strategies: Strategy[];
  fileName?: string;
  onComplete: () => void;
}

export const ReportDraft: React.FC<ReportDraftProps> = ({
  insights,
  strategies,
  fileName = '샘플_HR_데이터.csv',
  onComplete,
}) => {
  // Inline edit state for report elements
  const [reportTitle, setReportTitle] = useState('2025 상반기 핵심 인재 이탈 분석 및 대응 전략 보고서');
  const [reportDate, setReportDate] = useState('2026.05.29');
  const [analystName, setAnalystName] = useState('박지민 (인사분석담당)');
  const [introduction, setIntroduction] = useState(
    '본 보고서는 최근 1년간 발생한 부서별 퇴사 및 온보딩 데이터를 심층 분석하여 핵심 조직 이탈 원인을 도출하고, 경영진의 신속한 의사결정을 돕기 위해 마련된 특별 진단서입니다. 데이터 분석 결과 상반기 핵심 인력 유출 추이가 과거 동기 대비 크게 가속화되고 있음이 발견되어 맞춤형 조기 방어 전략 도입이 매우 시급한 상황입니다.'
  );

  const [insightEdits, setInsightEdits] = useState(
    insights.map((ins) => ({
      id: ins.id,
      title: ins.title,
      desc: ins.description,
    }))
  );

  const [strategyEdits, setStrategyEdits] = useState(
    strategies.map((str) => ({
      id: str.id,
      title: str.title,
      desc: str.description,
    }))
  );

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleInsightTitleChange = (id: number, val: string) => {
    setInsightEdits(prev => prev.map(item => item.id === id ? { ...item, title: val } : item));
  };

  const handleInsightDescChange = (id: number, val: string) => {
    setInsightEdits(prev => prev.map(item => item.id === id ? { ...item, desc: val } : item));
  };

  const handleStrategyTitleChange = (id: number, val: string) => {
    setStrategyEdits(prev => prev.map(item => item.id === id ? { ...item, title: val } : item));
  };

  const handleStrategyDescChange = (id: number, val: string) => {
    setStrategyEdits(prev => prev.map(item => item.id === id ? { ...item, desc: val } : item));
  };

  const handleCopyToClipboard = () => {
    const textToCopy = `
[HR AI 분석 보고서]
보고서명: ${reportTitle}
작성일자: ${reportDate}
작성자: ${analystName}

1. 보고 개요
${introduction}

2. 핵심 AI 인사이트
${insightEdits.map((ins, i) => `${i + 1}. ${ins.title}\n- 내용: ${ins.desc}`).join('\n\n')}

3. 맞춤 실행 전략 제안
${strategyEdits.map((str, i) => `${i + 1}. ${str.title}\n- 세부 내용: ${str.desc}`).join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Action Toolbars */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-ara-border p-4 rounded-card shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ara-blue animate-pulse-slow" />
          <span className="font-bold text-ara-navy text-sm">📋 경영진 보고용 초안 완성</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isEditing 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/50'
                : 'bg-slate-50 text-ara-navy border-ara-border hover:bg-slate-100/50'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>편집 완료</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>텍스트 편집하기</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="px-3 py-1.5 bg-slate-50 border border-ara-border hover:bg-slate-100/50 text-ara-navy rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? '복사 완료!' : '텍스트 복사'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-50 border border-ara-border hover:bg-slate-100/50 text-ara-navy rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄 및 PDF 저장</span>
          </button>
        </div>
      </div>

      {/* Premium Paper Document Preview */}
      <div 
        id="printable-report" 
        className="w-full bg-white border border-slate-200 rounded-card p-10 md:p-12 shadow-2xl relative min-h-[840px] text-ara-navy border-t-[8px] border-t-ara-blue theme-transition select-text print:border-0 print:shadow-none print:p-0"
      >
        {/* Subtle background watermark */}
        <div className="absolute top-12 right-12 text-[10px] font-mono tracking-widest text-slate-200 uppercase font-bold select-none border border-slate-100 px-2 py-1 pointer-events-none print:hidden">
          ARA SECURE HR DRAFT
        </div>

        {/* Title Header */}
        <div className="border-b-2 border-ara-navy/10 pb-6 mb-8 text-center sm:text-left">
          {isEditing ? (
            <input 
              type="text" 
              value={reportTitle} 
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full text-2xl md:text-3xl font-extrabold text-ara-navy border-b border-ara-blue/40 pb-1 focus:outline-none focus:border-ara-blue bg-blue-50/50 px-2 rounded"
            />
          ) : (
            <h1 className="text-2xl md:text-3xl font-extrabold text-ara-navy leading-tight">
              {reportTitle}
            </h1>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-bold text-ara-muted">
            <div className="flex items-center gap-1.5">
              <span>작성일자:</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={reportDate} 
                  onChange={(e) => setReportDate(e.target.value)}
                  className="border-b border-ara-blue/40 focus:outline-none bg-blue-50/50 px-1 rounded font-mono"
                />
              ) : (
                <span className="font-mono text-ara-navy">{reportDate}</span>
              )}
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-1.5">
              <span>작성자:</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={analystName} 
                  onChange={(e) => setAnalystName(e.target.value)}
                  className="border-b border-ara-blue/40 focus:outline-none bg-blue-50/50 px-1 rounded"
                />
              ) : (
                <span className="text-ara-navy">{analystName}</span>
              )}
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-1.5 font-mono">
              <span>분석 소스:</span>
              <span className="text-ara-teal font-extrabold">{fileName}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Introduction */}
        <div className="space-y-4 mb-10">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-ara-blue flex items-center gap-1">
            <span>01</span>
            <span>보고 목적 및 배경</span>
          </h3>
          {isEditing ? (
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={4}
              className="w-full text-sm font-semibold leading-relaxed text-ara-navy border border-ara-blue/40 focus:outline-none focus:border-ara-blue bg-blue-50/50 p-3 rounded"
            />
          ) : (
            <p className="text-sm leading-relaxed text-slate-700 font-medium">
              {introduction}
            </p>
          )}
        </div>

        {/* Section 2: Core Insights */}
        <div className="space-y-6 mb-10">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-ara-blue flex items-center gap-1">
            <span>02</span>
            <span>데이터 추출 핵심 AI 인사이트</span>
          </h3>

          <div className="space-y-4">
            {insightEdits.map((ins, index) => (
              <div key={ins.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-ara-gold text-white flex items-center justify-center font-bold text-[10px]">
                    {index + 1}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={ins.title}
                      onChange={(e) => handleInsightTitleChange(ins.id, e.target.value)}
                      className="w-full font-bold text-ara-navy border-b border-ara-blue/30 focus:outline-none bg-blue-50/30 px-1 rounded text-sm"
                    />
                  ) : (
                    <h4 className="font-bold text-ara-navy text-sm leading-tight">
                      {ins.title}
                    </h4>
                  )}
                </div>
                
                {isEditing ? (
                  <textarea
                    value={ins.desc}
                    onChange={(e) => handleInsightDescChange(ins.id, e.target.value)}
                    rows={2}
                    className="w-full text-xs text-slate-600 border border-ara-blue/30 focus:outline-none bg-blue-50/30 p-2 rounded leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold pl-7">
                    {ins.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Execution Strategies */}
        <div className="space-y-6 mb-10">
          <h3 className="text-sm font-extrabold tracking-wider uppercase text-ara-blue flex items-center gap-1">
            <span>03</span>
            <span>비즈니스 성과 창출 방안</span>
          </h3>

          <div className="space-y-4">
            {strategyEdits.map((str, index) => (
              <div key={str.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-ara-blue text-white flex items-center justify-center font-bold text-[10px]">
                    {index + 1}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={str.title}
                      onChange={(e) => handleStrategyTitleChange(str.id, e.target.value)}
                      className="w-full font-bold text-ara-navy border-b border-ara-blue/30 focus:outline-none bg-blue-50/30 px-1 rounded text-sm"
                    />
                  ) : (
                    <h4 className="font-bold text-ara-navy text-sm leading-tight">
                      {str.title}
                    </h4>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    value={str.desc}
                    onChange={(e) => handleStrategyDescChange(str.id, e.target.value)}
                    rows={2}
                    className="w-full text-xs text-slate-600 border border-ara-blue/30 focus:outline-none bg-blue-50/30 p-2 rounded leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold pl-7">
                    {str.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Warning */}
        <div className="mt-12 p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl text-[11px] text-amber-800 leading-relaxed font-semibold text-center select-none print:hidden">
          ⚠️ 본 보고서는 분석 참고용 AI 초안 미리보기입니다. 경영진 보고 시 오탈자 여부 및 현업 데이터와의 정합성을 반드시 최종 확인 바랍니다.
        </div>
      </div>

      {/* Primary Final Action Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onComplete}
          className="px-10 py-4 bg-ara-blue hover:bg-blue-700 text-white rounded-btn font-extrabold text-lg shadow-blue-glow transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
        >
          <CheckSquare className="w-5 h-5" />
          <span>✅ 최종 보고서 완성</span>
        </button>
      </div>
    </div>
  );
};
