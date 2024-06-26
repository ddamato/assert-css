import assert from 'assert';
import assertCss from '../src/index.js';

describe('assert-css', function () {
  describe('root styles', function () {
    it('should assert selector exists', function () {
      assertCss('body { margin: 0; }')
        .selector('body')
        .exists();
    });
  
    it('should assert selector does not exist', function () {
      assertCss('body { margin: 0; }')
        .selector('html')
        .not.exists();
    });
  
    it('should assert selector includes property', function () {
      assertCss('body { margin: 0; }')
        .selector('body')
        .includes('margin');
    });
  
    it('should assert selector does not include property', function () {
      assertCss('body { margin: 0; }')
        .selector('body')
        .not.includes('font-family');
    });
  
    it('should assert selector includes property & value', function () {
      assertCss('body { margin: 0; }')
        .selector('body')
        .includes('margin', 0);
    });
  
    it('should assert selector does not include property & value', function () {
      assertCss('body { margin: 0; }')
        .selector('body')
        .not.includes('margin', 'auto');
    });

    it('should assert with custom value validator', function () {
      assertCss('body { margin: 0 1rem; }')
        .selector('body')
        .includes('margin', (actual) => actual.includes('1rem'));
    });
  });

  describe('at-rule styles', function () {
    it('should assert at-rule exists', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .exists();
    });

    it('should assert at-rule does not exist', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@font-face')
        .not.exists();
    });

    it('should assert at-rule includes value', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .includes('max-width: 800px');
    });

    it('should assert at-rule does not include value', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .not.includes('min-width: 700px');
    });

    it('should assert at-rule uses custom value validator', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .includes((actual) => actual.includes('800px'));
    });

    it('should assert at-rule has selector', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .exists();
    });

    it('should assert at-rule does not have selector', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('html')
        .not.exists();
    });

    it('should assert at-rule has selector with property', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin');
    });

    it('should assert at-rule has selector without property', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('font-size');
    });

    it('should assert at-rule has selector with property and value', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin', 0);
    });

    it('should assert at-rule has selector with property and not value', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('margin', 'auto');
    });

    it('should assert at-rule has selector with property and value validator', function () {
      assertCss('@media (max-width: 800px) { body { margin: 0 1rem; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin', (actual) => actual.includes('1rem'));
    });
  });

  describe('root throws', function () {
    it('should throw when selector exists', function () {
      assert.throws(() => {
        assertCss('body { margin: 0; }')
        .selector('body')
        .not.exists();
      });
    });
  
    it('should throw when selector does not exist', function () {
      assert.throws(() => {
        assertCss('body { margin: 0; }')
        .selector('html')
        .exists();
      });
    });
  
    it('should throw when selector includes property', function () {
      assert.throws(() => {
        assertCss('body { margin: 0; }')
        .selector('body')
        .not.includes('margin');
      });
    });
  
    it('should throw when selector does not include property', function () {
      assert.throws(() => {
        assertCss('body { margin: 0; }')
        .selector('body')
        .includes('font-family');
      });
    });
  
    it('should throw when selector includes property & value', function () {
      assert.throws(() => {
        assertCss('body { margin: 0; }')
        .selector('body')
        .not.includes('margin', 0);
      });
    });
  
    it('should throw when selector does not include property & value', function () {
      assert.throws(() => {
        assertCss('body { margin: 0; }')
        .selector('body')
        .includes('margin', 'auto');
      });
    });

    it('should assert with custom value validator', function () {
      assert.throws(() => {
        assertCss('body { margin: 0 1rem; }')
        .selector('body')
        .not.includes('margin', (actual) => actual.includes('1rem'));
      });
    });
  });

  describe('at-rule throws', function () {
    it('should throw when at-rule exists', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .not.exists();
      });
    });

    it('should throw when at-rule does not exist', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@font-face')
        .exists();
      });
    });

    it('should throw when at-rule includes value', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .not.includes('max-width: 800px');
      })
    });

    it('should throw when at-rule does not include value', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .includes('min-width: 700px');
      });
    });

    it('should throw when at-rule uses custom value validator', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .not.includes((actual) => actual.includes('800px'));
      });
    });

    it('should throw when at-rule has selector', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.exists();
      });
    });

    it('should throw when at-rule does not have selector', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('html')
        .exists();
      });
    });

    it('should throw when at-rule has selector with property', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('margin');
      });
    });

    it('should throw when at-rule has selector without property', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .includes('font-size');
      });
    });

    it('should throw when at-rule has selector with property and value', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('margin', 0);
      });
    });

    it('should throw when at-rule has selector with property and not value', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin', 'auto');
      });
    });

    it('should throw when at-rule has selector with property and value validator', function () {
      assert.throws(() => {
        assertCss('@media (max-width: 800px) { body { margin: 0 1rem; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('margin', (actual) => actual.includes('1rem'));
      });
    });
  });
});
