import { v4 as uuidv4 } from 'uuid';
import { INITIAL_TRIP_STATE } from './constants';

// In-memory cache (populated on init)
let tripsCache = [];
let hotelsCache = [];
let countriesCache = [];
let carsCache = [];
let initialized = false;

async function persistToServer(trips) {
  try {
    await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trips }),
    });
  } catch (err) {
    console.error('Failed to persist trips to server:', err);
  }
}

async function persistHotelsToServer(hotels) {
  try {
    await fetch('/api/hotels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotels }),
    });
  } catch (err) {
    console.error('Failed to persist hotels to server:', err);
  }
}

async function persistCountriesToServer(countries) {
  try {
    await fetch('/api/countries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countries }),
    });
  } catch (err) {
    console.error('Failed to persist countries to server:', err);
  }
}

async function persistCarsToServer(cars) {
  try {
    await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cars }),
    });
  } catch (err) {
    console.error('Failed to persist cars to server:', err);
  }
}

export const db = {
  // Must be called once on app startup (async)
  init: async () => {
    if (initialized) return;
    
    // Load Trips
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        tripsCache = await res.json();
      }
    } catch (err) {
      console.error('Failed to load trips from server, falling back to localStorage:', err);
      try {
        const data = typeof window !== 'undefined' ? localStorage.getItem('weekendgo_trips_db') : null;
        tripsCache = data ? JSON.parse(data) : [];
      } catch {
        tripsCache = [];
      }
    }

    // Load Hotels
    try {
      const res = await fetch('/api/hotels');
      if (res.ok) {
        hotelsCache = await res.json();
      }
    } catch (err) {
      console.error('Failed to load hotels from server, falling back to localStorage:', err);
      try {
        const data = typeof window !== 'undefined' ? localStorage.getItem('weekendgo_hotels_db') : null;
        hotelsCache = data ? JSON.parse(data) : [];
      } catch {
        hotelsCache = [];
      }
    }

    // Load Countries
    try {
      const res = await fetch('/api/countries');
      if (res.ok) {
        countriesCache = await res.json();
      }
    } catch (err) {
      console.error('Failed to load countries from server, falling back to localStorage:', err);
      try {
        const data = typeof window !== 'undefined' ? localStorage.getItem('weekendgo_countries_db') : null;
        countriesCache = data ? JSON.parse(data) : [];
      } catch {
        countriesCache = [];
      }
    }

    // Load Cars
    try {
      const res = await fetch('/api/cars');
      if (res.ok) {
        carsCache = await res.json();
      }
    } catch (err) {
      console.error('Failed to load cars from server, falling back to localStorage:', err);
      try {
        const data = typeof window !== 'undefined' ? localStorage.getItem('weekendgo_cars_db') : null;
        carsCache = data ? JSON.parse(data) : [];
      } catch {
        carsCache = [];
      }
    }

    initialized = true;
  },

  // Reset so init can be called again (for testing/hot-reload)
  reset: () => {
    initialized = false;
    tripsCache = [];
    hotelsCache = [];
    countriesCache = [];
    carsCache = [];
  },

  getTrips: () => {
    return [...tripsCache];
  },

  getTrip: (id) => {
    return tripsCache.find(t => t.id === id) || null;
  },

  saveTrip: (tripData, name = 'رحلة بدون اسم', existingId = null) => {
    const now = new Date().toISOString();

    if (existingId) {
      const index = tripsCache.findIndex(t => t.id === existingId);
      if (index >= 0) {
        tripsCache[index] = {
          ...tripsCache[index],
          name,
          updatedAt: now,
          data: tripData,
        };
        persistToServer([...tripsCache]);
        return { ...tripsCache[index] };
      }
    }

    // Create new
    const newTrip = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      name,
      data: tripData || { ...INITIAL_TRIP_STATE },
    };
    tripsCache.push(newTrip);
    persistToServer([...tripsCache]);
    return { ...newTrip };
  },

  deleteTrip: (id) => {
    tripsCache = tripsCache.filter(t => t.id !== id);
    persistToServer([...tripsCache]);
  },

  // Hotels Management
  getHotels: () => {
    return [...hotelsCache];
  },

  saveHotelsList: (hotelsList) => {
    hotelsCache = hotelsList;
    persistHotelsToServer(hotelsList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('weekendgo_hotels_db', JSON.stringify(hotelsList));
      } catch (e) {}
    }
  },

  // Countries & Cities Management
  getCountries: () => {
    return [...countriesCache];
  },

  saveCountriesList: (countriesList) => {
    countriesCache = countriesList;
    persistCountriesToServer(countriesList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('weekendgo_countries_db', JSON.stringify(countriesList));
      } catch (e) {}
    }
  },

  // Cars Management (control panel only, not used in trip PDF yet)
  getCars: () => {
    return [...carsCache];
  },

  saveCarsList: (carsList) => {
    carsCache = carsList;
    persistCarsToServer(carsList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('weekendgo_cars_db', JSON.stringify(carsList));
      } catch (e) {}
    }
  }
};
