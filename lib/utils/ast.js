function isPageIdentifier({ callee }) {
  return (
    callee &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'page'
  );
}

function isCalleeProperty({ callee }, name) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === name
  );
}

function isTestIdentifier(node) {
  return node.object && node.object.type === 'Identifier' && node.object.name === 'test';
}

function hasAnnotation(node, annotation) {
  return (
    node.property &&
    node.property.type === 'Identifier' &&
    node.property.name === annotation
  );
}

function isDescribeIdentifier(node) {
  return (
    node.object &&
    node.object.type === 'MemberExpression' &&
    node.object.property.type === 'Identifier' &&
    node.object.property.name === 'describe'
  );
}

function isStringLiteral(node) {
  return node && node.type === 'Literal' && typeof node.value === 'string';
}

function isBooleanLiteral(node) {
  return node && node.type === 'Literal' && typeof node.value === 'boolean';
}

function isBinaryExpression(node) {
  return node && node.type === 'BinaryExpression';
}

module.exports = {
  isPageIdentifier,
  isCalleeProperty,
  isTestIdentifier,
  hasAnnotation,
  isStringLiteral,
  isBooleanLiteral,
  isBinaryExpression,
};
