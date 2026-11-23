import { notFound } from "next/navigation";
import WorkoutDetails from "../../../components/workout-details";

export default async function WorkoutPage({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  return <WorkoutDetails workoutId={Number(id)} />;
}
