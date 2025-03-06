import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    ignores: ["web/test", "lib", "src"]
  },
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          "selector": "WhileStatement > BlockStatement >:last-child[expression.type!='YieldExpression']",
          "message": "(ScratchLib)while構文の最後はyieldを書いてください"
        },
        "error",
        {
          "selector": "ForStatement > BlockStatement >:last-child[expression.type!='YieldExpression']",
          "message": "(ScratchLib)for構文の最後はyieldを書いてください"
        },
      ],
      'no-unused-vars': [
        'error', 
        { 
          'argsIgnorePattern': '^_$' , // 引数
          "varsIgnorePattern": "^_$",  // 変数
          "caughtErrorsIgnorePattern": "^_$",  // errorハンドリング
          "destructuredArrayIgnorePattern": "^_$"  // 配列内の変数参照
        }
      ]
    }
  },
];