import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

/**
 * Return a 5-character UUID
 * @return {String}
 */
const shortUuid = () => uuidv4().substr(0, 5);

/**
 * Generate IDs which will be unique for a file.
 */
class IDGenerator {
  constructor(filepath) {
    this.prefix = '';
    this.ids = new Set();

    // Get prefix from file name
    if (filepath) {
      const ext = path.extname(filepath);
      let prefix = path.basename(filepath, ext);

      // If this is an index file, use parent path name
      if (prefix.toLowerCase() === 'index') {
        prefix = path.basename(path.dirname(filepath));
      }

      this.prefix = prefix;
    } else {
      this.prefix = shortUuid();
    }
  }

  /**
   * Create a new unique ID
   * @return {String}
   */
  createId() {
    let id;
    do {
      id = `${this.prefix}-${shortUuid()}`;
    } while (this.ids.has(id));
    this.ids.add(id);
    return id;
  }

  /**
   * Check that the passed ID is unique to the file.
   * If it's unique, return the ID, unchanged.
   * If it's not unique, add a unique identifier to the end.
   * @param {String} id - ID to verify.
   * @return {String}
   */
  ensureUniqueId(id) {
    let i = 0;
    let uniqueId = id;

    while (this.ids.has(uniqueId)) {
      i += 1;
      uniqueId = `${id}-${i}`;
    }

    this.ids.add(uniqueId);
    return uniqueId;
  }
}

module.exports = IDGenerator;
