import React from 'react';
import { Insight } from '../types';
import { ShieldCheck, Table, X } from 'lucide-react';

interface EvidenceModalProps {
  insight: Insight | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ insight, onClose }) => {
  if (!insight) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ara-navy/60 backdrop-blur-sm animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-[580px] bg-white rounded-modal shadow-2xl overflow-hidden border border-ara-border animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ara-border bg-slate-50">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-ara-gold animate-pulse-slow" />
            <span className="font-bold text-ara-navy">📄 인사이트 근거 데이터 출처</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-ara-muted hover:text-ara-navy transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Active Insight Details */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-ara-gold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100/50">
              검증 대상 인사이트
            </span>
            <h4 className="text-lg font-bold text-ara-navy mt-2.5 leading-snug">
              {insight.title}
            </h4>
            <p className="text-sm text-ara-muted mt-1.5 leading-relaxed">
              {insight.description}
            </p>
          </div>

          {/* Source Data Table */}
          <div className="border border-ara-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-ara-navy border-b border-ara-border font-bold">
                  <th className="px-4 py-3">항목</th>
                  <th className="px-4 py-3">수치</th>
                  <th className="px-4 py-3">기간</th>
                  <th className="px-4 py-3">출처</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {insight.sources.map((src, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-ara-navy">{src.항목}</td>
                    <td className="px-4 py-3 font-mono font-bold text-ara-teal">{src.수치}</td>
                    <td className="px-4 py-3 text-ara-muted font-mono">{src.기간}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        src.출처 === '연산' 
                          ? 'bg-purple-50 text-purple-600 border border-purple-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {src.출처}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rationale Explanation */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100/50 text-xs text-ara-navy leading-relaxed font-semibold">
            💬 "이 인사이트는 HRIS 내부 데이터의 전년 동기(YoY) 및 분기별 추세 비교를 위해 규칙 기반 확정적 수식 계산을 통해 분석 검증되었습니다. 외부 AI 생성물에서 자주 나타나는 데이터 환각(Hallucination) 우려가 없는 수치 검증된 안전한 인사이트입니다."
          </div>

          {/* Trust Guarantee Alert */}
          <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-ara-border rounded-xl text-xs text-ara-muted">
            <ShieldCheck className="w-5 h-5 text-ara-teal shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-ara-navy block">보안 및 검증 책임 안내</span>
              <p className="leading-relaxed font-medium">
                본 정보는 의사결정 보조 자료이며 최종 데이터 검증 및 보고 책임은 사용자에게 있습니다. 분석 직후 입력된 원천 직무 데이터는 보관 기간 없이 완전 삭제되어 정보 유출 우려가 없습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-end px-6 py-4 bg-slate-50 border-t border-ara-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-ara-teal hover:bg-ara-teal-hover text-white text-sm font-bold rounded-btn transition-colors duration-200 shadow-premium"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
