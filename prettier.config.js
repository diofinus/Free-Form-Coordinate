import tailwindcss from 'prettier-plugin-tailwindcss';

module.exports = {
  plugins: [tailwindcss],
  extends: ['plugin:react/recommended'],
  semi: true,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  jsxBracketSameLine: true,
  bracketSpacing: true
};
