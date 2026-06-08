# 2주차 — API 명세서 & ERD 분석 정리

> 작성일: 2026-06-08  
> 출처: 유시스(UXIS) Notion 개발 자료 페이지  
> 작성자: 박수용 (HARP팀)

---

## 1. 전체 구조 이해

```
[Waple 백엔드] ──데이터 전송──▶ [우리 AI 서버] ──AI 결과 반환──▶ [Waple 화면]
```

- **Waple(유시스)** = HR 데이터를 갖고 있는 쪽
- **우리 팀** = AI로 분석해서 점수 + 텍스트를 돌려주는 FastAPI 서버
- Waple이 데이터를 POST로 보내면, 우리가 분석 결과를 JSON으로 반환

---

## 2. 공통 사항

| 항목 | 내용 |
|------|------|
| Base URL | 우리가 결정 (예: `http://localhost:8000`) |
| Content-Type | `application/json` |
| 인증 | 없음 (내부망 통신 가정) |

### 상태 코드 정의

| code | label | 색상 | 의미 |
|------|-------|------|------|
| `0010` | 양호 | 초록 | 정상 범위 |
| `0020` | 주의 | 주황 | 관심 필요 |
| `0030` | 위험 | 빨강 | 즉각 조치 필요 |

> ⚠️ **점수 → 상태 코드 변환 기준은 우리 팀이 직접 설계해야 함**  
> 예시: 80점 이상 → `0010`, 60~79점 → `0020`, 60점 미만 → `0030`

---

## 3. API 1: 관리자 주간 리포트

### 엔드포인트

```
POST /api/report/admin
```

### Request Body (Waple → 우리 서버)

```json
{
  "period": {
    "startDate": "2025-06-02",
    "endDate": "2025-06-06"
  },
  "company": {
    "totalEmpCount": 42
  },
  "attendance": {
    "lateCount": 8,
    "absentCount": 3,
    "avgWorkHours": "41:30",
    "prevWeek": {
      "lateCount": 5,
      "absentCount": 2
    }
  },
  "workLog": {
    "expectedCount": 210,
    "writtenCount": 183,
    "prevWeek": {
      "expectedCount": 210,
      "writtenCount": 195
    }
  },
  "goal": {
    "totalGoals": 87,
    "completedGoals": 52,
    "delayedGoals": 12,
    "prevWeek": {
      "totalGoals": 87,
      "completedGoals": 48
    }
  },
  "leave": {
    "totalAnnualDays": 420,
    "usedAnnualDays": 10,
    "prevWeek": {
      "usedAnnualDays": 7
    }
  }
}
```

#### Request 필드 설명

| 필드 | 설명 |
|------|------|
| `period` | 리포트 대상 주간 날짜 범위 |
| `company.totalEmpCount` | 전체 직원 수 |
| `attendance.lateCount` | 이번 주 전체 지각 건수 |
| `attendance.absentCount` | 이번 주 무단결근 건수 |
| `attendance.avgWorkHours` | 전체 평균 근무 시간 (HH:mm) |
| `workLog.expectedCount` | 업무일지 작성 대상 건수 (직원수 × 근무일수) |
| `workLog.writtenCount` | 실제 작성된 업무일지 건수 |
| `goal.totalGoals` | 전체 목표 수 |
| `goal.completedGoals` | 완료된 목표 수 |
| `goal.delayedGoals` | 지연된 목표 수 |
| `leave.totalAnnualDays` | 전체 직원 연차 총합 |
| `leave.usedAnnualDays` | 이번 주 사용된 연차 수 |
| `*.prevWeek` | 전주 동일 지표 (증감 계산용) |

### Response Body (우리 서버 → Waple)

```json
{
  "summary": {
    "totalScore": 86,
    "deltaFromLastWeek": 2,
    "status": {
      "code": "0010",
      "label": "양호"
    },
    "report": "회사 전반적으로 지각 횟수와 업무일지 누락 횟수가 함께 증가하고 있어..."
  },
  "metrics": [
    {
      "title": "목표점수",
      "score": 92,
      "average": 85,
      "status": { "code": "0010", "label": "양호" }
    },
    {
      "title": "업무일지점수",
      "score": 92,
      "average": 88,
      "status": { "code": "0010", "label": "양호" }
    },
    {
      "title": "근태점수",
      "score": 62,
      "average": 70,
      "status": { "code": "0020", "label": "주의" }
    },
    {
      "title": "연차점수",
      "score": 40,
      "average": 60,
      "status": { "code": "0020", "label": "주의" }
    }
  ]
}
```

