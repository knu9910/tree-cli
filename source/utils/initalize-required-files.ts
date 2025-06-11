import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';

/**
 * 프로젝트에서 컴포넌트 사용에 필요한 필수 파일과 디렉토리를 초기화하는 함수
 *
 * 이 함수는 사용자의 프로젝트에 다음과 같은 필수 요소들을 자동으로 생성합니다:
 * 1. src/lib/utils.ts - Tailwind CSS 클래스 병합 등의 유틸리티 함수들
 * 2. src/components/ui - UI 컴포넌트들이 저장될 디렉토리
 *
 * shadcn/ui와 유사한 구조를 따라서 일관성 있는 프로젝트 구조를 제공합니다.
 */

// __dirname: 현재 CLI 패키지 내부 경로 (ES 모듈에서 __dirname 대체)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 필수 파일/폴더가 없으면 생성하는 함수
export async function initializeRequiredFiles() {
	// CLI 패키지 내부의 templates/utils.ts 파일 경로
	// 이 파일은 CLI 패키지와 함께 배포되는 기본 유틸리티 템플릿입니다.
	const templatesUtilsPath = path.join(
		__dirname,
		'..',
		'..',
		'templates/utils.ts',
	);

	// 사용자 프로젝트의 src/lib/utils.ts 경로
	// 명령어를 실행한 현재 작업 디렉토리(process.cwd()) 기준
	const utilsPath = path.join(process.cwd(), 'src/lib/utils.ts');

	// src/lib/utils.ts 파일 초기화 로직
	if (!fs.existsSync(utilsPath)) {
		// CLI 패키지의 templates/utils.ts가 존재하면 복사
		if (fs.existsSync(templatesUtilsPath)) {
			await fs.copy(templatesUtilsPath, utilsPath);
			console.log(
				'✅ CLI 패키지의 templates/utils.ts 파일을 src/lib/utils.ts로 복사했습니다.',
			);
		} else {
			// 템플릿 파일이 없으면 빈 파일 생성
			await fs.ensureFile(utilsPath);
			await fs.writeFile(utilsPath, '// utils 함수들을 여기에 작성하세요\n');
			console.log('✅ src/lib/utils.ts 파일이 생성되었습니다.');
		}
	}

	// src/components/ui 디렉토리 초기화
	// shadcn/ui 컴포넌트들이 설치될 기본 위치
	const uiDir = path.join(process.cwd(), 'src/components/ui');
	if (!fs.existsSync(uiDir)) {
		await fs.ensureDir(uiDir);
		console.log('✅ src/components/ui 폴더가 생성되었습니다.');
	}
}
