// Unit tests for location formatting utility

function isNumericOnly(val) {
  return /^\d+$/.test(val.trim());
}

function isSectorOrLocalityPattern(val) {
  return /\b(sector|sec|block|phase|pocket|mohalla|colony|nagar|enclave|vihar|layout|ward)\b/i.test(
    val,
  );
}

function normalizeForComparison(val) {
  return val
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function formatLocationAddress(address) {
  if (!address) return null;

  const { name, street, district, city, subregion, region, country } = address;

  const rawCity = (city || subregion || '').trim();
  const rawRegion = (region || '').trim();
  const rawCountry = (country || '').trim();

  let candidateLocality = null;

  const rawName = (name || '').trim();
  const rawDistrict = (district || '').trim();
  const rawStreet = (street || '').trim();

  if (rawName && !isNumericOnly(rawName)) {
    const normName = normalizeForComparison(rawName);
    const normCity = normalizeForComparison(rawCity);
    const normRegion = normalizeForComparison(rawRegion);
    const normCountry = normalizeForComparison(rawCountry);

    if (normName !== normCity && normName !== normRegion && normName !== normCountry) {
      candidateLocality = rawName;
    }
  }

  if (!candidateLocality && rawDistrict && !isNumericOnly(rawDistrict)) {
    const normDist = normalizeForComparison(rawDistrict);
    const normCity = normalizeForComparison(rawCity);
    const normRegion = normalizeForComparison(rawRegion);
    const normCountry = normalizeForComparison(rawCountry);

    if (normDist !== normCity && normDist !== normRegion && normDist !== normCountry) {
      candidateLocality = rawDistrict;
    }
  }

  if (rawDistrict && isSectorOrLocalityPattern(rawDistrict)) {
    candidateLocality = rawDistrict;
  } else if (rawName && isSectorOrLocalityPattern(rawName)) {
    candidateLocality = rawName;
  } else if (rawStreet && isSectorOrLocalityPattern(rawStreet)) {
    candidateLocality = rawStreet;
  }

  const parts = [];

  const addIfUnique = (item) => {
    if (!item) return;
    const trimmed = item.trim();
    if (!trimmed || isNumericOnly(trimmed)) return;

    const normItem = normalizeForComparison(trimmed);

    const exists = parts.some((p) => {
      const normP = normalizeForComparison(p);
      return normP === normItem;
    });

    if (!exists) {
      parts.push(trimmed);
    }
  };

  if (candidateLocality) {
    addIfUnique(candidateLocality);
  }

  if (rawCity) {
    addIfUnique(rawCity);
  } else if (rawDistrict && !parts.includes(rawDistrict)) {
    addIfUnique(rawDistrict);
  }

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

  if (rawCountry) {
    addIfUnique(rawCountry);
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join(', ');
}

console.log('=== RUNNING LOCATION FORMATTER TESTS ===\n');

let failed = 0;
function assert(condition, name, actual, expected) {
  if (condition) {
    console.log(`PASS: ${name} -> "${actual}"`);
  } else {
    console.error(`FAIL: ${name}\n  Got:      "${actual}"\n  Expected: "${expected}"`);
    failed++;
  }
}

// 1. Locality and sector available
const res1 = formatLocationAddress({
  name: 'Sector 72',
  city: 'Gurugram',
  region: 'Haryana',
  country: 'India',
});
assert(
  res1 === 'Sector 72, Gurugram, Haryana, India',
  '1. Locality and sector available',
  res1,
  'Sector 72, Gurugram, Haryana, India',
);

// 2. Locality unavailable
const res2 = formatLocationAddress({
  name: null,
  district: null,
  city: 'Gurugram',
  region: 'Haryana',
  country: 'India',
});
assert(
  res2 === 'Gurugram, Haryana, India',
  '2. Locality unavailable',
  res2,
  'Gurugram, Haryana, India',
);

// 3. City, region, and country fallback (with Delhi / New Delhi deduplication)
const res3a = formatLocationAddress({
  city: 'New Delhi',
  region: 'Delhi',
  country: 'India',
});
assert(
  res3a === 'New Delhi, India',
  '3a. City and country fallback (Delhi deduplicated)',
  res3a,
  'New Delhi, India',
);

const res3b = formatLocationAddress({
  city: 'Dallas',
  region: 'Texas',
  country: 'United States',
});
assert(
  res3b === 'Dallas, Texas, United States',
  '3b. City, region, country fallback',
  res3b,
  'Dallas, Texas, United States',
);

// 4. Missing reverse-geocoding fields
const res4 = formatLocationAddress({
  city: 'Makkah',
  country: 'Saudi Arabia',
  region: null,
  district: null,
});
assert(
  res4 === 'Makkah, Saudi Arabia',
  '4. Missing reverse-geocoding fields',
  res4,
  'Makkah, Saudi Arabia',
);

// 5. Duplicate location components
const res5 = formatLocationAddress({
  name: 'Gurugram',
  district: 'Gurugram',
  city: 'Gurugram',
  region: 'Haryana',
  country: 'India',
});
assert(
  res5 === 'Gurugram, Haryana, India',
  '5. Duplicate location components removed',
  res5,
  'Gurugram, Haryana, India',
);

// 6. Misleading district values:
// Case 6a: District is "Sector 72" (used as locality)
const res6a = formatLocationAddress({
  name: 'Random Landmark',
  district: 'Sector 72',
  city: 'Gurugram',
  region: 'Haryana',
  country: 'India',
});
assert(
  res6a === 'Sector 72, Gurugram, Haryana, India',
  '6a. Sector pattern in district preferred over generic landmark',
  res6a,
  'Sector 72, Gurugram, Haryana, India',
);

// Case 6b: District is identical to city (ignored as locality)
const res6b = formatLocationAddress({
  district: 'Gurugram',
  city: 'Gurugram',
  region: 'Haryana',
  country: 'India',
});
assert(
  res6b === 'Gurugram, Haryana, India',
  '6b. Misleading duplicate district ignored',
  res6b,
  'Gurugram, Haryana, India',
);

// 7. Empty or unusable geocoding results
const res7a = formatLocationAddress(null);
assert(res7a === null, '7a. Null address returns null', res7a, null);

const res7b = formatLocationAddress({ name: '123', postalCode: '110001' });
assert(res7b === null, '7b. Pure numeric / postal-only returns null', res7b, null);

const res7c = formatLocationAddress({});
assert(res7c === null, '7c. Empty object returns null', res7c, null);

// 8. Correct handling of optional fields (only subregion and country present)
const res8 = formatLocationAddress({
  subregion: 'Badaun',
  country: 'India',
});
assert(
  res8 === 'Badaun, India',
  '8. Optional fields fallback (subregion as city)',
  res8,
  'Badaun, India',
);

console.log(
  `\n=== RESULTS: ${failed === 0 ? 'ALL TESTS PASSED!' : `${failed} TESTS FAILED`} ===\n`,
);
process.exit(failed === 0 ? 0 : 1);
