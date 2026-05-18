# AI Agent 설계 방식 알아보기

> 파일명: `ai_agent_design.md`

## 1. 개념

**AI Agent**는 사용자의 목표를 이해하고, 필요한 도구를 선택하고, 여러 단계를 거쳐 작업을 수행하는 AI 시스템이다.

일반 LLM 호출은 보통 한 번 질문하고 한 번 답변을 받는 구조이다.

```text
사용자 질문
→ LLM
→ 답변
```

반면 AI Agent는 중간에 데이터를 조회하거나, 계산하거나, 문서를 검색하거나, 결과를 검토하는 과정을 포함할 수 있다.

```text
사용자 목표
→ 계획 수립
→ 도구 선택
→ 데이터 조회
→ 분석
→ 결과 작성
→ 필요하면 재검토
→ 최종 답변
```

## 2. 왜 필요한가?

우리 프로젝트의 AI Report 기능은 단순 문장 생성보다 복잡하다. AI는 HR 데이터를 조회하고, 어떤 분석이 필요한지 판단하고, 리포트를 작성해야 한다.

예를 들어 사용자가 이렇게 요청할 수 있다.

```text
"이번 달 개발팀의 이직 위험 요인을 분석해서 리포트로 만들어줘."
```

이 요청을 처리하려면 AI가 다음 작업을 해야 한다.

| 단계 | 필요한 작업 |
|---|---|
| 1 | "이번 달", "개발팀", "이직 위험"이라는 조건 이해 |
| 2 | 직원 데이터 조회 |
| 3 | 근태, 성과, 만족도 데이터 조회 |
| 4 | 이직 위험 요인 계산 |
| 5 | 결과를 리포트 형식으로 작성 |
| 6 | 개인정보나 과도한 판단 표현이 없는지 검토 |

이런 복합 작업에는 AI Agent 설계가 필요하다.

## 3. 핵심 용어 정리

| 용어 | 설명 |
|---|---|
| Agent | 목표 달성을 위해 스스로 단계와 도구를 선택하는 AI 시스템 |
| Tool | Agent가 사용할 수 있는 기능. 예: DB 조회, API 호출 |
| Planning | 작업 순서를 계획하는 과정 |
| Memory | 이전 대화나 작업 결과를 기억하는 기능 |
| State | 현재까지의 작업 상태 |
| Reflection | 결과를 다시 검토하고 개선하는 과정 |
| Human-in-the-loop | 중요한 단계에서 사람이 승인하거나 검토하는 방식 |
| Orchestration | 여러 Agent나 작업 단계를 조율하는 구조 |

## 4. AI Agent 설계 패턴

### 4.1 단일 Agent 방식

하나의 Agent가 모든 작업을 처리하는 방식이다.

```text
사용자 요청
→ HR Report Agent
→ 데이터 조회
→ 분석
→ 리포트 생성
```

| 장점 | 단점 |
|---|---|
| 구조가 단순함 | 작업이 복잡해지면 관리가 어려움 |
| 초기 구현이 쉬움 | 역할 분리가 부족함 |

우리 프로젝트 초기 MVP에는 단일 Agent 방식이 적합하다.

### 4.2 Tool Calling Agent 방식

AI가 필요할 때 미리 정의된 도구를 호출하는 방식이다.

```text
사용자 질문
→ Agent
→ get_employees() 호출
→ get_attendance() 호출
→ calculate_kpi() 호출
→ 리포트 생성
```

도구 예시:

| Tool 이름 | 역할 |
|---|---|
| get_employees | 직원 목록 조회 |
| get_attendance_summary | 근태 요약 조회 |
| get_performance_summary | 성과 요약 조회 |
| get_attrition_risk | 이직 위험 데이터 조회 |
| create_report | 리포트 저장 |

이 방식은 우리 프로젝트에서 가장 현실적으로 적용하기 좋다.

### 4.3 ReAct 방식

**ReAct**는 Reasoning과 Acting을 결합한 방식이다. AI가 생각하고, 필요한 행동을 하고, 결과를 관찰한 뒤 다음 행동을 이어간다.

```text
생각: 개발팀 데이터를 조회해야 한다
행동: 직원 조회 Tool 호출
관찰: 개발팀 직원 24명 확인
생각: 근태와 성과 데이터를 추가로 봐야 한다
행동: 근태/성과 Tool 호출
관찰: 지각률 8%, 평균 성과 4.1
최종 답변: 리포트 생성
```

| 장점 | 단점 |
|---|---|
| 복잡한 문제를 단계적으로 해결 가능 | 중간 과정 관리가 필요함 |
| 도구 사용 흐름이 명확함 | 잘못된 도구 선택 가능성이 있음 |

### 4.4 Plan-and-Execute 방식

먼저 전체 계획을 세우고, 이후 각 단계를 실행하는 방식이다.

```text
계획 수립 Agent
→ 1. 데이터 범위 확인
→ 2. 근태 데이터 조회
→ 3. 성과 데이터 조회
→ 4. 위험 요인 분석
→ 5. 리포트 작성

실행 Agent
→ 각 단계 실행
```

