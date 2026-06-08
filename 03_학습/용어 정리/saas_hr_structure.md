# SaaS HR 표준 플랫폼 구조와 HR 데이터셋 구조

> 파일명: `saas_hr_structure.md`

## 1. 개념

이 문서는 기존 `saas.md`, `dataset.md`에서 다룬 기본 개념을 바탕으로, **SaaS HR 플랫폼을 실제로 만들 때 어떤 구조로 설계하면 좋은지**를 정리한 보강 문서이다.

SaaS HR 플랫폼은 단순히 직원 목록을 보여주는 웹사이트가 아니다. 여러 회사가 하나의 서비스를 함께 사용하면서도, 각 회사의 데이터는 안전하게 분리되어야 한다. 또한 인사 담당자가 직원 정보, 근태, 성과, 만족도, AI 리포트를 한 곳에서 관리할 수 있어야 한다.

우리 프로젝트에서는 다음 구조를 목표로 생각할 수 있다.

```text
기업 사용자
→ SaaS HR 웹 플랫폼
→ 인증/권한 관리
→ HR 데이터 관리
→ AI Report 생성
→ 대시보드/리포트 제공
```

## 2. 왜 필요한가?

기본 SaaS 개념만 알고 있으면 “웹에서 쓰는 서비스” 정도로 이해할 수 있다. 하지만 실제 프로젝트를 개발하려면 **어떤 모듈이 필요하고, 데이터가 어떻게 저장되고, AI 리포트가 어디에서 생성되는지**까지 정리해야 한다.

| 필요한 이유 | 설명 |
|---|---|
| 역할 분담 | 프론트엔드, 백엔드, AI, DB 담당자가 작업 범위를 나눌 수 있음 |
| DB 설계 | 어떤 테이블이 필요한지 미리 정할 수 있음 |
| API 설계 | 화면과 서버가 어떤 데이터를 주고받을지 정할 수 있음 |
| 보안 설계 | 회사별 데이터 분리와 권한 관리를 설계할 수 있음 |
| AI 기능 연결 | AI Report가 어떤 데이터를 입력으로 받을지 정할 수 있음 |

## 3. SaaS HR 표준 플랫폼 구조

SaaS HR 플랫폼은 보통 다음과 같은 계층으로 구성된다.

| 계층 | 역할 | 예시 |
|---|---|---|
| 사용자 계층 | 실제 서비스를 사용하는 사람 | 관리자, HR 담당자, 팀장, 직원 |
| 프론트엔드 | 사용자가 보는 화면 | 로그인, 대시보드, 리포트 화면 |
| 백엔드 API | 비즈니스 로직 처리 | 직원 조회, 리포트 생성 요청 |
| 인증/권한 | 로그인과 접근 제어 | JWT, 세션, Role 관리 |
| 데이터베이스 | HR 데이터 저장 | 직원, 근태, 성과, 리포트 테이블 |
| AI 모듈 | 분석과 리포트 생성 | LLM API, LangChain, RAG |
| 외부 연동 | 협업 도구와 연결 | Notion, GitHub, Figma, MCP |

전체 구조 예시:

```text
[사용자]
  ↓
[프론트엔드]
  ↓
[백엔드 REST API]
  ↓
┌──────────────────────┐
│ 인증/권한 관리       │
│ HR 데이터 관리       │
│ AI Report 요청 처리  │
└──────────────────────┘
  ↓
┌─────────────┬─────────────┐
│ HR Database │ AI Service  │
└─────────────┴─────────────┘
  ↓
[대시보드 / 리포트 / 챗봇]
```

## 4. 핵심 모듈 정리

| 모듈 | 주요 기능 | 우리 프로젝트 적용 |
|---|---|---|
| 회원/로그인 모듈 | 사용자 가입, 로그인, 로그아웃 | 관리자와 HR 담당자 계정 관리 |
| 회사 관리 모듈 | 회사별 workspace 생성 | 회사별 데이터 분리 |
| 직원 관리 모듈 | 직원 등록, 수정, 조회 | 직원 기본 정보 관리 |
| 근태 관리 모듈 | 출근, 퇴근, 지각, 결근 관리 | 근태 리포트 생성 |
| 성과 관리 모듈 | 평가 점수, 목표 달성률 관리 | 성과 분석 리포트 생성 |
| 만족도 관리 모듈 | 설문 결과 관리 | 조직 만족도 분석 |
| AI Report 모듈 | HR 데이터를 요약하고 리포트 생성 | 핵심 기능 |
| 대시보드 모듈 | KPI와 차트 제공 | 이직률, 결근률, 성과 평균 표시 |

## 5. 권한 구조 예시

HR 플랫폼에서는 **누가 어떤 데이터를 볼 수 있는지**가 매우 중요하다.

| 역할 | 권한 예시 |
|---|---|
| Super Admin | 전체 서비스 관리, 회사 계정 관리 |
| Company Admin | 자기 회사의 전체 HR 데이터 관리 |
| HR Manager | 직원, 근태, 성과, 리포트 관리 |
| Team Leader | 자기 팀의 직원 요약 정보 조회 |
| Employee | 본인 정보와 본인 리포트 일부 조회 |

권한 흐름:

```text
사용자 로그인
→ 사용자 역할 확인
→ 회사 ID 확인
→ 접근 가능한 데이터 범위 확인
→ 요청 처리
```

## 6. HR 데이터셋 구조

우리 프로젝트에서 기본으로 필요한 HR 데이터셋은 다음과 같이 나눌 수 있다.

