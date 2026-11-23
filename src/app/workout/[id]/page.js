import { notFound } from "next/navigation";
import WorkoutDetails from "../../../components/workout-details";
import { getWorkouts } from "../../../lib/workouts";

export default async function WorkoutPage({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  let workouts = null;
  try {
    workouts = await getWorkouts();
  } catch (error) {
    console.error(
      "Unable to validate workout route:",
      error instanceof Error ? error.message : String(error),
    );
  }

  if (workouts && !workouts.some((workout) => workout.id === Number(id))) {
    notFound();
  }

  return <WorkoutDetails workoutId={Number(id)} />;
}
