import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Import custom rule
import noHyphenatedJsxProps from './eslint-rules/no-hyphenated-jsx-props.js'

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      "./public/**/*"
    ],
    plugins: {
      import: (await import('eslint-plugin-import')).default,
      react: (await import('eslint-plugin-react')).default,
      'custom-rules': {
        rules: {
          'no-hyphenated-jsx-props': noHyphenatedJsxProps,
        },
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'custom-rules/no-hyphenated-jsx-props': 'error',
    },
  },
]

export default eslintConfig
