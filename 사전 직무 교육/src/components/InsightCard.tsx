import React from 'react';
import { Insight } from '../types';
import { ArrowUpRight, TrendingUp, TrendingDown, HelpCircle, TableProperties } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  index: number;
  onViewEvidence: (insight: Insight) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, index, onViewEvidence }) => {
  const isPositiveMetric = insight.change.startsWith('+');
  const isPercentageChange = insight.change.includes('%');
  
  // Custom badges/styles based on index for variety
  const getPhaseStyles = (idx: number) => {
    switch (idx) {
      case 0:
        return {
          badgeBg: 'bg-amber-100 text-ara-gold',
          bubbleBg: 'bg-amber-50/60 border border-amber-100/50',
          bubbleArrow: 'before:border-b-amber-50/60',
        };
      case 1:
        return {
          badgeBg: 'bg-teal-100 text-ara-teal',
          bubbleBg: 'bg-teal-50/40 border border-teal-100/40',
          bubbleArrow: 'before:border-b-teal-50/40',
        };
      default:
        return {
          badgeBg: 'bg-indigo-100 text-indigo-600',
          bubbleBg: 'bg-indigo-50/30 border border-indigo-100/30',
          bubbleArrow: 'before:border-b-indigo-50/30',
        };
    }
  };

  const themeStyle = getPhaseStyles(index);

  return (
    <div className="w-full bg-white border border-ara-border rounded-card p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 relative group">
      {/* Decorative Gold top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-card bg-ara-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Upper row: Sequence Badge & Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-8 h-8 rounded-full ${themeStyle.badgeBg} flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
          {index + 1}
        </div>
        
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-ara-navy tracking-tight leading-snug group-hover:text-ara-gold transition-colors duration-200">
            {insight.title}
          </h4>
          <span className="text-[10px] text-ara-muted bg-slate-100 px-2 py-0.5 rounded-md font-mono">
            AI INSIGHT #{1034 + index}
          </span>
        </div>
      </div>

      {/* Speech bubble conversational description */}
      <div className={`relative p-4 rounded-xl mb-5 text-sm text-ara-navy leading-relaxed font-medium ${themeStyle.bubbleBg}`}>
        {/* Decorative Quote mark */}
        <span className="text-lg font-serif text-ara-gold mr-1">“</span>
        {insight.description}
        <span className="text-lg font-serif text-ara-gold ml-1">”</span>
      </div>

      {/* Lower row: Huge highlighted metrics */}
      <div className="flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="text-xs text-ara-muted block mb-1">핵심 지표</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-ara-navy tracking-tight">
              {insight.metric}
            </span>
            <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
              isPositiveMetric 
                ? 'bg-rose-50 text-rose-600' 
                : 'bg-emerald-50 text-emerald-600'
            }`}>
              {isPositiveMetric ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {insight.change}
            </span>
          </div>
        </div>

        {/* View source triggers */}
        <button
          onClick={() => onViewEvidence(insight)}
          className="text-xs font-bold text-ara-teal hover:text-ara-teal-hover flex items-center gap-1.5 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-teal-50/50"
        >
          <TableProperties className="w-4 h-4" />
          <span>근거 보기</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
