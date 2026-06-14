"""
============================================================
Claude API 호출 테스트 코드
- 목적   : 가설 5(연차 미사용 누적) 기반 근로자 인사이트 생성
- 대상   : LLM팀 (박수용, 도형준)
- 모델   : claude-haiku-4-5 (개발/테스트용) → 나중에 sonnet으로 교체
- 작성일 : 2026-06-14
============================================================

【실행 전 준비】
1. pip install anthropic
2. 환경변수 설정:
   - Mac/Linux: export ANTHROPIC_API_KEY="sk-ant-..."
   - Windows  : set ANTHROPIC_API_KEY="sk-ant-..."
   - Colab    : import os; os.environ["ANTHROPIC_API_KEY"] = "sk-ant-..."

【실행 방법】
   python claude_api_test.py
"""

import os
import json
from anthropic import Anthropic

# ============================================================
# 1단계: 클라이언트 초기화
#   Anthropic() 는 자동으로 환경변수 ANTHROPIC_API_KEY를 읽는다.
#   API 키를 코드에 직접 넣으면 절대 안 됨! (GitHub에 올라가면 큰일)
# ============================================================
client = Anthropic()


# ============================================================
# 2단계: 가짜(예시) 점수 데이터 정의
#   실제로는 DB에서 꺼내온 데이터가 여기 들어온다.
#   지금은 테스트용이므로 직접 숫자를 넣는다.
#   가명처리 원칙: 이름 대신 EMP_SEQ(직원 ID) 사용
# ============================================================
sample_data = {
    "emp_seq": "E007",          # 직원 ID (실명 대신 사용 — 가명처리)
    "dept_name": "개발팀",       # 부서명

    # --- 연차 관련 (가설 5 핵심) ---
    "leave_given": 15,           # 올해 부여된 연차 일수 (HR_LEAVE_GIVE.LEAVE_DAY_CNT)
    "leave_used": 2,             # 올해 실제 사용한 연차 일수 (HR_LEAVE 승인건 합산)
    "leave_remaining": 13,       # 남은 연차 = 부여 - 사용

    # --- 번아웃 관련 참고 데이터 (가설 1 연결) ---
    "overtime_weeks": 4,         # 최근 초과근무 누적 주수 (HR_OVRTM_WOR)
    "task_completion_rate": 0.88, # 업무일지 완료율 (HR_TASK_LOG.CMPLT_YN)

    # --- 목표 관련 (가설 3 참고) ---
    "aim_achievement_rate": 0.72, # 목표 달성률 (HR_AIM.CRNT_ACHV_RATE)

    # --- 종합 점수 (4개 합산) ---
    "goal_score": 72,            # 목표점수
    "task_score": 88,            # 업무일지점수
    "attend_score": 65,          # 근태점수
    "leave_score": 20,           # 연차점수 (낮을수록 미사용 누적)
    "total_score": 61,           # 회사 종합점수
}


# ============================================================
# 3단계: 시스템 프롬프트 정의
#   시스템 프롬프트 = AI에게 "너는 어떤 역할이야"를 알려주는 지시문
#   여기서 출력 형식, 말투, 금지 사항을 명확히 지정한다.
# ============================================================
SYSTEM_PROMPT = """
너는 HR 데이터를 분석하는 전문 AI 어시스턴트야.
근로자의 인사 데이터를 받아서 개인 인사이트 리포트를 작성한다.

【출력 규칙】
1. 반드시 JSON 형식으로만 출력한다. 다른 텍스트(설명, 마크다운 등)는 절대 포함하지 마라.
2. JSON 구조는 아래와 같다:
   {
     "ai_summary": "전체 총평 (2~3문장, 부드러운 말투)",
     "leave_insight": "연차 관련 개인 인사이트 (1~2문장)",
     "burnout_risk": "낮음 / 보통 / 높음 중 하나만",
     "burnout_message": "번아웃 관련 부드러운 제안 (1문장)",
     "action": "근로자가 지금 바로 할 수 있는 구체적 행동 (1문장)"
   }

【말투 규칙】
- 경고·강요 표현 금지: "위험합니다", "반드시 해야 합니다" 같은 표현 사용하지 마라.
- 부드럽고 응원하는 말투 사용: "어떨까요?", "도움이 될 수 있어요" 수준
- 특정 직원을 단정적으로 평가하지 마라.
- 직원 이름 언급 금지 (ID만 참고용으로 사용).
""".strip()


# ============================================================
# 4단계: 사용자 프롬프트 생성 함수
#   데이터를 JSON 문자열로 변환해서 Claude에게 넘긴다.
#   Claude는 이 데이터를 읽고 인사이트를 생성한다.
# ============================================================
def build_user_prompt(data: dict) -> str:
    """
    입력 데이터를 Claude에게 전달할 프롬프트 문자열로 변환한다.

    Args:
        data (dict): 직원 점수 데이터

    Returns:
        str: Claude에게 전달할 프롬프트 문자열
    """
    # json.dumps: Python 딕셔너리 → JSON 문자열 변환
    # ensure_ascii=False: 한국어가 깨지지 않게
    # indent=2: 보기 좋게 들여쓰기
    data_str = json.dumps(data, ensure_ascii=False, indent=2)

    return f"""
아래는 직원 {data['emp_seq']}의 이번 주 HR 데이터야.
이 데이터를 분석해서 근로자용 개인 인사이트 리포트를 JSON 형식으로 작성해줘.

[HR 데이터]
{data_str}

[참고]
- leave_score가 낮을수록 연차를 안 쓰고 있다는 의미야.
- overtime_weeks가 길수록 최근 초과근무가 많다는 의미야.
- 두 가지가 동시에 나타나면 번아웃 위험 신호로 판단해.
""".strip()


