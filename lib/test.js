const cli = require('./logger').cli;
const helper = require('./helper');
const util = require('util');
const assert = require('assert').strict;

let testSuites = [];
let currentDescribeInstance = null;
let describeStack = [];
let currentVisitedFilename = '';

function describe (title, describeInstance) {
  if (describeInstance === undefined) {
    describeInstance = title;
    title = '';
  }
  if (currentVisitedFilename === '') {
    throw new Error('Test file cannot be called without using efik test tools');
  }
  let _describeInstance = {
    fn         : describeInstance,
    file       : currentVisitedFilename,
    title      : title,
    before     : [],
    beforeEach : [],
    after      : [],
    afterEach  : [],
    test       : []
  };
  if (currentDescribeInstance !== null) {
    currentDescribeInstance.test.push(_describeInstance);
    describeStack.push(currentDescribeInstance);
  }
  else {
    testSuites.push(_describeInstance);
  }
  currentDescribeInstance = _describeInstance;
  describeInstance();
  currentDescribeInstance = describeStack.pop();
}

function it (title, itInstance) {
  if (itInstance === undefined) {
    itInstance = title;
    title = '';
  }
  let _testInstance = {
    fn    : itInstance,
    title : title
  };
  currentDescribeInstance.test.push(_testInstance);
}

it.only = function itOnly () {

}

function before (beforeFn) {
  currentDescribeInstance.before.push({ fn : beforeFn });
}

function after (afterFn) {
  currentDescribeInstance.after.push({ fn : afterFn });
}

function beforeEach (beforeEachFn) {
  currentDescribeInstance.beforeEach.push({ fn :beforeEachFn });
}

function afterEach (afterEachFn) {
  currentDescribeInstance.afterEach.push({ fn :afterEachFn });
}


assert.eq = function (actual, expected) {
  assert.strictEqual(JSON.stringify(actual, null, 2), JSON.stringify(expected , null, 2));
};


function _run (options) {
  console.log(testSuites)
  for (let i = 0; i < testSuites.length; i++ ) {
    let _testSuite = testSuites[i];

    cli(_testSuite.file);
    // execute before
    helper.queue(_testSuite.before, () => {

      // it is a it('should')
      if (_testSuite.test === undefined)  {

      }
      helper.queue(_testSuite.after, () => {

      });
    });

  }
}

function nextTest (test, beforeEach, afterEach) {
  for (let i = 0; i < testSuites.test.length; i++ ) {
    let _test = testSuites.test[i];
    helper.queue(_testSuite.beforeEach, () => {

      _testSuite.test();

      helper.queue(_testSuite.afterEach, () => {});
    });
  }
}


function _beforeRequire (filename) {
  currentDescribeInstance = null;
  currentVisitedFilename = filename;
  stack = [];
}


module.exports = {
  before,
  after,
  beforeEach,
  afterEach,
  describe,
  it,
  assert,
  // private
  _run,
  _beforeRequire
};