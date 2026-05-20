# HR 데이터 스키마 정의서

## 1. 데이터 구성 목적

본 프로젝트는 SaaS HR 플랫폼 내 AI Report 기능 개발을 목표로 한다.  
AI Report는 직원 정보, 근태, 성과, 이직 데이터를 기반으로 HR 지표를 분석하고,  
관리자에게 차트와 자연어 리포트 형태로 인사이트를 제공한다.

---

## 2. 전체 테이블 구조

| 테이블명 | 설명 |
|---|---|
| departments | 부서 정보 |
| employees | 직원 기본 정보 |
| attendance | 일별 근태 정보 |
| performance | 월별 성과 정보 |
| attrition | 퇴사 및 이직 정보 |

---

## 3. departments 테이블

| 컬럼명 | 타입 | 설명 | 예시 |
|---|---|---|---|
| department_id | string | 부서 ID | D001 |
| department_name | string | 부서명 | 개발팀 |
| manager_id | string | 부서장 직원 ID | E0001 |

---

## 4. employees 테이블

| 컬럼명 | 타입 | 설명 | 예시 |
|---|---|---|---|
| employee_id | string | 직원 ID | E0001 |
| department_id | string | 소속 부서 ID | D001 |
| age | int | 나이 | 32 |
| gender | string | 성별 | Male |
| job_role | string | 직무 | Developer |
| position | string | 직급 | 대리 |
| hire_date | date | 입사일 | 2023-03-01 |
| employment_type | string | 고용 형태 | 정규직 |
| status | string | 재직 상태 | Active |

---

## 5. attendance 테이블

| 컬럼명 | 타입 | 설명 | 예시 |
|---|---|---|---|
| attendance_id | string | 근태 ID | A000001 |
| employee_id | string | 직원 ID | E0001 |
| work_date | date | 근무일 | 2026-05-01 |
| check_in | time | 출근 시간 | 09:03 |
| check_out | time | 퇴근 시간 | 18:20 |
| late_minutes | int | 지각 시간 | 3 |
| overtime_hours | float | 초과근무 시간 | 1.5 |
| absence | boolean | 결근 여부 | false |

---

## 6. performance 테이블

| 컬럼명 | 타입 | 설명 | 예시 |
|---|---|---|---|
| performance_id | string | 성과 ID | P000001 |
| employee_id | string | 직원 ID | E0001 |
| month | string | 평가 월 | 2026-05 |
| performance_score | int | 성과 점수 | 82 |
| goal_achievement_rate | float | 목표 달성률 | 91.5 |
| manager_review_score | float | 관리자 평가 점수 | 4.2 |
| peer_review_score | float | 동료 평가 점수 | 4.0 |

---

## 7. attrition 테이블

| 컬럼명 | 타입 | 설명 | 예시 |
|---|---|---|---|
| attrition_id | string | 이직 데이터 ID | T000001 |
| employee_id | string | 직원 ID | E0001 |
| attrition | string | 퇴사 여부 | No |
| resignation_date | date | 퇴사일 | null |
| reason | string | 퇴사 사유 | 워라밸 |
| risk_score | int | 퇴사 위험 점수 | 72 |