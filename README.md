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
var interpolateParams = require('interpolate-params'). interpolateParams;
// or
var interpolateParamsInFirstMatch = require('interpolate-params'). interpolateParamsInFirstMatch;
```

## API

* [`interpolateParams(pattern, params, indexFn)`](#interpolateParams)
* [`interpolateParamsInFirstMatch(patterns, params, indexFn)`](#interpolateParamsInFirstMatch)

<a name="interpolateParams"></a>
### interpolateParams(pattern, params, indexFn)

Interpolates `params` in the given parameterized `pattern`, using an optional `indexFn`.

If all `pattern` parameters appear in `params`, the interpolation is considered successful, and the interpolated pattern along with the remaining params are returned. Otherwise, `null` is returned.

`pattern` parameters must be in the following format: `:camelCase`

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
  indexFn: function(param, value) {
    switch (param) {
      case 'userId':
        return value === '456' ? 'Misha' : '';

      case 'friendId':
        return value === '123' ? 'David' : '';

      default:
        return '';
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
### interpolateParamsInFirstMatch(patterns, params, indexFn)

Interpolates `params` in one of the parameterized `patterns`, using an optional `indexFn`. If none of the `patterns` match, `interpolateParamsInFirstMatch` returns `null`. Otherwise, it returns the first successful interpolation.

#### Example 1

```js
var result = interpolateParamsInFirstMatch(
  [
    '/users/:userId/friends/:friendId/photo',
    '/users/:userId/friends/:friendId',
    '/users/:userId/friends',
    '/users/:userId',
    '/users'
  ],
  {
    userId: '456',
    mood: 'Awesome'
  }
);

/* 
  Returns:
    {
      interpolatedPattern: '/users/456/friends',
      remainingParams: {
        mood: 'Awesome'
      }
    }
*/
```

#### Example 2

```js
var result = interpolateParamsInFirstMatch(
  [
    '/users/:userId/friends/:friendId/photo',
    '/users/:userId/friends/:friendId',
    '/users/:userId/friends',
    '/users/:userId',
    '/users'
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
*/
```

#### Example 3

```js
var result = interpolateParamsInFirstMatch(
  [
    '/users/:userId/friends/:friendId/photo',
    '/users/:userId/friends/:friendId',
    '/users/:userId/friends',
    '/users/:userId'
  ],
  {
    friendId: '123'
  }
);

/* 
  Returns:
    null
    
  because none of the `patterns` match.
*/
```


## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)
