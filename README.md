# 🌳 tree-cli

> shadcn/ui에서 영감을 받은 재사용 가능한 컴포넌트 및 모듈 관리 CLI 도구

## 📖 프로젝트 개요

기존 개발 환경에서 Tiptap 같은 커스텀 모듈, 컴포넌트, 훅(hook) 등 재사용 가능한 코드들을 다른 프로젝트에 옮길 때마다 **복사-붙여넣기**를 하고, 의존성 패키지들도 일일이 설치해야 하는 번거로움이 있었습니다.

**tree-cli**는 이러한 문제를 해결하고자 **shadcn/ui에서 영감을 받아** 만든 CLI 도구로, 내가 만든 재사용 가능한 모듈, 컴포넌트, 훅 등을 **손쉽게 다른 프로젝트에서 불러와 사용할 수 있도록** 도와줍니다.

### ✨ 주요 기능

- 🚀 **원클릭 컴포넌트 설치**: 복잡한 컴포넌트도 한 명령어로 설치
- 📦 **자동 의존성 관리**: 필요한 npm 패키지들을 자동으로 설치
- 🔗 **컴포넌트 의존성 해결**: 컴포넌트 간 의존성을 재귀적으로 해결
- 🏗️ **프로젝트 구조 자동 생성**: 필요한 폴더와 파일들을 자동으로 생성
- 🎨 **shadcn/ui 호환**: 기존 shadcn/ui 프로젝트와 완벽 호환

## 🚀 설치 및 사용법

# 컴포넌트 추가

npx @knu9910/tree-cli --add tiptap

# Tiptap 에디터 컴포넌트 설치

knu-tree-cli --add tiptap

## 📁 프로젝트 구조

```
tree-cli/
├── source/                 # 소스 코드
│   ├── cli.tsx             # CLI 엔트리 포인트
│   ├── app.tsx             # 메인 앱 컴포넌트
│   ├── utils/              # 유틸리티 함수들
│   │   ├── add-components.ts    # 컴포넌트 추가 로직
│   │   ├── install-daps.ts      # 의존성 설치 로직
│   │   ├── initalize-required-files.ts  # 필수 파일 초기화
│   └── components/         # React 컴포넌트들
├── templates/              # 템플릿 컴포넌트들
│   ├── utils.ts           # 기본 유틸리티 함수
│   ├── tiptap/            # Tiptap 에디터 템플릿
│   ├── button/            # Button 컴포넌트 템플릿
│   ├── dialog/            # Dialog 컴포넌트 템플릿
│   └── ...                # 기타 컴포넌트들
├── dist/                  # 빌드된 파일들
└── package.json
```

## 🔧 주요 컴포넌트 분석

### 1. CLI 엔트리 포인트 (`source/cli.tsx`)

CLI 도구의 진입점으로, 명령줄 인수를 파싱하고 적절한 동작을 실행합니다.

- **meow** 라이브러리를 사용한 CLI 인터페이스 정의
- `--add` 플래그 처리
- Ink를 사용한 터미널 UI 렌더링

### 2. 컴포넌트 추가 로직 (`source/utils/add-components.ts`)

tree-cli의 핵심 기능으로, 템플릿 컴포넌트를 사용자 프로젝트로 복사합니다.

- CLI 패키지의 templates 디렉토리에서 사용자 프로젝트로 파일 복사
- `dependencies.json` 파일 기반 의존성 해결
- 재귀적 컴포넌트 의존성 설치

### 3. 의존성 설치 (`source/utils/install-daps.ts`)

npm 패키지 의존성을 자동으로 설치하는 기능입니다.

- 사용자 프로젝트의 `package.json` 분석
- 새로운 의존성 추가 및 중복 검사
- pnpm을 사용한 자동 패키지 설치

### 4. 필수 파일 초기화 (`source/utils/initalize-required-files.ts`)

프로젝트에서 컴포넌트 사용에 필요한 필수 파일들을 자동 생성합니다.

- `src/lib/utils.ts` 파일 생성 (Tailwind CSS 유틸리티)
- `src/components/ui` 디렉토리 생성
- shadcn/ui 호환 구조 제공

## 📋 템플릿 구조

각 컴포넌트 템플릿은 다음과 같은 구조를 가집니다:

```
templates/component-name/
├── index.ts               # 컴포넌트 진입점
├── component.tsx          # 메인 컴포넌트
├── dependencies.json      # 의존성 정의
└── ...                   # 기타 관련 파일들
```

### dependencies.json 형식

json
{
"packages": [
"react",
"@radix-ui/react-dialog",
"lucide-react"
],
"components": [
"button",
"input"
]
}

## 🛠️ 개발 및 빌드

# 의존성 설치

pnpm install

### 빌드 과정

1. TypeScript 컴파일 (`tsc`)
2. `dist/` 디렉토리에 JavaScript 파일 생성
3. `templates/` 디렉토리는 npm 패키지에 포함

# 버전 업데이트

npm version patch # 또는 minor, major

# npm에 배포

npm publish
