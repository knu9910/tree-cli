import {execa} from 'execa';
import fs from 'fs-extra'; // package.json 읽고 쓰기 위함
import path from 'path';

export async function installDeps(deps: string[]) {
	const projectPackageJsonPath = path.join(process.cwd(), 'package.json');
	let projectPackageJson = await fs.readJson(projectPackageJsonPath);

	let changed = false;
	deps.forEach(pkg => {
		// 패키지 이름과 버전 분리 (예: "react@latest", "@radix-ui/react-select")
		const [pkgName, pkgVersion = 'latest'] =
			pkg.includes('@') && pkg.lastIndexOf('@') > 0
				? [
						pkg.substring(0, pkg.lastIndexOf('@')),
						pkg.substring(pkg.lastIndexOf('@') + 1),
				  ]
				: [pkg, 'latest'];

		// 기존 dependencies 또는 devDependencies에 해당 패키지가 없으면 추가
		if (
			!projectPackageJson.dependencies?.[pkgName] &&
			!projectPackageJson.devDependencies?.[pkgName]
		) {
			projectPackageJson.dependencies = projectPackageJson.dependencies || {};
			projectPackageJson.dependencies[pkgName] = pkgVersion;
			changed = true;
		}
	});

	if (changed) {
		// package.json 파일에 변경 사항 저장
		await fs.writeJson(projectPackageJsonPath, projectPackageJson, {spaces: 2});
		console.log(
			'📦 새로운 패키지를 package.json에 추가했습니다. 의존성 설치를 시작합니다...',
		);

		try {
			// pnpm install 실행 (전체 의존성 재설정)
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
