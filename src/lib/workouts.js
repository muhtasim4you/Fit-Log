const WORKOUT_ENDPOINTS = [
  "https://api.abcz.workers.dev/api/fitlog",
  "https://api.api-store.workers.dev/api/fitlog",
];

function isWorkoutList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (workout) =>
        Number.isInteger(workout.id) &&
        typeof workout.name === "string" &&
        typeof workout.image === "string" &&
        Array.isArray(workout.muscleGroups) &&
        typeof workout.equipment === "string" &&
        typeof workout.duration === "number" &&
        typeof workout.caloriesBurned === "number" &&
        typeof workout.rating === "number",
    )
  );
}

export async function getWorkouts() {
  const failures = [];

  for (const endpoint of WORKOUT_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        failures.push(`${endpoint} returned ${response.status}`);
        continue;
      }

      const workouts = await response.json();

      if (!isWorkoutList(workouts)) {
        failures.push(`${endpoint} returned an invalid workout list`);
        continue;
      }

      return workouts;
    } catch (error) {
      failures.push(
        `${endpoint}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  throw new Error(`Unable to load workouts. ${failures.join("; ")}`);
}