# ============================================================
# 5단계: Claude API 호출 함수
#   실제로 Claude에게 요청을 보내고 응답을 받는 핵심 부분
# ============================================================
def call_claude_api(data: dict) -> dict:
    """
    직원 데이터를 Claude API에 전달하고 인사이트 JSON을 받아 반환한다.

    Args:
        data (dict): 직원 점수 데이터

    Returns:
        dict: Claude가 생성한 인사이트 (JSON 파싱 완료)

    Raises:
        ValueError: Claude 응답이 JSON으로 파싱되지 않을 경우
    """

    # Claude API 호출
    # - model: 개발/테스트는 haiku(빠르고 저렴), 최종 데모는 sonnet으로 교체
    # - max_tokens: 출력 최대 길이 (1000 토큰 ≈ 약 700~800 한국어 글자)
    # - system: 시스템 프롬프트 (역할 지정)
    # - messages: 실제 대화 내용 (role: "user" = 우리가 보내는 질문)
    response = client.messages.create(
        model="claude-haiku-4-5",          # 개발용 모델 (저렴하고 빠름)
        max_tokens=1000,                    # 출력 최대 길이
        system=SYSTEM_PROMPT,              # 역할 지정
        messages=[
            {
                "role": "user",
                "content": build_user_prompt(data)  # 우리가 보내는 질문
            }
        ]
    )

    # response.content[0].text: Claude의 실제 응답 텍스트 추출
    # response.content는 리스트 → [0] = 첫 번째 응답 블록
    raw_text = response.content[0].text

    # Claude가 JSON 형식으로 답했는지 파싱 시도
    # json.loads: JSON 문자열 → Python 딕셔너리 변환
    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError:
        # 파싱 실패 시 원본 텍스트와 함께 오류 반환
        raise ValueError(f"Claude가 JSON 형식으로 응답하지 않았습니다.\n원본 응답:\n{raw_text}")

    # 토큰 사용량 출력 (비용 추적용)
    print(f"\n[토큰 사용량]")
    print(f"  입력 토큰: {response.usage.input_tokens}")
    print(f"  출력 토큰: {response.usage.output_tokens}")
    print(f"  합계     : {response.usage.input_tokens + response.usage.output_tokens}")

    return result


# ============================================================
# 6단계: 결과 출력 함수
#   Claude의 응답을 보기 좋게 출력한다.
# ============================================================
def print_result(data: dict, insight: dict) -> None:
    """
    입력 데이터와 Claude 인사이트를 보기 좋게 출력한다.

    Args:
        data   (dict): 원본 직원 데이터
        insight (dict): Claude가 생성한 인사이트
    """
    print("\n" + "="*60)
    print(f"📋 직원 {data['emp_seq']} ({data['dept_name']}) 개인 인사이트 리포트")
    print("="*60)

    print(f"\n📊 [입력 데이터 요약]")
    print(f"  연차 부여: {data['leave_given']}일  |  사용: {data['leave_used']}일  |  남은 연차: {data['leave_remaining']}일")
    print(f"  초과근무: 최근 {data['overtime_weeks']}주 연속")
    print(f"  종합점수: {data['total_score']}점")

    print(f"\n🤖 [AI 총평]")
    print(f"  {insight.get('ai_summary', '없음')}")

    print(f"\n📅 [연차 인사이트]")
    print(f"  {insight.get('leave_insight', '없음')}")

    print(f"\n⚠️ [번아웃 위험도]")
    risk = insight.get('burnout_risk', '없음')
    risk_icon = {"낮음": "🟢", "보통": "🟡", "높음": "🔴"}.get(risk, "⚪")
    print(f"  {risk_icon} {risk}")
    print(f"  → {insight.get('burnout_message', '없음')}")

    print(f"\n✅ [권장 액션]")
    print(f"  {insight.get('action', '없음')}")

    print("\n" + "="*60)
    print("📎 [Claude 원본 JSON 응답]")
    print(json.dumps(insight, ensure_ascii=False, indent=2))


# ============================================================
# 7단계: 메인 실행
#   이 파일을 직접 실행하면 아래 코드가 동작한다.
#   (다른 파일에서 import 할 때는 실행되지 않음)
# ============================================================
if __name__ == "__main__":

    print("🚀 Claude API 호출 테스트 시작...")
    print(f"📦 테스트 대상: 직원 {sample_data['emp_seq']}")

    # API 키가 환경변수에 설정되어 있는지 먼저 확인
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("\n❌ 오류: ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
        print("   설정 방법: export ANTHROPIC_API_KEY='sk-ant-...'")
        exit(1)

    # Claude API 호출 및 오류 처리
    try:
        print("\n⏳ Claude API 호출 중...")
        insight = call_claude_api(sample_data)

        # 결과 출력
        print_result(sample_data, insight)

        print("\n✅ 테스트 성공! Discord에 결과 스크린샷 공유해줘.")

    except ValueError as e:
        # JSON 파싱 실패
        print(f"\n❌ JSON 파싱 오류: {e}")

    except Exception as e:
        # 기타 오류 (네트워크, API 키 오류 등)
        print(f"\n❌ API 호출 오류: {type(e).__name__}: {e}")
        print("   → API 키 확인, 네트워크 상태 확인, anthropic 패키지 설치 확인")
