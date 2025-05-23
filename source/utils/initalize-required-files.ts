import fs from 'fs-extra';
import path from 'path';
import {exists} from './exists.js';
import {fileURLToPath} from 'url';

// __dirname: 현재 CLI 패키지 내부 경로
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 필수 파일/폴더가 없으면 생성하는 함수
export async function initializeRequiredFiles() {
	// 내 CLI(패키지) 내부의 templates/utils.ts 경로
	const templatesUtilsPath = path.join(
		__dirname,
		'..',
		'..',
		'templates/utils.ts',
	);
	// 사용자 프로젝트의 src/lib/utils.ts 경로
	const utilsPath = path.join(process.cwd(), 'src/lib/utils.ts');

	// src/lib/utils.ts 파일이 없으면 CLI 패키지의 templates/utils.ts를 복사
	if (!exists(utilsPath)) {
		if (exists(templatesUtilsPath)) {
			await fs.copy(templatesUtilsPath, utilsPath);
			console.log(
				'✅ CLI 패키지의 templates/utils.ts 파일을 src/lib/utils.ts로 복사했습니다.',
			);
		} else {
			await fs.ensureFile(utilsPath);
			await fs.writeFile(utilsPath, '// utils 함수들을 여기에 작성하세요\n');
			console.log('✅ src/lib/utils.ts 파일이 생성되었습니다.');
		}
	}

	// src/components/ui 폴더가 없으면 생성
	const uiDir = path.join(process.cwd(), 'src/components/ui');
	if (!exists(uiDir)) {
		await fs.ensureDir(uiDir);
		console.log('✅ src/components/ui 폴더가 생성되었습니다.');
	}
}
