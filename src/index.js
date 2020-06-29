import babylonParser from 'prettier/parser-babylon';
import traverse from '@babel/traverse';
import ElementHandler from './ElementHandler';

const { babylon } = babylonParser.parsers;

/**
 * Traverse an AST tree and add missing IDs to JSX elements
 * @param {Object} ast - AST object
 * @param {Object} options - Parser options
 * @return {Object} Update AST.
 */
function processAST(ast, options) {
  const elHandler = new ElementHandler(options);

  // Traverse AST
  traverse(ast, {
    enter(path) {
      elHandler.handle(path);
    },
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
  processAST(ast, options);
  return ast;
}

exports.parsers = {
  babel: {
    ...babylon,
    parse,
  },
};
exports.options = {
  idAttrName: {
    type: 'string',
    category: 'JSX',
    default: 'data-testid',
    description: 'The ID attribute name to use.',
  },
  idElements: {
    type: 'string',
    category: 'JSX',
    defualt: '',
    description: 'A comma-delimtited list of elements which should always have an ID.',
  },
  idWhenAttributes: {
    type: 'string',
    category: 'JSX',
    default: '',
    description: 'A comma-delimited list of attributes which, if present, indicate the element should get an ID.',
  },
};
