var expect = require('chai').expect;
var interpolateParams = require('../lib/interpolateParams');

function map(param, value) {
  switch (param) {
    case 'eyesCount':
      return value === '8' ? 'eight' : null;

    case 'legsCount':
      return value === '2' ? 'TWO' : null;

    case 'animal':
      return value === 'Dog' ? 'doggy' : null;

    default:
      return null;
  }
}

var testCases = [
  {
    should: 'throw an Error if pattern is not a string',
    pattern: [':eyesCount-eyes'],
    params: {
      eyesCount: '8'
    },
    throw: '\'pattern\' must be a string'
  },
  {
    should: 'throw an Error if params is not an object',
    pattern: ':eyesCount-eyes',
    params: 'something',
    throw: '\'params\' must be an object'
  },
  {
    should: 'throw an Error if map is not a function',
    pattern: ':eyesCount-eyes',
    params: {
      eyesCount: '8'
    },
    map: {
      8: 'eight'
    },
    throw: '\'map\' must be a function'
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
    should: 'interpolate using map',
    pattern: ':animal/has/:legsCount-legs/and/:eyesCount-eyes',
    params: {
      eyesCount: '8',
      animal: 'Dog',
      legsCount: '2',
      mood: 'awesome'
    },
    map: map,
    result: {
      interpolatedPattern: 'doggy/has/TWO-legs/and/eight-eyes',
      remainingParams: {
        mood: 'awesome'
      }
    }
  },
  {
    should: 'not interpolate if map returns null',
    pattern: ':animal/has/:legsCount-legs/and/:eyesCount-eyes',
    params: {
      eyesCount: '999',
      animal: 'Dog',
      legsCount: '2',
      mood: 'awesome'
    },
    map: map,
    result: null
  }
];

describe('interpolateParams should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      var fn = interpolateParams.bind(null, testCase.pattern, testCase.params, testCase.map);

      if (testCase.throw) {
        expect(fn).to.throw(testCase.throw);
      } else {
        expect(fn()).to.deep.equal(testCase.result);
      }
    });
  });
});
