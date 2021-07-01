module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    window: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    ecmaVersion: 6,
    sourceType: "module",
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  settings: {
    "import/resolver": {
      node: {
        paths: [".", "src"],
        extensions: [".js", ".ts"],
      },
    },
  },
  plugins: [
    "prettier",
    "react",
    "jsx-a11y",
    "react-hooks",
    "@typescript-eslint",
  ],
  rules: {
    "import/extensions": "off",
    "no-use-before-define": "off",
    "no-console": "off",
    "no-extend-native": "off",
    "no-param-reassign": "off",
    "class-methods-use-this": "off",
    "node/no-unpublished-require": "off",
    "node/no-missing-import": "off",
    "node/no-unpublished-import": "off",
    "dot-notation": ["error", { allowKeywords: true }],
    "arrow-parens": "as-needed",
  },
};
