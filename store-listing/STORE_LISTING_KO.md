# Chrome Web Store 등록 문구 — 한국어

## 이름
VaultClip - Markdown + PDF

## 짧은 설명
현재 웹페이지를 로컬 Vault에 요약 Markdown과 전체 PDF로 함께 저장합니다.

## 권장 카테고리
Productivity

## 상세 설명
VaultClip은 웹페이지를 오래 보관하고 나중에 검색하기 쉽게 만드는 로컬 우선 웹 클리퍼입니다.

버튼 한 번으로 현재 페이지를 두 가지 형태로 저장합니다.

- 가벼운 Markdown 노트: 저장 시간, 간단한 요약, PDF 링크
- 전체 PDF 아카이브: 현재 렌더링된 웹페이지 원문 보관
- 사용자가 직접 선택한 로컬 폴더에 저장
- Obsidian 등 Markdown 기반 Vault에서 바로 사용할 수 있는 `[[...]]` PDF 링크
- 외부 서버 업로드 없음
- 계정, 회원가입, 클라우드 서비스 불필요

### 사용 방법
1. 확장 프로그램에서 Vault 폴더를 선택합니다.
2. Vault 내부 저장 폴더(기본값 `WebClip`)를 지정합니다.
3. 보관할 웹페이지에서 **요약 MD + PDF 저장**을 누릅니다.
4. Markdown 노트와 PDF가 선택한 Vault에 함께 저장됩니다.

### 저장 예시
```text
Vault/
└─ WebClip/
   ├─ 페이지제목__날짜시간.md
   └─ _archive/
      └─ pdf/
         └─ 페이지제목__날짜시간.pdf
```

### 개인정보 및 로컬 처리
VaultClip은 사용자가 저장 버튼을 누른 현재 탭의 내용만 읽습니다.
페이지 내용은 요약 텍스트와 PDF를 만들기 위해 로컬 브라우저에서 처리되며 개발자 서버나 제3자 서버로 전송하지 않습니다.

PDF 자동 생성에는 Chrome의 `debugger` 권한이 사용됩니다. 이 권한은 사용자가 저장을 실행했을 때 현재 탭에 일시적으로 연결하여 `Page.printToPDF`를 실행하기 위한 용도이며, PDF 생성 후 즉시 연결을 해제합니다.

VaultClip은 Obsidian의 공식 제품이나 제휴 제품이 아닙니다.
