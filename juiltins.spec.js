const { 
  abs,
  all,
  any,
  bool,
  chr,
  divmod,
  frozenset,
  hex,
  int,
  issubclass,
  isinstance,
  len,
  ord,
  range,
  type,
  zip,
  OverflowError,
  ZeroDivisionError,
  ValueError
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
      expect(() => int(1, -10)).toThrow(error);
      expect(() => int(1, 0)).toThrow(error);
      expect(() => int(1, 1)).toThrow(error);
      expect(() => int(1, 37)).toThrow(error);
    });

    it('only allows 0x prefix for base 16', () => {
      expect(int("0x0", 16)).toEqual(0);
      expect(int("0xaaff", 16)).toEqual(43775);
      expect(int("-0xaaff", 16)).toEqual(-43775);
      expect(() => int('0x1', 2)).toThrow(new ValueError("invalid literal for int() with base 2: '0x1'"));
      expect(() => int('0x1', 10)).toThrow(new ValueError("invalid literal for int() with base 10: '0x1'"));
      expect(() => int('0x1', 17)).toThrow(new ValueError("invalid literal for int() with base 17: '0x1'"));
      expect(() => int('0x1', 36)).toThrow(new ValueError("invalid literal for int() with base 36: '0x1'"));
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
      expect(() => int('0b1111', 36)).toThrow(new ValueError("invalid literal for int() with base 36: '0b1111'"));
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
      expect(() => int('0o77', 20)).toThrow(new ValueError("invalid literal for int() with base 20: '0o77'"));
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
      expect(() => int('0xff', 24)).toThrow(new ValueError("invalid literal for int() with base 24: '0xff'"));
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

    it('fails when digit is not available in a particular base', () => {
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
    })

    // Remove parseInt's behavior of partially parsing a string that contains gargabe in the end
    it.skip('only parses when the whole string can be parsed', () => {
      expect(() => int('12345blablabla')).toThrow(ValueError);
    });

    it.skip('test for anything not a number or string (object, function, date, null, undefined...)', () => {
      expect.fail('not implemented');
    });
  });
});