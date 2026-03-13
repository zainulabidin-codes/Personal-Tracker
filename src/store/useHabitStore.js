import { create } from 'zustand';

const STORAGE_KEY = 'pt-habits';

function formatToday() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const habits = JSON.parse(raw);
      const today = formatToday();
      // Remove daily habits whose creation day has already passed
      return habits.filter(
        (h) => h.type === 'permanent' || h.createdAt >= today
      );
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
  currentDate: formatToday(),
  setCurrentDate: (date) => {
    set((state) => {
      // Purge daily habits whose creation day is before the new date
      const updatedHabits = state.habits.filter(
        (h) => h.type === 'permanent' || h.createdAt >= date
      );
      if (updatedHabits.length !== state.habits.length) {
        persistHabits(updatedHabits);
      }
      return { currentDate: date, habits: updatedHabits };
    });
  },

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
