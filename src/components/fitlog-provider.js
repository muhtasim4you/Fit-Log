"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const FitLogContext = createContext(null);

export function FitLogProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [workoutStatus, setWorkoutStatus] = useState("loading");
  const [workoutError, setWorkoutError] = useState("");

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

  return (
    <FitLogContext.Provider
      value={{
        workouts,
        workoutStatus,
        workoutError,
        retryWorkouts,
      }}
    >
      {children}
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
