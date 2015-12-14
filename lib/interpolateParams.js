var paramRegex = /:[a-zA-Z]+/g;

function defaultIndexFn(param, value) {
  return value;
}

function copyParams(params) {
  var result = {};

  for (var param in params) {
    result[param] = params[param];
  }

  return result;
}

module.exports = function interpolateParams(pattern, params, indexFn) {
  if (typeof indexFn === 'undefined') {
    indexFn = defaultIndexFn;
  } else if (typeof indexFn !== 'function') {
    throw new Error('\'indexFn\' must be a function');
    return null;
  }

  var remainingParams = copyParams(params);
  var isMatch = true;
  var interpolatedPattern = pattern.replace(paramRegex, function(paramWithColon) {
    var param = paramWithColon.slice(1);

    if (param in params) {
      delete remainingParams[param];
      return indexFn(param, params[param]);
    }

    isMatch = false;
  });

  if (!isMatch) {
    return null;
  }

  return {
    interpolatedPattern: interpolatedPattern,
    remainingParams: remainingParams
  };
};
