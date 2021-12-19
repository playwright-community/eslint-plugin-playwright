module.exports = {
  create(context) {
    return {
      MemberExpression(node) {
        if (node.object.name === "page" && node.property.name === "pause") {
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
