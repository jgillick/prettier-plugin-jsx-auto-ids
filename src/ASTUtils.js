const t = require('@babel/types');

module.exports = {

  /**
   * Return the name of an AST element
   * @param {Object} path - AST element
   * @return {String}
   */
  getName(path) {
    const { node } = path;
    if (node && node.name) {
      if (node.name.name) {
        return node.name.name;
      }
      return node.name;
    }
    return undefined;
  },

  /**
   * Get an attribute, by name, from a JSX element.
   * @param {JSXOpeningElement} path - AST path for a JSX opening element.
   * @param {String} attrName - The name of the attribute to get
   * @return {Object}
   */
  getAttribute(path, attrName) {
    const { node } = path;
    if (!node || !node.attributes) {
      return undefined;
    }
    return node.attributes.find((attr) => {
      return t.isJSXAttribute(attr) && attr.name.name === attrName;
    });
  },

  /**
   * Return a list of attribute names for this element.
   * @param {JSXOpeningElement} path - AST path for a JSX opening element.
   * @return {String[]}
   */
  getAttributeNames(path) {
    const { node } = path;
    if (!node || !node.attributes) {
      return [];
    }

    return node.attributes
      .filter((attr) => t.isJSXAttribute(attr))
      .map((attr) => {
        return attr.name.name;
      });
  },

  /**
   * Prepend a JSX attribute to a JSX element
   * @param {Object} path - AST element
   * @param {String} name - Attribute name
   * @param {String} value - Attribute value
   * @return {boolean}
   */
  prependAttribute(path, name, value) {
    const attr = t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(value));
    attr.value.extra = {
      rawValue: value,
      raw: JSON.stringify(value),
    };
    path.unshiftContainer('attributes', attr);
  },
};
