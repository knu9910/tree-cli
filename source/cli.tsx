#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import {addComponent} from './utils/add-components.js';
import App from './app.js';
const cli = meow(
	`
	Usage
	  $ tree-cli --add sidebar

	Options
	  --add  추가할 컴포넌트 이름

	Examples
	  $ tree-cli --add sidebar
`,
	{
		importMeta: import.meta,
		flags: {
			add: {
				type: 'string',
			},
		},
	},
);

if (cli.flags.add) {
	// 텍스트 UI 없이 바로 실행
	addComponent(cli.flags.add);
} else {
	// Ink UI 표시
	render(<App />);
}
