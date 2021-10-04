function getPromiseMemberExpressionNode(node, matchers) {
  if (node.property.type === "Identifier" && matchers.has(node.property.name)) {
    return node;
  }
}

function isValidExpect(node) {
  const parentType =
    node.parent && node.parent.parent && node.parent.parent.type;

  // Don't report on nodes which are already awaited or returned
  return (
    parentType === "AwaitExpression" ||
    parentType === "ReturnStatement" ||
    parentType === "ArrowFunctionExpression"
  );
}

const expectPlaywrightMatchers = [
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
];

const playwrightTestMatchers = [
  "toBeChecked",
  "toBeDisabled",
  "toBeEditable",
  "toBeEmpty",
  "toBeEnabled",
  "toBeFocused",
  "toBeHidden",
  "toBeVisible",
  "toContainText",
  "toHaveAttribute",
  "toHaveClass",
  "toHaveCount",
  "toHaveCSS",
  "toHaveId",
  "toHaveJSProperty",
  "toHaveText",
  "toHaveTitle",
  "toHaveURL",
  "toHaveValue",
  "toMatchSnapshot",
];

module.exports = {
  create(context) {
    const options = context.options[0] || {};
    const matchers = new Set([
      ...expectPlaywrightMatchers,
      ...playwrightTestMatchers,
      // Add any custom matchers to the set
      ...(options.customMatchers || []),
    ]);

    return {
      MemberExpression(statement) {
        const node = getPromiseMemberExpressionNode(statement, matchers);
        if (!node || isValidExpect(node)) return;

        context.report({
          fix: (fixer) => fixer.insertTextBefore(node, "await "),
          messageId: "expect",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      category: "Possible Errors",
      description: `Identify false positives when async Playwright APIs are not properly awaited.`,
      recommended: true,
    },
    fixable: "code",
    messages: {
      expect: "'expect' matchers must be awaited or returned.",
      testStep: "'test.step' must be awaited.",
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
