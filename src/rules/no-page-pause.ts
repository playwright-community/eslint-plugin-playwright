import { Rule } from 'eslint';
import { isCalleeObject, isCalleeProperty } from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (isCalleeObject(node, 'page') && isCalleeProperty(node, 'pause')) {
          context.report({ messageId: 'noPagePause', node });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Prevent usage of page.pause()',
      recommended: true,
    },
    messages: {
      noPagePause: 'Unexpected use of page.pause().',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
