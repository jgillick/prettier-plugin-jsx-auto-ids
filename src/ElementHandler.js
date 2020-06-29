import * as t from '@babel/types';
import ASTUtils from './ASTUtils';
import IDGenerator from './IDGenerator';

/**
 * Handles adding ID attributes to JSX elements for a file.
 * @param {Object} options - Prettier parser options.
 */
export default class ElementHandler {
  constructor(options) {
    this.idName = 'data-testid';
    this.attrList = [];
    this.elemList = [];
    this.idGen = new IDGenerator(options.filepath);
    this.processOptions(options);
  }

  /**
   * Process the parser options.
   * @param {Object} options
   */
  processOptions(options) {
    this.idName = options.idAttrName || this.idName;

    const idElements = options.idElements || '';
    const idWhenAttributes = options.idWhenAttributes || '';
    this.elemList = idElements.split(',').map((i) => i.trim());
    this.attrList = idWhenAttributes.split(',').map((i) => i.trim());
  }

  /**
   * Takes in a JSX element and handles adding/modifying the
   * @param {JSXOpeningElement} path - AST path for a JSX opening element.
   */
  handle(path) {
    if (!path.type || !t.isJSXOpeningElement(path)) {
      return;
    }

    const elemName = ASTUtils.getName(path);
    const attributes = ASTUtils.getAttributeNames(path);
    const attrMatch = this.attrList.find((a) => attributes.includes(a));

    // Restrict if it doesn't match element name or attribute conditions
    if (
      (this.elemList.length && !this.elemList.includes(elemName))
      && (this.attrList.length && !attrMatch)
      && !attributes.includes(this.idName)
    ) {
      return;
    }

    if (attributes.includes(this.idName)) {
      this.updateId(path);
    } else {
      this.addId(path);
    }
  }

  /**
   * Add a unique ID attribute to this element
   * @param {JSXOpeningElement} path - AST path for a JSX opening element.
   */
  addId(path) {
    ASTUtils.prependAttribute(path, this.idName, this.idGen.createId());
  }

  /**
   * Update the ID on this element, if it is not unique to the file.
   * @param {JSXOpeningElement} path - AST path for a JSX opening element.
   */
  updateId(path) {
    const attr = ASTUtils.getAttribute(path, this.idName);
    if (!attr || !t.isStringLiteral(attr.value)) {
      return;
    }

    const valueNode = attr.value;
    const id = valueNode.value;
    const uniqueID = this.idGen.ensureUniqueId(id);

    // Update ID
    if (id !== uniqueID) {
      valueNode.value = uniqueID;
      attr.value.extra.rawValue = uniqueID;
      attr.value.extra.raw = JSON.stringify(uniqueID);
    }
  }
}
