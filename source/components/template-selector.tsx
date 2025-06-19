import React, {useState, useEffect} from 'react';
import {Text, Box, useInput, useApp} from 'ink';
import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';
import {addComponent} from '../utils/add-components.js';

// ES 모듈에서 __dirname 대체
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface TemplateInfo {
	name: string;
	description: string;
}

export const TemplateSelector = () => {
	const [templates, setTemplates] = useState<TemplateInfo[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const {exit} = useApp();

	// 템플릿 목록 로드
	useEffect(() => {
		const loadTemplates = async () => {
			try {
				const templatesPath = path.join(__dirname, '..', '..', 'templates');
				const templateDirs = await fs.readdir(templatesPath);

				const templateList: TemplateInfo[] = [];

				for (const dir of templateDirs) {
					const dirPath = path.join(templatesPath, dir);
					const stat = await fs.stat(dirPath);

					if (stat.isDirectory()) {
						// 각 템플릿의 설명 정보를 추가할 수 있습니다
						const descriptions: {[key: string]: string} = {
							accordion: '접고 펼칠 수 있는 아코디언 컴포넌트',
							button: '재사용 가능한 버튼 컴포넌트',
							dialog: '모달 다이얼로그 컴포넌트',
							input: '텍스트 입력 필드 컴포넌트',
							popover: '팝오버 컴포넌트',
							'scroll-area': '스크롤 영역 컴포넌트',
							select: '드롭다운 선택 컴포넌트',
							separator: '구분선 컴포넌트',
							sheet: '사이드 시트 컴포넌트',
							sidebar: '사이드바 네비게이션 컴포넌트',
							skeleton: '로딩 스켈레톤 컴포넌트',
							tiptap: '리치 텍스트 에디터 컴포넌트',
							tooltip: '툴팁 컴포넌트',
						};

						templateList.push({
							name: dir,
							description: descriptions[dir] || `${dir} 컴포넌트`,
						});
					}
				}

				// hooks 제외하고 알파벳 순으로 정렬
				const filteredTemplates = templateList
					.filter(template => template.name !== 'hooks')
					.sort((a, b) => a.name.localeCompare(b.name));

				setTemplates(filteredTemplates);
				setIsLoading(false);
			} catch (error) {
				console.error('템플릿 로드 중 오류:', error);
				setIsLoading(false);
			}
		};

		loadTemplates();
	}, []);

	// 키보드 입력 처리
	useInput(async (input, key) => {
		if (isProcessing) return;

		if (key.upArrow) {
			setSelectedIndex(prev => (prev === 0 ? templates.length - 1 : prev - 1));
		} else if (key.downArrow) {
			setSelectedIndex(prev => (prev === templates.length - 1 ? 0 : prev + 1));
		} else if (key.return) {
			// Enter 키 눌렀을 때 선택된 템플릿 추가
			const selectedTemplate = templates[selectedIndex];
			if (selectedTemplate) {
				setIsProcessing(true);
				try {
					await addComponent(selectedTemplate.name);
					exit();
				} catch (error) {
					console.error('컴포넌트 추가 중 오류:', error);
					exit();
				}
			}
		} else if (key.escape || input === 'q') {
			// ESC 키나 q 키로 종료
			exit();
		}
	});

	if (isLoading) {
		return (
			<Box marginY={1}>
				<Text color="blue">템플릿 목록을 불러오는 중...</Text>
			</Box>
		);
	}

	if (isProcessing) {
		return (
			<Box marginY={1}>
				<Text color="green">선택한 컴포넌트를 추가하는 중...</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" marginY={1}>
			<Text color="cyan" bold>
				🌳 안녕하세요! tree-cli입니다
			</Text>
			<Box marginBottom={1}>
				<Text color="gray">
					이것은 파일을 붙여넣을 수 있게 만든 프로젝트입니다
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text color="yellow">📦 복사할 컴포넌트를 선택해주세요:</Text>
			</Box>

			<Box flexDirection="column" marginLeft={2}>
				{templates.map((template, index) => (
					<Box key={template.name} marginBottom={0}>
						<Text color={index === selectedIndex ? 'green' : 'white'}>
							{index === selectedIndex ? '▸ ' : '  '}
							{template.name}
						</Text>
						<Box marginLeft={1}>
							<Text color="gray">- {template.description}</Text>
						</Box>
					</Box>
				))}
			</Box>

			<Box marginTop={1}>
				<Text color="gray" dimColor>
					↑↓ 화살표로 선택, Enter로 추가, ESC/q로 종료
				</Text>
			</Box>
		</Box>
	);
};
