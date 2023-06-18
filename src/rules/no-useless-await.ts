import { Rule } from 'eslint';
import { getStringValue } from '../utils/ast';

const methods = new Set([
  'and',
  'childFrames',
  'first',
  'frame',
  'frameLocator',
  'frames',
  'getByAltText',
  'getByLabel',
  'getByPlaceholder',
  'getByRole',
  'getByTestId',
  'getByText',
  'getByTitle',
  'isClosed',
  'isDetached',
  'last',
  'locator',
  'mainFrame',
  'name',
  'nth',
  'on',
  'or',
  'page',
  'parentFrame',
  'setDefaultNavigationTimeout',
  'setDefaultTimeout',
  'url',
  'video',
  'viewportSize',
  'workers',
]);

export default {
  create(context) {
    return {
      AwaitExpression(node) {
        // Must be a call expression
        if (node.argument.type !== 'CallExpression') return;

        // Must be a foo.bar() call, bare calls are ignored
        const { callee } = node.argument;
        if (callee.type !== 'MemberExpression') return;

        // Must be a method we care about
        const { property } = callee;
        if (!methods.has(getStringValue(property))) return;

        const start = node.loc!.start;
        const range = node.range!;

        context.report({
          fix: (fixer) => fixer.removeRange([range[0], range[0] + 6]),
          loc: {
            end: {
              column: start.column + 5,
              line: start.line,
            },
            start,
          },
          messageId: 'noUselessAwait',
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow unnecessary awaits for Playwright methods',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      noUselessAwait:
        'Unnecessary await expression. This method does not return a Promise.',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
