export const FEATURE_FLAGS = {
  PHASE_5_ACTIVE: true,
  
  // Geographic Controls
  ACTIVE_CITIES: ["Ahmedabad"],
  ACTIVE_AREAS: ["Bopal"],
  
  // Service Controls
  SERVICES: {
    WALKING: { enabled: true, isBeta: false },
    SITTING: { enabled: true, isBeta: false },
    BOARDING: { enabled: false, isBeta: true },
  },
  
  // Operational Capacity
  DAILY_BOOKING_CAP: 5,
};

export function isAreaActive(city: string, area: string) {
  return FEATURE_FLAGS.ACTIVE_CITIES.includes(city) && FEATURE_FLAGS.ACTIVE_AREAS.includes(area);
}

export function isServiceActive(service: keyof typeof FEATURE_FLAGS.SERVICES) {
  return FEATURE_FLAGS.SERVICES[service]?.enabled || false;
}