#### Response 필드 설명

| 필드 | 타입 | 설명 | 담당 |
|------|------|------|------|
| `summary.totalScore` | number | 종합 점수 (0~100) | 우리 로직 |
| `summary.deltaFromLastWeek` | number | 전주 대비 증감 (음수 가능) | 우리 로직 |
| `summary.status` | object | 상태 코드 + 라벨 | 우리 로직 |
| `summary.report` | string | AI 요약 텍스트 | **LLM 생성** |
| `metrics[].title` | string | "목표점수" / "업무일지점수" / "근태점수" / "연차점수" 고정 | — |
| `metrics[].score` | number | 카테고리 점수 (0~100) | 우리 로직 |
| `metrics[].average` | number | 전주 평균 (비교 기준선) | 우리 로직 |
| `metrics[].status` | object | 상태 코드 + 라벨 | 우리 로직 |

---

## 4. API 2: 개인 직원 인사이트

### 엔드포인트

```
POST /api/report/individual
```

### Request Body (Waple → 우리 서버)

```json
{
  "empSeq": 123,
  "empNm": "김찬기",
  "deptNm": "개발팀",
  "period": {
    "startDate": "2025-06-02",
    "endDate": "2025-06-06"
  },
  "workLog": {
    "expectedCount": 5,
    "entries": [
      {
        "date": "2025-06-02",
        "written": true,
        "keywords": ["회의", "보고서", "기획"],
        "taskCount": 3
      },
      {
        "date": "2025-06-03",
        "written": false,
        "keywords": [],
        "taskCount": 0
      }
    ],
    "companyAverage": 85
  },
  "attendance": {
    "records": [
      {
        "date": "2025-06-02",
        "inTime": "09:05",
        "outTime": "18:10",
        "workMinutes": 485,
        "isLate": false,
        "leaveType": null
      },
      {
        "date": "2025-06-03",
        "inTime": "09:32",
        "outTime": "18:00",
        "workMinutes": 508,
        "isLate": true,
        "leaveType": null
      }
    ],
    "lateCount": 1,
    "leaveUsed": {
      "annual": 1,
      "vacation": 0,
      "leaveOfAbsence": 0
    },
    "companyAverage": 80
  },
  "aim": {
    "goals": [
      {
        "title": "Q2 매출 목표 달성",
        "status": "completed",
        "progressRate": 100
      },
      {
        "title": "신규 기능 개발",
        "status": "delayed",
        "progressRate": 45
      }
    ],
    "companyAverage": 78
  },
  "history": {
    "prevWeekTotalScore": 84
  }
}
```

#### 목표 status 값 종류

| 값 | 의미 |
|----|------|
| `completed` | 완료 |
| `inProgress` | 진행 중 |
| `delayed` | 지연 |
| `danger` | 위험 |

### Response Body (우리 서버 → Waple)

