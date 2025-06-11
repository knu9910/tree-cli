import {execa} from 'execa';
import fs from 'fs-extra'; // package.json 읽고 쓰기 위함
import path from 'path';

/**
 * 컴포넌트에 필요한 npm 패키지 의존성을 자동으로 설치하는 함수
 *
 * 이 함수는 다음과 같은 작업을 수행합니다:
 * 1. 사용자 프로젝트의 package.json을 읽어옴
 * 2. 새로운 의존성이 이미 설치되어 있는지 확인
 * 3. 새로운 의존성이 있다면 package.json에 추가
 * 4. pnpm install을 실행하여 실제 패키지 설치
 *
 * @param deps - 설치할 패키지들의 배열 (예: ["react@18.2.0", "@radix-ui/react-dialog"])
 *
 * 패키지 형식:
 * - "패키지명" (최신 버전으로 설치)
 * - "패키지명@버전" (특정 버전으로 설치)
 * - "@스코프/패키지명@버전" (스코프 패키지)
 */
export async function installDeps(deps: string[]) {
	// 사용자 프로젝트의 package.json 경로
	const projectPackageJsonPath = path.join(process.cwd(), 'package.json');

	// 기존 package.json 내용을 읽어옴
	let projectPackageJson = await fs.readJson(projectPackageJsonPath);

	let changed = false; // package.json에 변경 사항이 있는지 추적

	// 각 의존성에 대해 처리
	deps.forEach(pkg => {
		// 패키지 이름과 버전을 분리
		// 예시: "react@18.2.0" → pkgName: "react", pkgVersion: "18.2.0"
		// 예시: "@radix-ui/react-dialog" → pkgName: "@radix-ui/react-dialog", pkgVersion: "latest"
		const [pkgName, pkgVersion = 'latest'] =
			pkg.includes('@') && pkg.lastIndexOf('@') > 0
				? [
						pkg.substring(0, pkg.lastIndexOf('@')), // @ 이전까지가 패키지명
						pkg.substring(pkg.lastIndexOf('@') + 1), // @ 이후가 버전
				  ]
				: [pkg, 'latest']; // @가 없거나 맨 앞에만 있으면 (스코프 패키지) 최신 버전 사용

		// 이미 설치된 패키지인지 확인
		// dependencies 또는 devDependencies에 해당 패키지가 없는 경우에만 추가
		if (
			!projectPackageJson.dependencies?.[pkgName] &&
			!projectPackageJson.devDependencies?.[pkgName]
		) {
			// dependencies 섹션이 없으면 생성
			projectPackageJson.dependencies = projectPackageJson.dependencies || {};

			// 새 패키지를 dependencies에 추가
			projectPackageJson.dependencies[pkgName] = pkgVersion;
			changed = true;
		}
	});

	// package.json에 변경 사항이 있는 경우
	if (changed) {
		// 변경된 내용을 package.json 파일에 저장 (들여쓰기 2칸으로 포맷팅)
		await fs.writeJson(projectPackageJsonPath, projectPackageJson, {spaces: 2});
		console.log(
			'📦 새로운 패키지를 package.json에 추가했습니다. 의존성 설치를 시작합니다...',
		);

		try {
			// pnpm install 명령어 실행
			// stdio: 'inherit' - 설치 과정의 로그를 그대로 터미널에 표시
			// cwd: process.cwd() - 사용자 프로젝트 디렉토리에서 실행
			await execa('pnpm', ['install'], {stdio: 'inherit', cwd: process.cwd()});
			console.log('✅ 의존성이 성공적으로 설치되었습니다.');
		} catch (error) {
			console.error('❌ 의존성 설치에 실패했습니다:', error);
			throw error; // 에러를 상위로 전파하여 CLI가 중단되도록 함
		}
	} else {
		console.log('📦 설치할 새로운 의존성이 없습니다.');
	}
}
