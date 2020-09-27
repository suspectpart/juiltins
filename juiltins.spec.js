const { 
  abs,
  all,
  any,
  bool,
  chr,
  divmod,
  frozenset,
  hex,
  issubclass,
  ord,
  type,
  zip,
  ZeroDivisionError,
  ValueError
} = require("./juiltins");

describe('juiltins', () => {
  describe('abs', () => {
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

  describe('any', () => {
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

  describe('all', () => {
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

  describe('divmod', () => {
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

  describe('bool', () => {
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

  describe('ord', () => {
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

    it('ord("\n") is 10 (escape sequence)', () => {
      expect(ord("\n")).toEqual(10);
    });

    it('ord("💩") is 128169 (Emojis, Unicode)', () => {
      expect(ord("💩")).toEqual(128169);
    });
  });

  describe('hex', () => {
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

  describe('zip', () => {
    it('zips empty things', () => {
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

  describe('type', () => {
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

    it('creates new types', () => {
      class Person {
        constructor(name) {
          this.name = name;
        }
      }

      const name = 'Employee';
      const base = new Person();
      const props = {prop: 100};

      // Act
      const Employee = type(name, base, props);
      const employee = new Employee();

      // Assert
      expect(employee.__proto__).toBe(base);
      expect(employee.prop).toEqual(100);
      expect(employee.constructor).toBe(Employee);
      expect(employee.constructor.name).toBe("Employee");
    });
  });

  describe('chr', () => {
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

  describe('frozenset', () => {
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

  describe('issubclass', () => {
    it('checks class hierarchy', () => {
      // Arrange
      class A {}
      class B extends A {}
      class C extends B {}

      // Assert
      expect(issubclass(B, A)).toBe(true);
      expect(issubclass(C, B)).toBe(true);
      expect(issubclass(C, A)).toBe(true);
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
});