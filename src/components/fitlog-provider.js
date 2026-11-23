"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const FitLogContext = createContext(null);
const STORAGE_KEYS = {
  plan: "fitlog-plan",
  saved: "fitlog-saved",
  completed: "fitlog-completed",
};

function readStoredIds(key) {
  const stored = window.localStorage.getItem(key);
  if (stored === null) return [];

  const value = JSON.parse(stored);
  if (!Array.isArray(value) || value.some((id) => !Number.isInteger(id))) {
    throw new Error(`Invalid saved workout data in "${key}".`);
  }

  return [...new Set(value)];
}

export function FitLogProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [workoutStatus, setWorkoutStatus] = useState("loading");
  const [workoutError, setWorkoutError] = useState("");
  const [planIds, setPlanIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const loadWorkouts = useCallback(async () => {
    try {
      const response = await fetch("/api/workouts", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load workouts.");
      }

      setWorkouts(result);
      setWorkoutStatus("ready");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load workouts.";
      console.error("Workout loading failed:", message);
      setWorkoutError(message);
      setWorkoutStatus("error");
    }
  }, []);

  const retryWorkouts = useCallback(() => {
    setWorkoutStatus("loading");
    setWorkoutError("");
    loadWorkouts();
  }, [loadWorkouts]);

  useEffect(() => {
    const timer = window.setTimeout(loadWorkouts, 0);
    return () => window.clearTimeout(timer);
  }, [loadWorkouts]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const [key, setter] of [
        [STORAGE_KEYS.plan, setPlanIds],
        [STORAGE_KEYS.saved, setSavedIds],
        [STORAGE_KEYS.completed, setCompletedIds],
      ]) {
        try {
          setter(readStoredIds(key));
        } catch (error) {
          console.error(
            "Unable to restore saved workouts:",
            error instanceof Error ? error.message : String(error),
          );
        }
      }
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    try {
      window.localStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(planIds));
      window.localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedIds));
      window.localStorage.setItem(
        STORAGE_KEYS.completed,
        JSON.stringify(completedIds),
      );
    } catch (error) {
      console.error(
        "Unable to persist saved workouts:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }, [completedIds, planIds, savedIds, storageReady]);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const addToPlan = useCallback(
    (id) => {
      if (planIds.includes(id)) {
        showToast("Already in today's plan.");
        return;
      }
      if (planIds.length >= 5) {
        showToast("Today's plan is full. Finish a lift to make room.");
        return;
      }
      setPlanIds((current) => [...current, id]);
      showToast("Added to today's plan.");
    },
    [planIds, showToast],
  );

  const saveForLater = useCallback(
    (id) => {
      if (savedIds.includes(id)) {
        showToast("Already saved for later.");
        return;
      }
      setSavedIds((current) => [...current, id]);
      showToast("Saved for later.");
    },
    [savedIds, showToast],
  );

  const removeFromPlan = useCallback(
    (id) => {
      setPlanIds((current) => current.filter((item) => item !== id));
      setCompletedIds((current) => current.filter((item) => item !== id));
      showToast("Removed from today's plan.");
    },
    [showToast],
  );

  const removeFromSaved = useCallback(
    (id) => {
      setSavedIds((current) => current.filter((item) => item !== id));
      showToast("Removed from saved.");
    },
    [showToast],
  );

  const markDone = useCallback(
    (id) => {
      setCompletedIds((current) =>
        current.includes(id) ? current : [...current, id],
      );
      showToast("Lift marked as done.");
    },
    [showToast],
  );

  return (
    <FitLogContext.Provider
      value={{
        workouts,
        workoutStatus,
        workoutError,
        retryWorkouts,
        planIds,
        savedIds,
        completedIds,
        storageReady,
        toast,
        addToPlan,
        saveForLater,
        removeFromPlan,
        removeFromSaved,
        markDone,
      }}
    >
      {children}
      {toast && (
        <div className="toast-notice" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          {toast}
        </div>
      )}
    </FitLogContext.Provider>
  );
}

export function useFitLog() {
  const context = useContext(FitLogContext);

  if (!context) {
    throw new Error("useFitLog must be used inside FitLogProvider.");
  }

  return context;
}
