var expect = require('chai').expect;
var interpolateParamsInFirstMatch = require('../lib/interpolateParamsInFirstMatch');

var testCases = [
  {
    should: 'return null if no patterns provided',
    patterns: [],
    params: {
      color: 'blue'
    },
    result: null
  },
  {
    should: 'return null if none of the patterns match',
    patterns: [
      '/:when/:language/is/:description',
      '/:language/is/:description',
      '/:language'
    ],
    params: {
      when: 'today',
      description: 'awesome'
    },
    result: null
  },
  {
    should: 'return the first match',
    patterns: [
      '/:when/:language/is/:description',
      '/:language/is/:description',
      '/:language'
    ],
    params: {
      year: '2015',
      description: 'awesome',
      language: 'Elm'
    },
    indexFn: function(param, value) {
      return value.toUpperCase();
    },
    result: {
      interpolatedPattern: '/ELM/is/AWESOME',
      remainingParams: {
        year: '2015'
      }
    }
  }
];

describe('interpolateParamsInFirstMatch should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      expect(interpolateParamsInFirstMatch(testCase.patterns, testCase.params, testCase.indexFn)).to.deep.equal(testCase.result);
    });
  });
});
