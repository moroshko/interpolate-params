var interpolateParams = require('./interpolateParams');

module.exports = function interpolateParamsInFirstMatch(patterns, params, indexFn) {
  var patternsCount = patterns.length;

  for (var i = 0; i < patternsCount; i++) {
    var result = interpolateParams(patterns[i], params, indexFn);

    if (result !== null) {
      return result;
    }
  }

  return null;
};
