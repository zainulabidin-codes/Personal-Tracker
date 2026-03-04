import { create } from 'zustand';

const STORAGE_KEY = 'pt-habits';

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    /* corrupted data — start fresh */
  }
  return [];
}

function persistHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

const useHabitStore = create((set, get) => ({
  habits: loadHabits(),

  addHabit: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newHabit = {
      id: crypto.randomUUID(),
      text: trimmed,
      type: 'daily',
      priority: 2,
      createdAt: new Date().toISOString().slice(0, 10),
      completions: {},
    };
    set((state) => {
      const updated = [...state.habits, newHabit];
      persistHabits(updated);
      return { habits: updated };
    });
  },

  deleteHabit: (id) => {
    set((state) => {
      const updated = state.habits.filter((h) => h.id !== id);
      persistHabits(updated);
      return { habits: updated };
    });
  },

  editHabit: (id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    set((state) => {
      const updated = state.habits.map((h) =>
        h.id === id ? { ...h, text: trimmed } : h
      );
      persistHabits(updated);
      return { habits: updated };
    });
  },

  toggleCompletion: (id, dateString) => {
    set((state) => {
      const updated = state.habits.map((h) => {
        if (h.id !== id) return h;
        const completions = { ...h.completions };
        if (completions[dateString]) {
          delete completions[dateString];
        } else {
          completions[dateString] = true;
        }
        return { ...h, completions };
      });
      persistHabits(updated);
      return { habits: updated };
    });
  },

  setHabitType: (id, type) => {
    set((state) => {
      const updated = state.habits.map((h) =>
        h.id === id ? { ...h, type } : h
      );
      persistHabits(updated);
      return { habits: updated };
    });
  },

  setHabitPriority: (id, priority) => {
    set((state) => {
      const updated = state.habits.map((h) =>
        h.id === id ? { ...h, priority } : h
      );
      persistHabits(updated);
      return { habits: updated };
    });
  },
}));

export default useHabitStore;
