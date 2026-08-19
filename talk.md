# YABOAZ K-FDE 대화 및 진행 기록

## 기록 목적

YABOAZ K-FDE 현장 실행·운영 플랫폼의 주요 요청, 구현 내용, 검증 결과, 커밋·푸시·배포 이력을 기록한다.

## 주요 진행 내용

### 참고자료 및 학습 콘텐츠

- `conversation.md`와 FDE 참고자료 HTML/PDF를 검토하고 참고자료·슬라이드 자료 구조를 정비했다.
- `reference-materials.html`에 FDE 관련 PDF 자료를 추가했다.
- PDF 자료에서 슬라이드를 추출해 적절한 위치에 삽입하는 작업을 진행했다.
- 참고자료 메뉴 표기를 `YABOAZ K-FDE 슬라이드자료(##)` 형식으로 정비했다.

### 관리자·액세스코드

- `ACCESSCODE.html`을 구축해 10자리 액세스코드를 관리하도록 했다.
- 미사용 코드를 복사해 제공하면 사용 처리할 수 있도록 구성했다.
- 관리자 대시보드와 액세스코드 관리 화면을 연결했다.
- 관리자 로그인 세션이 새로고침 후에도 유지되도록 구성했다.
- `admin-login.html` 인증 후 `admin-members.html`로 연결되도록 했다.
- 액세스코드는 Supabase와 연동하고 회원가입 시 인증에 사용하도록 했다.

### LMS 및 학습 진행 관리

- 회원 LMS와 관리자 LMS를 구축했다.
- 관리자가 관리자 대시보드에서 회원 이름을 클릭하면 해당 회원 LMS로 이동하도록 했다.
- 13단계 실행 콘텐츠와 학습자료 페이지의 HTML·슬라이드·영상 학습 이력을 관리하도록 했다.
- 학습 콘텐츠 마지막에 `학습완료 후 클릭!` 버튼을 추가했다.
- 완료 후 버튼은 오렌지색으로 바뀌고 `학습완료 확인됨!` 문구와 빨간 가로줄을 표시한다.
- 개인별 학습 완료 상태를 Supabase에 저장하고 13단계 로드맵에서 구분하도록 했다.
- 학습 페이지 상단·하단에 이전 페이지 이동 기능을 추가했다.
- `usage-guide.html`에서는 학습완료 및 이전 페이지 버튼을 제거했다.

### 랜딩페이지 및 사용안내

- `index-ko.html`의 사용안내 버튼을 English 버튼 왼쪽으로 이동했다.
- `13단계 프로젝트 실행 (유료)`를 `13단계 AX프로젝트 실행 (유료)`로 변경했다.
- 상단 버튼 크기와 간격을 축소해 겹치지 않도록 했다.
- 중복으로 표시되던 브랜드 심볼 하나를 제거했다.
- 중복된 `13단계 로드맵 이동` 버튼을 삭제했다.
- `usage-guide.html`의 `13단계 실행` 표기를 `13단계 AX프로젝트 실행`으로 변경했다.
- 사용안내 단계에 `3. 로그인` 다음 `4. 학습하기`를 추가하고 기존 실행 단계를 `5. 13단계 AX프로젝트 실행`으로 이동했다.
- 사용안내의 1~5단계를 데스크톱에서 한 줄로 배치하고, 좁은 화면에서는 반응형으로 줄바꿈되도록 했다.

## 최근 변경 파일

- `index-ko.html`
- `landing.css`
- `usage-guide.html`

## 최근 커밋 이력

- `43e26c0` Move usage guide before language switch
- `5155130` Remove LMS completion controls from usage guide
- `c109abc` Compact landing navigation and remove duplicate symbol
- `c718eda` Remove duplicate roadmap navigation button
- `c04bf1e` Rename usage guide project execution label
- `c04f00c` Add learning step to usage guide
- `4644a94` Place usage guide steps in one row

## 배포

- Git 원격 저장소: `https://github.com/jaiwshim-project/yaboaz.git`
- 작업 브랜치: `agent/paid-learning-roadmap`
- 운영 주소: `https://yaboaz.com`
- 최근 배포 상태: Vercel Production `READY`
- 최근 배포 확인 페이지: `https://yaboaz.com/usage-guide.html`

## 현재 확인 결과

- 사용안내 페이지에 `4. 학습하기`가 표시된다.
- `5. 13단계 AX프로젝트 실행`이 표시된다.
- 1~5단계 한 줄 배치 CSS가 운영 페이지에 반영되어 있다.
- 관련 변경은 커밋·푸시·배포까지 완료되었다.

## 운영 원칙

- 기존 사용자 파일과 무관한 변경은 보존한다.
- 기능 변경 후 `git diff --check`로 기본 오류를 확인한다.
- 변경 범위를 명확히 하여 필요한 파일만 커밋한다.
- 배포 후 운영 URL에서 실제 반영 여부를 확인한다.