이 방식은 리포트 생성처럼 단계가 비교적 명확한 작업에 적합하다.

### 4.5 Router Agent 방식

사용자 요청을 보고 어떤 Agent 또는 기능으로 보낼지 결정하는 방식이다.

```text
사용자 질문
→ Router Agent
  → 근태 질문이면 Attendance Agent
  → 성과 질문이면 Performance Agent
  → 이직 질문이면 Attrition Agent
  → 문서 질문이면 RAG Agent
```

우리 프로젝트가 커지면 다음처럼 나눌 수 있다.

| Agent | 담당 역할 |
|---|---|
| Attendance Agent | 근태 분석 |
| Performance Agent | 성과 분석 |
| Attrition Agent | 이직 위험 분석 |
| Document Agent | HR 문서 검색 |
| Report Agent | 최종 리포트 작성 |

### 4.6 Supervisor / Multi-Agent 방식

여러 Agent가 있고, 상위 Supervisor가 작업을 배분하고 결과를 모으는 방식이다.

```text
Supervisor Agent
→ Attendance Agent
→ Performance Agent
→ Satisfaction Agent
→ Report Writer Agent
→ Reviewer Agent
```

| 장점 | 단점 |
|---|---|
| 복잡한 업무를 역할별로 나눌 수 있음 | 구현 난이도가 높음 |
| 전문 Agent를 만들 수 있음 | 비용과 응답 시간이 증가할 수 있음 |

### 4.7 Reflection 방식

AI가 만든 결과를 다시 검토하고 수정하는 방식이다.

```text
리포트 초안 생성
→ 검토 Agent가 오류 확인
→ 민감한 표현 수정
→ 최종 리포트 생성
```

HR 리포트에서는 특히 중요하다. 예를 들어 “이 직원은 곧 퇴사할 가능성이 높다”처럼 단정적인 표현은 위험하다. 대신 “이직 위험 신호가 관찰되므로 면담이나 업무 부담 점검이 필요하다”처럼 표현해야 한다.

### 4.8 Human-in-the-loop 방식

AI가 모든 것을 자동으로 처리하지 않고, 중요한 단계에서 사람이 확인하는 방식이다.

```text
AI 리포트 초안 생성
→ HR 담당자 검토
→ 승인 또는 수정 요청
→ 최종 리포트 저장
```

HR 데이터는 민감하므로 우리 프로젝트에서는 이 방식을 적극 고려해야 한다.

## 5. 우리 프로젝트 추천 설계

초기 MVP에서는 너무 복잡한 Multi-Agent보다 다음 구조가 적합하다.

```text
사용자 요청
→ Router
→ Tool Calling Agent
→ HR DB 조회
→ 통계 계산
→ LLM 리포트 생성
→ 검토 단계
→ 최종 리포트 저장
```

단계별 추천:

| 개발 단계 | 추천 방식 |
|---|---|
| MVP | 단일 Agent + Tool Calling |
| 기능 확장 | Router Agent |
| 리포트 품질 개선 | Reflection |
| 민감 데이터 검토 | Human-in-the-loop |
| 대규모 기능 | Supervisor / Multi-Agent |

## 6. 주의할 점

- Agent가 모든 판단을 자동으로 하게 만들면 위험하다.
- HR 데이터 기반 판단은 반드시 **근거 데이터**를 함께 보여줘야 한다.
- 개인정보를 Tool 결과로 너무 많이 넘기지 않도록 제한해야 한다.
- Agent가 호출할 수 있는 Tool은 명확히 정의해야 한다.
- 리포트 생성, 삭제, 외부 전송 같은 중요한 작업은 사람의 승인이 필요하다.

## 7. 우리 프로젝트 적용 정리

우리 프로젝트에서 AI Agent는 다음 역할을 맡을 수 있다.

| 기능 | Agent 적용 방식 |
|---|---|
| AI Report 생성 | Tool Calling Agent가 HR 데이터를 조회하고 리포트 생성 |
| HR 챗봇 | Router Agent가 문서 질문과 데이터 질문을 구분 |
| 이직 위험 분석 | Plan-and-Execute 방식으로 데이터 조회와 분석 단계 분리 |
| 리포트 검토 | Reflection 방식으로 표현과 오류 점검 |
| 관리자 승인 | Human-in-the-loop 방식 적용 |

가장 현실적인 시작점은 **Tool Calling 기반 단일 Agent**이다. 이후 기능이 많아지면 Router와 Reflection을 추가하는 방식으로 확장하는 것이 좋다.

참고 자료:
- OpenAI Agents 소개: https://openai.com/index/new-tools-for-building-agents/
- OpenAI Agents SDK 소개: https://openai.com/index/the-next-evolution-of-the-agents-sdk
- LangGraph Overview: https://langchain-5e9cc07a.mintlify.app/oss/python/langgraph/overview
