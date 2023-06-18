import { Rule } from 'eslint';

export default {
  create(context) {
    return {
      CallExpression(node) {},
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
      noUselessAwait: 'Unexpected use of networkidle.',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
