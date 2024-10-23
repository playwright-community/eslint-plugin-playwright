import { Linter, Rule } from 'eslint'

declare const config: {
  configs: {
    'flat/jest-playwright': Linter.Config
    'flat/recommended': Linter.Config
    'jest-playwright': Linter.Config
    'playwright-test': Linter.Config
    recommended: Linter.Config
  }
  rules: Record<string, Rule.RuleModule>
}

export default config
