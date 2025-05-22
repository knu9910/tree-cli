import {execa} from 'execa';

export async function installDeps(deps: string[]) {
	console.log(`📦 패키지 설치 중: ${deps.join(', ')}`);
	await execa('pnpm', ['add', ...deps], {stdio: 'inherit'});
}
