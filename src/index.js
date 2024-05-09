import fs from 'fs/promises';
import * as csstree from 'css-tree';
import { selector, atRule } from './chain.js';

export default function assert (css) {
  const ast = csstree.parse(css, {
    parseRulePrelude: false,
    parseAtrulePrelude: false
  });
  return {
    selector: selector.bind(ast),
    atRule: atRule.bind(ast),
  }
}
