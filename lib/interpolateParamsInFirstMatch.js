var interpolateParams = require('./interpolateParams');

module.exports = function interpolateParamsInFirstMatch(patterns, params) {
  var patternsCount = patterns.length;

  for (var i = 0; i < patternsCount; i++) {
    var result = interpolateParams(patterns[i].pattern, params, patterns[i].map);

    if (result !== null) {
      return result;
    }
  }

  return null;
};
