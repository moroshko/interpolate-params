var expect = require('chai').expect;
var interpolateParamsInFirstMatch = require('../lib/interpolateParamsInFirstMatch');

function map(param, value) {
  switch (param) {
    case 'language':
      return value[0] === 'E' ? value.toUpperCase() : null;

    default:
      return value;
  }
}

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
      { pattern: '/:when/:language/is/:description' },
      { pattern: '/:language/is/:description' },
      { pattern: '/:language' }
    ],
    params: {
      when: 'today',
      description: 'awesome'
    },
    result: null
  },
  {
    should: 'interpolate the first match',
    patterns: [
      { pattern: '/:when/:language/is/:description' },
      { pattern: '/:language/is/:description', map: map },
      { pattern: '/:language' }
    ],
    params: {
      year: '2015',
      description: 'awesome',
      language: 'Elm'
    },
    result: {
      interpolatedPattern: '/ELM/is/awesome',
      remainingParams: {
        year: '2015'
      }
    }
  },
  {
    should: 'not interpolate if map returns null',
    patterns: [
      { pattern: '/:when/:language/is/:description' },
      { pattern: '/:language/is/:description', map: map },
      { pattern: '/:language' }
    ],
    params: {
      year: '2015',
      description: 'awesome',
      language: 'Javascript'
    },
    result: {
      interpolatedPattern: '/Javascript',
      remainingParams: {
        year: '2015',
        description: 'awesome'
      }
    }
  }
];

describe('interpolateParamsInFirstMatch should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      expect(interpolateParamsInFirstMatch(testCase.patterns, testCase.params)).to.deep.equal(testCase.result);
    });
  });
});
