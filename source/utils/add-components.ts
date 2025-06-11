import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';
import {installDeps} from './install-daps.js';
import {initializeRequiredFiles} from './initalize-required-files.js';

/**
 * tree-cli의 핵심 기능: 컴포넌트를 사용자 프로젝트에 추가하는 함수
 *
 * 이 함수는 shadcn/ui의 `npx shadcn-ui@latest add button` 방식을 모방하여
 * CLI 패키지에 포함된 템플릿 컴포넌트를 사용자 프로젝트로 복사하고,
 * 필요한 의존성 패키지들을 자동으로 설치합니다.
 *
 * 작업 흐름:
 * 1. 필수 파일/디렉토리 초기화 (src/lib/utils.ts, src/components/ui 등)
 * 2. CLI 패키지의 templates/{컴포넌트명} 디렉토리를 사용자 프로젝트로 복사
 * 3. dependencies.json 파일이 있으면 필요한 패키지들 설치
 * 4. 의존성 컴포넌트가 있으면 재귀적으로 추가
 *
 * @param name - 추가할 컴포넌트의 이름 (예: "tiptap", "button", "dialog")
 */

// ES 모듈에서 __dirname 대체 (현재 파일의 디렉토리 경로)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function addComponent(name: string) {
	// CLI 패키지 내부의 템플릿 경로
	// 예: /node_modules/@knu9910/tree-cli/templates/tiptap
	const templatePath = path.join(__dirname, '..', '..', 'templates', name);

	// 사용자 프로젝트에서 컴포넌트가 복사될 목적지 경로
	// 예: /Users/user/my-project/src/components/custom-ui/tiptap
	const targetPath = path.join(process.cwd(), 'src/components/custom-ui', name);

	// 디버깅을 위한 경로 출력
	console.log('templatePath:', templatePath);
	console.log('targetPath:', targetPath);

	// 프로젝트 초기화 (필수 파일/디렉토리 생성)
	initializeRequiredFiles();

	// 요청된 템플릿이 CLI 패키지에 존재하는지 확인
	if (!fs.existsSync(templatePath)) {
		console.error(`❌ ${name} 템플릿이 존재하지 않아요.`);
		return;
	}

	// 목적지 디렉토리 생성 (중간 디렉토리들도 자동 생성)
	await fs.ensureDir(targetPath);

	// 템플릿 디렉토리 전체를 사용자 프로젝트로 복사
	// 모든 하위 파일과 디렉토리가 재귀적으로 복사됨
	await fs.copy(templatePath, targetPath);

	console.log(`✅ ${name} 컴포넌트가 성공적으로 추가되었습니다.`);

	// 의존성 처리: dependencies.json 파일 확인 및 처리
	const depsPath = path.join(templatePath, 'dependencies.json');
	if (fs.existsSync(depsPath)) {
		const depsJson = await fs.readJson(depsPath);

		// npm 패키지 의존성 설치
		if (Array.isArray(depsJson.packages) && depsJson.packages.length > 0) {
			await installDeps(depsJson.packages);
		}

		// 컴포넌트 의존성 재귀적 설치
		// 예: tiptap 컴포넌트가 button, dialog 컴포넌트를 필요로 하는 경우
		if (Array.isArray(depsJson.components) && depsJson.components.length > 0) {
			for (const depComp of depsJson.components) {
				await addComponent(depComp); // 재귀 호출
			}
		}
	}
}
