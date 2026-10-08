module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "@react-native",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "react-native", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "warn",
    "react-native/no-inline-styles": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-require-imports": "off", // ✅ allows require() for images
    "react-native/sort-styles": "off",
    "react-native/split-platform-components": "off",
  },
  overrides: [
    {
      files: ["*.tsx"],
      rules: {
        "max-lines": [
          "warn",
          { max: 250, skipBlankLines: true, skipComments: true },
        ],
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
