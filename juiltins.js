/**
 * JavaScript-Lol: The modulo bug.
 * https://dustinpfister.github.io/2017/09/02/js-whats-wrong-with-modulo/
 * 
 * Or is it a bug?
 * http://python-history.blogspot.com/2010/08/why-pythons-integer-division-floors.html
 */
function mod(a, b) {
  return (a % b + b) % b;
}

class ZeroDivisionError extends Error {
  constructor() {
    super('ZeroDivisionError: integer division or modulo by zero');
  }
}

function abs(n) {
  return Math.abs(n);
}

function any(iterable) {
  return iterable.some(v => !!v);
}

function all(iterable) {
  return iterable.every(v => !!v);
}

function dir(obj) {
  console.dir(obj);
}

function divmod(a, b) {
  if (b === 0) {
    throw new ZeroDivisionError();
  }

  const quotient =  Math.floor(a / b);
  const remainder = mod(a, b);
  
  return [ quotient, remainder ];
}


module.exports = { abs, all, any, dir, divmod, ZeroDivisionError };