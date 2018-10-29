'use strict'

const isPathInScope = (path, scope, { separator = '.', wildcard = '*', wildcardIsRoot = true } = {}) => {
  return path.split(separator)
    .reduce((possibilities, segment) => {
    const possibility = possibilities.slice(-1).length
        ? `${possibilities.slice(-1)[0]}${separator}${segment}`
        : segment

    possibilities.push(possibility)
    return possibilities
    }, [])
    .map(possibility => (possibility !== path) || wildcardIsRoot ? `${possibility}${separator}${wildcard}` : possibility)
    .concat([wildcard, path])
    .reduce((result, possibility) => result || scope.includes(possibility), false)
}

module.exports = isPathInScope
