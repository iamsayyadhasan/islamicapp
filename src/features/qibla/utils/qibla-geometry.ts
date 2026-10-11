/**
 * Qibla geometric and astronomical calculation utilities.
 *
 * Mecca (Kaaba) Coordinates:
 * Latitude: 21.422487° N
 * Longitude: 39.826206° E
 */

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

const toRadians = (deg: number): number => (deg * Math.PI) / 180;
const toDegrees = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Normalizes any angle in degrees into the [0, 360) range.
 */
export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Computes the shortest signed angular difference between two angles in degrees.
 * Returns a value in [-180, 180).
 * Positive = clockwise turn; Negative = counter-clockwise turn.
 */
export function shortestAngleDiff(fromAngle: number, toAngle: number): number {
  const diff = (toAngle - fromAngle) % 360;
  return ((diff + 540) % 360) - 180;
}

/**
 * Calculates the initial great-circle bearing (forward azimuth)
 * from the observer's geographic coordinates to the Kaaba in Mecca.
 *
 * Spherical Trigonometry Formula:
 * θ = atan2(sin(Δλ) * cos(φ2), cos(φ1) * sin(φ2) - sin(φ1) * cos(φ2) * cos(Δλ))
 *
 * @param userLat User latitude in decimal degrees (-90 to +90)
 * @param userLng User longitude in decimal degrees (-180 to +180)
 * @returns Bearing in degrees clockwise from True North [0, 360)
 */
export function calculateQiblaBearing(userLat: number, userLng: number): number {
  const phi1 = toRadians(userLat);
  const phi2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLambda = toRadians(KAABA_COORDINATES.longitude - userLng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  return normalizeAngle(toDegrees(theta));
}

/**
 * Calculates the great-circle surface distance in kilometers
 * from user coordinates to the Kaaba using the Haversine formula.
 */
export function calculateQiblaDistance(userLat: number, userLng: number): number {
  const R = 6371; // Earth's mean radius in kilometers
  const phi1 = toRadians(userLat);
  const phi2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaPhi = toRadians(KAABA_COORDINATES.latitude - userLat);
  const deltaLambda = toRadians(KAABA_COORDINATES.longitude - userLng);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Calculates the rotation angle (in degrees) for the compass needle
 * relative to the device's current heading.
 *
 * When the top of the device points directly at the Kaaba,
 * deviceHeading === qiblaBearing, so needleAngle === 0° (pointing straight up).
 */
export function calculateNeedleAngle(qiblaBearing: number, deviceHeading: number): number {
  return normalizeAngle(qiblaBearing - deviceHeading);
}

/**
 * Determines whether the device is currently oriented towards the Kaaba
 * within an acceptable angular tolerance threshold.
 *
 * @param qiblaBearing Target bearing to Mecca (0-360)
 * @param deviceHeading Current device heading (0-360)
 * @param thresholdDeg Tolerance in degrees (defaults to 3°)
 */
export function isQiblaAligned(
  qiblaBearing: number,
  deviceHeading: number,
  thresholdDeg: number = 3,
): boolean {
  const diff = Math.abs(shortestAngleDiff(deviceHeading, qiblaBearing));
  return diff <= thresholdDeg;
}

/**
 * Returns a human-readable 8-point compass direction label
 * corresponding to the specified bearing in degrees.
 */
export function getDirectionLabel(bearingDeg: number): string {
  const normalized = normalizeAngle(bearingDeg);
  if (normalized >= 337.5 || normalized < 22.5) return 'North';
  if (normalized >= 22.5 && normalized < 67.5) return 'North East';
  if (normalized >= 67.5 && normalized < 112.5) return 'East';
  if (normalized >= 112.5 && normalized < 157.5) return 'South East';
  if (normalized >= 157.5 && normalized < 202.5) return 'South';
  if (normalized >= 202.5 && normalized < 247.5) return 'South West';
  if (normalized >= 247.5 && normalized < 292.5) return 'West';
  return 'North West';
}

/**
 * Formats decimal latitude and longitude into standard coordinate notation.
 * e.g., 28.6139° N, 77.2090° E
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
