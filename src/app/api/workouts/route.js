import { getWorkouts } from "../../../lib/workouts";

export async function GET() {
  try {
    const workouts = await getWorkouts();
    return Response.json(workouts);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown workout API error";
    console.error("Workout API request failed:", message);
    return Response.json({ error: message }, { status: 502 });
  }
}
