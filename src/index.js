const babylonParser = require("prettier/parser-babylon");
const { default: traverse } = require("@babel/traverse");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const t = require('@babel/types');

const { babylon } = babylonParser.parsers;

/**
 * Return the name of an AST element
 * @param {Object} path - AST element
 * @return {String}
 */
function getName(path) {
  if (path && path.name) {
    if (path.name.name) {
      return path.name.name;
    } else {
      return path.name;
    }
  }
  return undefined;
}

/**
 * Get an attribute, by name, from a JSX element.
 * @param {Object} path - AST element
 * @return {Object}
 */
function getAttribute(path, attrName) {
  if (!path.node || !path.node.attributes) {
    return null;
  }
  return path.node.attributes.find((attr) => {
    const name = getName(attr);
    return name === attrName;
  });
}

/**
 * Prepend a JSX attribute to a JSX element
 * @param {Object} path - AST element
 * @param {String} name - Attribute name
 * @param {String} value - Attribute value
 * @return {boolean}
 */
function prependAttribute(path, name, value) {
  const attr = t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(value));
  attr.value.extra = {
    rawValue: value,
    raw: JSON.stringify(value),
  }
  path.unshiftContainer('attributes', attr);
}

/**
 * Get file ID
 * @param {Object} options - Parser options
 */
function generateFileID(options) {
  if (options.filepath) {
    const { filepath } = options;
    const ext = path.extname(filepath);
    let name = path.basename(filepath, ext).toLowerCase();
    if (name.match('index')) {
      name = path.basename(path.dirname(filepath))
      name = `${name}Index`;
    }
    return name;
  }
  return uuidv4().substr(0, 5);
}

/**
 * Traverse an AST tree and add missing IDs to JSX elements
 * @param {Object} ast - AST object
 * @param {Object} options - Parser options
 * @return {Object} Update AST.
 */
function processAST(ast, options) {
  const idAttrName = options.idAttributeName;
  const ids = new Set();
  const fileId = generateFileID(options);

  // Generate a unique ID
  function generateID() {
    const id = `${fileId}-${uuidv4().substr(0, 5)}`;
    ids.add(id);
    return id;
  }

  // Ensure this element's ID is unique to the file
  function ensureUniqueIDAttr(attr) {
    const id = attr.value.value;
    let newId = id;
    let i = 0;

    while (ids.has(newId)) {
      i++;
      newId = `${id}-${i}`
    }

    // Update ID
    if (id !== newId) {
      attr.value.value = newId;
      attr.value.extra.rawValue = newId;
      attr.value.extra.raw = JSON.stringify(newId);
    }
    ids.add(newId);
  }

  // Traverse AST
  traverse(ast, {
    enter(path) {
      if (path.type) {
        let name = getName(path.node) || '';
        if (t.isJSXOpeningElement(path)) {
          const idAttr = getAttribute(path, idAttrName);
          if (idAttr) {
            ensureUniqueIDAttr(idAttr);
          } else {
            prependAttribute(path, idAttrName, generateID());
          }
        }
      }
    }
  });

  return ast;
}

/**
 * Parse a script source and return AST.
 * @param {String} text - Script source
 * @param {Object} parsers - Prettier parsers
 * @param {Object} options - Parser options
 */
function parse(text, parsers, options) {
  const ast = babylon.parse(text, parsers, options);
  processAST(ast, options)
  return ast
}

exports.parsers = {
  'babel': {
    ...babylon,
    parse,
  },
};
exports.options = {
  idAttributeName: {
    type: "string",
    category: "JSX",
    default: 'data-testid',
    description: "The ID attribute name to use."
  },
};
