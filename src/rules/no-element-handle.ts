import { isPageMethod } from '../utils/ast';
import * as ESTree from 'estree';
import { Rule, AST } from 'eslint';

function getPropertyRange(node: ESTree.Node): AST.Range {
  return node.type === 'Identifier'
    ? node.range!
    : [node.range![0] + 1, node.range![1] - 1];
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageMethod(node, '$') || isPageMethod(node, '$$')) {
          context.report({
            messageId: 'noElementHandle',
            suggest: [
              {
                messageId: isPageMethod(node, '$')
                  ? 'replaceElementHandleWithLocator'
                  : 'replaceElementHandlesWithLocator',
                fix: (fixer) => {
                  const { property } = node.callee as ESTree.MemberExpression;

                  // Replace $/$$ with locator
                  const fixes = [
                    fixer.replaceTextRange(
                      getPropertyRange(property),
                      'locator'
                    ),
                  ];

                  // Remove the await expression if it exists as locators do
                  // not need to be awaited.
                  if (node.parent.type === 'AwaitExpression') {
                    fixes.push(
                      fixer.removeRange([node.parent.range![0], node.range![0]])
                    );
                  }

                  return fixes;
                },
              },
            ],
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'The use of ElementHandle is discouraged, use Locator instead',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-element-handle.md',
    },
    hasSuggestions: true,
    messages: {
      noElementHandle: 'Unexpected use of element handles.',
      replaceElementHandleWithLocator: 'Replace `page.$` with `page.locator`',
      replaceElementHandlesWithLocator: 'Replace `page.$$` with `page.locator`',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
