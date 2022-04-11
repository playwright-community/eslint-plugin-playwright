const { isPageIdentifier, isEvalIdentifier, isEvalAllIdentifier } = require('../utils/ast');

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageIdentifier(node) && (isEvalIdentifier(node) || isEvalAllIdentifier(node))) {
          context.report({ messageId: isEvalIdentifier(node) ? 'noEval' : 'noEvalAll', node });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'The use of `page.$eval` and `page.$$eval` are discouraged, use `locator.evaluate` or `locator.evaluateAll` instead',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-eval',
    },
    messages: {
      noEval: 'Unexpected use of page.$eval().',
      noEvalAll: 'Unexpected use of page.$$eval().',
    },
    type: 'problem',
  },
};
