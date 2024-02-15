import { Rule } from 'eslint';
import ESTree from 'estree';
import { dig, isExpectCall, isTestCall } from '../utils/ast';
import { getSourceCode } from '../utils/misc';

function isAssertionCall(
  context: Rule.RuleContext,
  node: ESTree.CallExpression,
  assertFunctionNames: string[],
) {
  return (
    isExpectCall(context, node) ||
    assertFunctionNames.find((name) => dig(node.callee, name))
  );
}

export default {
  create(context) {
    const options = {
      assertFunctionNames: [] as string[],
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    };

    const sourceCode = getSourceCode(context);
    const unchecked: ESTree.CallExpression[] = [];

    function checkExpressions(nodes: ESTree.Node[]) {
      for (const node of nodes) {
        const index =
          node.type === 'CallExpression' ? unchecked.indexOf(node) : -1;

        if (index !== -1) {
          unchecked.splice(index, 1);
          break;
        }
      }
    }

    return {
      CallExpression(node) {
        if (isTestCall(context, node, ['fixme', 'only', 'skip'])) {
          unchecked.push(node);
        } else if (
          isAssertionCall(context, node, options.assertFunctionNames)
        ) {
          const ancestors = sourceCode.getAncestors
            ? sourceCode.getAncestors(node)
            : context.getAncestors();

          checkExpressions(ancestors);
        }
      },
      'Program:exit'() {
        unchecked.forEach((node) => {
          context.report({ messageId: 'noAssertions', node });
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce assertion to be made in a test body',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md',
    },
    messages: {
      noAssertions: 'Test has no assertions',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          assertFunctionNames: {
            items: [{ type: 'string' }],
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
} as Rule.RuleModule;
