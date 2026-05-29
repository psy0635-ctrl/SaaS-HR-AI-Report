import React from 'react';
import { UploadCloud, Sparkles, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number; // 1: Upload, 2: Insights, 3: Strategy & Report
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      label: '데이터 업로드',
      icon: UploadCloud,
      colorClass: 'text-ara-teal border-ara-teal bg-teal-50',
      activeColorClass: 'bg-ara-teal text-white shadow-teal-glow',
    },
    {
      id: 2,
      label: 'AI 핵심 분석',
      icon: Sparkles,
      colorClass: 'text-ara-gold border-ara-gold bg-amber-50',
      activeColorClass: 'bg-ara-gold text-white shadow-gold-glow',
    },
    {
      id: 3,
      label: '실행 전략 & 보고서',
      icon: CheckCircle2,
      colorClass: 'text-ara-blue border-ara-blue bg-blue-50',
      activeColorClass: 'bg-ara-blue text-white shadow-blue-glow',
    },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto py-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Connection lines */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Dynamic active lines */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-ara-teal -translate-y-1/2 z-0 transition-all duration-700 ease-out" 
          style={{ 
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            backgroundColor: currentStep === 2 ? '#F5A623' : currentStep === 3 ? '#2563EB' : '#1AB8A6'
          }}
        />

        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center z-10 relative">
              {/* Step Circle */}
              <div 
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-white ${
                  isActive 
                    ? step.activeColorClass 
                    : isCompleted 
                      ? 'border-ara-teal bg-teal-50 text-ara-teal' 
                      : 'border-slate-300 text-ara-muted'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 animate-pulse-slow" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-soft' : ''}`} />
                )}
              </div>
              
              {/* Step Label */}
              <span 
                className={`mt-2.5 text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? currentStep === 1 
                      ? 'text-ara-teal font-extrabold' 
                      : currentStep === 2 
                        ? 'text-ara-gold font-extrabold' 
                        : 'text-ara-blue font-extrabold'
                    : isCompleted 
                      ? 'text-ara-teal' 
                      : 'text-ara-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