| 데이터셋 | 설명 | 주요 활용 |
|---|---|---|
| 직원 데이터 | 직원의 기본 정보 | 부서별 인원, 근속연수 분석 |
| 근태 데이터 | 출근, 퇴근, 지각, 결근 기록 | 결근률, 지각률 분석 |
| 성과 데이터 | 평가 점수와 목표 달성률 | 성과 추세 분석 |
| 이직 데이터 | 퇴사 여부와 이직 위험 요인 | 이직 위험 분석 |
| 만족도 데이터 | 설문 응답과 만족도 점수 | 조직 분위기 분석 |
| 리포트 데이터 | AI가 생성한 리포트 기록 | 과거 리포트 조회 |

## 7. 테이블 구조 예시

### 7.1 companies

회사 정보를 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| company_id | string | 회사 고유 ID |
| company_name | string | 회사명 |
| plan | string | 구독 플랜 |
| created_at | datetime | 가입일 |

### 7.2 users

로그인 사용자를 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| user_id | string | 사용자 고유 ID |
| company_id | string | 소속 회사 ID |
| email | string | 로그인 이메일 |
| password_hash | string | 암호화된 비밀번호 |
| role | string | 관리자, HR 담당자, 직원 등 |

### 7.3 employees

직원 기본 정보를 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| employee_id | string | 직원 고유 ID |
| company_id | string | 소속 회사 ID |
| department | string | 부서 |
| job_role | string | 직무 |
| position | string | 직급 |
| hire_date | date | 입사일 |
| employment_status | string | 재직, 휴직, 퇴사 |

### 7.4 attendance_records

근태 기록을 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| attendance_id | string | 근태 기록 ID |
| employee_id | string | 직원 ID |
| work_date | date | 근무일 |
| check_in | time | 출근 시간 |
| check_out | time | 퇴근 시간 |
| is_late | boolean | 지각 여부 |
| is_absent | boolean | 결근 여부 |
| overtime_hours | number | 초과근무 시간 |

### 7.5 performance_reviews

성과 평가 데이터를 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| review_id | string | 평가 ID |
| employee_id | string | 직원 ID |
| period | string | 평가 기간 |
| performance_score | number | 성과 점수 |
| goal_achievement_rate | number | 목표 달성률 |
| manager_comment | text | 관리자 평가 의견 |

### 7.6 satisfaction_surveys

만족도 설문 결과를 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| survey_id | string | 설문 ID |
| employee_id | string | 직원 ID |
| survey_date | date | 설문일 |
| job_satisfaction | number | 업무 만족도 |
| work_life_balance | number | 워라밸 점수 |
| stress_level | number | 스트레스 수준 |
| comment | text | 주관식 의견 |

### 7.7 ai_reports

AI가 생성한 리포트를 저장하는 테이블이다.

| 컬럼명 | 타입 예시 | 설명 |
|---|---|---|
| report_id | string | 리포트 ID |
| company_id | string | 회사 ID |
| report_type | string | 근태, 성과, 이직 위험 등 |
| period | string | 분석 기간 |
| title | string | 리포트 제목 |
| summary | text | 요약 |
| content | text | 전체 리포트 내용 |
| created_by | string | 생성 요청자 |
| created_at | datetime | 생성일 |

## 8. AI Report 생성에 필요한 데이터 흐름

```text
사용자 리포트 생성 요청
→ 회사 ID와 사용자 권한 확인
→ 직원 데이터 조회
→ 근태/성과/만족도 데이터 조회
→ 통계 계산
→ LLM 입력용 요약 데이터 생성
→ AI Report 생성
→ ai_reports 테이블에 저장
→ 프론트엔드에 결과 반환
```

예시 입력 데이터:

```json
{
  "department": "개발팀",
  "period": "2026-05",
  "attendance": {
    "late_rate": 0.08,
    "absence_rate": 0.02,
    "avg_overtime_hours": 12.5
  },
  "performance": {
    "avg_score": 4.1,
    "goal_achievement_rate": 0.87
  },
  "satisfaction": {
    "avg_job_satisfaction": 3.6,
    "avg_stress_level": 4.2
  }
}
```

## 9. 주의할 점

- **company_id를 모든 주요 테이블에 포함**해 회사별 데이터가 섞이지 않도록 해야 한다.
- 실제 이름, 이메일, 전화번호 등 개인정보는 최소한만 저장해야 한다.
- AI에게 원본 개인정보를 그대로 전달하지 말고 요약 통계 중심으로 전달해야 한다.
- 근태, 성과, 만족도 데이터는 직원 평가에 민감하게 쓰일 수 있으므로 접근 권한을 제한해야 한다.
- 처음부터 너무 복잡한 테이블을 만들기보다 MVP에 필요한 구조부터 시작하는 것이 좋다.

## 10. 우리 프로젝트 적용 정리

우리 프로젝트는 다음 순서로 설계하면 좋다.

| 단계 | 적용 내용 |
|---|---|
| 1단계 | 회사, 사용자, 직원 테이블 구성 |
| 2단계 | 근태, 성과, 만족도 데이터셋 추가 |
| 3단계 | 대시보드 KPI 계산 API 개발 |
| 4단계 | AI Report 생성 API 개발 |
| 5단계 | 리포트 저장과 조회 기능 구현 |
| 6단계 | 권한 관리와 회사별 데이터 분리 강화 |

핵심은 **SaaS 구조, HR 데이터 구조, AI 리포트 구조를 처음부터 연결해서 설계하는 것**이다.
