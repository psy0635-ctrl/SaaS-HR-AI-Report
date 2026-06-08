# GitHub 협업 매뉴얼 - 초보자용

## 0. 이 매뉴얼의 목적

이 문서는 팀원 4명이 같은 방식으로 GitHub를 사용하기 위한 설명서입니다. Git을 잘 모르는 팀원도 그대로 따라 할 수 있게 작성했습니다.

---

## 1. 브랜치 구조 이해

### main
최종 안정 코드만 있는 브랜치입니다. 발표나 제출 가능한 상태만 들어갑니다.

### dev
개발 중인 기능을 모으는 통합 브랜치입니다. 팀원들이 만든 기능은 바로 main으로 가지 않고 dev로 먼저 합쳐집니다.

### feature
각자 맡은 기능을 만드는 브랜치입니다.

예시:

```text
feature/employee-crud
feature/dashboard-ui
feature/ai-report
feature/login
```

---

## 2. 처음 저장소를 만들 때

```bash
git init
git add README.md .gitignore .env.example .env.local.example
git commit -m "chore: 초기 프로젝트 설정"
git branch -M main
git remote add origin 저장소주소
git push -u origin main
```

---

## 3. dev 브랜치 만들기

```bash
git checkout -b dev
git add README_DEV.md CONTRIBUTING.md GIT_MANUAL.md docs .github scripts
git commit -m "docs: 개발 문서 구조 추가"
git push -u origin dev
```

---

## 4. 기능 브랜치 만들기

반드시 dev에서 시작합니다.

```bash
git checkout dev
git pull origin dev
git checkout -b feature/employee-crud
```

---

## 5. 작업 후 커밋하기

```bash
git status
git add .
git commit -m "feat: 직원 목록 CRUD 구현"
git push -u origin feature/employee-crud
```

---

## 6. Pull Request 만들기

GitHub에서 다음 방향으로 PR을 만듭니다.

```text
feature/employee-crud → dev
```

절대 처음부터 main으로 보내지 않습니다.

---

## 7. 팀원이 PR 확인할 때

확인할 것:

- 실행이 되는가?
- 다른 기능을 망가뜨리지 않았는가?
- 파일명이 이상하지 않은가?
- `.env`가 올라오지 않았는가?
- main에 docs를 넣으려 하지 않았는가?

---

## 8. dev에서 main으로 올리는 시점

아래 조건을 만족할 때만 진행합니다.

- dev에서 기능이 정상 동작함
- 발표/제출 가능한 상태임
- 불필요한 docs 폴더가 main 병합 대상에 포함되지 않음
- README.md가 최신 상태임

---

## 9. main에 docs가 올라가면 안 되는 이유

main은 최종 코드 제출용으로 깔끔하게 유지해야 합니다. 회의록, 개발 중간 문서, 참고자료는 dev에서만 관리하면 됩니다.

---

## 10. 자주 쓰는 명령어

```bash
# 현재 상태 확인
git status

# 브랜치 목록 확인
git branch

# 브랜치 이동
git checkout 브랜치명

# 최신 내용 가져오기
git pull origin 브랜치명

# 커밋 기록 확인
git log --oneline

# 원격 저장소로 올리기
git push origin 브랜치명
```
