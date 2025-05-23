import fs from 'fs-extra';
import path from 'path';
import {exists} from './exists.js';

// 필수 파일/폴더가 없으면 생성하는 함수
export async function initializeRequiredFiles() {
	// src/app/utils.ts 파일이 없으면 생성
	const utilsPath = path.join(process.cwd(), 'src/lib/utils.ts');
	if (!exists(utilsPath)) {
		await fs.ensureFile(utilsPath);
		await fs.writeFile(utilsPath, '// utils 함수들을 여기에 작성하세요\n');
		console.log('✅ src/app/utils.ts 파일이 생성되었습니다.');
	}

	// src/components/ui 폴더가 없으면 생성
	const uiDir = path.join(process.cwd(), 'src/components/ui');
	if (!exists(uiDir)) {
		await fs.ensureDir(uiDir);
		console.log('✅ src/components/ui 폴더가 생성되었습니다.');
	}
}
