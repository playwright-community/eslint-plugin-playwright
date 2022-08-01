import { isObject, isCalleeProperty } from '../utils/ast';
import * as ESTree from 'estree';
import { Rule, AST } from 'eslint';

function getRange(
  node: ESTree.CallExpression & Rule.NodeParentExtension
): AST.Range {
  const callee = node.callee as ESTree.MemberExpression;
  const start =
    node.parent.type === 'AwaitExpression'
      ? node.parent.range![0]
      : callee.object.range![0];

  return [start, callee.property.range![1]];
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (
          isObject(node, 'page') &&
          (isCalleeProperty(node, '$') || isCalleeProperty(node, '$$'))
        ) {
          context.report({
            messageId: 'noElementHandle',
            suggest: [
              {
                messageId: isCalleeProperty(node, '$')
                  ? 'replaceElementHandleWithLocator'
                  : 'replaceElementHandlesWithLocator',
                fix: (fixer) =>
                  fixer.replaceTextRange(getRange(node), 'page.locator'),
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
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-element-handle',
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
