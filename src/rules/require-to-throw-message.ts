import { Rule } from 'eslint';
import { getStringValue } from '../utils/ast';
import { parseFnCall } from '../utils/parseFnCall';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const call = parseFnCall(context, node);
        if (call?.type !== 'expect') return;

        if (
          call.matcherArgs.length === 0 &&
          ['toThrow', 'toThrowError'].includes(call.matcherName) &&
          !call.modifiers.some((nod) => getStringValue(nod) === 'not')
        ) {
          // Look for `toThrow` calls with no arguments.
          context.report({
            data: { matcherName: call.matcherName },
            messageId: 'addErrorMessage',
            node: call.matcher,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Require a message for `toThrow()`',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/require-to-throw-message.md',
    },
    messages: {
      addErrorMessage: 'Add an error message to {{ matcherName }}()',
    },
    schema: [],
    type: 'suggestion',
  },
} as Rule.RuleModule;
