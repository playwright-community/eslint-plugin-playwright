import { Rule } from 'eslint';
import { isPageMethod } from '../utils/ast';

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageMethod(node, 'pause')) {
          context.report({ messageId: 'noNetworkidle', node });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Prevent usage of the networkidle option',
      recommended: true,
    },
    messages: {
      noNetworkidle: 'Unexpected use of networkidle.',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
