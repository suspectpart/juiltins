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

class FrozenSet {
  constructor(iterable) {
    this._set = new Set(iterable);

    // This is a FrozenSet, so we better freeze it.
    // There is no need to do it, but it somehow makes 
    // aesthetical sense to do so.
    Object.freeze(this);
  }

  values() {
    return this._set.values();
  }

  keys() {
    return this._set.keys();
  }

  entries() {
    return  this._set.entries();
  }

  forEach(callback, thisArg) {
    return this._set.forEach(callback, thisArg);
  }

  has(value) {
    return this._set.has(value);
  }

  get size() { 
    return this._set.size;
  }

  get [Symbol.toStringTag]() {
    return "FrozenSet";
  }

  [Symbol.iterator]() {
    return this._set[Symbol.iterator]();
  }
}

class ZeroDivisionError extends Error {
  constructor() {
    super('integer division or modulo by zero');
  }
}

class OverflowError extends Error {
  constructor() {
    super('cannot convert float infinity to integer');
  }
}

class ValueError extends Error {}
class NotImplementedException extends Error{}

// TODO: return the magnitude if n is a complex number
function abs(n) {
  return Math.abs(n);
}

function any(iterable) {
  return iterable.some(bool);
}

function all(iterable) {
  return iterable.every(bool);
}

function chr(value) {
  if (typeof value !== 'number') {
    throw new TypeError(`an integer is required (got type ${typeof value})`);
  }

  if(!Number.isInteger(value)) {
    throw new TypeError('integer argument expected, got float');
  }

  if(value < 0 || value >= 0x110000) {
    throw new ValueError('chr() arg not in range(0x110000)');
  }

  return String.fromCodePoint(value);
}

/**
 * Party inspired by https://github.com/dcrosta/xrange -- thank you!
 * 
 * TODO: Add a .count() method that returns either 0 or 1
 */
class Range {
  constructor(start, stop, step) {
    if (step === 0) {
      throw new ValueError('range() arg 3 must not be zero');
    } else if(step < 0) {
      stop = Math.min(stop, start);
    } else {
      stop = Math.max(stop, start);
    }

    this.start = start;
    this.stop = stop;
    this.step = step;
    this.length = Math.floor((stop - start) / step) + bool((stop - start) % step)

    Object.freeze(this);
  }

  *[Symbol.iterator] () {
    let last = this.start;
    let count = 0

    while (count < this.length) {
      yield last;
      last += this.step;
      count += 1;
    }
  }
}

function range(start, stop, step) {
  if (arguments.length === 1) {
    stop = start;
    start = 0;
  } 

  if (arguments.length < 3) {
    step = 1;
  }

  return new Range(start, stop, step);
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

function issubclass(B, A) {
  return Object.is(B, A) || B.prototype instanceof A;
}

function isinstance(obj, classOrClasses) {
  if (Array.isArray(classOrClasses)) {
    return classOrClasses.some(cls => obj instanceof cls);
  }

  return obj instanceof classOrClasses;
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

function frozenset(iterable) {
  return new FrozenSet(iterable);
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

/**
 * is that in any way sane? :-) 
 */
function type(...args) {
  if(args.length === 3) return type_(...args);
  if(args.length != 1)  {
    throw new Error("TODO: test this");
  }

  const obj = args[0];
  if (obj === undefined || obj === null) {
    return obj;
  }

  /**
   * Caution: This doesn't work well with old-school inheritance!
   * 
   * function Animal() {}
   * function Dog() {}
   * Dog.prototype = Object.create(Animal.prototype)
   * 
   * new Dog().constructor // => will be [Function: Animal], NOT [Function: Dog]!
   * 
   * If going this path, make sure to fix the constructor prop on the prototype:
   * 
   * Dog.prototype.constructor = Dog
   * new Dog().constructor // => Fixed, will be [Function: Dog] again.
   */
  return obj.constructor;
}

function type_(name, base, props) {
  const Type = {[name]: function() {}}[name];

  if (base && typeof base === 'object') {
    Type.prototype = base;

    // avoid shadowing the original constructor
    Type.prototype.constructor = Type;
  }
  
  Object.assign(Type.prototype, props);

  return Type;
}

function len(thing) {
  if(typeof thing === 'string') {
    return thing.length;
  }

  if (thing && typeof thing.length === 'number') {
    return thing.length;
  }

  if(isinstance(thing, [Set, Map, FrozenSet])) {
    return thing.size;
  }

  if(isinstance(thing, ArrayBuffer)) {
    return thing.byteLength;
  }

  throw new TypeError(`object of type '${typeof thing}' has no len()`);
}

/**
 * TODO: Reject anything not string or number
 */
function int(value, base) {
  if (base !== undefined && typeof value !== 'string') {
    throw new TypeError("int() can't convert non-string with explicit base");
  }

  base = base || 10;

  if (base === 0) {
    throw new NotImplementedException('interpretation as a code literal not supported yet');
  }

  if (base < 2 || base > 36) {
    throw new ValueError("int() base must be >= 2 and <= 36");
  }

  if (Number.isInteger(value)) {
    return value;
  }

  if(value === Infinity || value === -Infinity) {
    throw new OverflowError();
  }

  if(Number.isNaN(value)) {
    throw new ValueError('cannot convert float NaN to integer');
  }

  if (typeof value === 'boolean') {
    return value + 0;
  }

  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new TypeError(`int() argument must be a string, a bytes-like object or a number, not '${typeof value}'`);
  }

  if (typeof value === 'string') {
    value = value.trim().toLowerCase();

    const unsigned = (str) => str.startsWith('-') ? str.slice(1) : str; 
    const sign = (str) => str.startsWith('-') ? -1 : 1;

    const literal = (value, base, targetBase) => {
      let result;
      if (base !== targetBase || Number.isNaN(result = Number(unsigned(value)))) {
        throw new ValueError(`invalid literal for int() with base ${base}: '${value}'`);
      }

      return result * sign(value);
    }

    if (unsigned(value).startsWith('0b')) return literal(value, base, 2);
    if (unsigned(value).startsWith('0o')) return literal(value, base, 8);
    if (unsigned(value).startsWith('0x')) return literal(value, base, 16);
  }

  const result =  parseInt(value, base);

  if (Number.isNaN(result)) {
    throw new ValueError(`invalid literal for int() with base ${base}: '${value}'`);
  }

  return result;
}

module.exports = { 
  abs, all, any, bool, chr, dir, divmod, frozenset, hex, int, len,
  issubclass, isinstance, ord, range, type, zip, 
  ValueError, ZeroDivisionError, OverflowError, FrozenSet
};
