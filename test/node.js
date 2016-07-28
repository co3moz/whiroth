var it = require("mocha/lib/mocha.js").it;
var describe = require("mocha/lib/mocha.js").describe;
var should = require('chai').should();
var assert = require('chai').assert;

describe('Whiroth', function () {
  var whiroth;

  describe('require', function () {
    it('should be loaded', function () {
      whiroth = require('../whiroth');
      should.not.equal(whiroth, null);
    });

    it('should has compileTime', function () {
      should.not.equal(whiroth("1 pv").compileTime, null);
    });


    it('should execution has out', function () {
      should.equal(whiroth("1 pv")().out, "1");
    });

    it('should execution has executionTime', function () {
      should.not.equal(whiroth("1 pv")().executionTime, null);
    });

  });

  describe('Language Basics', function () {
    it('should be 1', function () {
      should.equal(whiroth("1")().toString(), "1");
    });

    it('should be 3', function () {
      should.equal(whiroth("1 2 +")().toString(), "3");
    });

    it('should be 2', function () {
      should.equal(whiroth("1 2 *")().toString(), "2");
    });

    it('should be 0.5', function () {
      should.equal(whiroth("1 2 /")().toString(), "0.5");
    });

    it('should be 9', function () {
      should.equal(whiroth("1 2 + 9")().toString(), "9");
    });

    it('should be 10', function () {
      should.equal(whiroth("1 2 + 7 +")().toString(), "10");
    });
  });

  describe('Native javascript function calls', function () {
    it('should be 1', function () {
      should.equal(whiroth("1 2	{Math.min}")().toString(), "1");
    });

    it('should be 2', function () {
      should.equal(whiroth("1 2	{Math.max}")().toString(), "2");
    });

    it('should be 1', function () {
      should.equal(whiroth("1 2	{#min}")().toString(), "1");
    });

    it('should be 2', function () {
      should.equal(whiroth("1 2	{#max}")().toString(), "2");
    });

    it('should be 0.8414709848078965', function () {
      should.equal(whiroth("1 [#sin]")().toString(), "0.8414709848078965");
    });

    it('should be 0.8414709848078965', function () {
      should.equal(whiroth("1 [Math.sin]")().toString(), "0.8414709848078965");
    });

    it('should be exists', function () {
      assert.isNotNaN(whiroth("[=Math.random]")().toString());
    });
  });

  describe('Comments', function () {
    it('should be 1', function () {
      should.equal(whiroth("1 ;2")().toString(), "1");
    });

    it('should be NaN', function () {
      assert.isNaN(whiroth("; 1; 2")().toString());
    });

    it('should be 2', function () {
      should.equal(whiroth(";1 \n2")().toString(), "2");
    });
  });

  describe('Conditional Routines', function () {
    it('should be 5', function () {
      should.equal(whiroth("10 10 == if(5)")().toString(), "5");
    });

    it('should be NaN', function () {
      assert.isNaN(whiroth("10 11 == if(5)")().toString());
    });

    it('should be 5', function () {
      should.equal(whiroth("10 ( i : 5 == if ( break ) )")().toString(), "5");
    });

    it('should be 6', function () {
      should.equal(whiroth("10 ( i 5 == if ( break ) i )")().toString(), "6");
    });

    it('should be 6', function () {
      should.equal(whiroth("10 ( i 5 == if ( continue ) i ) @ @ @ @ ")().toString(), "6");
    });

    it('should be 108', function () {
      should.equal(whiroth("10 20 == if ( 99 ) else ( 108 )")().toString(), "108");
    });

    it('should be 54321', function () {
      should.equal(whiroth("5 (i pv)")().out.toString(), "54321");
    });

    it('should be 12345', function () {
      should.equal(whiroth("5 for (i pv)")().out.toString(), "12345");
    });
  });

  describe('Heap zone', function () {
    it('should be 10', function () {
      should.equal(whiroth("10 set<val> #val")().toString(), "10");
    });

    it('should be 10', function () {
      should.equal(whiroth("set<val, 10> #val")().toString(), "10");
    });

    it('should be equal', function () {
      should.equal(whiroth('set<a, 10> #a set<b> #a #b == if ( "equal" (pc))')().out.toString(), "equal");
    });
  });

  describe('Routines', function () {
    it('should be 3', function () {
      should.equal(whiroth("routine add (+) 1 2 add<>")().toString(), "3");
    });

    it('should be throw error', function () {
      assert.throws(whiroth("routine add (+) routine add (-) 1 2 add<>"), Error, 'already defined routine add');
    });

    it('should be -1', function () {
      should.equal(whiroth("routine add (+) routine add # (-) 1 2 add<>")().toString(), "-1");
    });

    it('should be 625', function () {
      should.equal(whiroth("routine square (: *) 5 square<> square<>")().toString(), "625");
    });
  });

  describe('Self Calling / Defining Routines', function () {
    it('should be 720', function () {
      should.equal(whiroth("routine factorial ( : 1 == if ( 1 * ) else ( : -- factorial<> * ) ) 6 factorial<>")().toString(), "720");
    });

    it('should be some text', function () {
      should.equal(whiroth('routine start ( routine crazy # ( routine crazy # ( routine crazy # ( routine crazy # ( "last" (pc) start <> ) "third" (pc) ) "second" (pc) ) "first" (pc) ) ) start <> crazy<> crazy<> crazy<> crazy<> crazy<> crazy<>')().out.toString(), "firstsecondthirdlastfirstsecond");
    });
  });

  describe('Some tests', function () {
    it('should be prime', function () {
      should.equal(whiroth('set <prime, 23> #prime  ( init i / : [#floor] - 0 == ) #prime -- (+) 2 - 0 == if ( "prime" ) else ( "not prime" ) (pc)')().out.toString(), "prime");
    });

    it('should be not prime', function () {
      should.equal(whiroth('set <prime, 24> #prime  ( init i / : [#floor] - 0 == ) #prime -- (+) 2 - 0 == if ( "prime" ) else ( "not prime" ) (pc)')().out.toString(), "not prime");
    });
  });
});