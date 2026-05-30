export interface EvidenceSource {
  항목: string;
  수치: string;
  기간: string;
  출처: string;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  metric: string;
  change: string;
  sources: EvidenceSource[];
}

export interface Strategy {
  id: number;
  title: string;
  description: string;
  expected_impact: string;
}

export interface HRDataRow {
  사번: string;
  이름: string;
  부서: string;
  퇴사여부: string;
  퇴사일: string;
  입사일: string;
  성과등급: string;
  [key: string]: string;
}
