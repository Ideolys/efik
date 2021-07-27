const {describe, it, before, after, beforeEach, afterEach, assert} = require('../lib/index').test;

let _test = []
describe('test', () => {
  console.log('des', this);

  before((done) => {
    _test.push('test/before1');
    done();
  });
  after(function after1 (done) {
    _test.push('test/after1');
    done();
  });
  beforeEach((done) => {
    _test.push('test/beforeEach1');
    done();
  });
  afterEach((done) => {
    _test.push('test/afterEach1');
    done();
  });

  it('test/it1', (done) => {
    _test.push('test/it1');
    done();
  });
  it('test/it2', (done) => {
    _test.push('test/it2');
    done();
  });

  describe('nestedTest2', () => {
    _test.push('nestedTest2');
    afterEach(function (done) {
      _test.push('nestedTest2/afterEach1');
      done();
    });
    beforeEach(function (done)  {
      _test.push('nestedTest2/beforeEach1');
      done();
    });
    after(function (done) {
      _test.push('nestedTest2/after1');
      done();
    });
    before(function ( done) {
      _test.push('nestedTest2/before1');
      done();
    });
    it('nestedTest2/it1', (done) => {
      _test.push('nestedTest2/it1');
      done();
    });
  });

  it('test/it3', (done) => {
    _test.push('test/it3');
    done();
  });

  describe('nestedTest3', () => {
    _test.push('nestedTest3');
    afterEach(function (done) {
      _test.push('nestedTest3/afterEach1');
      done();
    });
    beforeEach(function (done)  {
      _test.push('nestedTest3/beforeEach1');
      done();
    });
    it('nestedTest3/it1', (done) => {
      _test.push('nestedTest3/it1');
      done();
    });
    after(function (done) {
      _test.push('nestedTest3/after1');
      done();
    });
    before(function ( done) {
      _test.push('nestedTest3/before1');
      done();
    });
  });

  before(() => {
    _test.push('_test/before2');
  });

  after(function after2 () {
    _test.push('test/after2');
  });

  it('test/it4', (done) => {
    _test.push('test/it2');
    assert.str(_test, []);
    done();
  });

});