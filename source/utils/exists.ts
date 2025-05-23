import fs from 'fs-extra';

// 파일 또는 폴더가 존재하는지 확인하는 함수
export function exists(targetPath: string): boolean {
	return fs.existsSync(targetPath);
}
