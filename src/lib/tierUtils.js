import { HOTEL_TIERS } from './constants';

// Derive one "period" per city group in tripData.hotels, based on the
// earliest check-in and latest check-out among the hotels entered for that city.
export function getCityPeriods(tripData) {
  return (tripData.hotels || [])
    .filter(g => g.list && g.list.some(h => h.checkIn && h.checkOut))
    .map(g => {
      const dated = g.list.filter(h => h.checkIn && h.checkOut);
      const checkIn = dated.reduce((min, h) => (!min || h.checkIn < min) ? h.checkIn : min, null);
      const checkOut = dated.reduce((max, h) => (!max || h.checkOut > max) ? h.checkOut : max, null);
      return { groupId: g.id, city: g.city, checkIn, checkOut };
    });
}

// A tier row is considered "active" (the employee started filling it in)
// if it has a price or at least one selected hotel somewhere.
function isTierRowActive(row) {
  if (!row) return false;
  const hasPrice = !!(row.price && String(row.price).trim());
  const hasSelection = row.selections && Object.values(row.selections).some(arr => Array.isArray(arr) && arr.length > 0);
  return hasPrice || hasSelection;
}

// Validates tier coverage against the city periods derived from tripData.hotels.
// - emptyTiers: tier rows that are active but have ZERO city coverage -> blocks export
// - partialTiers: tier rows that are active but missing coverage for SOME cities
//   -> excluded entirely from the printed comparison table, with a dashboard warning
export function validateTiers(tripData) {
  const cityPeriods = getCityPeriods(tripData);
  const tiersData = tripData.tiers || [];
  const emptyTiers = [];
  const partialTiers = [];

  HOTEL_TIERS.forEach(tierDef => {
    const row = tiersData.find(t => t.tier === tierDef.value);
    if (!isTierRowActive(row)) return;

    const missingCities = cityPeriods.filter(cp => {
      const sel = row.selections?.[cp.groupId];
      return !sel || sel.length === 0;
    });

    if (cityPeriods.length > 0 && missingCities.length === cityPeriods.length) {
      emptyTiers.push(tierDef);
    } else if (missingCities.length > 0) {
      partialTiers.push({ tier: tierDef, missingCities });
    }
  });

  return { cityPeriods, emptyTiers, partialTiers };
}

// Rows that are safe to print: active, and covering every city period.
export function getPrintableTierRows(tripData) {
  const { cityPeriods } = validateTiers(tripData);
  const tiersData = tripData.tiers || [];

  return HOTEL_TIERS
    .map(tierDef => ({ tierDef, row: tiersData.find(t => t.tier === tierDef.value) }))
    .filter(({ row }) => isTierRowActive(row))
    .filter(({ row }) => cityPeriods.every(cp => {
      const sel = row.selections?.[cp.groupId];
      return sel && sel.length > 0;
    }))
    .map(({ tierDef, row }) => ({ tierDef, row }));
}
