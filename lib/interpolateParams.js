var paramRegex = /:[a-zA-Z]+/g;

function defaultMap(param, value) {
  return value;
}

function copyParams(params) {
  var result = {};

  for (var param in params) {
    result[param] = params[param];
  }

  return result;
}

module.exports = function interpolateParams(pattern, params, map) {
  if (typeof pattern !== 'string') {
    throw new Error('\'pattern\' must be a string');
    return null;
  }

  if (typeof params !== 'object') {
    throw new Error('\'params\' must be an object');
    return null;
  }

  if (typeof map === 'undefined') {
    map = defaultMap;
  } else if (typeof map !== 'function') {
    throw new Error('\'map\' must be a function');
    return null;
  }

  var remainingParams = copyParams(params);
  var isMatch = true;
  var interpolatedPattern = pattern.replace(paramRegex, function(paramWithColon) {
    var param = paramWithColon.slice(1);

    if (param in params) {
      var value = map(param, params[param]);

      if (value === null) {
        isMatch = false;
        return '';
      }

      delete remainingParams[param];

      return value;
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
