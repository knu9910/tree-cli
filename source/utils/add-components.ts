import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';
import {installDeps} from './install-daps.js';
import {initializeRequiredFiles} from './initalize-required-files.js';

/**
 * tree-cli의 핵심 기능: 컴포넌트를 사용자 프로젝트에 추가하는 함수
 *
 * CLI 패키지에 포함된 템플릿 컴포넌트를 사용자 프로젝트로 복사하고,
 * 필요한 의존성 패키지들을 자동으로 설치합니다.
 *
 * 작업 흐름:
 * 1. 필수 파일/디렉토리 초기화 (src/lib/utils.ts, src/components/custom-ui 등)
 * 2. CLI 패키지의 templates/{컴포넌트명} 디렉토리를 사용자 프로젝트로 복사
 * 3. dependencies.json 파일이 있으면 필요한 패키지들 설치
 * 4. 의존성 컴포넌트가 있으면 재귀적으로 추가
 *
 * @param name - 추가할 컴포넌트의 이름 (예: "tiptap", "button", "dialog")
 */

// ES 모듈에서 __dirname 대체 (현재 파일의 디렉토리 경로)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 스타일 처리를 위한 유틸리티 함수
async function updateGlobalStyles(styles: any) {
	const globalCssPath = path.join(process.cwd(), 'src/app/globals.css');

	// globals.css 파일이 없으면 생성
	if (!fs.existsSync(globalCssPath)) {
		await fs.ensureFile(globalCssPath);
		await fs.writeFile(globalCssPath, '');
	}

	let content = await fs.readFile(globalCssPath, 'utf8');

	// @theme inline 블록이 있는지 확인
	const themeBlockRegex = /@theme\s+inline\s*{[\s\S]*?}/;
	const hasThemeBlock = themeBlockRegex.test(content);

	if (!hasThemeBlock) {
		// @theme inline 블록이 없으면 새로 생성
		content += '\n\n@theme inline {\n';

		// theme 변수들 추가
		if (styles.theme) {
			Object.entries(styles.theme).forEach(([key, value]) => {
				content += `  ${key}: ${value};\n`;
			});
		}

		// animations 변수들 추가
		if (styles.animations) {
			Object.entries(styles.animations).forEach(([key, value]) => {
				content += `  ${key}: ${value};\n`;
			});
		}

		content += '}\n';
	} else {
		// 기존 @theme inline 블록 내부에 변수들 추가
		content = content.replace(themeBlockRegex, match => {
			let newBlock = match.slice(0, -1); // 마지막 } 제거

			// 기존 CSS 변수들을 정확히 파싱
			const existingVarsRegex = /--[\w-]+\s*:\s*[^;]+;/g;
			const existingVars = match.match(existingVarsRegex) || [];
			const existingKeys = existingVars
				.map(varDeclaration => {
					const keyMatch = varDeclaration.match(/^(--[\w-]+)\s*:/);
					return keyMatch ? keyMatch[1] : null;
				})
				.filter(Boolean);

			// theme 변수들 추가 (중복 체크)
			if (styles.theme) {
				Object.entries(styles.theme).forEach(([key, value]) => {
					if (!existingKeys.includes(key)) {
						newBlock += `  ${key}: ${value};\n`;
					} else {
						console.log(`⚠️ CSS 변수 ${key}가 이미 존재합니다. 건너뜁니다.`);
					}
				});
			}

			// animations 변수들 추가 (중복 체크)
			if (styles.animations) {
				Object.entries(styles.animations).forEach(([key, value]) => {
					if (!existingKeys.includes(key)) {
						newBlock += `  ${key}: ${value};\n`;
					} else {
						console.log(`⚠️ CSS 변수 ${key}가 이미 존재합니다. 건너뜁니다.`);
					}
				});
			}

			return newBlock + '}';
		});
	}

	await fs.writeFile(globalCssPath, content);
}

export async function addComponent(name: string) {
	const templatePath = path.join(__dirname, '..', '..', 'templates', name);
	const targetPath = path.join(process.cwd(), 'src/components/custom-ui', name);

	console.log('templatePath:', templatePath);
	console.log('targetPath:', targetPath);

	initializeRequiredFiles();

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

		// 스타일 처리
		if (depsJson.styles) {
			await updateGlobalStyles(depsJson.styles);
			console.log('✅ globals.css에 스타일이 추가되었습니다.');
		}

		if (Array.isArray(depsJson.hooks) && depsJson.hooks.length > 0) {
			const hooksDir = path.join(process.cwd(), 'src/hooks');
			await fs.ensureDir(hooksDir);

			for (const hook of depsJson.hooks) {
				const hookTemplatePath = path.join(
					__dirname,
					'..',
					'..',
					'templates/hooks',
					`${hook}.ts`,
				);
				const hookTargetPath = path.join(hooksDir, `${hook}.ts`);

				if (fs.existsSync(hookTemplatePath)) {
					await fs.copy(hookTemplatePath, hookTargetPath);
					console.log(`✅ ${hook} hook이 성공적으로 추가되었습니다.`);
				} else {
					console.error(`❌ ${hook} hook 템플릿이 존재하지 않아요.`);
				}
			}
		}

		if (Array.isArray(depsJson.components) && depsJson.components.length > 0) {
			for (const depComp of depsJson.components) {
				await addComponent(depComp);
			}
		}
	}
}
