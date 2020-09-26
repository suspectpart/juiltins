const { 
  abs,
  all,
  any,
  bool,
  divmod,
  hex,
  ord,
  ZeroDivisionError,
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
});