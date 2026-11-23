"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  const planIdsRef = useRef([]);
  const savedIdsRef = useRef([]);
  const availableWorkoutIds = useMemo(
    () => new Set(workouts.map((workout) => workout.id)),
    [workouts],
  );
  const workoutsReady = workoutStatus === "ready";
  const visiblePlanIds = useMemo(
    () =>
      planIds
        .filter((id) => !workoutsReady || availableWorkoutIds.has(id))
        .slice(0, 5),
    [availableWorkoutIds, planIds, workoutsReady],
  );
  const visibleSavedIds = useMemo(
    () =>
      savedIds.filter((id) => !workoutsReady || availableWorkoutIds.has(id)),
    [availableWorkoutIds, savedIds, workoutsReady],
  );
  const visibleCompletedIds = useMemo(
    () => completedIds.filter((id) => visiblePlanIds.includes(id)),
    [completedIds, visiblePlanIds],
  );

  useEffect(() => {
    planIdsRef.current = visiblePlanIds;
    savedIdsRef.current = visibleSavedIds;
  }, [visiblePlanIds, visibleSavedIds]);

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
      for (const [key, setter, idsRef] of [
        [STORAGE_KEYS.plan, setPlanIds, planIdsRef],
        [STORAGE_KEYS.saved, setSavedIds, savedIdsRef],
        [STORAGE_KEYS.completed, setCompletedIds, null],
      ]) {
        try {
          const ids = readStoredIds(key);
          if (idsRef) idsRef.current = ids;
          setter(ids);
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
      window.localStorage.setItem(
        STORAGE_KEYS.plan,
        JSON.stringify(visiblePlanIds),
      );
      window.localStorage.setItem(
        STORAGE_KEYS.saved,
        JSON.stringify(visibleSavedIds),
      );
      window.localStorage.setItem(
        STORAGE_KEYS.completed,
        JSON.stringify(visibleCompletedIds),
      );
    } catch (error) {
      console.error(
        "Unable to persist saved workouts:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }, [
    storageReady,
    visibleCompletedIds,
    visiblePlanIds,
    visibleSavedIds,
  ]);

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
      const currentPlan = planIdsRef.current
        .filter((item) => !workoutsReady || availableWorkoutIds.has(item))
        .slice(0, 5);

      if (currentPlan.includes(id)) {
        showToast("Already in today's plan.");
        return;
      }
      if (currentPlan.length >= 5) {
        showToast("Today's plan is full. Finish a lift to make room.");
        return;
      }

      const nextPlan = [...currentPlan, id];
      planIdsRef.current = nextPlan;
      setPlanIds(nextPlan);
      showToast("Added to today's plan.");
    },
    [availableWorkoutIds, showToast, workoutsReady],
  );

  const saveForLater = useCallback(
    (id) => {
      const currentSaved = savedIdsRef.current.filter(
        (item) => !workoutsReady || availableWorkoutIds.has(item),
      );

      if (currentSaved.includes(id)) {
        showToast("Already saved for later.");
        return;
      }

      const nextSaved = [...currentSaved, id];
      savedIdsRef.current = nextSaved;
      setSavedIds(nextSaved);
      showToast("Saved for later.");
    },
    [availableWorkoutIds, showToast, workoutsReady],
  );

  const removeFromPlan = useCallback(
    (id) => {
      const nextPlan = planIdsRef.current.filter((item) => item !== id);
      planIdsRef.current = nextPlan;
      setPlanIds(nextPlan);
      setCompletedIds((current) => current.filter((item) => item !== id));
      showToast("Removed from today's plan.");
    },
    [showToast],
  );

  const removeFromSaved = useCallback(
    (id) => {
      const nextSaved = savedIdsRef.current.filter((item) => item !== id);
      savedIdsRef.current = nextSaved;
      setSavedIds(nextSaved);
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
        planIds: visiblePlanIds,
        savedIds: visibleSavedIds,
        completedIds: visibleCompletedIds,
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
