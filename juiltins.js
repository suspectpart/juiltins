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

  values = () => this._set.values();
  keys = () => this._set.keys();
  entries = () => this._set.entries();
  forEach = (callback, thisArg) => this._set.forEach(callback, thisArg);
  has = (value) => this._set.has(value);

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

class ValueError extends Error { }

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

module.exports = { 
  abs, all, any, bool, chr, dir, divmod, frozenset,
  hex, ord, type, zip, ZeroDivisionError, ValueError
};