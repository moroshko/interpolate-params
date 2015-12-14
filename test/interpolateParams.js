var expect = require('chai').expect;
var interpolateParams = require('../lib/interpolateParams');

var testCases = [
  {
    should: 'throw an Error if indexFn is not a function',
    pattern: ':eyesCount-eyes',
    params: {
      eyesCount: '8'
    },
    indexFn: {
      8: 'eight'
    },
    throw: '\'indexFn\' must be a function'
  },
  {
    should: 'return null if there is no match',
    pattern: ':animal/has/:legsCount-legs/and/:eyesCount-eyes',
    params: {
      eyesCount: '8',
      animal: 'Dog'
    },
    result: null
  },
  {
    should: 'match if there are no params',
    pattern: 'have-a-nice-day',
    params: {
      today: 'Sunday'
    },
    result: {
      interpolatedPattern: 'have-a-nice-day',
      remainingParams: {
        today: 'Sunday'
      }
    }
  },
  {
    should: 'interpolate all params',
    pattern: ':animal/has/:legsCount-legs/and/:eyesCount-eyes',
    params: {
      eyesCount: '8',
      animal: 'Dog',
      legsCount: '2'
    },
    result: {
      interpolatedPattern: 'Dog/has/2-legs/and/8-eyes',
      remainingParams: {}
    }
  },
  {
    should: 'remove interpolated params from remainingParams',
    pattern: ':animal/has/:legsCount-legs/and/:eyesCount-eyes',
    params: {
      eyesCount: '8',
      animal: 'Dog',
      legsCount: '2',
      mood: 'awesome'
    },
    result: {
      interpolatedPattern: 'Dog/has/2-legs/and/8-eyes',
      remainingParams: {
        mood: 'awesome'
      }
    }
  },
  {
    should: 'interpolate using indexFn',
    pattern: ':animal/has/:legsCount-legs/and/:eyesCount-eyes',
    params: {
      eyesCount: '8',
      animal: 'Dog',
      legsCount: '2',
      mood: 'awesome'
    },
    indexFn: function(param, value) {
      switch (param) {
        case 'eyesCount':
          return value === '8' ? 'eight' : '';

        case 'legsCount':
          return value === '2' ? 'TWO' : '';

        case 'animal':
          return value === 'Dog' ? 'doggy' : '';

        default:
          return '';
      }
    },
    result: {
      interpolatedPattern: 'doggy/has/TWO-legs/and/eight-eyes',
      remainingParams: {
        mood: 'awesome'
      }
    }
  }
];

describe('interpolateParams should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      var fn = interpolateParams.bind(null, testCase.pattern, testCase.params, testCase.indexFn);

      if (testCase.throw) {
        expect(fn).to.throw(testCase.throw);
      } else {
        expect(fn()).to.deep.equal(testCase.result);
      }
    });
  });
});
