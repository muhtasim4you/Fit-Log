import Link from "next/link";
import WorkoutImage from "./workout-image";

export default function WorkoutCard({ workout }) {
  return (
    <Link
      className="workout-card"
      href={`/workout/${workout.id}`}
      aria-label={`View ${workout.name} details`}
    >
      <div className="workout-card-image">
        <WorkoutImage src={workout.image} alt={workout.name} />
        <span className="card-index">{String(workout.id).padStart(2, "0")}</span>
        <span className="card-open" aria-hidden="true">↗</span>
      </div>
      <div className="workout-card-body">
        <div className="tag-row">
          {workout.muscleGroups.map((group) => (
            <span className="tag" key={group}>{group}</span>
          ))}
        </div>
        <h3>{workout.name}</h3>
        <p className="card-equipment">{workout.equipment}</p>
        <div className="card-stats" aria-label="Workout stats">
          <span><span aria-hidden="true">◷</span>{workout.duration} min</span>
          <span><span aria-hidden="true">♨</span>{workout.caloriesBurned} kcal</span>
          <span><span aria-hidden="true">★</span>{workout.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
