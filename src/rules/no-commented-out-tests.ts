import { Rule } from 'eslint'
import * as ESTree from 'estree'
import { createRule } from '../utils/createRule.js'
import { getImportedAliases } from '../utils/ast.js'

function getTestNames(context: Rule.RuleContext) {
  const aliases = context.settings.playwright?.globalAliases?.test ?? []
  const importAliases = getImportedAliases(context, 'test')
  return ['test', ...aliases, ...importAliases]
}

function hasTests(context: Rule.RuleContext, node: ESTree.Comment) {
  const testNames = getTestNames(context)
  const names = testNames.join('|')
  const regex = new RegExp(
    `^\\s*(${names}|describe)(\\.\\w+|\\[['"]\\w+['"]\\])?\\s*\\(`,
    'mu',
  )
  return regex.test(node.value)
}

export default createRule({
  create(context) {
    function checkNode(node: ESTree.Comment) {
      if (!hasTests(context, node)) return

      context.report({
        messageId: 'commentedTests',
        node: node as unknown as ESTree.Node,
      })
    }

    return {
      Program() {
        context.sourceCode.getAllComments().forEach(checkNode)
      },
    }
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow commented out tests',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-commented-out-tests.md',
    },
    messages: {
      commentedTests: 'Some tests seem to be commented',
    },
    type: 'problem',
  },
})
