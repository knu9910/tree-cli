import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';
import {installDeps} from './install-daps.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function addComponent(name: string) {
	// CLI 내부 템플릿 경로 (패키지 내부)
	const templatePath = path.join(__dirname, '..', '..', 'templates', name);

	// 사용자 프로젝트 내부 컴포넌트 경로 (명령어 실행 위치 기준)
	const targetPath = path.join(process.cwd(), 'src/components', name);

	console.log('templatePath:', templatePath);
	console.log('targetPath:', targetPath);

	if (!fs.existsSync(templatePath)) {
		console.error(`❌ ${name} 템플릿이 존재하지 않아요.`);
		return;
	}

	await fs.ensureDir(targetPath);
	await fs.copy(templatePath, targetPath);

	console.log(`✅ ${name} 컴포넌트가 성공적으로 추가되었습니다.`);

	const depsPath = path.join(templatePath, 'dependencies.json');
	if (fs.existsSync(depsPath)) {
		const depsJson = await fs.readJson(depsPath);
		if (Array.isArray(depsJson.packages) && depsJson.packages.length > 0) {
			await installDeps(depsJson.packages);
		}
		if (Array.isArray(depsJson.components) && depsJson.components.length > 0) {
			for (const depComp of depsJson.components) {
				await addComponent(depComp);
			}
		}
	}
}
