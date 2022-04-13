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

module.exports = {
  isPageIdentifier,
  isCalleeProperty,
  isTestIdentifier,
  hasAnnotation,
};
