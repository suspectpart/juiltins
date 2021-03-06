const { 
  abs,
  all,
  any,
  bin,
  bool,
  callable,
  chr,
  divmod,
  enumerate,
  filter,
  frozenset,
  hex,
  input,
  int,
  issubclass,
  isinstance,
  iter,
  len,
  list,
  oct,
  open_,
  ord,
  range,
  sum,
  type,
  zip,
  TextIOWrapper,
  OverflowError,
  ZeroDivisionError,
  UnsupportedOperation,
  ValueError,
  __iter__
} = require("./juiltins");

describe('juiltins', () => {
  describe('abs()', () => {
    it('calculates the absolute of a positive int', () => {
      expect(abs(1)).toBe(1);
    });

    it('calculates the absolute of a positive float', () => {
      expect(abs(1.2)).toBe(1.2);
    });

    it('calculates the absolute of a negative int', () => {
      expect(abs(-1)).toBe(1);
    });

    it('calculates the absolute of a negative float', () => {
      expect(abs(-1.2)).toBe(1.2);
    });

    xit('calculates the absolute of a complex as its magnitude', () => {
      expect.fail('Not Implemented: complex');
    });
  })

  describe('any()', () => {
    [
      { value: [], expected: false },
      { value: [0], expected: false },
      { value: [0, null, undefined, ""], expected: false },
      { value: [1], expected: true },
      { value: [1, 2, 3], expected: true },
      { value: [0, 2, null], expected: true },
    ].forEach(({ value, expected }) => {
      it(`any(${JSON.stringify(value)}) === ${expected}`, () => {
        expect(any(value)).toBe(expected);
      });
    })
  });

  describe('all()', () => {
    [
      { value: [], expected: true },
      { value: [1], expected: true },
      { value: [1, 2, 3], expected: true },
      { value: [null], expected: false },
      { value: [1, 2, 3, null], expected: false },
    ].forEach(({ value, expected }) => {
      it(`all(${JSON.stringify(value)}) === ${expected}`, () => {
        expect(all(value)).toBe(expected);
      });
    })
  });

  describe('divmod()', () => {
    [
      { a: 0, b: 1, expected: [0, 0] },
      { a: 0, b: 2, expected: [0, 0] },
      { a: 1, b: 1, expected: [1, 0] },
      { a: 2, b: 1, expected: [2, 0] },
      { a: 3, b: 4, expected: [0, 3] },
      { a: 1.5, b: 3.2, expected: [0.0, 1.5] },
    ].forEach(({ a, b, expected }) => {
      it(`divmod(${a}, ${b}) === ${expected}`, () => {
        expect(divmod(a, b)).toEqual(expected);
      });
    });

    it('throws ZeroDivisionError when b = 0', () => {
      // Arrange
      const a = 10;
      const b = 0;

      // Act
      expect(() => divmod(a, b)).toThrow(ZeroDivisionError);
    });

    it('mimics Pythons modulo behavior for negative numbers', () => {
      // Arrange
      const a = -200.85;
      const b = 17.56;

      // Act
      const [ quotient, remainder ] = divmod(a, b);
      
      // Assert
      expect(quotient).toEqual(-12.0);
      expect(remainder).toEqual(9.86999999999999);
    });
  });

  describe('bool()', () => {
    [
      { value: true, expected: true, },
      { value: 1, expected: true, },
      { value: 2, expected: true, },
      { value: [], expected: true, }, // would be false in Python, but we're JS here.
      { value: {}, expected: true, },
      { value: "a", expected: true, },
      { value: Infinity, expected: true, },
      { value: () => {}, expected: true, },
      { value: "", expected: false, },
      { value: 0, expected: false, },
      { value: null, expected: false, },
      { value: undefined, expected: false, },
      { value: NaN, expected: false, },
    ].forEach(({ value, expected }) => {
        it(`bool(${value}) is ${expected ? 'truthy' : 'falsy'}`, () => {
          expect(bool(value)).toEqual(expected);
        });
      });
  });

  describe('ord()', () => {
    it('throws TypeError if argument is not a string', () => {
      expect(() => ord({})).toThrow(new TypeError('ord() expected string of length 1, but object found'));
    });

    it('throws TypeError if argument is a too-long string', () => {
      expect(() => ord('abcdefgh')).toThrow(new TypeError('ord() expected a character, but string of length 8 found'));
    });

    it('throws TypeError if argument is missing', () => {
      expect(() => ord()).toThrow(new TypeError('ord() takes exactly one argument (0 given)'));
    });

    it('throws TypeError if too many arguments', () => {
      expect(() => ord("a", "b", "c")).toThrow(new TypeError('ord() takes exactly one argument (3 given)'));
    });

    it('ord("a") is 97 (ASCII)', () => {
      expect(ord("a")).toEqual(97);
    })

    it('ord("\\n") is 10 (escape sequence)', () => {
      expect(ord("\n")).toEqual(10);
    });

    it('ord("💩") is 128169 (Emojis, Unicode)', () => {
      expect(ord("💩")).toEqual(128169);
    });
  });

  describe('hex()', () => {
    [
      {number: 0, expected: '0x0'},
      {number: 255, expected: '0xff'},
      {number: -42, expected: '-0x2a'},
      {number: 2 ** 32 + 1, expected: '0x100000001'},
    ].forEach(({ number, expected }) => {
      it(`hex(${number}) is ${expected}`, () => {
        expect(hex(number)).toEqual(expected);
      });
    });

    it('tries to call __index__ on objects', () => {
      // Arrange
      const object = {
        __index__: () => 32
      };

      const expected = '0x20';

      // Act
      const actual = hex(object);

      // Assert
      expect(actual).toEqual(expected);
    });

    it('throws TypeError if value is neither a number nor has an __index__ on object', () => {
      expect(() => hex(true)).toThrow(new TypeError("'boolean' object cannot be interpreted as an integer"));
    });
  });

  describe('oct()', () => {
    [
      {number: 0, expected: '0o0'},
      {number: 255, expected: '0o377'},
      {number: -42, expected: '-0o52'},
      {number: 2 ** 32 + 1, expected: '0o40000000001'},
    ].forEach(({ number, expected }) => {
      it(`oct(${number}) is ${expected}`, () => {
        expect(oct(number)).toEqual(expected);
      });
    });

    it('tries to call __index__ on objects', () => {
      // Arrange
      const object = {
        __index__: () => 32
      };

      const expected = '0o40';

      // Act
      const actual = oct(object);

      // Assert
      expect(actual).toEqual(expected);
    });

    it('throws TypeError if value is neither a number nor has an __index__ on object', () => {
      expect(() => oct(true)).toThrow(new TypeError("'boolean' object cannot be interpreted as an integer"));
    });
  });

  describe('bin()', () => {
    [
      {number: 0, expected: '0b0'},
      {number: 255, expected: '0b11111111'},
      {number: -42, expected: '-0b101010'},
      {number: 2 ** 32 + 1, expected: '0b100000000000000000000000000000001'},
    ].forEach(({ number, expected }) => {
      it(`bin(${number}) is ${expected}`, () => {
        expect(bin(number)).toEqual(expected);
      });
    });

    it('tries to call __index__ on objects', () => {
      // Arrange
      const object = {
        __index__: () => 32
      };

      const expected = '0b100000';

      // Act
      const actual = bin(object);

      // Assert
      expect(actual).toEqual(expected);
    });

    it('throws TypeError if value is neither a number nor has an __index__ on object', () => {
      expect(() => bin(true)).toThrow(new TypeError("'boolean' object cannot be interpreted as an integer"));
    });
  });


  describe('zip()', () => {
    it('zips empty iterables', () => {
      expect([...zip()]).toEqual([]);
      expect([...zip([])]).toEqual([]);
      expect([...zip([], [])]).toEqual([]);
    });

    it('zips a single iterable', () => {
      expect([...zip([1, 2])]).toEqual([[1], [2]]);
    });

    it('zips two iterables of the same length', () => {
      // Arrange
      const left = [1, 2, 3];
      const right = ["a", "b", "c"];
      const expected = [[1, "a"], [2, "b"], [3, "c"]];

      // Act
      const actual = zip(left, right);
      
      // Assert
      expect([...actual]).toEqual(expected);
    });

    it('only zips up to the length of the left iterable', () => {
      // Arrange
      const left = [1, 2];
      const right = ["a", "b", "c"];
      const expected = [[1, "a"], [2, "b"]];

      // Act
      const actual = zip(left, right);
      
      // Assert
      expect([...actual]).toEqual(expected);
    });

    it('only zips up to the length of the right iterable', () => {
      // Arrange
      const left = [1, 2, 3];
      const right = ["a", "b"];
      const expected = [[1, "a"], [2, "b"]];

      // Act
      const actual = zip(left, right);
      
      // Assert
      expect([...actual]).toEqual(expected);
    });

    it('zips up to the shortest of all iterables', () => {
      // Arrange
      const left = [1, 2, 3, 4];
      const middle = ["a", "b", "c"]
      const right = [null, undefined, true, false, Infinity];

      const expected = [[1, "a", null], [2, "b", undefined], [3, "c", true]];

      // Act
      const actual = zip(left, middle, right);
      
      // Assert
      expect([...actual]).toEqual(expected);
    });

    it('zips up to the shortest of all iterables', () => {
      // Arrange
      const left = [1, 2, 3, 4];
      const middle = ["a", "b", "c"]
      const right = [null, undefined, true, false, Infinity];

      const expected = [[1, "a", null], [2, "b", undefined], [3, "c", true]];

      // Act
      const actual = zip(left, middle, right);
      
      // Assert
      expect([...actual]).toEqual(expected);
    });

    it('zips generators, iterators and other iterable stuff', () => {
      // Arrange
      class Iterator {
        [Symbol.iterator] = function* () {
          yield 1;
          yield 2;
          yield 3;
        }
      }

      const generator = function* () {
        yield "a";
        yield "b";
        yield "c";
      };

      const map = new Map([
        ["k1", Infinity],
        ["k2", NaN],
        ["k3", null],
      ])

      const expected = [
        [1, "a", ["k1", Infinity]], 
        [2, "b", ["k2", NaN]], 
        [3, "c", ["k3", null]]
      ];

      // Act
      const actual = zip(new Iterator(), generator(), map);
      
      // Assert
      expect([...actual]).toEqual(expected);
    });
  });

  describe('type()', () => {
    it('returns the constructor of objects', () => {
      // Arrange
      class Thing {
        constructor(value) {
          this._value = value;
        }
      }

      const thing = new Thing(2);

      // Act
      ctor = type(thing);

      expect(ctor).toEqual(thing.constructor);
      expect((new ctor(3))._value).toEqual(3);
    });

    it('returns null or undefined', () => {
      expect(type(undefined)).toEqual(undefined);
      expect(type(null)).toEqual(null);
    });

    it('creates new types based on a class', () => {
      class Person {
        constructor(name) {
          this.name = name;
        }

        sayHi() {

        }
      }

      const name = 'Employee';
      const base = Person;
      const props = {prop: 100};

      // Act
      const Employee = type(name, base, props);
      const employee = new Employee("horst");

      // Assert
      // properties have been assigned
      expect(employee.prop).toEqual(100);

      // super constructor called
      expect(employee.name).toEqual("horst");

      // prototype inherited
      expect(employee.sayHi).toEqual(Person.prototype.sayHi);

      // did not change Person's prototype
      expect(Person.prototype.prop).toBe(undefined);

      // proper prototype chain
      expect(employee instanceof Person).toEqual(true);
      expect(employee instanceof Employee).toEqual(true);
      expect(employee.constructor).toBe(Employee);
      expect(employee.constructor.name).toBe("Employee");
    });

    it('creates new types based on a constructor function', () => {
      function Person(name) {
          this.name = name;
      }

      Person.prototype.sayHi = () => {};

      const name = 'Employee';
      const base = Person;
      const props = {prop: 100};

      // Act
      const Employee = type(name, base, props);
      const employee = new Employee("horst");

      // Assert
      // properties have been assigned
      expect(employee.prop).toEqual(100);

      // super constructor called
      expect(employee.name).toEqual("horst");

      // prototype inherited
      expect(employee.sayHi).toEqual(Person.prototype.sayHi);

      // did not change Person's prototype
      expect(Person.prototype.prop).toBe(undefined);

      // proper prototype chain
      expect(employee instanceof Person).toEqual(true);
      expect(employee instanceof Employee).toEqual(true);
      expect(employee.constructor).toBe(Employee);
      expect(employee.constructor.name).toBe("Employee");
    });
  });

  describe('chr()', () => {
      it('converts int to char', () => {
        expect(chr(10)).toEqual('\n');
        expect(chr(8364)).toEqual('€');
        expect(chr(0x110000 - 1)).toEqual('􏿿');
      });

      it('converts back and forth', () => {
        expect(ord(chr(0))).toEqual(0);
        expect(ord(chr(12345))).toEqual(12345);
        expect(ord(chr(0x110000 - 1))).toEqual(0x110000 - 1);
      });

      it('throws Error if arg is out of range', () => {
        expect(() => chr(-1)).toThrow(new ValueError('chr() arg not in range(0x110000)'));
        expect(() => chr(0x110000)).toThrow(new ValueError('chr() arg not in range(0x110000)'));
        expect(() => chr(0x123456)).toThrow(new ValueError('chr() arg not in range(0x110000)'));
      });

      it('throws Error if arg is not a number', () => {
        expect(() => chr("test")).toThrow(new ValueError('an integer is required (got type string)'));
      });

      it('throws Error if arg is a float', () => {
        expect(() => chr(1.2)).toThrow(new TypeError('integer argument expected, got float'));
      });
  });

  describe('frozenset()', () => {
    it('supports read operations', () => {
      // Arrange
      const iterable = [1, 2, 3, 2, 3, 1];
      const expected = new Set(iterable); 

      // Act
      const frozen = frozenset(iterable);
      
      // Assert
      expect(frozen.has(1)).toEqual(true);
      expect(frozen.has(2)).toEqual(true);
      expect(frozen.has(4)).toEqual(false);

      expect([...frozen.keys()]).toEqual([...expected.keys()]);
      expect([...frozen.values()]).toEqual([...expected.values()]);
      expect([...frozen.entries()]).toEqual([...expected.entries()]);
    });

    it('won\'t allow to change its size', () => {
      // Arrange
      const frozen = frozenset([1, 2]);

      // Act
      frozen.size = 3;

      // Assert
      expect(frozen.size).toEqual(2);
    });

    it('supports forEach()', () => {
      // Arrange
      const frozen = frozenset([1, 2, 3]);
      spy = [];

      // Act
      frozen.forEach(n => spy.push(n ** 2));
      
      // Assert
      expect(spy).toEqual([1, 4, 9]);
    });

    it('supports iterator', () => {
      // Arrange
      const frozen = frozenset([1, 2, 3]);

      // Act
      const iterator = frozen[Symbol.iterator]();
      
      // Assert
      expect([...iterator]).toEqual([1, 2, 3]);
    });

    it('identifies itself', () => {
      // Arrange
      const frozen = frozenset([1, 2, 3]);

      // Act
      const asString = Object.prototype.toString.call(frozen);

      // Assert
      expect(asString).toEqual('[object FrozenSet]');
      expect(frozen.toString()).toEqual('[object FrozenSet]');
    });
  });

  describe('issubclass()', () => {
    it('checks class hierarchy', () => {
      // Arrange
      class A {}
      class B extends A {}
      class C extends B {}
      class D {}

      // Assert
      expect(issubclass(B, A)).toBe(true);
      expect(issubclass(C, B)).toBe(true);
      expect(issubclass(C, A)).toBe(true);
      expect(issubclass(C, D)).toBe(false);
    });

    it('works for oldschool prototype chains', () => {
      // Arrange
      const A = function() {};
      const B = function() {};
      const C = function() {};
      B.prototype = Object.create(A.prototype);
      C.prototype = Object.create(B.prototype);

      // Assert
      expect(issubclass(B, B)).toBe(true);
      expect(issubclass(B, A)).toBe(true);
      expect(issubclass(C, B)).toBe(true);
      expect(issubclass(C, A)).toBe(true);
    });

    it('recognizes the same type as a subclass of itself', () => {
      // Arrange
      class A {}

      // Assert
      expect(issubclass(A, A)).toBe(true);
    });    
  });

  describe('insinstance()', () => {
    it('checks against a single class', () => {
      // Arrange
      class A {}
      class B extends A {}
      class C extends B {}
      class D {};

      // Act
      const c = new C();

      // Assert
      expect(isinstance(c, C)).toBe(true);
      expect(isinstance(c, B)).toBe(true);
      expect(isinstance(c, A)).toBe(true);
      expect(isinstance(c, D)).toBe(false);
    });

    it('checks against a list of classes', () => {
      // Arrange
      class A {}
      class B extends A {}
      class C {};
      class D {};

      // Act
      const b = new B();

      // Assert
      expect(isinstance(b, [A])).toBe(true);
      expect(isinstance(b, [B])).toBe(true);
      expect(isinstance(b, [A, B])).toBe(true);
      expect(isinstance(b, [A, B, C])).toBe(true);
      expect(isinstance(b, [C])).toBe(false);
      expect(isinstance(b, [C, D])).toBe(false);
    });
  });

  describe('range()', () => {
    it('exposes start, stop and step', () => {
      // Arrange
      const threeSixNine = range(3, 12, 3);

      // Assert
      expect(threeSixNine.start).toEqual(3);
      expect(threeSixNine.stop).toEqual(12);
      expect(threeSixNine.step).toEqual(3);
    });

    it('knows its length', () => {
      expect(range(0, 100, 1).length).toEqual(100);
      expect(range(40, -40, -2).length).toEqual(40);
      expect(range(0, 100, -2).length).toEqual(0);
    });

    it('counts elements', () => {
      // no step
      expect(range(0, 100).count(-1)).toEqual(0);
      expect(range(0, 100).count(0)).toEqual(1);
      expect(range(0, 100).count(1)).toEqual(1);
      expect(range(0, 100).count(99)).toEqual(1);
      expect(range(0, 100).count(100)).toEqual(0);

      // even step
      expect(range(0, 100, 2).count(1)).toEqual(0);
      expect(range(0, 100, 2).count(2)).toEqual(1);
      expect(range(0, 100, 2).count(98)).toEqual(1);
      expect(range(0, 100, 2).count(99)).toEqual(0);

      // odd step
      expect(range(0, 100, 3).count(0)).toEqual(1);
      expect(range(0, 100, 3).count(1)).toEqual(0);
      expect(range(0, 100, 3).count(2)).toEqual(0);
      expect(range(0, 100, 3).count(3)).toEqual(1);

      // negative step
      expect(range(15, -15, -3).count(15)).toEqual(1);
      expect(range(15, -15, -3).count(14)).toEqual(0);
      expect(range(15, -15, -3).count(13)).toEqual(0);
      expect(range(15, -15, -3).count(12)).toEqual(1);
      expect(range(15, -15, -3).count(0)).toEqual(1);
      expect(range(15, -15, -3).count(-3)).toEqual(1);
    });

    it('keeps start, stop and step immutable', () => {
      // Arrange
      const myRange = range(1, 10, 2);

      myRange.start = 2;
      myRange.stop = 11;
      myRange.step = 3;

      // Assert
      expect(myRange.start).toEqual(1);
      expect(myRange.stop).toEqual(10);
      expect(myRange.step).toEqual(2);
    });

    it('does not run away to positive infinity', () => {
      expect([...range(0, 0, 10)]).toEqual([]);
      expect([...range(10, 10, 1)]).toEqual([]);
      expect([...range(12, 10, 2)]).toEqual([]);
    });

    it('does not run away to negative infinity', () => {
      expect([...range(5, -5, 1)]).toEqual([])
      expect([...range(0, -1000, 20)]).toEqual([])
    });

    it('defaults start to 0 and step to 1', () => {
      expect(range(10).start).toEqual(0);
      expect(range(10).step).toEqual(1);
    });

    it('defaults step to 1', () => {
      expect(range(10, 20).step).toEqual(1);
    });

    it('steps in positive direction', () => {
      expect([...range(0, 5, 1)]).toEqual([0, 1, 2, 3, 4])
      expect([...range(0, 10, 2)]).toEqual([0, 2, 4, 6, 8])
      expect([...range(-20, 20, 10)]).toEqual([-20, -10, 0, 10])
      expect([...range(5, 10, 5)]).toEqual([5])
      expect([...range(0, 10, 10)]).toEqual([0])
    });

    it('steps in negative direction', () => {
      expect([...range(-4, -10, -2)]).toEqual([-4, -6, -8]);
      expect([...range(10, -10, -5)]).toEqual([10, 5, 0, -5]);
    });

    it('throws ValueError if step=0', () => {
      expect(() => range(1, 2, 0)).toThrow(new ValueError('range() arg 3 must not be zero'));
    });
  });

  describe('len()', () => {
    it('works with strings', () => {
      expect(len('python')).toEqual(6);
    });

    it('works with functions', () => {
      // JavaScript functions expose the number of parameters as their length.
      // Did you know? I didn't.
      expect(len((a, b, c) => {})).toEqual(3);
      expect(len(function(a, b, c){})).toEqual(3);
      expect(len(async function(a, b, c, d){})).toEqual(4);
      expect(len(function*(d, e){})).toEqual(2);
    })

    it('works with Arrays', () => {
      expect(len([1, 2, 3])).toEqual(3);
    });

    it('works with NodeList', () => {
      // Arrange
      for (let i = 0; i < 5; i++) {
        document.body.appendChild(document.createElement('div'));
      }

      const divs  = document.querySelectorAll('div');

      // Act
      const length = len(divs);

      // Assert
      expect(length).toEqual(5);
    });

    it('works with Sets', () => {
      expect(len(new Set([1, 2, 3, 4, 5]))).toEqual(5);
    });

    it('works with FrozenSets', () => {
      expect(len(frozenset([1, 2, 3, 4, 5]))).toEqual(5);
    });

    it('works with Maps', () => {
      expect(len(new Map([["a", 1], ["b", 2], ["c", 3]]))).toEqual(3);
    });

    it('works with Range', () => {
      expect(len(range(0, 20, 2))).toEqual(10);
    });

    it('works with ArrayBuffer', () => {
      expect(len(new ArrayBuffer(10))).toEqual(10);
    });

    it('works with Buffer', () => {
      expect(len(new Buffer(10))).toEqual(10);
    });

    it('works with Int8Array', () => {
      expect(len(new Uint8Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Uint8Array', () => {
      expect(len(new Uint8Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Uint8ClampedArray', () => {
      expect(len(new Uint8Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Int16Array', () => {
      expect(len(new Int16Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Uint16Array', () => {
      expect(len(new Uint16Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Int32Array', () => {
      expect(len(new Int32Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Uint32Array', () => {
      expect(len(new Uint32Array([1, 2, 3]))).toEqual(3);
    });

    it('works with Float32Array', () => {
      expect(len(new Float32Array([1.2, 23.2, 37.7, 8.2]))).toEqual(4);
    });

    it('works with Float64Array', () => {
      expect(len(new Float64Array([1.2, 23.2, 37.7, 8.2, 2 ** 65]))).toEqual(5);
    });

    it('works with BigInt64Array', () => {
      expect(len(new BigInt64Array([BigInt(2 ** 128)]))).toEqual(1);
    });

    it('works with BigUint64Array', () => {
      expect(len(new BigUint64Array([BigInt(2 ** 127), BigInt(1)]))).toEqual(2);
    });

    it('throws TypeError if length can not be determined', () => {
      expect(() => len(true)).toThrow(new TypeError("object of type 'boolean' has no len()"));
      expect(() => len(null)).toThrow(new TypeError("object of type 'object' has no len()"));
      expect(() => len({})).toThrow(new TypeError("object of type 'object' has no len()"));
      expect(() => len(undefined)).toThrow(new TypeError("object of type 'undefined' has no len()"));
    });
  });

  describe('int()', () => {
    it('allows only bases >= 2 and <= 36', () => {
      const error = new ValueError("int() base must be >= 2 and <= 36");
      expect(() => int("1", -10)).toThrow(error);
      expect(() => int("1", 1)).toThrow(error);
      expect(() => int("1", 37)).toThrow(error);
    });

    it('returns numbers unchanged', () => {
      expect(int(0)).toEqual(0);
      expect(int(2 ** 32)).toEqual(2 ** 32);
      expect(int(-4096)).toEqual(-4096);
    });

    it('floors floats', () => {
      expect(int(10.5)).toEqual(10);
      expect(int(.2)).toEqual(0);
      expect(int(-32.5)).toEqual(-32);
    });

    it('parses booleans', () => {
      expect(int(false)).toEqual(0);
      expect(int(true)).toEqual(1);
    });

    it('parses binary strings', () => {
      expect(int('0b0', 2)).toEqual(0);
      expect(int('0b1111', 2)).toEqual(15);
      expect(int('0B1111', 2)).toEqual(15); // upper case
      expect(int('     0b1111', 2)).toEqual(15);
      expect(int('0b1111     ', 2)).toEqual(15);
      expect(int('-0b1111', 2)).toEqual(-15);
      expect(int('     -0b1111     ', 2)).toEqual(-15);
      expect(() => int('-0b11gargabe', 2)).toThrow(new ValueError("invalid literal for int() with base 2: '-0b11gargabe'"));
    });

    it('rejects binary strings with base != 2', () => {
      expect(() => int('0b1111', 8)).toThrow(new ValueError("invalid literal for int() with base 8: '0b1111'"));
      expect(() => int('0b1111', 16)).toThrow(new ValueError("invalid literal for int() with base 16: '0b1111'"));
      expect(() => int('-0b1111', 36)).toThrow(new ValueError("invalid literal for int() with base 36: '-0b1111'"));
    })

    it('parses octal strings', () => {
      expect(int('0o0', 8)).toEqual(0);
      expect(int('0o77', 8)).toEqual(63);
      expect(int('0O77', 8)).toEqual(63); // upper case
      expect(int('      0o77', 8)).toEqual(63);
      expect(int('0o77      ', 8)).toEqual(63);
      expect(int('-0o77', 8)).toEqual(-63);
      expect(int('        -0o77        ', 8)).toEqual(-63);
      expect(() => int('-0o77gargabe', 8)).toThrow(new ValueError("invalid literal for int() with base 8: '-0o77gargabe'"));
    });

    it('rejects octal strings with base != 8', () => {
      expect(() => int('0o77', 10)).toThrow(new ValueError("invalid literal for int() with base 10: '0o77'"));
      expect(() => int('0o77', 16)).toThrow(new ValueError("invalid literal for int() with base 16: '0o77'"));
      expect(() => int('-0o77', 20)).toThrow(new ValueError("invalid literal for int() with base 20: '-0o77'"));
    })

    it('parses hex strings', () => {
      expect(int('0x0', 16)).toEqual(0);
      expect(int('0xff', 16)).toEqual(255);
      expect(int('0Xff', 16)).toEqual(255); // upper case
      expect(int('    0xff', 16)).toEqual(255);
      expect(int('0xff    ', 16)).toEqual(255);
      expect(int('-0xff', 16)).toEqual(-255);
      expect(int('    -0xff      ', 16)).toEqual(-255);
      expect(() => int('-0x11gargabe', 16)).toThrow(new ValueError("invalid literal for int() with base 16: '-0x11gargabe'"));
    });

    it('rejects hex strings with base != 16', () => {
      expect(() => int('0xff', 2)).toThrow(new ValueError("invalid literal for int() with base 2: '0xff'"));
      expect(() => int('0xff', 10)).toThrow(new ValueError("invalid literal for int() with base 10: '0xff'"));
      expect(() => int('-0xff', 24)).toThrow(new ValueError("invalid literal for int() with base 24: '-0xff'"));
    });

    it('works with all bases >= 2 and <= 36', () => {
      expect(int("12", 3)).toEqual(5);
      expect(int("12", 4)).toEqual(6);
      expect(int("44", 5)).toEqual(24);
      expect(int("55", 6)).toEqual(35);
      expect(int("66", 7)).toEqual(48);
      expect(int("77", 8)).toEqual(63);
      /* .. snip, let's trust this working for all others as well .. */
      expect(int("yyyy", 35)).toEqual(1500624);
      expect(int("xyzabc", 36)).toEqual(2054137080);
    });

    it('fails when string does not conform to base', () => {
      expect(() => int("99", 5)).toThrow(new ValueError("invalid literal for int() with base 5: '99'"));
      expect(() => int("zz", 20)).toThrow(new ValueError("invalid literal for int() with base 20: 'zz'"));
    });

    it('fails to convert +/-Infinity with OverflowError', () => {      
      expect(() => int(+Infinity)).toThrow(new OverflowError());
      expect(() => int(-Infinity)).toThrow(new OverflowError());
    });

    it('fails to convert NaN to integer with ValueError', () => {
      expect(() => int(NaN)).toThrow(new ValueError('cannot convert float NaN to integer'));
    });

    it('fails to parse empty string', () => {
      expect(() => int('')).toThrow(new ValueError("invalid literal for int() with base 10: ''"));
    });

    it('fails to parse malformed base 10 strings', () => {
      expect(() => int('')).toThrow(ValueError);
      expect(() => int('test')).toThrow(ValueError);
      expect(() => int('0b11100')).toThrow(ValueError);
      expect(() => int('0x11100')).toThrow(ValueError);
      expect(() => int('   - 10000')).toThrow(ValueError);
    });

    it('parses base 10 number strings', () => {
      expect(int("0")).toEqual(0);
      expect(int("1")).toEqual(1);
      expect(int("-1")).toEqual(-1);
      expect(int("     2000")).toEqual(2000);
      expect(int("2000     ")).toEqual(2000);
      expect(int("   2000  ")).toEqual(2000);
      expect(int("-32.5")).toEqual(-32);
      expect(int("        32.5    ")).toEqual(32);
    });

    it('skips leading zeros', () => {
      // Python does this as well
      expect(int("0")).toEqual(0);
      expect(int("012345")).toEqual(12345);
      expect(int("0000000012345")).toEqual(12345);
    });

    it('rejects any types that are not suppprted', () => {
      expect(() => int({})).toThrow(new TypeError("int() argument must be a string, a bytes-like object or a number, not 'object'"));
      expect(() => int(new Date())).toThrow(new TypeError("int() argument must be a string, a bytes-like object or a number, not 'object'"));
      expect(() => int(null)).toThrow(new TypeError("int() argument must be a string, a bytes-like object or a number, not 'object'"));
      expect(() => int(undefined)).toThrow(new TypeError("int() argument must be a string, a bytes-like object or a number, not 'undefined'"));
      expect(() => int(() => {})).toThrow(new TypeError("int() argument must be a string, a bytes-like object or a number, not 'function'"));
    });

    // Remove parseInt's behavior of partially parsing a string that contains gargabe in the end
    it.skip('doesn\'t do crappy parseInt()-style partial parsing', () => {
      expect(() => int('12345blablabla')).toThrow(ValueError);
    });

    it.skip('supports base=0 (interpret exactly as a code literal)', () => {
      expect.fail('not implemented');
    });
  });

  describe('iter()', () => {
    it('searches for [Symbol.iterator]', () => {
      // Arrange
      class Stub {
        *[Symbol.iterator]() {
          yield 1;
          yield 2;
          yield 3;
        }
      }

      const iterable = new Stub();

      // Act
      iterator = iter(iterable);

      // Assert
      expect([...iterator]).toEqual([1, 2, 3]);
    });

    it('fails if value is not iterable', () => {
      expect(() => iter({})).toThrow(new TypeError("'object' object is not iterable"));
      expect(() => iter(5)).toThrow(new TypeError("'number' object is not iterable"));
      expect(() => iter(undefined)).toThrow(new TypeError("'undefined' object is not iterable"));
      expect(() => iter(null)).toThrow(new TypeError("'object' object is not iterable"));
    });

    it('works on Arrays', () => {
      // Arrange
      const arr = [1, 2, 3];

      // Act
      const iterator = iter(arr);

      // Assert
      expect([...iterator]).toEqual(arr);
    });

    it('works on generators', () => {
      // Arrange
      function* generator() { yield 1; }

      // Act
      const iterator = iter(generator());

      // Assert
      expect([...iterator]).toEqual([1]);
    });

    it('works on strings', () => {
      // Arrange
      const string = "hallo";

      // Act
      const iterator = iter(string);

      // Assert
      expect([...iterator]).toEqual(['h', 'a', 'l', 'l', 'o']);
    });

    it('aliases Symbol.iterator to __iter__', () => {
         // Arrange
         class Stub {
          *[__iter__]() {
            yield 1;
            yield 2;
            yield 3;
          }
        }

        const iterable = new Stub();
  
        // Act
        iterator = iter(iterable);
  
        // Assert
        expect([...iterator]).toEqual([1, 2, 3]);
    });
  });

  describe('sum()', () => {
    it('sums up values in an Array', () => {
      expect(sum([1, 2, 3])).toEqual(6);
      expect(sum([1, 2, 3], 10)).toEqual(16);
    });

    it('sums up values in an iterable', () => {
      // Arrange
      function* iterable() { 
        yield 10;
        yield 20;
      }

      // Act
      const iterator = iterable();

      // Assert
      expect(sum(iterator)).toEqual(30);
    });

    it('sums up a range', () => {
      expect(sum(range(0, 10, 2))).toEqual(2 + 4 + 6 + 8);
    });
  });

  describe('callable()', () => {
    it('figures functions are callable', () => {
      function callMe() {}

      expect(callable(callMe)).toBe(true);
    });

    it('figures classes are callable', () => {
      /* fun fact: classes ARE functions, but they are not callable without the new keyword. */
      class Stub {}

      expect(callable(Stub)).toBe(true);
    });

    it('figure all other types or values to be non-callable', () => {
      expect(callable(null)).toBe(false);
      expect(callable(undefined)).toBe(false);
      expect(callable({})).toBe(false);
      expect(callable(1)).toBe(false);
      expect(callable(true)).toBe(false);
      expect(callable("test")).toBe(false);
    });
  });

  describe('enumerate()', () => {
    it('enumerates Arrays', () => {
      // Arrange
      const array = ["a", "b", "c", 0xd, 0xe];
      const expected = [[0, "a"], [1, "b"], [2, "c"], [3, 0xd], [4, 0xe]];

      // Act + Assert
      expect([...enumerate(array)]).toEqual(expected);
    });

    it('enumerates Sets', () => {
      // Arrange
      const set = new Set([10, 5, 20, -100]);
      const expected = [[0, 10], [1, 5], [2, 20], [3, -100]];

      // Act + Assert
      expect([...enumerate(set)]).toEqual(expected);
    });

    it('enumerates FrozenSets', () => {
      // Arrange
      const set = frozenset([10, 5, 20, -100]);
      const expected = [[0, 10], [1, 5], [2, 20], [3, -100]];

      // Act + Assert
      expect([...enumerate(set)]).toEqual(expected);
    });

    it('enumerates Maps', () => {
      // Arrange
      const map = [["c", 10], ["a", 80], ["d", 13]];
      const expected = [[0, ["c", 10]], [1, ["a", 80]], [2, ["d", 13]]];

      // Act + Assert
      expect([...enumerate(map)]).toEqual(expected);
    });

    it('enumerates Iterables', () => {
      // Arrange
      class Iterable {
        *[Symbol.iterator]() {
          yield null;
          yield undefined;
          yield -Infinity;
        }
      }

      const iterable = new Iterable();
      const expected = [[0, null], [1, undefined], [2, -Infinity]];

      // Act + Assert
      expect([...enumerate(iterable)]).toEqual(expected);
    });

    it('enumerates strings', () => {
      // Arrange
      const string = "hallo";
      const expected = [[0, 'h'], [1, 'a'], [2, 'l'], [3, 'l'], [4, 'o']];

      // Act
      const chars = enumerate(string);

      expect([...chars]).toEqual(expected);
    });

    it('accepts a positive start offset', () => {
      // Arrange
      const array = ["a", "b", "c"];
      const start = 100;
      const expected = [[100, "a"], [101, "b"], [102, "c"]];

      // Act
      const enumerated = enumerate(array, start);

      // Assert
      expect([...enumerated]).toEqual(expected);
    });

    it('accepts a negative start offset', () => {
      // Arrange
      const array = ["a", "b", "c"];
      const start = -1;
      const expected = [[-1, "a"], [0, "b"], [1, "c"]];

      // Act
      const enumerated = enumerate(array, start);

      // Assert
      expect([...enumerated]).toEqual(expected);
    });
  });

  describe('list()', () => {
    it('transforms Arrays', () => {
        expect(list([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('transforms generators', () => {
      function* generator() {
        yield "a";
        yield "b";
        yield "c";
      }

      expect(list(generator())).toEqual(["a", "b", "c"]);
    });

    it('transforms Ranges', () => {
      expect(list(range(0, 10, 2))).toEqual([0, 2, 4, 6, 8]);
    });

    it('transforms Strings', () => {
      expect(list("hallo")).toEqual(['h', 'a', 'l', 'l', 'o']);
    });

    it('transforms FrozenSets', () => {
      expect(list(frozenset([0, 10, 2]))).toEqual([0, 10, 2]);
    });

    it('transforms Sets', () => {
      expect(list(new Set([0, 10, 2]))).toEqual([0, 10, 2]);
    });

    it('transforms Maps', () => {
      expect(list(new Map([["a", 0], ["b", 2]]))).toEqual([["a", 0], ["b", 2]]);
    });

    it('fails if value is not iterable', () => {
      expect(() => list(1)).toThrow(new TypeError("'number' object is not iterable"));
      expect(() => list({})).toThrow(TypeError);
      expect(() => list(null)).toThrow(TypeError);
      expect(() => list(undefined)).toThrow(TypeError);
      expect(() => list(false)).toThrow(TypeError);
      expect(() => list(() => {})).toThrow(TypeError);
    });
  });

  describe('input()', () => {
    beforeEach(() => window.prompt = (text) => text);

    it('reads text from prompt', () => {
      expect(input("hi")).toEqual("hi");
    });
  });

  describe('open()', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    [
      { mode: 'r', readable: true, writable: false, text: true },
      { mode: 'w', readable: false, writable: true, text: true },
      { mode: 'a', readable: false, writable: true, text: true },
      { mode: 'x', readable: false, writable: true, text: true },
      { mode: 'r+', readable: true, writable: true, text: true },
      { mode: '+r', readable: true, writable: true, text: true },
      { mode: 'w+', readable: true, writable: true, text: true },
      { mode: '+w', readable: true, writable: true, text: true },
      { mode: 'a+', readable: true, writable: true, text: true },
      { mode: '+a', readable: true, writable: true, text: true },
      { mode: 'x+', readable: true, writable: true, text: true },
      { mode: '+x', readable: true, writable: true, text: true },

      { mode: 'rb', readable: true, writable: false, text: false },
      { mode: 'rb+', readable: true, writable: true, text: false },
      { mode: 'br', readable: true, writable: false, text: false },
      { mode: 'br+', readable: true, writable: true, text: false },
      { mode: 'r+b', readable: true, writable: true, text: false },
      { mode: 'b+r', readable: true, writable: true, text: false },
      { mode: '+br', readable: true, writable: true, text: false },
      { mode: '+rb', readable: true, writable: true, text: false },  
      
      { mode: 'rt', readable: true, writable: false, text: true },
      { mode: 'rt+', readable: true, writable: true, text: true },
      { mode: 'tr', readable: true, writable: false, text: true },
      { mode: 'tr+', readable: true, writable: true, text: true },
      { mode: 'r+t', readable: true, writable: true, text: true },
      { mode: 't+r', readable: true, writable: true, text: true },
      { mode: '+tr', readable: true, writable: true, text: true },
      { mode: '+rt', readable: true, writable: true, text: true },  
    ].forEach(({ mode, readable, writable }) => {
      it(`accepts mode ${mode}`, () => {
      // Arrange
      const path = "/tmp/file";

      // System Under Test
      const stream = new TextIOWrapper(path, mode);

      // Act & Assert
      expect(stream.readable).toEqual(readable);
      expect(stream.writable).toEqual(writable);
      expect(stream.mode).toEqual(mode);
      });
    });

    [
      '',
      'p',
      'rr',
      'www',
      'wwww',
      'hallo'
    ].forEach((mode) => {
      it(`rejects invalid mode ${mode}`, () => {
        expect(() => new TextIOWrapper("/tmp", mode)).toThrow(new ValueError(`Invalid mode: '${mode}'`));
      });
    });

    it('rejects binary and text mode at the same time', () => {
      expect(() => new TextIOWrapper("path", "rtb")).toThrow(new ValueError('can\'t have text and binary mode at once'));
    });

    [
      "rax",
      "axr",
      "xar",
      "xaw",
      "wax",
      "rwt",
      "wbr",
      "rwx",
      "+aw",
      "xa+",
    ].forEach(mode => {
      it(`rejects mode ${mode} (ambiguous read/write/append/create)`, () => {
        // Arrange
        const expected = new ValueError("Must have exactly one of create/read/write/append mode");
        
        // Assert
        expect(() => new TextIOWrapper("path", mode)).toThrow(expected);
      });
    });
    
    [
      "+",
      "b",
      "t",
      "t+",
      "+t",
      "b+",
      "+b"
    ].forEach(mode => {
      it(`rejects mode ${mode} (missing read/write/append/create)`, () => {
        // Arrange
        const expected = new ValueError("Must have exactly one of create/read/write/append mode and at most one plus");
        
        // Assert
        expect(() => new TextIOWrapper("path", mode)).toThrow(expected);
      });
    });

    it('defaults to text mode', () => {
      expect(open_("/tmp/file", "r").text).toEqual(true);
    });

    [
      "w",
      "a",
      "x"
    ].forEach(mode => {
      it(`rejects reading a write-only stream (mode '${mode}')`, () => {
        // Arrange
        const path = "/tmp/test";
        localStorage.setItem("/tmp/test", "test");
  
        const stream = open_(path, mode);
  
        // Act + Assert
        expect(() => stream.read()).toThrow(new UnsupportedOperation("not readable"));
      });
    })
    
    it("rejects writing a read-only stream (mode 'r')", () => {
      // Arrange
      const path = "/tmp/test";
      localStorage.setItem("/tmp/test", "test");

      const stream = open_(path, "r");

      // Act + Assert
      expect(() => stream.write()).toThrow(new UnsupportedOperation("not writable"));
    });

    it("rejects writing nothing", () => {
      // Arrange
      const path = "/tmp/test";
      localStorage.setItem("/tmp/test", "test");

      const stream = open_(path, "w");

      // Act + Assert
      expect(() => stream.write()).toThrow(new TypeError("write() takes exactly one argument (0 given)"));
    });

    it("rejects writing garbage", () => {
      // Arrange
      const path = "/tmp/test";
      localStorage.setItem("/tmp/test", "test");

      const stream = open_(path, "w");

      // Act + Assert
      expect(() => stream.write(null)).toThrow(new TypeError("write() argument must be string, not 'object'"));
      expect(() => stream.write(100)).toThrow(new TypeError("write() argument must be string, not 'number'"));
      expect(() => stream.write({})).toThrow(new TypeError("write() argument must be string, not 'object'"));
      expect(() => stream.write(function(){})).toThrow(new TypeError("write() argument must be string, not 'function'"));
    });
  });

  describe('filter', () => {
    it('filters an iterable', () => {
      // Arrange
      const even = (n) => !(n % 2);
      const iterable = [1, 2, 3, 4, 5, 6, 7, 8];

      // Act
      const evens = filter(even, iterable);
      
      // Assert
      expect([...evens]).toEqual([2, 4, 6, 8]);
    });

    it('interprets empty predicate as no filter', () => {
      // Arrange
      const iterable = [1, 2, 3, 4, 5, 6, 7, 8];

      // Act
      const unfiltered = filter(null, iterable);
      
      // Assert
      expect([...unfiltered]).toEqual(iterable);
    });
  });

  describe('bytes', () => {
    function bytes(str) {
      return new bytes_(str);
    }

    class bytes_ extends Uint8Array {
      // TODO: Make this accept bytes
      // TODO: Test decode
      constructor(str) {
        super(str.length * 2);

        const view = new Uint16Array(this.buffer);

        for (let i = 0; i < str.length; i++) {
          view[i] = str.charCodeAt(i);
        }
      }

      decode() {
        const view = new Uint16Array(this.buffer);
        return Array.from(view).map(c => String.fromCodePoint(c)).join("");
      }

      get [Symbol.toStringTag]() {
        return "bytes";
      }
    }

    it('reads from empty string', () => {
      expect([...bytes("")]).toEqual([]);
    });

    it('reads a simple ony-byte BMP char', () => {
      expect([...bytes("a")]).toEqual([97, 0]);
    });

    it('reads a 2-byte BMP char', () => {
      expect([...bytes("€")]).toEqual([172, 32]);
    });

    it('reads a 4-byte non-BMP char', () => {
      expect([...bytes("𝄞")]).toEqual([52, 216, 30, 221]);
      expect([...bytes("𤽜")]).toEqual([83, 216, 92, 223]);
    });

    it('decodes a mixed string', () => {
      // Arrange
      const string = "中 文 𝄞 and abc";
      const expected = [
        45, 78, 32, 0, 135, 101, 32, 0, 52, 
        216, 30, 221, 32, 0, 97, 0, 110, 0, 
        100, 0, 32, 0, 97, 0, 98, 0, 99, 0];

      // Act
      const actual = bytes(string);  

      // Assert
      expect([...actual]).toEqual(expected);
    });

    it('reads a mixed string', () => {
      // Arrange
      const string = "中 文 𝄞 and abc";
      const expected = [
        45, 78, 32, 0, 135, 101, 32, 0, 52, 
        216, 30, 221, 32, 0, 97, 0, 110, 0, 
        100, 0, 32, 0, 97, 0, 98, 0, 99, 0];

      // Act
      const actual = bytes(string);  

      // Assert
      expect([...actual]).toEqual(expected);
    });
  })
});


/**
 * 
 * for bytes()
 * 
 * function strEncodeUTF16(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return new Uint8Array(buf);
}

 function toString(bytes_) {
      let string = "";
      const view = new Uint8Array(bytes_);
      const sixteen = new Uint16Array(view.buffer);

      for(let i = 0; i < sixteen.length; i++) {
        string += String.fromCodePoint(sixteen[i]);
      }

      return string;
    }


strEncodeUTF16("汉a")
 */
