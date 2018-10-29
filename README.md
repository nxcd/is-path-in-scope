[![Javascript code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# is path in scope?

## Description
> Just it, verify "is path in scope".

Checks wether a given path is covered by given scopes.

## Usage

### Installing
> $ npm install @nxcd/is-path-in-scope

### Examples

#### A Simple example:
Verifies that user scopes have the required path.
```js
// ...

const isPathInScope = require('@nxcd/is-path-in-scope')

// Given scopes
const userScopes = [ 'write', 'read' ]

// The path you are requiring access
const pathRequired = 'read'

if (!isPathInScope(pathRequired, userScopes)){
  throw new Error('You have no power here!')
}

console.log('Run forest, run!')
```

Verifies a deep path
```js
// ...

const userScopes = [ 'something.read', 'anything.read', 'anything.write' ]

isPathInScope('something.write', userScopes)
// false

isPathInScope('something.read')
// true
```

Given an admin user
```js
const userScopes = [ '*' ]

isPathInScope('something.read', userScopes)
// true
```

Given a user with full permission for a specific module
```js
// ...

const userScopes = [ 'something.*' ]

isPathInScope('something.read', userScopes)
// true

isPathInScope ('anything.read', userScopes)
// false
```

#### Optional params
```js
// I don't know why not
const params = {
  separator = '-',
  wildcard = '#'
}

const userScopes = [ 'something-#' ]

isPathScope('something-write', userScopes, params)
```

#### Using with express
Checks whether user scopes have the path required by the route
```js
const isPathInScope = require('@nxcd/is-path-in-scope')

// ...

const scopes = (expected) => {
  if (!Array.isArray(expected)) {
    return scopes(expected.split(' '))
  }

  return (req, res, next) => {
    if (!req.user || !Array.isArray(req.user.scopes)) {
      return next(new HttpError.Unauthorized({
        message: 'authorization token is missing or has an invalid scope grant',
        code: 'unauthorized'
      }))
    }

    const unfulfilledScopes = expected.filter((scope) => !isPathInScope(scope, req.user.scopes))

    if (unfulfilledScopes.length > 0) {
      return next(new HttpError.Unauthorized({
        message: format('the following permissions are required: %s', unfulfilledScopes.join(' ')),
        code: 'insufficient_permissions'
      }))
    }

    next()
  }
}

app.get('/:id', scopes('write'), routes.something.findById)

```
