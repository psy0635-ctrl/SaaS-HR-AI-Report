# 🐱 GitHub 팀 협업 완전 초보 가이드

> 개발 경험이 전혀 없어도 이 문서 하나로 GitHub 팀 협업을 시작할 수 있습니다.  
> ⭐ 표시는 **반드시 알아야 하는 핵심 내용**입니다.  
> 순서대로 따라하면 됩니다.

---

## 목차

1. [GitHub가 뭔가요?](#1-github가-뭔가요)
2. [기본 용어 정리](#2-기본-용어-정리)
3. [설치 및 계정 만들기](#3-설치-및-계정-만들기)
4. [팀장 - 저장소 만들기](#4-팀장---저장소-만들기)
5. [팀원 - 저장소 내 컴퓨터로 가져오기](#5-팀원---저장소-내-컴퓨터로-가져오기)
6. [매일 쓰는 기본 명령어](#6-매일-쓰는-기본-명령어)
7. [팀 협업 규칙 (브랜치)](#7-팀-협업-규칙-브랜치)
8. [충돌이 생겼을 때](#8-충돌이-생겼을-때)
9. [자주 하는 실수 TOP 5](#9-자주-하는-실수-top-5)
10. [우리 팀 협업 흐름 정리](#10-우리-팀-협업-흐름-정리)

---

## 1. GitHub가 뭔가요?

### 한 줄 정의

> **팀원들과 코드를 함께 저장하고 관리하는 구글 드라이브 같은 것**

### 비유로 이해하기

```
📁 구글 드라이브
   └─ 파일 저장, 공유, 협업 가능
   └─ 누가 언제 수정했는지 확인 가능
   └─ 이전 버전으로 되돌리기 가능

📁 GitHub (개발자 버전 구글 드라이브)
   └─ 코드 저장, 공유, 협업 가능
   └─ 누가 언제 어떤 코드를 수정했는지 정확히 확인 가능
   └─ 이전 버전으로 언제든 되돌리기 가능
   └─ 팀원끼리 동시에 작업해도 안 섞임
```

### GitHub가 없으면 생기는 문제

```
❌ GitHub 없이 팀 프로젝트 할 때

팀원 A: "index.html 수정했어요"
팀원 B: "저도 index.html 수정했는데요..."
팀원 C: "어떤 버전이 최신이에요?"

→ 카톡으로 파일 주고받기
→ 누가 최신 버전인지 모름
→ 서로 덮어쓰기 발생
→ 팀 프로젝트 지옥 시작 😱

✅ GitHub 있을 때
→ 각자 작업 후 GitHub에 올리면 자동으로 합쳐짐
→ 누가 언제 뭘 바꿨는지 기록 남음
→ 실수해도 이전 버전으로 복구 가능
```

---

## 2. 기본 용어 정리

### ⭐ 반드시 알아야 하는 단어 6개

| 용어 | 쉬운 설명 | 비유 |
|---|---|---|
| **Repository (저장소)** | 프로젝트 파일 전체를 담는 폴더 | 구글 드라이브 폴더 |
| **Commit** | 변경사항을 저장하는 것 | "저장" 버튼 누르기 |
| **Push** | 내 컴퓨터 → GitHub 서버로 올리기 | 구글 드라이브에 업로드 |
| **Pull** | GitHub 서버 → 내 컴퓨터로 가져오기 | 구글 드라이브에서 다운로드 |
| **Branch** | 각자 독립적으로 작업하는 공간 | 복사본 만들어서 작업 |
| **Merge** | 각자 작업한 걸 하나로 합치기 | 복사본을 원본에 합치기 |

### 전체 흐름 한눈에 보기

```
내 컴퓨터                    GitHub 서버
┌──────────┐                ┌──────────┐
│          │  →  Push  →   │          │
│  내 코드  │                │  원본 코드│
│          │  ←  Pull  ←   │          │
└──────────┘                └──────────┘
     ↑
  Commit
(변경 저장)
```

---

## 3. 설치 및 계정 만들기

### Step 1 — GitHub 계정 만들기

1. https://github.com 접속
2. 우측 상단 **Sign up** 클릭
3. 이메일, 비밀번호, 사용자명 입력
4. 이메일 인증 완료

> 💡 사용자명은 나중에 포트폴리오로 보여주는 거라 **실명이나 깔끔한 닉네임** 추천

---

### Step 2 — Git 설치하기

GitHub는 웹사이트, Git은 내 컴퓨터에 설치하는 프로그램입니다.  
둘 다 필요합니다.

**Windows 기준**

1. https://git-scm.com 접속
2. **Download for Windows** 클릭
3. 설치 파일 실행 → 계속 **Next** 클릭 (기본값 유지)
4. 설치 완료

**설치 확인**

```bash
# 터미널(명령 프롬프트) 열고 입력
git --version

# 아래처럼 나오면 성공
# git version 2.xx.x
```

---

### Step 3 — Git에 내 정보 등록하기

```bash
# 이름 등록 (GitHub 사용자명으로)
git config --global user.name "내이름"

# 이메일 등록 (GitHub 가입 이메일로)
git config --global user.email "내이메일@gmail.com"

# 확인
git config --list
```

> ⭐ 이 설정 안 하면 나중에 누가 커밋했는지 구분이 안 됩니다. 반드시 하세요.

---

## 4. 팀장 — 저장소 만들기

> 팀에서 1명만 하면 됩니다. 나머지는 5번으로 넘어가세요.

### Step 1 — GitHub에서 저장소 생성

1. GitHub 로그인
2. 우측 상단 **+** 버튼 → **New repository** 클릭
3. 아래처럼 입력

```
Repository name: hr-ai-project   ← 프로젝트 이름 (영어, 붙임표 사용)
Description: HR AI 리포트 프로젝트  ← 설명 (선택)
Public / Private: Private         ← 팀 프로젝트는 Private 추천
✅ Add a README file              ← 체크하기
```

4. **Create repository** 클릭

---

### Step 2 — 팀원 초대하기

1. 저장소 페이지 → **Settings** 탭
2. 왼쪽 메뉴 **Collaborators** 클릭
3. **Add people** 버튼
4. 팀원 GitHub 사용자명 또는 이메일 입력 후 초대
5. 팀원이 이메일로 초대 수락하면 완료

---

### Step 3 — 내 컴퓨터에 저장소 복사

```bash
# 저장소 주소 복사 (GitHub 저장소 페이지 → Code 버튼 → HTTPS 주소)

# 원하는 폴더에서 터미널 열고 입력
git clone https://github.com/팀장이름/hr-ai-project.git

# 폴더 이동
cd hr-ai-project
```

---

### Step 4 — 기본 폴더 구조 만들기

```bash
# 폴더 생성
mkdir frontend backend database docs

# README 수정 후 첫 커밋
git add .
git commit -m "프로젝트 초기 구조 생성"
git push origin main
```

팀원들이 Pull 하면 이 구조가 그대로 받아집니다.

---

## 5. 팀원 — 저장소 내 컴퓨터로 가져오기

### Step 1 — 초대 수락

GitHub 가입 이메일로 온 초대 메일에서 **Accept invitation** 클릭

### Step 2 — 저장소 복사 (Clone)

```bash
# 터미널 열고 입력 (주소는 팀장한테 받기)
git clone https://github.com/팀장이름/hr-ai-project.git

# 폴더 이동
cd hr-ai-project

# 파일 목록 확인
ls
```

이걸로 팀 프로젝트 파일이 내 컴퓨터에 생겼습니다. ✅

---

## 6. 매일 쓰는 기본 명령어

### ⭐ 이 5개만 외우면 됩니다

```bash
# 1. 최신 코드 받아오기 (작업 시작 전 항상 먼저)
git pull origin main

# 2. 변경된 파일 확인
git status

# 3. 변경 파일 저장 준비 (스테이징)
git add .          # 전체 파일
git add 파일명.py  # 특정 파일만

# 4. 커밋 (변경사항 저장 + 메모 남기기)
git commit -m "변경 내용을 한 줄로 설명"

# 5. GitHub에 올리기
git push origin main
```

### 하루 작업 루틴

```
출근 (작업 시작)
    ↓
git pull origin main     ← 팀원이 올린 최신 코드 받기
    ↓
코드 작업
    ↓
git status               ← 내가 바꾼 파일 확인
    ↓
git add .                ← 저장 준비
    ↓
git commit -m "설명"     ← 저장
    ↓
git push origin main     ← GitHub에 올리기
    ↓
퇴근 (작업 종료)
```

### 좋은 커밋 메시지 작성법

```bash
# ❌ 나쁜 예
git commit -m "수정"
git commit -m "asdf"
git commit -m "작업함"

# ✅ 좋은 예
git commit -m "직원 등록 폼 UI 추가"
git commit -m "DB 직원 테이블 설계 완료"
git commit -m "GPT API 연결 테스트 완료"
git commit -m "버그 수정: 점수 입력 오류 해결"
```

> 💡 커밋 메시지는 3개월 후의 나와 팀원이 보는 기록입니다. 구체적으로 쓰세요.

---

## 7. 팀 협업 규칙 (브랜치)

### 브랜치가 왜 필요한가?

```
❌ 브랜치 없이 작업하면

팀원 A가 main에 직접 작업 중
팀원 B도 main에 직접 작업 중

→ 서로 코드 충돌 발생
→ 팀원 A 코드가 팀원 B 코드를 덮어씀
→ 둘 다 작업 날아감 😱

✅ 브랜치 사용하면

팀원 A → feature/frontend 브랜치에서 작업
팀원 B → feature/backend 브랜치에서 작업

→ 각자 독립적으로 작업
→ 완성 후 main에 합치기 (Merge)
→ 충돌 없음 ✅
```

### 브랜치 구조 (우리 팀 추천)

```
main              ← 최종 완성본만 올라오는 곳 (건드리지 않음)
  │
  ├── feature/frontend    ← 프론트 담당자 작업 공간
  ├── feature/backend     ← 백엔드 담당자 작업 공간
  ├── feature/database    ← DB 담당자 작업 공간
  └── feature/ai          ← AI 연결 담당자 작업 공간
```

### 브랜치 만들고 이동하기

```bash
# 브랜치 만들기 + 이동
git checkout -b feature/frontend

# 현재 어떤 브랜치인지 확인
git branch

# 브랜치 이동
git checkout main
git checkout feature/frontend
```

### 브랜치 작업 후 올리기

```bash
# 내 브랜치에 올리기
git push origin feature/frontend
```

### 완성 후 main에 합치기 (Pull Request)

1. GitHub 저장소 페이지 접속
2. **Pull requests** 탭 → **New pull request** 클릭
3. `base: main` ← `compare: feature/frontend` 선택
4. 제목과 설명 작성
5. **Create pull request** 클릭
6. 팀장이 확인 후 **Merge** 승인

> ⭐ Pull Request = "내 작업을 main에 합쳐도 될까요?" 라고 팀에 물어보는 것

---

## 8. 충돌이 생겼을 때

### 충돌(Conflict)이 뭔가?

```
팀원 A가 index.html 3번 줄을 → "배경색: 파란색" 으로 수정
팀원 B가 index.html 3번 줄을 → "배경색: 빨간색" 으로 수정

→ 같은 줄을 둘 다 수정하면 Git이 어떤 걸 써야 할지 모름
→ 충돌(Conflict) 발생
```

### 충돌 났을 때 파일 안에 생기는 표시

```
<<<<<<< HEAD
배경색: 파란색     ← 내가 수정한 내용
=======
배경색: 빨간색     ← 상대방이 수정한 내용
>>>>>>> feature/backend
```

### 해결 방법

```bash
# 1. 충돌난 파일 열기
# 2. <<<< ==== >>>> 표시 찾기
# 3. 팀원과 상의해서 어떤 내용 쓸지 결정
# 4. 표시 제거하고 최종 내용만 남기기

# 수정 후
git add .
git commit -m "충돌 해결: 배경색 파란색으로 통일"
```

### 충돌 예방법

```bash
# 작업 시작 전 항상 이것부터
git pull origin main

# 각자 다른 파일 작업
# 같은 파일은 한 명만 담당
```

---

## 9. 자주 하는 실수 TOP 5

### ❌ 실수 1 — Pull 안 하고 작업 시작

```bash
# 잘못된 루틴
코드 바로 작업 시작 → Push → 충돌 발생

# 올바른 루틴
git pull origin main → 작업 → Push
```

---

### ❌ 실수 2 — 커밋 없이 Push 하려고 함

```bash
# 이렇게 하면 에러 남
git push origin main   # 커밋 안 하고 Push

# 올바른 순서
git add .
git commit -m "설명"
git push origin main
```

---

### ❌ 실수 3 — main에 직접 작업

```bash
# 위험한 방법
git checkout main
(main에서 직접 작업)  ← 팀원 코드 덮어쓸 위험

# 올바른 방법
git checkout feature/내담당
(내 브랜치에서 작업)
```

---

### ❌ 실수 4 — 커밋 메시지를 "수정" 으로만 씀

```bash
# 나쁜 예
git commit -m "수정"    # 뭘 수정했는지 모름

# 좋은 예
git commit -m "로그인 버튼 CSS 스타일 수정"
```

---

### ❌ 실수 5 — .env 파일 (비밀키) GitHub에 올리기

```bash
# API 키, 비밀번호가 담긴 파일을 올리면 안 됨!

# .gitignore 파일 만들어서 제외하기
# .gitignore 파일 내용:
.env
__pycache__/
*.pyc
node_modules/
```

> ⭐ API 키를 GitHub에 올리면 전 세계에 공개됩니다. 절대 올리지 마세요!

---

## 10. 우리 팀 협업 흐름 정리

### 프로젝트 시작 (1회만)

```
팀장
  1. GitHub 저장소 생성
  2. 팀원 초대
  3. 기본 폴더 구조 push

팀원 전체
  1. 초대 수락
  2. git clone 으로 저장소 복사
  3. 각자 브랜치 생성
```

### 매일 작업 루틴

```
[작업 시작]
git pull origin main
git checkout feature/내브랜치

[작업 중]
코드 작성

[작업 끝]
git status
git add .
git commit -m "오늘 작업 내용"
git push origin feature/내브랜치

[완성됐을 때]
GitHub에서 Pull Request 생성
팀장이 확인 후 Merge
```

### 우리 팀 브랜치 규칙

| 브랜치 이름 | 담당자 | 역할 |
|---|---|---|
| `main` | 팀장 관리 | 최종 완성본 |
| `feature/frontend` | 프론트 담당 | 화면 작업 |
| `feature/backend` | 백엔드 담당 | 서버 작업 |
| `feature/ai` | AI/DB 담당 | AI 연결, DB 설계 |
| `feature/docs` | PM 담당 | 문서, 발표자료 |

---

## 📋 명령어 치트시트 (자주 보기)

```bash
# ── 처음 한 번만 ──────────────────────────────
git config --global user.name "이름"
git config --global user.email "이메일"
git clone 저장소주소

# ── 매일 사용 ─────────────────────────────────
git pull origin main          # 최신 코드 받기
git status                    # 변경 파일 확인
git add .                     # 전체 파일 스테이징
git add 파일명                 # 특정 파일 스테이징
git commit -m "설명"           # 커밋
git push origin 브랜치이름     # GitHub에 올리기

# ── 브랜치 관련 ───────────────────────────────
git branch                    # 브랜치 목록 확인
git checkout -b 브랜치이름     # 브랜치 만들고 이동
git checkout 브랜치이름        # 브랜치 이동

# ── 확인 ──────────────────────────────────────
git log --oneline             # 커밋 기록 보기
git diff                      # 변경 내용 비교
```

---

## 🆘 막혔을 때 해결 방법

| 상황 | 해결 방법 |
|---|---|
| push가 안 됨 | `git pull origin main` 먼저 하기 |
| 파일 되돌리고 싶음 | `git checkout -- 파일명` |
| 커밋 취소하고 싶음 | `git reset HEAD~1` |
| 뭔가 잘못됨, 무서움 | **팀장한테 물어보기** (혼자 하지 말기) |
| 완전 처음부터 다시 | `git clone` 다시 받기 |

---

> 📌 처음엔 명령어가 낯설지만 1주일만 쓰면 자연스러워집니다.  
> 모르면 혼자 해결하려 하지 말고 팀장 또는 단톡방에 바로 물어보세요!  
> **GitHub는 실수해도 거의 다 되돌릴 수 있습니다. 겁먹지 마세요** 💪
