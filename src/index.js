import { parse } from 'css-tree';
import { selector, atRule } from './chain.js';

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
