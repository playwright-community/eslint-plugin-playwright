function isObject({ callee }, name) {
  return (
    callee &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === name
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

function isObjectProperty({ object }, name) {
  return (
    object &&
    object.type === 'MemberExpression' &&
    object.property.type === 'Identifier' &&
    object.property.name === name
  );
}

function isStringLiteral(node, value) {
  return node && node.type === 'Literal'
  && typeof node.value === 'string'
  && (value === undefined || node.value === value);
}

function isBooleanLiteral(node) {
  return node && node.type === 'Literal' && typeof node.value === 'boolean';
}

function isBinaryExpression(node) {
  return node && node.type === 'BinaryExpression';
}

function isCallExpression(node) {
  return node && node.type === 'CallExpression';
}

function isMemberExpression(node) {
  return node && node.type === 'MemberExpression';
}

function isIdentifier(node, name) {
  return node 
  && node.type === 'Identifier' 
  && (name === undefined || node.name === name);
}

function isDescribeAlias(node) {
  return isIdentifier(node) && node.name === 'describe';
}

function isAccessor(node, value) {
  return isIdentifier(node, value) || isStringNode(node, value);
}

function isStringNode(node, specifics) {
  return isStringLiteral(node, specifics) || isTemplateLiteral(node, specifics);
}

function isTemplateLiteral(node, value) {
  return node.type === 'TemplateLiteral'
  && node.quasis.length === 1
  && (value === undefined || node.quasis[0].value.raw === value);
}

function getStringValue(node) {
  isTemplateLiteral(node) 
  ? node.quasis[0].value.raw 
  : node.value;
}

function getAccessorValue(accessor) {
  return accessor.type === 'Identifier'
  ? accessor.name
  : getStringValue(accessor);
}

function isDescribeProperty(node) {
  const describeProperties = new Set(['parallel', 'serial', 'only', 'skip']);

  return isAccessor(node) && describeProperties.has(getAccessorValue(node));
}

function isDescribeCall(node) {
  if (isDescribeAlias(node.callee)) {
    return true;
  }

  const callee =
    node.callee.type === 'TaggedTemplateExpression'
      ? node.callee.tag
      : node.callee.type === 'CallExpression'
      ? node.callee.callee
      : node.callee;

  if(callee.type === 'MemberExpression' && isDescribeAlias(callee.property)) {
    return true;
  }

  if (callee.type === 'MemberExpression' && isDescribeProperty(callee.property)) {

    return callee.object.type === 'MemberExpression'
      ?  callee.object.object.type === 'MemberExpression'
      ? isDescribeAlias(callee.object.object.property)
      : isDescribeAlias(callee.object.property)
      : (isDescribeAlias(callee.property) || isDescribeAlias(callee.object));
  }

  return false;
};

module.exports = {
  isObject,
  isCalleeProperty,
  isTestIdentifier,
  hasAnnotation,
  isObjectProperty,
  isStringLiteral,
  isBooleanLiteral,
  isBinaryExpression,
  isCallExpression,
  isMemberExpression,
  isDescribeCall
};
