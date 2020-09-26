const { 
  abs,
  all,
  any,
  divmod,
  ZeroDivisionError
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
    })
  });
});