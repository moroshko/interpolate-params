<a href="https://codeship.com/projects/121963" target="_blank">
  <img src="https://img.shields.io/codeship/0ebab7a0-8484-0133-436c-4aba2e1c52b6/master.svg"
       alt="Build Status" />
</a>
<a href="https://npmjs.org/package/interpolate-params" target="_blank">
  <img src="https://img.shields.io/npm/v/interpolate-params.svg"
       alt="NPM Version" />
</a>
<a href="https://npmjs.org/package/interpolate-params" target="_blank">
  <img src="https://img.shields.io/npm/dm/interpolate-params.svg"
       alt="NPM Downloads" />
</a>

# Interpolate Params

## Installation

```shell
npm install interpolate-params --save
```

Then, in your app:

```js
var interpolateParams = require('interpolate-params').interpolateParams;
// or
var interpolateParamsInFirstMatch = require('interpolate-params').interpolateParamsInFirstMatch;
```

## API

* [`interpolateParams(pattern, params, [map])`](#interpolateParams)
* [`interpolateParamsInFirstMatch(patterns, params)`](#interpolateParamsInFirstMatch)

<a name="interpolateParams"></a>
### interpolateParams(pattern, params, [map])

Interpolates `params` in the given parameterized `pattern`, using an optional `map` function (see its uses in the examples below).

If all `pattern` parameters appear in `params`, and `map` doesn't return `null`, the interpolation is considered successful. In this case, the interpolated pattern is returned along with the remaining params. 

Otherwise, `interpolateParams` returns `null`.

`pattern` parameters must have letters only.

#### Example 1

```js
var result = interpolateParams(
  '/users/:userId/friends/:friendId/photo',
  {
    friendId: '123',
    userId: '456',
    mood: 'Awesome'
  }
);

/* 
  Returns:
    {
      interpolatedPattern: '/users/456/friends/123/photo',
      remainingParams: {
        mood: 'Awesome'
      }
    }
*/
```

#### Example 2

```js
var result = interpolateParams(
  '/users/:userId/friends/:friendId/photo',
  {
    friendId: '123',
    userId: '456',
    mood: 'Awesome'
  },
  function(param, value) {
    switch (param) {
      case 'userId':
        return value === '456' ? 'Misha' : null;

      case 'friendId':
        return value === '123' ? 'David' : null;

      default:
        return null;
    }
  }
);

/* 
  Returns:
    {
      interpolatedPattern: '/users/Misha/friends/David/photo',
      remainingParams: {
        mood: 'Awesome'
      }
    }
*/
```

#### Example 3

```js
var result = interpolateParams(
  '/users/:userId/friends/:friendId/photo',
  {
    friendId: '999',
    userId: '456',
    mood: 'Awesome'
  },
  function(param, value) {
    switch (param) {
      case 'userId':
        return value === '456' ? 'Misha' : null;

      case 'friendId':
        return value === '123' ? 'David' : null;

      default:
        return null;
    }
  }
);

/* 
  Returns:
    null
    
  because friendId !== '123'
*/
```

#### Example 4

```js
var result = interpolateParams(
  '/users/:userId/friends/:friendId/photo',
  {
    friendId: '123',
    mood: 'Awesome'
  }
);

/* 
  Returns:
    null
    
  because `userId` is not in `params`.
*/
```

<a name="interpolateParamsInFirstMatch"></a>
### interpolateParamsInFirstMatch(patterns, params)

Interpolates `params` in one of the parameterized `patterns`. Every pattern can have and optional `map` function. If none of the `patterns` match, `interpolateParamsInFirstMatch` returns `null`. Otherwise, it returns the first successful interpolation.

#### Example 1

```js
function paramsMap(param, value) {
  switch (param) {
    case 'userId':
      return value === '456' ? 'Misha' : null;

    case 'friendId':
      return value === '123' ? 'David' : null;

    default:
      return null;
  }
}
  
var result = interpolateParamsInFirstMatch(
  [
    { pattern: '/users/:userId/friends/:friendId/photo', map: paramsMap },
    { pattern: '/users/:userId/friends/:friendId' },
    { pattern: '/users/:userId/friends' },
    { pattern: '/users/:userId' },
    { pattern: '/users' }
  ],
  {
    userId: '456',
    friendId: '999',
    mood: 'Awesome'
  }
);

/* 
  Returns:
    {
      interpolatedPattern: '/users/456/friends/999',
      remainingParams: {
        mood: 'Awesome'
      }
    }
    
  because the first pattern requires friendId === '123'
*/
```

#### Example 2

```js
var result = interpolateParamsInFirstMatch(
  [
    { pattern: '/users/:userId/friends/:friendId/photo' },
    { pattern: '/users/:userId/friends/:friendId' },
    { pattern: '/users/:userId/friends' },
    { pattern: '/users/:userId' },
    { pattern: '/users' }
  ],
  {
    friendId: '123',
    mood: 'Awesome'
  }
);

/* 
  Returns:
    {
      interpolatedPattern: '/users',
      remainingParams: {
        friendId: '123',
        mood: 'Awesome'
      }
    }
    
  because every other pattern requires `userId` to be in params.
*/
```

#### Example 3

```js
var result = interpolateParamsInFirstMatch(
  [
    { pattern: '/users/:userId/friends/:friendId/photo' },
    { pattern: '/users/:userId/friends/:friendId' },
    { pattern: '/users/:userId/friends' },
    { pattern: '/users/:userId' }
  ],
  {
    friendId: '123'
  }
);

/* 
  Returns:
    null
    
  because all the patterns require `userId` to be in params.
*/
```


## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)
