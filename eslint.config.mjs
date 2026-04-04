import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  // ── Global ignores ───────────────────────────────────────────────
  {
    ignores: [
      '.next/',
      'out/',
      'dist/',
      'build/',
      'node_modules/',
      'coverage/',
      'tailwind.config.ts',
      'postcss.config.mjs',
      'public/',
    ],
  },

  // ── Base: ESLint recommended ─────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript ───────────────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ── Global settings ──────────────────────────────────────────────
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
        React: 'readonly',
        JSX: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },

  // ── Next.js ──────────────────────────────────────────────────────
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // ── React ────────────────────────────────────────────────────────
  {
    plugins: { react },
    rules: {
      // Not needed with React 19 JSX transform
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Prop types not needed with TypeScript
      'react/prop-types': 'off',

      // Enforce best practices
      'react/self-closing-comp': 'warn',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'warn',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/hook-use-state': 'warn',
      'react/jsx-no-leaked-render': [
        'warn',
        { validStrategies: ['ternary', 'coerce'] },
      ],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: ['function-declaration', 'arrow-function'],
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },

  // ── React Hooks ──────────────────────────────────────────────────
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // ── JSX Accessibility ────────────────────────────────────────────
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'warn',
    },
  },

  // ── Import organization ──────────────────────────────────────────
  {
    plugins: { import: importPlugin },
    rules: {
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': ['error', { maxDepth: 3 }],
      'import/no-useless-path-segments': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: 'next/**', group: 'builtin', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // ── TypeScript-specific overrides ────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Allow unused vars when prefixed with _ (common pattern)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // Prefer types but allow interfaces
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Allow explicit `any` with warning (practical balance)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disallow non-null assertions (prefer optional chaining)
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Prevents empty interfaces / type aliases that add no value
      '@typescript-eslint/no-empty-object-type': 'warn',

      // Require return types on exported functions only
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Allow require() in config files
      '@typescript-eslint/no-require-imports': 'warn',

      // No redundant JS rules when TS equivalents exist
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },

  // ── General best practices ───────────────────────────────────────
  {
    rules: {
      // Prevent common bugs
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-duplicate-imports': 'off', // handled by import/no-duplicates

      // Code quality
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'multi-line', 'consistent'],
      'no-nested-ternary': 'warn',
      'no-unneeded-ternary': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-param-reassign': ['warn', { props: false }],
      'no-else-return': ['warn', { allowElseIf: false }],
      'no-return-await': 'off',
      'require-await': 'off',
    },
  },

  // ── Test files (relaxed rules) ───────────────────────────────────
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/__tests__/**',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'react/jsx-no-leaked-render': 'off',
    },
  },
);
