function getMemberPartName(node, part) {
  return node[part].type === "Identifier" ? node[part].name : undefined;
}

function getMemberExpressionNode(node, matchers) {
  const propertyName = getMemberPartName(node, "property");

  if (getMemberPartName(node, "object") === "test") {
    return propertyName === "step" ? { node, type: "testStep" } : undefined;
  }

  return matchers.has(propertyName) ? { node, type: "expect" } : undefined;
}

function isValid(node) {
  const grandparentType =
    node.parent && node.parent.parent && node.parent.parent.type;

  return (
    grandparentType === "AwaitExpression" ||
    grandparentType === "ReturnStatement" ||
    grandparentType === "ArrowFunctionExpression"
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
  "toBeOK",
  "toHaveText",
  "toHaveTitle",
  "toHaveURL",
  "toHaveValue",
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
        const result = getMemberExpressionNode(statement, matchers);

        if (result && !isValid(result.node)) {
          context.report({
            fix: (fixer) => fixer.insertTextBefore(result.node, "await "),
            messageId: result.type,
            node: result.node,
          });
        }
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
      testStep: "'test.step' must be awaited or returned.",
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
