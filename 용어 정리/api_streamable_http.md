# RESTful API / Streamable HTTP 알아보기

> 파일명: `api_streamable_http.md`

## 1. 개념

**API(Application Programming Interface)**는 서로 다른 프로그램이 데이터를 주고받기 위한 약속이다.

우리 프로젝트에서는 프론트엔드가 백엔드에 “리포트 목록을 줘”, “AI 리포트를 생성해줘”, “직원 목록을 조회해줘”라고 요청해야 한다. 이때 사용하는 통신 규칙이 API다.

**RESTful API**는 HTTP 주소와 메서드를 이용해 자원을 다루는 API 설계 방식이다.

**Streamable HTTP**는 서버가 응답을 한 번에 모두 보내는 것이 아니라, 생성되는 내용을 **조각 단위로 계속 보내는 방식**이다. AI 챗봇 답변처럼 긴 응답을 실시간으로 보여줄 때 유용하다.

## 2. 왜 필요한가?

우리 프로젝트는 프론트엔드, 백엔드, AI 기능이 분리되어 있다. 따라서 각 영역이 안정적으로 통신할 수 있는 API가 필요하다.

| 필요한 이유 | 설명 |
|---|---|
| 화면과 서버 연결 | 프론트엔드가 백엔드 데이터를 가져옴 |
| AI Report 생성 | 사용자가 버튼을 누르면 백엔드가 AI 생성 요청 처리 |
| 데이터 조회 | 직원, 근태, 성과 데이터를 API로 조회 |
| 실시간 응답 | AI 챗봇 답변을 한 글자 또는 문장 단위로 표시 |
| 기능 분리 | 프론트엔드와 백엔드를 독립적으로 개발 가능 |

## 3. 핵심 용어 정리

| 용어 | 설명 |
|---|---|
| API | 프로그램끼리 요청과 응답을 주고받는 약속 |
| REST | 자원을 URL로 표현하고 HTTP 메서드로 조작하는 방식 |
| Endpoint | API 주소. 예: `/reports` |
| Request | 클라이언트가 서버에 보내는 요청 |
| Response | 서버가 클라이언트에 보내는 응답 |
| JSON | API 응답에 많이 쓰는 데이터 형식 |
| HTTP Method | GET, POST, PUT, PATCH, DELETE 같은 요청 방식 |
| Streaming | 응답을 한 번에 보내지 않고 나누어 보내는 방식 |
| SSE | 서버가 브라우저로 이벤트를 계속 보내는 HTTP 기반 방식 |

HTTP 메서드 차이:

| 메서드 | 의미 | HR 프로젝트 예시 |
|---|---|---|
| GET | 데이터 조회 | `GET /reports` 리포트 목록 조회 |
| POST | 데이터 생성 또는 실행 | `POST /reports` AI 리포트 생성 |
| PUT | 전체 수정 | `PUT /employees/1` 직원 정보 전체 수정 |
| PATCH | 일부 수정 | `PATCH /employees/1` 직급만 수정 |
| DELETE | 삭제 | `DELETE /reports/1` 리포트 삭제 |

## 4. 동작 흐름 또는 구조

일반 REST API 흐름:

```text
사용자
→ 프론트엔드에서 버튼 클릭
→ 백엔드 API 요청
→ 데이터베이스 조회 또는 저장
→ JSON 응답
→ 프론트엔드 화면 업데이트
```

AI Report 생성 흐름:

```text
사용자
→ "AI Report 생성" 클릭
→ POST /reports 요청
→ 백엔드가 HR 데이터 조회
→ AI 모델 호출
→ 리포트 저장
→ 생성된 리포트 반환
```

Streamable HTTP 흐름:

```text
사용자
→ POST /chat 요청
→ 백엔드가 AI 모델 호출
→ AI 답변 일부 생성
→ 프론트엔드에 조각 전송
→ 다음 조각 전송
→ 답변 완료
```

## 5. 사용 예시

우리 프로젝트에서 사용할 수 있는 API 예시:

| API | 설명 | 응답 예시 |
|---|---|---|
| `GET /reports` | AI 리포트 목록 조회 | 리포트 목록 |
| `POST /reports` | 새 AI 리포트 생성 | 생성된 리포트 |
| `GET /employees` | 직원 목록 조회 | 직원 데이터 |
| `GET /dashboard/kpi` | 대시보드 KPI 조회 | 이직률, 결근률 등 |
| `POST /chat` | HR 챗봇 질문 전송 | AI 답변 |

`POST /reports` 요청 예시:

```json
{
  "department": "개발팀",
  "period": "2026-05",
  "reportType": "attendance_performance"
}
```

응답 예시:

```json
{
  "reportId": 101,
  "title": "2026년 5월 개발팀 근태 및 성과 리포트",
  "summary": "개발팀의 출근 준수율은 94%이며 성과 평균은 4.1점입니다.",
  "createdAt": "2026-05-18T10:30:00"
}
```

스트리밍 챗봇 예시:

```text
사용자: "이번 달 이직 위험 요약해줘."

화면 출력:
"이번 달..."
"이번 달 이직..."
"이번 달 이직 위험이 높은 부서는..."
```

## 6. 장점

- 프론트엔드와 백엔드를 명확히 분리할 수 있다.
- URL과 HTTP 메서드만 봐도 기능을 이해하기 쉽다.
- 모바일 앱, 웹, 외부 시스템과 연동하기 좋다.
- AI 답변을 스트리밍하면 사용자가 기다리는 느낌이 줄어든다.
- API 문서화가 쉬워 팀원 간 협업에 유리하다.

## 7. 주의할 점

- API마다 인증 토큰을 확인해야 한다.
- HR 데이터는 민감하므로 권한 없는 사용자가 접근하면 안 된다.
- `POST /reports`처럼 비용이 드는 AI 요청은 호출 횟수 제한이 필요하다.
- 스트리밍 응답은 중간에 연결이 끊길 수 있으므로 예외 처리가 필요하다.
- API URL과 응답 형식을 팀 내에서 미리 정해야 한다.

## 8. 우리 프로젝트 적용 정리

우리 프로젝트에서는 RESTful API를 기본 통신 방식으로 사용하고, AI 챗봇이나 긴 리포트 생성에는 Streamable HTTP를 적용하는 것이 좋다.

| 기능 | API 방식 | 설명 |
|---|---|---|
| 리포트 목록 | `GET /reports` | 저장된 AI 리포트 조회 |
| 리포트 생성 | `POST /reports` | HR 데이터를 기반으로 리포트 생성 |
| 직원 조회 | `GET /employees` | 직원 목록 및 상세 정보 조회 |
| KPI 조회 | `GET /dashboard/kpi` | 대시보드 지표 조회 |
| 챗봇 | `POST /chat` + Streaming | AI 답변 실시간 출력 |

추천 흐름:

```text
프론트엔드
→ REST API
→ 백엔드
→ DB 조회
→ AI 모델 호출
→ 일반 JSON 또는 스트리밍 응답
```

참고 자료:
- MDN HTTP Methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods
- MDN Server-Sent Events: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
- MCP Streamable HTTP Transport: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
