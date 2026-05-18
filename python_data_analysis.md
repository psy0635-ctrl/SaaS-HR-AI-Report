# Python 데이터 분석 라이브러리 알아보기

> 파일명: `python_data_analysis.md`

## 1. 개념

**Python 데이터 분석 라이브러리**는 CSV, Excel, JSON 같은 데이터를 읽고, 정리하고, 계산하고, 시각화하는 데 사용하는 도구이다.

우리 프로젝트의 AI Report 기능은 HR 데이터를 기반으로 한다. 따라서 AI에게 데이터를 바로 넘기기 전에, 먼저 Python으로 데이터를 정리하고 통계를 계산하는 과정이 필요하다.

예를 들어 다음과 같은 질문에 답하려면 데이터 분석이 필요하다.

```text
이번 달 개발팀의 지각률은?
부서별 평균 성과 점수는?
만족도가 낮은 팀은 어디인가?
이직 위험이 높은 직원의 공통 특징은?
```

## 2. 왜 필요한가?

LLM은 문장을 잘 만들지만, 원본 데이터를 직접 정확하게 계산하는 데에는 한계가 있다. 그래서 **정확한 계산은 Python 데이터 분석 라이브러리로 처리하고, 해석과 문장화는 AI가 담당**하는 구조가 좋다.

| 구분 | 담당 역할 |
|---|---|
| Python 데이터 분석 | 데이터 정리, 통계 계산, 차트 생성 |
| LLM | 결과 해석, 요약, 리포트 문장 생성 |
| 백엔드 API | 분석 요청 처리, 결과 저장 |
| 프론트엔드 | 대시보드와 리포트 화면 표시 |

## 3. 핵심 라이브러리 정리

| 라이브러리 | 주요 역할 | HR 프로젝트 활용 |
|---|---|---|
| pandas | 표 형태 데이터 처리 | 직원, 근태, 성과 데이터 정리 |
| NumPy | 숫자 계산, 배열 처리 | 평균, 표준편차, 벡터 계산 |
| Matplotlib | 기본 그래프 생성 | 선 그래프, 막대 그래프 |
| Seaborn | 통계 시각화 | 상관관계, 분포, 박스플롯 |
| Plotly | 인터랙티브 차트 | 대시보드용 동적 차트 |
| scikit-learn | 머신러닝 분석 | 이직 위험 예측, 군집 분석 |
| openpyxl | Excel 파일 읽기/쓰기 | HR Excel 업로드 처리 |
| Jupyter Notebook | 분석 실험 환경 | 데이터 탐색과 시각화 실습 |

## 4. 라이브러리별 설명

### 4.1 pandas

**pandas**는 Python에서 표 형태 데이터를 다루는 대표 라이브러리이다. Excel처럼 행과 열로 된 데이터를 읽고, 필터링하고, 그룹별로 계산할 수 있다.

| 기능 | 예시 |
|---|---|
| 파일 읽기 | CSV, Excel 파일 불러오기 |
| 데이터 정리 | 결측치 제거, 중복 제거 |
| 그룹 계산 | 부서별 평균 성과 점수 |
| 필터링 | 결근 횟수가 많은 직원 찾기 |
| 병합 | 직원 정보와 성과 데이터 연결 |

예시 코드:

```python
import pandas as pd

employees = pd.read_csv("employees.csv")
performance = pd.read_csv("performance.csv")

merged = employees.merge(performance, on="employee_id")
department_score = merged.groupby("department")["performance_score"].mean()

print(department_score)
```

### 4.2 NumPy

**NumPy**는 숫자 계산을 빠르게 처리하는 라이브러리이다. pandas 내부에서도 NumPy가 많이 사용된다.

| 기능 | 예시 |
|---|---|
| 평균 계산 | 평균 근무 시간 |
| 표준편차 계산 | 성과 점수 편차 |
| 배열 연산 | 여러 직원의 점수 한 번에 계산 |
| 벡터 계산 | 임베딩 벡터 유사도 계산 |

예시 코드:

```python
import numpy as np

scores = np.array([4.2, 3.8, 4.5, 2.9, 3.4])

print(np.mean(scores))
print(np.std(scores))
```

### 4.3 Matplotlib

**Matplotlib**은 Python의 기본 그래프 라이브러리이다. 막대 그래프, 선 그래프, 원 그래프 등을 만들 수 있다.

예시 코드:

```python
import matplotlib.pyplot as plt

departments = ["개발팀", "영업팀", "인사팀"]
late_rates = [0.08, 0.12, 0.04]

plt.bar(departments, late_rates)
plt.title("부서별 지각률")
plt.show()
```

### 4.4 Seaborn

**Seaborn**은 Matplotlib 위에서 동작하는 통계 시각화 라이브러리이다. 데이터 분포, 상관관계, 박스플롯을 보기 좋게 만들 수 있다.

