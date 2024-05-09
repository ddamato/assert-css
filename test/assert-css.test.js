import assert from '../src/index.js';

describe('assert-css', function () {
  describe('root styles', function () {
    it('should assert selector exists', function () {
      assert('body { margin: 0; }')
        .selector('body')
        .exists();
    });
  
    it('should assert selector does not exist', function () {
      assert('body { margin: 0; }')
        .selector('html')
        .not.exists();
    });
  
    it('should assert selector includes property', function () {
      assert('body { margin: 0; }')
        .selector('body')
        .includes('margin');
    });
  
    it('should assert selector does not include property', function () {
      assert('body { margin: 0; }')
        .selector('body')
        .not.includes('font-family');
    });
  
    it('should assert selector includes property & value', function () {
      assert('body { margin: 0; }')
        .selector('body')
        .includes('margin', 0);
    });
  
    it('should assert selector does not include property & value', function () {
      assert('body { margin: 0; }')
        .selector('body')
        .not.includes('margin', 'auto');
    });

    it('should assert with custom value validator', function () {
      assert('body { margin: 0 1rem; }')
        .selector('body')
        .includes('margin', (actual) => actual.includes('1rem'));
    });
  });

  describe('at-rule styles', function () {
    it('should assert at-rule exists', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .exists();
    });

    it('should assert at-rule does not exist', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@font-face')
        .not.exists();
    });

    it('should assert at-rule includes value', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .includes('max-width: 800px');
    });

    it('should assert at-rule does not include value', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .not.includes('min-width: 700px');
    });

    it('should assert at-rule has selector', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .exists();
    });

    it('should assert at-rule does not have selector', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('html')
        .not.exists();
    });

    it('should assert at-rule has selector with property', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin');
    });

    it('should assert at-rule has selector without property', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('font-size');
    });

    it('should assert at-rule has selector with property and value', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin', 0);
    });

    it('should assert at-rule has selector with property and not value', function () {
      assert('@media (max-width: 800px) { body { margin: 0; } }')
        .atRule('@media')
        .selector('body')
        .not.includes('margin', 'auto');
    });

    it('should assert at-rule has selector with property and value validator', function () {
      assert('@media (max-width: 800px) { body { margin: 0 1rem; } }')
        .atRule('@media')
        .selector('body')
        .includes('margin', (actual) => actual.includes('1rem'));
    });
  })
});