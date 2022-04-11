function isPageIdentifier({ callee }) {
  return (
    callee &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'page'
  );
}

function isEvalIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === '$eval'
  );
}

function isEvalAllIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === '$$eval'
  );
}

function isElementHandleIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === '$'
  );
}

function isElementHandlesIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === '$$'
  );
}

function isPauseIdentifier({ callee }) {
  return (
    callee &&
    callee.property &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'pause'
  );
}

module.exports = {
  isPageIdentifier,
  isElementHandleIdentifier,
  isElementHandlesIdentifier,
  isEvalIdentifier,
  isEvalAllIdentifier,
  isPauseIdentifier,
};
