# Workspace + Workspace MCP 알아보기

> 파일명: `workspace_mcp.md`

## 1. 개념

**Workspace**는 팀이 함께 일하는 공간을 의미한다. 문서, 코드, 디자인, 일정, 데이터 등이 모여 있는 협업 환경이다.

대표적인 Workspace 도구는 다음과 같다.

| 도구 | 용도 |
|---|---|
| Notion | 기획 문서, 회의록, 기술 조사 정리 |
| GitHub | 코드 저장소, 이슈, Pull Request 관리 |
| Figma | UI/UX 디자인, 화면 설계 |
| Google Drive | 파일 공유, 문서 관리 |
| Slack / Teams | 팀 커뮤니케이션 |
| Database | 서비스 운영 데이터 저장 |

**MCP(Model Context Protocol)**는 AI가 외부 도구나 데이터에 연결될 수 있도록 하는 표준 방식이다. 쉽게 말해, AI가 Notion, GitHub, Figma, DB 같은 도구와 안전하게 대화할 수 있게 해주는 연결 규칙이다.

## 2. 왜 필요한가?

AI Report 기능을 제대로 만들려면 AI가 HR 데이터뿐만 아니라 프로젝트 문서, 디자인, 이슈, DB 정보도 참고할 수 있어야 한다.

예를 들어 AI가 다음 일을 할 수 있다.

| 예시 | 설명 |
|---|---|
| Notion 문서 요약 | 회의록과 기획서를 요약 |
| GitHub 이슈 정리 | 남은 개발 작업과 버그 목록 정리 |
| Figma 디자인 참고 | 화면 설계 기준 확인 |
| DB 조회 | 직원, 근태, 성과 데이터 조회 |
| 리포트 생성 | 여러 자료를 바탕으로 HR 리포트 작성 |

Workspace MCP는 이런 외부 도구를 AI와 연결하는 역할을 한다.

## 3. 핵심 용어 정리

| 용어 | 설명 |
|---|---|
| Workspace | 팀의 문서, 코드, 디자인, 데이터가 모인 작업 공간 |
| MCP | AI와 외부 도구를 연결하는 표준 프로토콜 |
| MCP Host | AI 앱을 실행하는 환경. 예: AI 도구 클라이언트 |
| MCP Client | MCP 서버와 연결되는 클라이언트 구성 요소 |
| MCP Server | 특정 도구나 데이터에 접근하는 기능을 제공 |
| Resource | AI가 참고할 수 있는 데이터. 예: 문서, 파일, DB 내용 |
| Tool | AI가 실행할 수 있는 기능. 예: 이슈 생성, DB 조회 |
| Prompt | 자주 쓰는 작업 지시문 템플릿 |
| Permission | 어떤 데이터와 기능에 접근 가능한지 정하는 권한 |

## 4. 동작 흐름 또는 구조

기본 구조:

```text
사용자
→ AI Assistant
→ MCP Client
→ MCP Server
→ 외부 도구
→ 결과 반환
→ AI가 요약/분석/작성
```

Workspace MCP 예시:

```text
AI Assistant
→ Notion MCP Server
→ 프로젝트 기획 문서 조회

AI Assistant
→ GitHub MCP Server
→ 이슈와 PR 상태 조회

AI Assistant
→ Figma MCP Server
→ 화면 디자인 정보 조회

AI Assistant
→ HR DB MCP Server
→ 직원/근태/성과 데이터 조회
```

우리 프로젝트 구조:

```text
프로젝트 문서
코드 저장소
디자인 파일
HR 데이터베이스
      ↓
Workspace MCP
      ↓
AI Report 생성기
      ↓
HR 리포트 / 챗봇 답변 / 개발 지원
```

## 5. 사용 예시

Notion 문서 요약:

```text
사용자:
"이번 주 회의록에서 AI Report 관련 결정사항 정리해줘."

AI:
Notion 문서 조회
→ 핵심 결정사항 추출
→ 작업 목록으로 정리
```

GitHub 이슈 정리:

```text
사용자:
"AI Report 기능 관련 아직 안 끝난 이슈 정리해줘."

AI:
GitHub 이슈 조회
→ label: ai-report 필터링
→ 담당자와 상태 요약
```

Figma 디자인 참고:

```text
사용자:
"리포트 화면 디자인 기준을 참고해서 프론트엔드 구현 포인트 알려줘."

AI:
Figma 화면 구조 조회
→ 색상, 컴포넌트, 레이아웃 요약
```

DB 조회 예시:

```text
사용자:
"개발팀의 이번 달 결근률과 성과 평균을 바탕으로 리포트 초안 작성해줘."

AI:
HR DB 조회
→ 통계 계산
→ 리포트 초안 생성
```

## 6. 장점

- AI가 단순 대화가 아니라 실제 업무 도구와 연결될 수 있다.
- 프로젝트 문서, 코드, 디자인, 데이터를 한 흐름에서 활용할 수 있다.
- 회의록 요약, 이슈 정리, 리포트 생성 같은 반복 업무를 자동화할 수 있다.
- 팀원이 필요한 정보를 직접 찾는 시간을 줄일 수 있다.
- AI Report 기능이 더 실제 서비스처럼 동작할 수 있다.

## 7. 주의할 점

- **모든 도구 접근에는 권한 관리가 필요하다.**
- HR DB에는 개인정보가 있으므로 AI가 접근할 수 있는 범위를 제한해야 한다.
- Notion, GitHub, Figma 토큰이 노출되지 않도록 관리해야 한다.
- AI가 외부 도구를 실행할 때 삭제, 수정 같은 위험한 작업은 승인 절차가 필요하다.
- MCP 서버별로 접근 로그를 남겨야 문제가 생겼을 때 추적할 수 있다.

## 8. 우리 프로젝트 적용 정리

우리 프로젝트에서는 Workspace MCP를 통해 문서, 코드, 디자인, HR DB를 AI와 연결할 수 있다.

| 연결 대상 | 활용 방향 |
|---|---|
| Notion | 기술 조사 자료, 회의록, 요구사항 요약 |
| GitHub | 이슈 정리, PR 요약, 코드 변경 내용 분석 |
| Figma | 리포트 화면 디자인 참고 |
| Google Drive | 참고 문서, 보고서 파일 검색 |
| HR DB | 직원, 근태, 성과 데이터 조회 |
| AI Report | 여러 Workspace 자료를 바탕으로 리포트 생성 |

추천 적용 방식:

```text
1단계: Notion/GitHub/Figma는 프로젝트 관리용으로 연결
2단계: HR DB는 읽기 전용으로 제한 연결
3단계: AI Report 생성 시 필요한 데이터만 조회
4단계: 개인정보는 마스킹 또는 익명화
5단계: 관리자 권한에서만 민감 데이터 접근 허용
```

참고 자료:
- MCP 공식 Specification: https://modelcontextprotocol.io/specification/2025-11-25/basic
- MCP Server Overview: https://modelcontextprotocol.io/specification/2025-11-25/server/index
- MCP Transport 문서: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
