import { v4 as uuidv4 } from 'uuid';
import { INITIAL_TRIP_STATE } from './constants';

const DB_KEY = 'weekendgo_trips_db';

export const db = {
  getTrips: () => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  getTrip: (id) => {
    const trips = db.getTrips();
    return trips.find(t => t.id === id) || null;
  },

  saveTrip: (tripData, name = 'رحلة بدون اسم', existingId = null) => {
    if (typeof window === 'undefined') return null;
    
    const trips = db.getTrips();
    const now = new Date().toISOString();

    if (existingId) {
      const index = trips.findIndex(t => t.id === existingId);
      if (index >= 0) {
        trips[index] = {
          ...trips[index],
          name,
          updatedAt: now,
          data: tripData
        };
        localStorage.setItem(DB_KEY, JSON.stringify(trips));
        return trips[index];
      }
    }

    // Create new
    const newTrip = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      name,
      data: tripData || { ...INITIAL_TRIP_STATE }
    };

    trips.push(newTrip);
    localStorage.setItem(DB_KEY, JSON.stringify(trips));
    return newTrip;
  },

  deleteTrip: (id) => {
    if (typeof window === 'undefined') return;
    const trips = db.getTrips();
    const filtered = trips.filter(t => t.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(filtered));
  }
};
