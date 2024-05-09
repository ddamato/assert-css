import { find, generate } from 'css-tree';

function selectorIncludes(str, value) {
  // check for at-rule, then no value
  const declarationAST = find(this, (node) => node?.type === 'Declaration' && node?.property === str);
  const results = {
    property: Boolean(declarationAST)
  };

  if (declarationAST && typeof value !== 'undefined') {
    const valueAST = find(declarationAST, (node) => node?.type === 'Value');
    const valueStr = generate(valueAST);

    results.value = typeof value === 'function'
      ? value(valueStr)
      : valueStr === String(value);
  }

  return results;
}

function atRuleIncludes(str) {
  const atRuleAST = find(this, (node) => node?.type === 'Atrule' && node?.prelude?.value?.includes(str));
  return {
    atRule: Boolean(atRuleAST)
  }
}

export function selector(str) {
  const rule = find(this, (node) => node.type === 'Rule' && node.prelude.value === str);

  return {
    exists: () => {
      if (!Boolean(rule)) throw new Error(`Selector ${str} does not exist`)
    },
    includes: (...args) => {
      const { property, value } = selectorIncludes.call(rule, ...args);
      if (!property) {
        throw new Error(`Property '${args[0]}' not found in ${str}`)
      } else if (typeof value === 'boolean' && !value) {
        throw new Error(`Value '${args[1]}' not found at ${args[0]} in ${str}`);
      }
    },
    not: {
      exists: () => {
        if (Boolean(rule)) throw new Error(`Selector ${str} does exist`)
      },
      includes: (...args) => {
        const { property, value } = selectorIncludes.call(rule, ...args);
        if (typeof value !== 'boolean' && property) {
          throw new Error(`Property '${args[0]}' found in ${str}`);
        } else if (value) {
          throw new Error(`Value '${args[1]}' found at ${args[0]} in ${str}`);
        }
      }
    }
  }
}

export function atRule(str) {
  const rule = find(this, (node) => node.type === 'Atrule' && `@${node.name}` === str);
  return {
    exists: () => {
      if (!Boolean(rule)) throw new Error(`At-rule ${str} does not exist`);
    },
    includes: (...args) => {
      const { atRule } = atRuleIncludes.call(rule, ...args);
      if (!atRule) throw new Error(`At-rule ${str} does not include ${args[0]}`);
    },
    selector: selector.bind(rule),
    not: {
      exists: () => {
        if (Boolean(rule)) throw new Error(`At-rule ${str} does exist`);
      },
      includes: (...args) => {
        const { atRule } = atRuleIncludes.call(rule, ...args);
        if (atRule) throw new Error(`At-rule ${str} does include ${args[0]}`);
      }
    }
  }
}