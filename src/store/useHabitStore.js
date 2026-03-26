import { create } from 'zustand';
import { today } from '../utils/dateUtils.js';
import storage from './storage.js';

const HABITS_KEY = 'pt-habits-v2';
const LEGACY_STORAGE_KEY = 'pt-habits';

const useHabitStore = create((set, get) => ({
  habits: [],
  currentDate: today(),
  isInitialized: false,

  /**
   * Initialize the store: Migration from localStorage + Load from IndexedDB
   */
  initialize: async () => {
    if (get().isInitialized) return;

    let habits = await storage.getItem(HABITS_KEY);

    // MIGRATION: If no IndexedDB data, check localStorage for legacy data
    if (!habits) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          habits = JSON.parse(legacyRaw);
          // Persist legacy data into IndexedDB
          await storage.setItem(HABITS_KEY, habits);
          // Optionally clear localStorage to save space
          // localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch (e) {
          console.error('Failed to parse legacy habits', e);
        }
      }
    }

    set({ habits: habits || [], isInitialized: true });
  },

  setCurrentDate: (date) => {
    set({ currentDate: date });
  },

  addHabit: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newHabit = {
      id: crypto.randomUUID(),
      text: trimmed,
      type: 'daily',
      priority: 2,
      createdAt: today(),
      completions: {},
    };
    const updated = [...get().habits, newHabit];
    set({ habits: updated });
    await storage.setItem(HABITS_KEY, updated);
  },

  deleteHabit: async (id) => {
    const updated = get().habits.filter((h) => h.id !== id);
    set({ habits: updated });
    await storage.setItem(HABITS_KEY, updated);
  },

  editHabit: async (id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const updated = get().habits.map((h) =>
      h.id === id ? { ...h, text: trimmed } : h
    );
    set({ habits: updated });
    await storage.setItem(HABITS_KEY, updated);
  },

  toggleCompletion: async (id, dateString) => {
    const updated = get().habits.map((h) => {
      if (h.id !== id) return h;
      const completions = { ...h.completions };
      if (completions[dateString]) {
        delete completions[dateString];
      } else {
        completions[dateString] = true;
      }
      return { ...h, completions };
    });
    set({ habits: updated });
    await storage.setItem(HABITS_KEY, updated);
  },

  setHabitType: async (id, type) => {
    const updated = get().habits.map((h) =>
      h.id === id ? { ...h, type } : h
    );
    set({ habits: updated });
    await storage.setItem(HABITS_KEY, updated);
  },

  setHabitPriority: async (id, priority) => {
    const updated = get().habits.map((h) =>
      h.id === id ? { ...h, priority } : h
    );
    set({ habits: updated });
    await storage.setItem(HABITS_KEY, updated);
  },

  /**
   * Bulk import: replaces all habits with the provided list.
   * Useful for backup restoration.
   */
  importHabits: async (habitsList) => {
    if (!Array.isArray(habitsList)) return;
    set({ habits: habitsList });
    await storage.setItem(HABITS_KEY, habitsList);
  }
}));

export default useHabitStore;
