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
    super('integer division or modulo by zero');
  }
}

class TypeError extends Error {
  constructor(message) {
    super(message)
  }
}

// TODO: return the magnitude if n is a complex number
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

// TODO: what about complex?
function divmod(a, b) {
  if (b === 0) {
    throw new ZeroDivisionError();
  }

  const quotient =  Math.floor(a / b);
  const remainder = mod(a, b);
  
  return [ quotient, remainder ];
}

function bool(value) {
  return !!value;
}

function ord(char) {
  if (arguments.length !== 1) {
    throw new TypeError(`ord() takes exactly one argument (${arguments.length} given)`);
  }

  if (typeof char !== 'string') {
    throw new TypeError(`ord() expected string of length 1, but ${typeof char} found`);
  }

  // We can not use char.length as JavaScript may report a length > 1 
  // if a Unicode character is made up of more than one code unit.
  // Spreading string characters into an Array helps counting them properly.
  const length = [...char].length;

  if (length !== 1){
    throw new TypeError(`ord() expected a character, but string of length ${length} found`);
  } 

  return char.codePointAt(0);
}

function hex(n) {
  if (arguments.length !== 1) {
    throw new TypeError(`hex() takes exactly one argument (${arguments.length} given)`);
  }

  const type = typeof n;

  if (type !== "number") {
    if (n.__index__ && typeof n.__index__ === 'function') {
      n = n.__index__();
    } else {
      throw new TypeError(`'${type}' object cannot be interpreted as an integer`);
    }
  }

  return `${n < 0 ? '-' : ''}0x${n.toString(16).slice(n < 0)}`;
}

function* zip(...iterables) {
  if (!iterables.length) return;

  const iterators = iterables.map(iterable => iterable[Symbol.iterator]());

  while(true) {
    let next = iterators.map(iter => iter.next());
    
    if(next.some(({ done }) => done)) {
      break;
    }

    yield next.map(({ value }) => value);
  }
}

module.exports = { 
  abs, all, any, bool, dir, divmod, 
  hex, ord, zip, ZeroDivisionError 
};