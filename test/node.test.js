var it = require("mocha/lib/mocha.js").it;
var describe = require("mocha/lib/mocha.js").describe;
var should = require('chai').should();

describe('Whiroth', function() {
  var whiroth;

  describe('require', function() {
    it('should be loaded', function() {
      whiroth = require('../whiroth');
      should.not.equal(whiroth, null);
    });

    it('should has compileTime', function() {
      should.not.equal(whiroth("1 pv").compileTime, null);
    });


    it('should execution has out', function() {
      should.equal(whiroth("1 pv")().out, "1");
    });

    it('should execution has executionTime', function() {
      should.not.equal(whiroth("1 pv")().executionTime, null);
    });

  });

  describe('basics', function() {
    it('should be 1', function() {
      should.equal(whiroth("1")().toString(), "1");
    });

    it('should be 3', function() {
      should.equal(whiroth("1 2 +")().toString(), "3");
    });

    it('should be 2', function() {
      should.equal(whiroth("1 2 *")().toString(), "2");
    });

    it('should be 0.5', function() {
      should.equal(whiroth("1 2 /")().toString(), "0.5");
    });

    it('should be 9', function() {
      should.equal(whiroth("1 2 + 9")().toString(), "9");
    });

    it('should be 10', function() {
      should.equal(whiroth("1 2 + 7 +")().toString(), "10");
    });
  });
});