```json
{
  "result": {
    "title": "매우 잘하고 있습니다!",
    "report": "당신은 조직 안에서 꾸준히 신뢰를 쌓아가고 있는 사람입니다..."
  },
  "summary": {
    "totalScore": 86,
    "deltaFromLastWeek": 2,
    "status": { "code": "0010", "label": "양호" },
    "departmentAverage": 74,
    "companyAverage": 72,
    "report": "김찬기님의 이번 주 점수가 향상되었어요...",
    "coreScore": [
      { "label": "실행력", "score": { "me": 95, "company": 88 } },
      { "label": "안정성", "score": { "me": 90, "company": 85 } },
      { "label": "성장력", "score": { "me": 88, "company": 80 } },
      { "label": "효율성", "score": { "me": 80, "company": 78 } },
      { "label": "영향력", "score": { "me": 78, "company": 70 } }
    ]
  },
  "detail": {
    "workLog": {
      "score": 92,
      "companyAverage": 85,
      "status": { "code": "0010", "label": "양호" },
      "report": "이번 주 업무일지 작성률이 92%로 양호한 편입니다.",
      "etc": [
        { "label": "이번주 작성 건수", "value": "5건" },
        { "label": "가장 많이 언급된 키워드", "value": "회의, 보고서" }
      ]
    },
    "attendance": {
      "score": 88,
      "companyAverage": 80,
      "status": { "code": "0010", "label": "양호" },
      "report": "이번 주 출퇴근 기록이 양호합니다.",
      "etc": [
        {
          "label": "평균시간",
          "value": [
            { "label": "출근", "value": "09:05" },
            { "label": "퇴근", "value": "18:10" },
            { "label": "근무", "value": "8시간 5분" }
          ]
        },
        { "label": "지각횟수", "value": "1건" },
        {
          "label": "휴무",
          "value": [
            { "label": "연차", "value": "1회" },
            { "label": "휴가", "value": "0" },
            { "label": "휴직", "value": "0" }
          ]
        }
      ]
    },
    "aim": {
      "score": 90,
      "companyAverage": 78,
      "status": { "code": "0020", "label": "주의" },
      "report": "이번 주 목표 달성률이 다소 낮습니다.",
      "etc": [
        { "label": "목표 달성률", "value": "80%" },
        { "label": "총 목표 생성 갯수", "value": "12개" },
        {
          "label": "상태별 목표 갯수",
          "value": [
            { "label": "완료", "value": "1" },
            { "label": "원활", "value": "0" },
            { "label": "지연", "value": "2" },
            { "label": "위험", "value": "0" }
          ]
        }
      ]
    }
  },
  "risk": {
    "report": "번아웃 리스크가 감지됩니다. 초과 근무 누적에 주의하세요.",
    "score": {
      "leave": {
        "label": "이직 리스크",
        "value": 10,
        "status": { "code": "0010", "label": "양호" }
      },
      "burnout": {
        "label": "번아웃 리스크",
        "value": 50,
        "status": { "code": "0020", "label": "주의" }
      }
    }
  }
}
```

#### Response 구조 요약

| 섹션 | 설명 | LLM 생성 여부 |
|------|------|--------------|
| `result.title` | 한 줄 격려/경고 문구 | ✅ LLM |
| `result.report` | 3~4문장 전체 평가 | ✅ LLM |
| `summary.totalScore` | 개인 종합 점수 | 우리 로직 |
| `summary.deltaFromLastWeek` | 전주 대비 증감 | 우리 로직 |
| `summary.departmentAverage` | 부서 평균 점수 | 우리 로직 |
| `summary.companyAverage` | 회사 평균 점수 | 우리 로직 |
| `summary.report` | 요약 코멘트 | ✅ LLM |
| `summary.coreScore` | 레이더차트 5개 축 점수 | 우리 로직 |
| `detail.*.score` | 각 영역 점수 | 우리 로직 |
| `detail.*.report` | 영역별 AI 코멘트 | ✅ LLM |
| `risk.report` | 리스크 종합 코멘트 | ✅ LLM |
| `risk.score.leave.value` | 이직 리스크 점수 | 우리 로직 |
| `risk.score.burnout.value` | 번아웃 리스크 점수 | 우리 로직 |

### 레이더차트 5개 축 정의

| 축 | 의미 |
|----|------|
| 실행력 | 목표를 실제로 실행하는 능력 |
| 안정성 | 근태, 꾸준함 |
| 성장력 | 업무 개선, 역량 향상 |
| 효율성 | 업무일지 작성률, 시간 활용 |
| 영향력 | 조직 내 기여도 |

### etc 배열 포맷 규칙

```json
// 단순 값
{ "label": "지각횟수", "value": "1건" }

// 다중 값 (그룹)
{ "label": "평균시간", "value": [
  { "label": "출근", "value": "09:05" },
  { "label": "퇴근", "value": "18:10" }
]}
```

> ⚠️ `value`가 문자열일 수도 있고 배열일 수도 있음 — 파싱 코드에서 두 경우 모두 처리해야 함

---

## 5. LLM이 생성해야 하는 텍스트 목록

| 위치 | 필드 | 내용 | 분량 |
|------|------|------|------|
| 관리자 리포트 | `summary.report` | 회사 현황 요약 + 행동 유도 | 2~3문장 |
| 개인 총평 제목 | `result.title` | 한 줄 격려/경고 | 1문장 |
| 개인 총평 본문 | `result.report` | 전체 평가 | 3~4문장 |
| 개인 요약 | `summary.report` | 이번 주 핵심 메시지 | 2문장 이내 |
| 업무일지 코멘트 | `detail.workLog.report` | 업무일지 영역 평가 | 1~2문장 |
| 근태 코멘트 | `detail.attendance.report` | 근태 영역 평가 | 1~2문장 |
| 목표 코멘트 | `detail.aim.report` | 목표 영역 평가 | 1~2문장 |
| 리스크 코멘트 | `risk.report` | 리스크 종합 + 조치 권고 | 1~2문장 |

