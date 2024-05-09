# assert-css

[![npm version](https://img.shields.io/npm/v/assert-css.svg)](https://www.npmjs.com/package/assert-css)

Assert that CSS is constructed properly.

## Usage

```js
import assertCss from 'assert-css';

describe('CSS generation', function () {
  it('should have the expected CSS', function () {
    assertCss('body { margin: 0; }').selector('body').includes('margin', 0);
  });
});
```

### Chains

The project uses object chaining to complete assertions.

#### `.selector()`

The `.selector()` method has the following possible chains:

- `.selector().exists()`, asserts that the selector is within the CSS.
- `.selector().not.exists()`, asserts that the selector is not within the CSS.
- `.selector().includes(property)`, asserts that the given property exists within the selector.
- `.selector().not.includes(property)`, asserts that the given property does not exist within the selector.
- `.selector().includes(property, value)`, asserts that the property-value pair exists within the selector.
- `.selector().not.includes(property, value)`, asserts that the property-value pair does not exist within the selector.

The `value` within an `includes()` chain can be a custom validator function. This will pass in the resolved value as a string. Return `true` when a match is expected, false to throw an exception.

```js
assertCss('body { margin: 0 1rem }')
  .selector('body')
  .includes('margin', (value) => value.includes('1rem')); // true
```

The given selector must be accurate to the expectation within the CSS. In other words:

```js
assertCss('body[data-theme] { margin: 0 }').selector('body').exists(); // false
assertCss('body[data-theme] { margin: 0 }').selector('body').not.exists(); // true
assertCss('body[data-theme] { margin: 0 }').selector('body[data-theme]').exists(); // true
```

Also, note that this will not dive into at-rules. To check for existence within an at-rule, use `.atRule()` with the appropriate chain.

#### `.atRule()`

Similar `.selector()` in that this checks against the current CSS at-rule and its possible values with some differences:

- `.includes(value)`, completes a generic `String.includes()` against the current value. This is because various at-rule specifications do not have a repeatable construction. So `(max-width: 800px)` will match against `max-width`, `800` and `800px` as examples. You may provide a function here instead for custom matching.
- `.selector()`, is chainable off of `.atRule()` to check for specific selectors within an at-rule with all expected chains further.

See [tests](./test/assert-css.test.js) for possible example chains.