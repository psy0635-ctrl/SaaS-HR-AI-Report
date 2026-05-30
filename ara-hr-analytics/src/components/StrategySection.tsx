import React from 'react';
import { Strategy } from '../types';
import { Award, Compass, TrendingDown, Target, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface StrategySectionProps {
  strategies: Strategy[];
  onViewSource: (strategyId: number) => void;
}

export const StrategySection: React.FC<StrategySectionProps> = ({ strategies, onViewSource }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-ara-blue animate-pulse-slow" />
        <h3 className="text-xl font-bold text-ara-navy">🎯 실행 전략 제안</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, idx) => {
          const isFirst = idx === 0;
          return (
            <div 
              key={strategy.id} 
              className="bg-white border border-ara-border rounded-card p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Blue top accent band on hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-ara-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badge Row */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-blue-50 text-ara-blue border border-blue-100">
                  전략 제안 0{idx + 1}
                </span>
                
                <div className={`w-8 h-8 rounded-full ${
                  isFirst ? 'bg-indigo-50 text-ara-blue' : 'bg-amber-50 text-ara-gold'
                } flex items-center justify-center`}>
                  {isFirst ? <Award className="w-4.5 h-4.5" /> : <Compass className="w-4.5 h-4.5" />}
                </div>
              </div>

              {/* Title */}
              <h4 className="text-lg font-bold text-ara-navy tracking-tight mb-2 group-hover:text-ara-blue transition-colors duration-200">
                {strategy.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-ara-muted mb-5 leading-relaxed">
                {strategy.description}
              </p>

              {/* Bottom Metrics Row */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="text-[10px] text-ara-muted font-bold block mb-1">기대되는 비즈니스 성과</span>
                  <span className="text-sm font-bold text-ara-teal flex items-center gap-1 font-mono">
                    <TrendingDown className="w-4 h-4 text-ara-teal shrink-0" />
                    {strategy.expected_impact}
                  </span>
                </div>

                <button
                  onClick={() => onViewSource(strategy.id)}
                  className="text-xs font-bold text-ara-blue hover:text-ara-blue/80 hover:underline flex items-center gap-1 transition-colors duration-200"
                >
                  <span>근거 데이터</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
