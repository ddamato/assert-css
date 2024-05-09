import { parse } from 'css-tree';
import { selector, atRule } from './chain.js';

/**
 * Begins assertion chain with provided CSS.
 * 
 * @param {String} css - CSS String. 
 * @returns {Object} { selector: Function, atRule: Function }
 */
export default function assert (css) {
  const ast = parse(css, {
    parseRulePrelude: false,
    parseAtrulePrelude: false
  });
  return {
    selector: selector.bind(ast),
    atRule: atRule.bind(ast),
  }
}
