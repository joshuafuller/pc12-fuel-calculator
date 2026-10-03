import { buildScaleMarkers, fillPercent } from './meterScale';
import { LITERS_PER_GALLON } from './constants';

describe('buildScaleMarkers', () => {
  it('ticks every 100 lbs with labelled majors every 500 (imperial)', () => {
    const markers = buildScaleMarkers(2704, 'imperial', 6.7);
    expect(markers).toHaveLength(28); // 0..2700
    expect(markers[0]).toMatchObject({ position: 0, isMajor: true, label: '0' });
    expect(markers[1]).toMatchObject({ isMajor: false, label: '' });
    expect(markers[5]).toMatchObject({ isMajor: true, label: '500' });
    expect(markers[27].position).toBeLessThanOrEqual(100);
  });

  it('places metric ticks using the supplied density', () => {
    const density = 6.5;
    const markers = buildScaleMarkers(2704, 'metric', density);
    const hundredLiters = markers[1];
    const expected = ((100 / LITERS_PER_GALLON) * density) / 2704 * 100;
    expect(hundredLiters.position).toBeCloseTo(expected);
    expect(markers.every(m => m.position <= 100)).toBe(true);
  });

  it('returns nothing for a degenerate scale', () => {
    expect(buildScaleMarkers(0, 'imperial', 6.7)).toEqual([]);
    expect(buildScaleMarkers(2704, 'metric', 0)).toEqual([]);
  });
});

describe('fillPercent', () => {
  it('clamps to 0–100 and survives a zero maximum', () => {
    expect(fillPercent(1352, 2704)).toBeCloseTo(50);
    expect(fillPercent(5000, 2704)).toBe(100);
    expect(fillPercent(-5, 2704)).toBe(0);
    expect(fillPercent(100, 0)).toBe(0);
  });
});