---

## 6. 점수 계산 로직 (우리가 설계)

### 유시스 제공 예시

```
업무일지 점수 = writtenCount / expectedCount × 100
근태 점수 = 100 - (지각횟수 × 10) - (무단결근 × 20)
```

### 리스크 점수 기준 힌트

| 리스크 | 올라가는 조건 |
|--------|-------------|
| 이직 리스크 | 지각 급증 + 성과 하락 + 연차 급증 조합 |
| 번아웃 리스크 | 초과 근무 누적 + 휴가 미사용 + 업무일지 퀄리티 저하 |

> 최종 점수 계산 공식은 팀 내에서 합의 후 확정 필요

---

## 7. ERD 분석 — AI Report 관련 핵심 테이블

전체 테이블 수: 100개 이상 (PostgreSQL 기반)  
AI Report 직접 관련: **15개**, 간접 포함 시 20개

### 7-1. 직원 / 회사 기본 정보

| 테이블 | 설명 | 핵심 컬럼 |
|--------|------|-----------|
| `HR_EMP` | 직원 마스터 | EMP_SEQ, CO_SEQ, EMP_NM, JNCMP_YMD(입사일) |
| `HR_CO` | 회사 정보 | CO_SEQ, CO_NM, RPRSV_EMP_SEQ(대표자) |
| `HR_DEPT` | 부서 구조 | DEPT_CD, DEPT_NM, UPP_DEPT_CD, LDR_EMP_SEQ |
| `HR_DEPT_EMP` | 직원↔부서 매핑 | EMP_SEQ, DEPT_CD, MAIN_YN(주부서 여부) |

### 7-2. 업무일지 (workLog 점수)

| 테이블 | 설명 | 핵심 컬럼 |
|--------|------|-----------|
| `HR_TASK_LOG` | 업무일지 본체 | TASK_LOG_SEQ, EMP_SEQ, TASK_BGNG_YMD, MEMO(내용), CMPLT_YN |
| `HR_TASK_LOG_TRGT` | 업무일지 대상자 | TASK_LOG_SEQ, EMP_SEQ, TRGT_TYPE, CMPLT_YN |

> ⚠️ `keywords` 필드는 DB에 없음 — `HR_TASK_LOG.MEMO`에서 우리가 직접 추출해야 함

### 7-3. 근태 (attendance 점수)

| 테이블 | 설명 | 핵심 컬럼 |
|--------|------|-----------|
| `HR_LEAVE` | 연차 사용 기록 | EMP_SEQ, APLY_YMD, APLY_BGNG_TM, APLY_END_TM, LEAVE_SE, PROC_STTS |
| `HR_VCTN` | 휴가 신청 기록 | EMP_SEQ, APLY_YMD, PROC_STTS, PAID_YN |
| `HR_HLDY` | 휴직 기록 | EMP_SEQ, HLDY_SE, APLY_YMD, PROC_STTS |
| `HR_OVRTM_WOR` | 초과근무 신청 | EMP_SEQ, APLY_BGNG_YMD, APLY_BGNG_TM, APLY_END_YMD, APLY_END_TM |
| `HR_LEAVE_GIVE` | 연차 부여 기록 | EMP_SEQ, LEAVE_DAY_CNT, GIVE_YMD, EXTSH_YMD |
| `HR_WORKTP` | 근무 유형 (기준 시간) | WORK_BGNG_TM(출근), WORK_END_TM(퇴근), WORK_HR, WORK_DAY |
| `HR_CO_HLDY` | 회사 공휴일 | CO_HLDY_YMD, CO_HLDY_NM, ALT_HLDY_YN |
| `HR_BSNSTR` | 출장 기록 | EMP_SEQ, BSNSTR_BGNG_YMD, BSNSTR_END_YMD, PROC_STTS |

### 7-4. 목표 (aim 점수)

| 테이블 | 설명 | 핵심 컬럼 |
|--------|------|-----------|
| `HR_AIM` | 목표 마스터 | AIM_SEQ, CO_SEQ, AIM_NM, AIM_STTS(상태), CRNT_ACHV_RATE(진행률%) |
| `HR_AIM_MEM_LST` | 목표 참여 직원 | EMP_SEQ, AIM_SEQ |
| `HR_AIM_HSTRY` | 목표 변경 이력 | AIM_SEQ, AIM_HSTRY_CN, REG_DT |

