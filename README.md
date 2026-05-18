# AI 기반 SaaS HR Report 기술 조사 자료

## 1. 조사 목적

우리 팀은 **SaaS HR 플랫폼 내 AI Report 기능**을 개발하기 위해 필요한 핵심 기술을 조사하였다.

이번 조사의 목적은 단순히 개념을 아는 것이 아니라, 각 기술이 우리 프로젝트에서 어떤 역할을 하는지 이해하고 실제 설계 방향을 잡는 것이다.

## 2. 파일 목록

| 번호 | 주제 | 파일명 |
|---|---|---|
| 1 | SaaS | saas.md |
| 2 | 데이터셋 | dataset.md |
| 3 | LangChain / LangGraph | langchain_langgraph.md |
| 4 | 임베딩 | embedding.md |
| 5 | RESTful API / Streamable HTTP | api_streamable_http.md |
| 6 | Workspace MCP | workspace_mcp.md |
| 7 | SaaS HR 표준 플랫폼 구조와 HR 데이터셋 구조 | saas_hr_structure.md |
| 8 | Python 데이터 분석 라이브러리 | python_data_analysis.md |
| 9 | AI Agent 설계 방식 | ai_agent_design.md |
| 10 | LLM API 활용 방식 | llm_api.md |
| 11 | 소프트웨어 개발 문서 작성과 소통 방식 | software_documentation.md |

## 3. 전체 기술 흐름

```text
SaaS
→ SaaS HR 플랫폼 구조
→ HR 데이터셋
→ Python 데이터 분석
→ 임베딩 / RAG
→ LangChain / LangGraph / AI Agent
→ LLM API
→ RESTful API / Streamable HTTP
→ Workspace MCP
→ 개발 문서와 팀 소통
```

각 기술의 연결 관계는 다음과 같다.

| 단계 | 역할 |
|---|---|
| SaaS | 여러 기업이 웹에서 사용할 수 있는 HR 플랫폼 구조 |
| SaaS HR 구조 | 로그인, 권한, 회사별 데이터 분리, HR DB 구조 설계 |
| 데이터셋 | AI Report 생성을 위한 직원, 근태, 성과, 이직 데이터 |
| Python 데이터 분석 | HR 데이터 정리, 통계 계산, 시각화, 예측 분석 |
| 임베딩 / RAG | HR 문서와 리포트를 의미 기반으로 검색 |
| LangChain / LangGraph / AI Agent | AI가 데이터를 조회하고 리포트를 생성하는 흐름 구성 |
| LLM API | 외부 AI 모델을 호출해 리포트와 챗봇 답변 생성 |
| RESTful API / Streamable HTTP | 프론트엔드와 백엔드, AI 응답 통신 |
| Workspace MCP | Notion, GitHub, Figma, DB 등 외부 도구와 AI 연결 |
| 개발 문서와 소통 | 요구사항, API, DB, PR, 회의록 기준 정리 |

## 4. 최종 정리

각 주제는 따로 떨어진 개념이 아니라, **AI 기반 HR Report 서비스를 만들기 위한 하나의 흐름** 안에서 연결된다.

우리 프로젝트에서는 SaaS 구조를 기반으로 사용자와 기업 데이터를 관리하고, HR 데이터셋을 분석하여 AI Report를 생성한다. Python 데이터 분석 라이브러리로 정확한 통계를 계산하고, 임베딩과 RAG로 HR 문서와 기존 리포트를 검색할 수 있다.

LangChain, LangGraph, AI Agent는 데이터 조회부터 리포트 생성까지의 AI 흐름을 구성하는 데 활용할 수 있다. LLM API는 실제 자연어 리포트와 챗봇 답변을 생성하는 핵심 연결점이며, RESTful API와 Streamable HTTP는 프론트엔드와 백엔드가 이 기능을 사용할 수 있게 해준다.

마지막으로 Workspace MCP를 활용하면 Notion, GitHub, Figma, HR DB 같은 외부 도구와 AI를 연결할 수 있다. 개발 문서와 소통 규칙을 함께 정리하면 팀원들이 같은 기준으로 구현하고 리뷰할 수 있다.
