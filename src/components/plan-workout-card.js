import Link from "next/link";
import WorkoutImage from "./workout-image";

export default function PlanWorkoutCard({
  workout,
  mode,
  completed = false,
  onMarkDone,
  onRemove,
}) {
  return (
    <article className={`plan-workout-card${completed ? " is-completed" : ""}`}>
      <Link
        className="plan-card-image"
        href={`/workout/${workout.id}`}
        aria-label={`View ${workout.name} details`}
      >
        <WorkoutImage src={workout.image} alt={workout.name} />
      </Link>
      <div className="plan-card-content">
        <div className="plan-card-title-row">
          <div className="tag-row">
            {workout.muscleGroups.map((group) => (
              <span className="tag" key={group}>{group}</span>
            ))}
          </div>
          {completed && <span className="done-label">Completed</span>}
        </div>
        <Link className="plan-card-title" href={`/workout/${workout.id}`}>
          {workout.name}
        </Link>
        <p className="plan-card-equipment">{workout.equipment}</p>
        <div className="plan-card-stats">
          <span><b aria-hidden="true">◷</b>{workout.duration} min</span>
          <span><b aria-hidden="true">♨</b>{workout.caloriesBurned} kcal</span>
          <span><b aria-hidden="true">★</b>{workout.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="plan-card-actions">
        <Link className="button button-outline" href={`/workout/${workout.id}`}>
          View details
        </Link>
        {mode === "plan" && (
          <button
            className={`button button-done${completed ? " is-done" : ""}`}
            type="button"
            disabled={completed}
            onClick={() => onMarkDone(workout.id)}
          >
            <span aria-hidden="true">✓</span>
            {completed ? "Done" : "Mark as done"}
          </button>
        )}
        <button
          className="remove-workout"
          type="button"
          aria-label={`Remove ${workout.name} from ${mode === "plan" ? "today's plan" : "saved workouts"}`}
          title="Remove"
          onClick={() => onRemove(workout.id)}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </article>
  );
}
