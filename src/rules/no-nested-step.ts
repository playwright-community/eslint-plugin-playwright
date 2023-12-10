import { Rule } from 'eslint';
import ESTree from 'estree';
import { isPropertyAccessor } from '../utils/ast';

function isStepCall(node: ESTree.Node): boolean {
  const inner = node.type === 'CallExpression' ? node.callee : node;

  if (inner.type !== 'MemberExpression') {
    return false;
  }

  return isPropertyAccessor(inner, 'step');
}

export default {
  create(context) {
    const stack: number[] = [];

    function pushStepCallback(node: Rule.Node) {
      if (node.parent.type !== 'CallExpression' || !isStepCall(node.parent)) {
        return;
      }

      stack.push(0);

      if (stack.length > 1) {
        context.report({
          messageId: 'noNestedStep',
          node: node.parent.callee,
        });
      }
    }

    function popStepCallback(node: Rule.Node) {
      const { parent } = node;

      if (parent.type === 'CallExpression' && isStepCall(parent)) {
        stack.pop();
      }
    }

    return {
      ArrowFunctionExpression: pushStepCallback,
      'ArrowFunctionExpression:exit': popStepCallback,
      FunctionExpression: pushStepCallback,
      'FunctionExpression:exit': popStepCallback,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow nested `test.step()` methods',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nested-step.md',
    },
    messages: {
      noNestedStep: 'Do not nest `test.step()` methods.',
    },
    schema: [],
    type: 'problem',
  },
} as Rule.RuleModule;
