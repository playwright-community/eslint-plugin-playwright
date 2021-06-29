function getPromiseMemberExpressionNode(node, matchers) {
  if (node.property.type === "Identifier" && matchers.has(node.property.name)) {
    return node;
  }
}

function isValidExpect(node) {
  const parentType =
    node.parent && node.parent.parent && node.parent.parent.type;

  // Don't report on nodes which are already awaited or returned
  return parentType === "AwaitExpression" || parentType === "ReturnStatement";
}

module.exports = {
  create(context) {
    const options = context.options[0] || {};
    const matchers = new Set([
      "toBeChecked",
      "toBeDisabled",
      "toBeEnabled",
      "toEqualText", // deprecated
      "toEqualUrl",
      "toEqualValue",
      "toHaveFocus",
      "toHaveSelector",
      "toHaveSelectorCount",
      "toHaveText", // deprecated
      "toMatchAttribute",
      "toMatchComputedStyle",
      "toMatchText",
      "toMatchTitle",
      "toMatchURL",
      "toMatchValue",
      // Add any custom matchers to the set
      ...(options.customMatchers || []),
    ]);

    return {
      MemberExpression(statement) {
        const node = getPromiseMemberExpressionNode(statement, matchers);
        if (!node || isValidExpect(node)) return;

        context.report({
          fix(fixer) {
            return fixer.insertTextBefore(node, "await ");
          },
          messageId: "missingAwait",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      category: "Possible Errors",
      description: "Enforce expect-playwright matchers to be awaited.",
      recommended: true,
    },
    fixable: "code",
    messages: {
      missingAwait: "expect-playwright matchers must be awaited or returned.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          customMatchers: {
            items: { type: "string" },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
};
