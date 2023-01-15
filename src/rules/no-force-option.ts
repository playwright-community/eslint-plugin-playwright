import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { getStringValue, isBooleanLiteral } from '../utils/ast';

function isForceOptionEnabled(node: ESTree.CallExpression) {
  const arg = node.arguments[node.arguments.length - 1];

  return (
    arg?.type === 'ObjectExpression' &&
    arg.properties.find(
      (property) =>
        property.type === 'Property' &&
        getStringValue(property.key) === 'force' &&
        isBooleanLiteral(property.value, true)
    )
  );
}

// https://playwright.dev/docs/api/class-locator
const methodsWithForceOption = new Set([
  'check',
  'uncheck',
  'click',
  'dblclick',
  'dragTo',
  'fill',
  'hover',
  'selectOption',
  'selectText',
  'setChecked',
  'tap',
]);

export default {
  create(context) {
    return {
      MemberExpression(node) {
        if (
          methodsWithForceOption.has(getStringValue(node.property)) &&
          node.parent.type === 'CallExpression'
        ) {
          const reportNode = isForceOptionEnabled(node.parent);

          if (reportNode) {
            context.report({ messageId: 'noForceOption', node: reportNode });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prevent usage of `{ force: true }` option.',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-force-option.md',
    },
    messages: {
      noForceOption: 'Unexpected use of { force: true } option.',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
