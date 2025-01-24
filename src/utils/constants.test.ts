import { poundsToGallons, gallonsToLiters, DEFAULT_FUEL_DENSITY, LITERS_PER_GALLON } from './constants';

describe('Utility Functions', () => {
  describe('poundsToGallons', () => {
    it('should convert pounds to gallons using default density', () => {
      const pounds = 67;
      const expectedGallons = pounds / DEFAULT_FUEL_DENSITY;
      expect(poundsToGallons(pounds)).toBeCloseTo(expectedGallons);
    });

    it('should convert pounds to gallons using specified density', () => {
      const pounds = 67;
      const density = 7.0;
      const expectedGallons = pounds / density;
      expect(poundsToGallons(pounds, density)).toBeCloseTo(expectedGallons);
    });
  });

  describe('gallonsToLiters', () => {
    it('should convert gallons to liters', () => {
      const gallons = 10;
      const expectedLiters = gallons * LITERS_PER_GALLON;
      expect(gallonsToLiters(gallons)).toBeCloseTo(expectedLiters);
    });
  });
}); 