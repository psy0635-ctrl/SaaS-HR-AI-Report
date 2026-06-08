import React from 'react';
import { AlertCircle, FileX, RefreshCw, X } from 'lucide-react';

interface ErrorModalProps {
  errorType: 'format' | 'parsing' | null;
  onClose: () => void;
  onRetry: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ errorType, onClose, onRetry }) => {
  if (!errorType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ara-navy/60 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-[500px] bg-white rounded-modal shadow-2xl overflow-hidden border border-ara-border animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ara-border bg-slate-50">
          <div className="flex items-center gap-2">
            {errorType === 'format' ? (
              <FileX className="w-5 h-5 text-ara-red" />
            ) : (
              <AlertCircle className="w-5 h-5 text-ara-red" />
            )}
            <span className="font-bold text-ara-navy">
              {errorType === 'format' ? '지원하지 않는 파일 형식' : '데이터 구조 분석 실패'}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-ara-muted hover:text-ara-navy transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorType === 'format' ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-ara-red mx-auto">
                <FileX className="w-6 h-6" />
              </div>
              
              <div className="text-center">
                <p className="font-semibold text-ara-navy mb-2">
                  엑셀(.xlsx) 또는 CSV(.csv) 파일만 업로드할 수 있습니다.
                </p>
                <p className="text-sm text-ara-muted">
                  PDF, 이미지, TXT 또는 ZIP 등의 파일은 시스템이 인식할 수 없습니다. 엑셀을 통해 확장자를 확인 후 다시 시도해 주세요.
                </p>
              </div>

              <div className="bg-slate-50 border border-ara-border p-4 rounded-card text-xs text-ara-muted space-y-1">
                <span className="font-bold text-ara-navy block mb-1">올바른 포맷 가이드:</span>
                <p>• Microsoft Excel 통합 문서 (.xlsx)</p>
                <p>• 쉼표로 구분된 텍스트 파일 (.csv)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-ara-red mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center">
                <p className="font-semibold text-ara-navy mb-2">
                  필수 데이터 항목이 누락되었거나 데이터 형식이 올바르지 않습니다.
                </p>
                <p className="text-sm text-ara-muted">
                  AI 분석을 위해 가장 핵심이 되는 <strong className="text-ara-teal">사번</strong> 컬럼이 존재하지 않거나, 파일이 손상되었습니다.
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-card text-xs text-ara-navy space-y-1.5">
                <span className="font-bold text-amber-800 block mb-1">🛠️ 필수 해결 가이드:</span>
                <p className="flex items-start gap-1">
                  <span className="text-ara-red font-bold">1.</span>
                  <span>첫 번째 행(헤더)에 <strong>사번</strong> (혹은 <strong>Employee ID</strong>, <strong>ID</strong>)이 반드시 존재해야 합니다.</span>
                </p>
                <p className="flex items-start gap-1">
                  <span className="text-ara-red font-bold">2.</span>
                  <span>샘플 예시 파일을 내려받아 데이터 컬럼 구조를 맞춘 다음 다시 업로드해 주세요.</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-ara-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-ara-muted font-medium hover:text-ara-navy transition-colors duration-200"
          >
            취소
          </button>
          
          <button
            onClick={onRetry}
            className="px-5 py-2 bg-ara-teal hover:bg-ara-teal-hover text-white text-sm font-semibold rounded-btn transition-colors duration-200 flex items-center gap-1.5 shadow-premium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{errorType === 'format' ? '다시 선택하기' : '에러 확인 후 재업로드'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
