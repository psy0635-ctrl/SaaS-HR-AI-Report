import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Info, HelpCircle } from 'lucide-react';

interface UploadBoxProps {
  onUploadSuccess: (csvText: string, fileName: string) => void;
  onUploadError: (errorType: 'format' | 'parsing') => void;
  onUseSample: () => void;
  onShowSecurityInfo: () => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  onUploadSuccess,
  onUploadError,
  onUseSample,
  onShowSecurityInfo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'csv' && extension !== 'xlsx') {
      onUploadError('format');
      return;
    }

    setSelectedFile(file);

    // Read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Basic CSV structural check
      if (!text || text.trim() === '') {
        onUploadError('parsing');
        return;
      }

      // Check if it has the required column '사번' or 'Employee ID'
      const firstLine = text.split('\n')[0];
      if (!firstLine.includes('사번') && !firstLine.toLowerCase().includes('employee id') && !firstLine.toLowerCase().includes('id')) {
        onUploadError('parsing');
        return;
      }

      // Validated successfully
      setTimeout(() => {
        onUploadSuccess(text, file.name);
      }, 500);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Live Sample CSV generation and download
  const handleDownloadSample = () => {
    const csvContent = "\ufeff사번,이름,부서,퇴사여부,퇴사일,입사일,성과등급\n" +
      "E001,김도현,개발1팀,N,,2023-03-12,A\n" +
      "E002,박지수,개발1팀,Y,2025-04-15,2022-01-10,S\n" +
      "E003,이민우,마케팅팀,N,,2024-05-01,B\n" +
      "E004,최아름,개발2팀,N,,2023-11-15,A\n" +
      "E005,정태영,영업팀,Y,2025-02-28,2021-08-01,B\n" +
      "E006,윤소희,인사팀,N,,2020-05-10,S\n" +
      "E007,한성민,개발1팀,Y,2025-05-10,2024-03-01,C\n" +
      "E008,강지혜,마케팅팀,N,,2023-09-01,A\n" +
      "E009,임재범,영업팀,N,,2022-07-20,B\n" +
      "E010,신동욱,개발2팀,Y,2025-03-31,2023-02-10,A\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ara_sample_hr_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto animate-fade-in">
      {/* Upload Panel Card */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full glass-panel rounded-card p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 min-h-[340px] text-center ${
          isDragActive 
            ? 'border-ara-teal bg-teal-50/40 shadow-teal-glow scale-[1.01]' 
            : 'border-slate-300 hover:border-ara-teal/60 hover:shadow-premium-hover'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          id="input-file-upload" 
          multiple={false} 
          accept=".csv,.xlsx" 
          className="hidden" 
          onChange={handleChange}
        />

        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6 text-ara-teal transition-transform duration-300 hover:scale-105">
          <UploadCloud className="w-8 h-8" />
        </div>

        {selectedFile ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-ara-border text-ara-navy font-medium mb-3">
              <FileText className="w-4 h-4 text-ara-teal" />
              <span className="font-mono text-sm max-w-[200px] truncate">{selectedFile.name}</span>
            </div>
            <p className="text-sm text-ara-muted mb-6">업로드 완료! 분석을 시작해주세요.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-ara-navy mb-2">
              Excel / CSV 파일을 드래그하거나 클릭하여 업로드
            </h3>
            <p className="text-sm text-ara-muted mb-4 max-w-[400px] mx-auto">
              직원의 기본 정보, 입사일, 퇴사 여부 및 성과 평가 등급이 들어있는 데이터 파일을 올려주세요.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onButtonClick}
            className="w-full sm:w-auto px-6 py-3 bg-ara-teal text-white rounded-btn font-semibold hover:bg-ara-teal-hover transition-colors duration-200 shadow-premium"
          >
            {selectedFile ? '다른 파일 선택하기' : '파일 업로드'}
          </button>
          
          <button
            onClick={onUseSample}
            className="w-full sm:w-auto px-6 py-3 border border-ara-teal text-ara-teal rounded-btn font-semibold hover:bg-teal-50/50 transition-colors duration-200"
          >
            샘플 데이터로 시작하기
          </button>
        </div>

        <button 
          onClick={handleDownloadSample}
          className="mt-6 text-xs text-ara-teal font-semibold hover:text-ara-teal-hover hover:underline transition-colors duration-200 flex items-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5" />
          💡 예시 파일 다운로드 (.csv)
        </button>
      </div>

      {/* Info Footers */}
      <div className="flex items-center justify-between mt-6 px-2 text-xs text-ara-muted">
        <button
          onClick={onShowSecurityInfo}
          className="hover:text-ara-navy hover:underline transition-colors duration-200 flex items-center gap-1 font-medium text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full bg-white/50"
        >
          🛡️ 보안 안내 확인하기
        </button>
        <span className="font-mono">지원 형식: .xlsx, .csv (최대 50MB)</span>
      </div>
    </div>
  );
};
