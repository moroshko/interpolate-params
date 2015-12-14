module.exports = function interpolateParams(pattern, params, indexFn) {
  return {
    interpolatedPattern: pattern,
    remainingParams: params
  };
};
