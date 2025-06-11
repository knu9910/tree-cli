import fs from 'fs-extra';

/**
 * 파일 또는 디렉토리의 존재 여부를 확인하는 유틸리티 함수
 *
 * @param targetPath - 확인할 파일 또는 디렉토리의 경로 (상대경로 또는 절대경로)
 * @returns 파일/디렉토리가 존재하면 true, 존재하지 않으면 false
 *
 * 사용 예시:
 * - exists('./src/components') // 디렉토리 존재 확인
 * - exists('/absolute/path/to/file.ts') // 절대경로 파일 존재 확인
 * - exists('package.json') // 현재 디렉토리의 파일 존재 확인
 */
export function exists(targetPath: string): boolean {
	return fs.existsSync(targetPath);
}
