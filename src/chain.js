import { find, generate } from 'css-tree';

function selectorMatcher(str, value) {
  const declarationAst = find(this, (node) => node?.type === 'Declaration' && node?.property === str);
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

function atRuleMatcher(value) {
  const atRuleAst = find(this, (node) => {
    if (node?.type !== 'Atrule' || !node?.prelude?.value) return;
    return typeof value === 'function'
      ? value(node.prelude.value)
      : node.prelude.value.includes(value)
  });
  return { atRule: Boolean(atRuleAst) };
}

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