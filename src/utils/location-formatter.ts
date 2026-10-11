import type { LocationGeocodedAddress } from 'expo-location';

/**
 * Checks if a string looks like a numeric street number or postal code
 * rather than a meaningful named locality.
 */
function isNumericOnly(val: string): boolean {
  return /^\d+$/.test(val.trim());
}

/**
 * Checks if a candidate string looks like a locality or sector
 * (e.g., "Sector 72", "Sector-14", "Block B", "Phase 2", "Pocket A").
 */
function isSectorOrLocalityPattern(val: string): boolean {
  return /\b(sector|sec|block|phase|pocket|mohalla|colony|nagar|enclave|vihar|layout|ward)\b/i.test(
    val,
  );
}

/**
 * Normalizes text for case-insensitive deduplication comparisons.
 */
function normalizeForComparison(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Formats a reverse-geocoded address into a clean, human-readable location string.
 *
 * Examples:
 * - "Sector 72, Gurugram, Haryana, India"
 * - "Gurugram, Haryana, India"
 * - "New Delhi, India"
 *
 * Rules:
 * - Extracts specific locality or sector when supported by data (e.g., Sector 72).
 * - Avoids using pure street numbers or duplicate components.
 * - Handles misleading district values (e.g. district identical to city or region).
 * - Omits postal codes and technical field names.
 * - Returns null if no meaningful address components exist.
 */
export function formatLocationAddress(
  address: LocationGeocodedAddress | null | undefined,
): string | null {
  if (!address) return null;

  const { name, street, district, city, subregion, region, country } = address;

  // 1. Resolve City / Primary Town
  const rawCity = (city || subregion || '').trim();
  const rawRegion = (region || '').trim();
  const rawCountry = (country || '').trim();

  // 2. Identify Locality / Sector candidate
  let candidateLocality: string | null = null;

  const rawName = (name || '').trim();
  const rawDistrict = (district || '').trim();
  const rawStreet = (street || '').trim();

  // Check name first if it represents a sector or meaningful neighborhood
  if (rawName && !isNumericOnly(rawName)) {
    const normName = normalizeForComparison(rawName);
    const normCity = normalizeForComparison(rawCity);
    const normRegion = normalizeForComparison(rawRegion);
    const normCountry = normalizeForComparison(rawCountry);

    if (normName !== normCity && normName !== normRegion && normName !== normCountry) {
      candidateLocality = rawName;
    }
  }

  // If no locality yet, check district (in many regions/providers district is e.g. "Sector 72")
  if (!candidateLocality && rawDistrict && !isNumericOnly(rawDistrict)) {
    const normDist = normalizeForComparison(rawDistrict);
    const normCity = normalizeForComparison(rawCity);
    const normRegion = normalizeForComparison(rawRegion);
    const normCountry = normalizeForComparison(rawCountry);

    if (normDist !== normCity && normDist !== normRegion && normDist !== normCountry) {
      candidateLocality = rawDistrict;
    }
  }

  // If district has explicit sector pattern even if name had something else, prefer sector
  if (rawDistrict && isSectorOrLocalityPattern(rawDistrict)) {
    candidateLocality = rawDistrict;
  } else if (rawName && isSectorOrLocalityPattern(rawName)) {
    candidateLocality = rawName;
  } else if (rawStreet && isSectorOrLocalityPattern(rawStreet)) {
    candidateLocality = rawStreet;
  }

  // 3. Assemble components in hierarchical order: Locality -> City -> Region -> Country
  const parts: string[] = [];

  const addIfUnique = (item: string | null | undefined) => {
    if (!item) return;
    const trimmed = item.trim();
    if (!trimmed || isNumericOnly(trimmed)) return;

    const normItem = normalizeForComparison(trimmed);

    // Check if already in parts (exact or contained)
    const exists = parts.some((p) => {
      const normP = normalizeForComparison(p);
      return normP === normItem;
    });

    if (!exists) {
      parts.push(trimmed);
    }
  };

  // Add locality
  if (candidateLocality) {
    addIfUnique(candidateLocality);
  }

  // Add city
  if (rawCity) {
    addIfUnique(rawCity);
  } else if (rawDistrict && !parts.includes(rawDistrict)) {
    // If city is missing, use district if not already used as locality
    addIfUnique(rawDistrict);
  }

  // Add state / region (e.g. Haryana, California)
  // Special check: If city is "New Delhi" and region is "Delhi", omit region to avoid "New Delhi, Delhi, India"
  if (rawRegion) {
    const normRegion = normalizeForComparison(rawRegion);
    const isRedundantWithCity = parts.some((p) => {
      const normP = normalizeForComparison(p);
      return (
        normP === normRegion ||
        (normP === 'newdelhi' && normRegion === 'delhi') ||
        (normP === 'delhi' && normRegion === 'delhi')
      );
    });

    if (!isRedundantWithCity) {
      addIfUnique(rawRegion);
    }
  }

  // Add country
  if (rawCountry) {
    addIfUnique(rawCountry);
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join(', ');
}
