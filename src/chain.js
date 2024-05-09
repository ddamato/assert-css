import { find, generate } from 'css-tree';

/**
 * Determines if match exists at property and/or value within declaration.
 * 
 * @param {String} property - Declaration property, ie. background-color. 
 * @param {String|Function} [value] - Declaration value or matcher function, ie. #c0ffee.
 * @returns {Object} { property: Boolean, value: null|Boolean } 
 */
function selectorMatcher(property, value) {
  const declarationAst = find(this, (node) => node?.type === 'Declaration' && node?.property === property);
  const results = { property: Boolean(declarationAst) };

  if (results.property && typeof value !== 'undefined') {
    const valueAst = find(declarationAst, (node) => node?.type === 'Value');
    results.value = Boolean(valueAst);
    if (results.value) {
      const valueStr = generate(valueAst);
      results.value = typeof value === 'function'
        ? value(valueStr)
        : valueStr === String(value);
    }
  }

  return results;
}

/**
 * Determines if match exists for value within at-rule.
 * 
 * @param {String|Function} value - Declaration value or matcher function, ie. (max-width: 800px).
 * @returns {Object} { atRule: Boolean }
 */
function atRuleMatcher(value) {
  const atRuleAst = find(this, (node) => {
    if (node?.type !== 'Atrule' || !node?.prelude?.value) return;
    return typeof value === 'function'
      ? value(node.prelude.value)
      : node.prelude.value.includes(value)
  });
  return { atRule: Boolean(atRuleAst) };
}

/**
 * Creates object method chain for assertCSS().selector
 * 
 * @param {String} str - Selector string, ie., button.primary 
 * @returns {Object} Object method chain
 */
export function selector(str) {
  const ruleAst = find(this, (node) => node.type === 'Rule' && node.prelude.value === str);

  return {
    exists() {
      if (!Boolean(ruleAst)) throw new Error(`Selector ${str} does not exist`)
    },
    includes(...args) {
      const { property, value } = selectorMatcher.call(ruleAst, ...args);
      if (!property) {
        throw new Error(`Property '${args[0]}' not found in ${str}`)
      } else if (typeof value === 'boolean' && !value) {
        const result = typeof args[1] === 'function' ? `from Function` : args[1];
        throw new Error(`Value '${str}' not found at ${args[0]} in ${result}`);
      }
    },
    not: {
      exists() {
        if (Boolean(ruleAst)) throw new Error(`Selector ${str} does exist`)
      },
      includes(...args) {
        const { property, value } = selectorMatcher.call(ruleAst, ...args);
        if (typeof value !== 'boolean' && property) {
          throw new Error(`Property '${args[0]}' found in ${str}`);
        } else if (value) {
          const result = typeof args[1] === 'function' ? `from Function` : args[1];
          throw new Error(`Value '${args[1]}' found at ${args[0]} in ${result}`);
        }
      }
    }
  }
}

/**
 * Creates object method chain for assertCSS().atRule
 * 
 * @param {String} str - At-rule string, ie., @font-face
 * @returns {Object} Object method chain
 */
export function atRule(str) {
  const ruleAst = find(this, (node) => node.type === 'Atrule' && `@${node.name}` === str);
  return {
    exists() {
      if (!Boolean(ruleAst)) throw new Error(`At-rule ${str} does not exist`);
    },
    includes(...args) {
      const { atRule } = atRuleMatcher.call(ruleAst, ...args);
      const result = typeof args[0] === 'function' ? `from Function` : args[0];
      if (!atRule) throw new Error(`At-rule ${str} does not match ${result}`);
    },
    selector: selector.bind(ruleAst),
    not: {
      exists() {
        if (Boolean(ruleAst)) throw new Error(`At-rule ${str} does exist`);
      },
      includes(...args) {
        const { atRule } = atRuleMatcher.call(ruleAst, ...args);
        if (atRule) throw new Error(`At-rule ${str} does match ${args[0]}`);
      }
    }
  }
}