### 7-5. 리스크 분석 보조

| 테이블 | 설명 | 핵심 컬럼 |
|--------|------|-----------|
| `HR_RSGNTN_PROC` | 퇴사 처리 이력 | EMP_SEQ, RSGNTN_TYPE, RSGNTN_YMD, PROC_STTS |
| `HR_EMP_DTL` | 직원 인사 이력 | EMP_SEQ, CRTR_YMD, EMP_SE, EMP_JBGD, EMP_STEPSYS |

---

## 8. API ↔ DB 테이블 매핑

| API 요청 필드 | 데이터 출처 테이블 | 비고 |
|---|---|---|
| `attendance.lateCount` | `HR_LEAVE` + `HR_WORKTP` | APLY_BGNG_TM vs WORK_BGNG_TM 비교 |
| `attendance.avgWorkHours` | `HR_OVRTM_WOR` + `HR_WORKTP` | WORK_HR 기준 |
| `workLog.writtenCount` | `HR_TASK_LOG` | TASK_BGNG_YMD 날짜 필터 |
| `workLog.entries[].keywords` | `HR_TASK_LOG.MEMO` | **우리가 키워드 추출 필요** |
| `goal.completedGoals` | `HR_AIM` | AIM_STTS 값 기준 |
| `goal.progressRate` | `HR_AIM` | CRNT_ACHV_RATE 컬럼 |
| `leave.usedAnnualDays` | `HR_LEAVE` | PROC_STTS = 승인 건수 |

---

## 9. 수요일 회의 확인 사항

- [ ] **출퇴근 시각 저장 테이블 존재 여부 확인**  
  ERD에 일반 출퇴근 기록 테이블(`HR_ATND` 등)이 없음. `inTime`, `outTime` 데이터가 어디서 오는지 확인 필요.

- [ ] **지각 판단 기준 확인**  
  `isLate: true/false` 판단을 Waple이 계산해서 보내주는지, 우리가 `HR_WORKTP.WORK_BGNG_TM`과 비교해서 계산하는지 확인 필요.

- [ ] **업무일지 키워드 추출 방식 확인**  
  API 명세서에 `keywords` 필드가 있는데, Waple이 미리 추출해서 보내주는지 아니면 우리가 `MEMO` 컬럼에서 NLP로 추출해야 하는지 확인 필요.

- [ ] **LLM 모델 결정** (기존 미결 사항)  
  GPT-4o-mini vs EXAONE 3.5 — 보안 정책(직원 HR 데이터 외부 전송 가능 여부) + GPU 서버 지원 여부에 따라 결정

---

## 10. 즉시 해야 할 개발 작업

| 우선순위 | 작업 | 비고 |
|---------|------|------|
| 🔴 즉시 | FastAPI 서버 뼈대 생성 | `/api/report/admin`, `/api/report/individual` 라우터 |
| 🔴 즉시 | 4개 카테고리 점수 계산 로직 설계 | 팀 전체 논의 필요 |
| 🟡 이번 주 | 상태코드 변환 기준 확정 | 80/60점 컷 등 |
| 🟡 이번 주 | LLM 프롬프트 초안 작성 | 8가지 텍스트 필드 |
| 🟢 다음 주 | 레이더차트 5개 축 점수 계산 로직 | 실행력/안정성/성장력/효율성/영향력 |
| 🟢 다음 주 | 리스크 점수 계산 로직 | 이직/번아웃 리스크 |

---

## 11. 주의사항

1. **`deltaFromLastWeek`는 음수 가능** — 점수가 떨어지면 `-3` 같은 음수로 반환
2. **`metrics[].average`는 "전주 평균"** — 전주 데이터 없을 경우 처리 방법 고민 필요
3. **`etc` 배열의 `value`가 두 가지 형태** — 파싱 시 문자열/배열 모두 처리
4. **출퇴근 기록 테이블 미확인** — 수요일 회의 전까지 가정으로 개발하지 말 것
5. **키워드 추출 방식 미확인** — Waple 측 확인 후 로직 결정

---

*이 문서는 2026-06-08 기준 유시스 Notion 개발 자료를 분석하여 작성되었습니다.*
