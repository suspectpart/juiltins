const { abs } = require("./juiltins");

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
})