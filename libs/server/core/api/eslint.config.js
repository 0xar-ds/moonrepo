import globals from 'globals';

import { fileURLToPath } from 'node:url';

import config from '@~meta/eslint';

import { includeIgnoreFile, makeTsConfig } from '@~meta/eslint/utils';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default makeTsConfig(
	includeIgnoreFile(gitignorePath),
	...config,
	{
		ignores: ['eslint.config.js'],
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
