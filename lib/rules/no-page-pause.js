const { isPageIdentifier, isCalleeProperty } = require('../utils/ast');

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (isPageIdentifier(node) && isCalleeProperty(node, 'pause')) {
          context.report({ messageId: "noPagePause", node });
        }
      },
    };
  },
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Prevent usage of page.pause()",
      recommended: true,
    },
    messages: {
      noPagePause: "Unexpected use of page.pause().",
    },
    type: "problem",
  },
};