| 차트 | 활용 예시 |
|---|---|
| heatmap | 성과, 만족도, 초과근무 간 상관관계 |
| boxplot | 부서별 성과 점수 분포 |
| histogram | 근속연수 분포 |
| scatterplot | 초과근무 시간과 만족도 관계 |

예시 코드:

```python
import seaborn as sns

sns.boxplot(data=df, x="department", y="performance_score")
```

### 4.5 Plotly

**Plotly**는 웹 대시보드에 적합한 인터랙티브 차트를 만들 수 있는 라이브러리이다. 사용자가 마우스를 올리면 상세 값이 보이고, 확대/축소도 가능하다.

| 기능 | 활용 예시 |
|---|---|
| 인터랙티브 막대 그래프 | 부서별 성과 비교 |
| 인터랙티브 선 그래프 | 월별 이직률 추세 |
| 대시보드 연동 | KPI 화면에 차트 삽입 |

예시 코드:

```python
import plotly.express as px

fig = px.line(df, x="month", y="attrition_rate", color="department")
fig.show()
```

### 4.6 scikit-learn

**scikit-learn**은 Python의 대표적인 머신러닝 라이브러리이다. 분류, 회귀, 군집 분석, 데이터 전처리 등을 할 수 있다.

우리 프로젝트에서는 다음처럼 활용할 수 있다.

| 기능 | HR 활용 예시 |
|---|---|
| 분류 | 이직 여부 예측 |
| 회귀 | 성과 점수 예측 |
| 군집 분석 | 비슷한 근무 패턴 직원 그룹 찾기 |
| 전처리 | 숫자형/범주형 데이터 변환 |
| 평가 지표 | 예측 정확도, 정밀도, 재현율 계산 |

## 5. HR AI Report 분석 흐름

```text
CSV / Excel 데이터
→ pandas로 읽기
→ 결측치와 이상치 정리
→ NumPy로 통계 계산
→ Seaborn/Plotly로 시각화
→ scikit-learn으로 예측 분석
→ 요약 결과를 LLM에 전달
→ AI Report 생성
```

## 6. 사용 예시

예시 목표:

```text
"부서별 지각률과 성과 점수를 분석해서 AI 리포트를 만들고 싶다."
```

처리 흐름:

| 단계 | 사용 도구 | 설명 |
|---|---|---|
| 1 | pandas | 직원, 근태, 성과 CSV 불러오기 |
| 2 | pandas | employee_id 기준으로 데이터 병합 |
| 3 | NumPy | 평균, 비율, 표준편차 계산 |
| 4 | Seaborn | 부서별 성과 분포 시각화 |
| 5 | Plotly | 대시보드용 차트 생성 |
| 6 | LLM API | 분석 결과를 자연어 리포트로 변환 |

## 7. 주의할 점

- 데이터 분석 결과는 **원본 데이터 품질**에 크게 영향을 받는다.
- 결측치와 이상치를 처리하지 않으면 잘못된 리포트가 생성될 수 있다.
- HR 데이터는 개인정보가 많으므로 분석용 데이터는 익명화하는 것이 좋다.
- 차트는 보기 좋게 만드는 것보다 의미가 정확한 것이 더 중요하다.
- 머신러닝 예측 결과를 인사 평가에 바로 사용하는 것은 위험하므로 참고용으로 제한해야 한다.

## 8. 우리 프로젝트 적용 정리

우리 프로젝트에서는 Python 데이터 분석 라이브러리를 다음처럼 활용할 수 있다.

| 목적 | 추천 라이브러리 | 활용 방식 |
|---|---|---|
| 데이터 업로드 처리 | pandas, openpyxl | CSV/Excel HR 데이터 읽기 |
| 통계 계산 | pandas, NumPy | 부서별 평균, 결근률, 이직률 계산 |
| 시각화 | Matplotlib, Seaborn, Plotly | 대시보드 차트 생성 |
| 예측 분석 | scikit-learn | 이직 위험 예측 실험 |
| AI Report 입력 생성 | pandas | LLM에 전달할 요약 데이터 생성 |

가장 먼저 익혀야 할 라이브러리는 **pandas**이다. 그다음 시각화는 **Seaborn 또는 Plotly**, 예측 분석은 **scikit-learn** 순서로 학습하는 것이 좋다.

참고 자료:
- pandas User Guide: https://pandas.pydata.org/docs/user_guide/
- NumPy Documentation: https://numpy.org/doc/stable
- Matplotlib Documentation: https://matplotlib.org/stable/
- Seaborn Documentation: https://seaborn.pydata.org/
- Plotly Python Documentation: https://plotly.com/python/getting-started/
- scikit-learn User Guide: https://scikit-learn.org/stable/user_guide.html
