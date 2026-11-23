"use client";

import Link from "next/link";
import { useFitLog } from "./fitlog-provider";
import WorkoutImage from "./workout-image";

function SpecRow({ label, value }) {
  return (
    <div className="spec-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function WorkoutDetails({ workoutId }) {
  const {
    workouts,
    workoutStatus,
    workoutError,
    retryWorkouts,
    planIds,
    savedIds,
    addToPlan,
    saveForLater,
  } = useFitLog();
  const workout = workouts.find((item) => item.id === workoutId);

  if (workoutStatus === "loading") {
    return (
      <section className="detail-loading" role="status">
        <span className="loading-spinner" />
        <span>Loading workout details…</span>
      </section>
    );
  }

  if (workoutStatus === "error") {
    return (
      <section className="detail-loading detail-error" role="alert">
        <p>{workoutError}</p>
        <button className="button button-outline" onClick={retryWorkouts} type="button">
          Try again
        </button>
      </section>
    );
  }

  if (!workout) {
    return (
      <section className="missing-workout">
        <p className="eyebrow">404 / Lift not found</p>
        <h1>This lift isn&apos;t in the library.</h1>
        <Link className="button button-primary" href="/">Back to workouts</Link>
      </section>
    );
  }

  const alreadyPlanned = planIds.includes(workout.id);
  const planIsFull = planIds.length >= 5;
  const alreadySaved = savedIds.includes(workout.id);
  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", workout.sets],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", `${workout.rating.toFixed(1)} / 5`],
  ];

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <Link href="/">Workout library</Link>
        <span aria-hidden="true">/</span>
        <span>{workout.name}</span>
      </div>
      <div className="detail-layout">
        <div className="detail-visual">
          <div className="detail-visual-image">
            <WorkoutImage
              src={workout.image}
              alt={`${workout.name} exercise illustration`}
              className="detail-image"
              priority
            />
            <span className="detail-image-index">
              EXERCISE <strong>{String(workout.id).padStart(2, "0")}</strong>
            </span>
            <span className="detail-image-caption">Form first. Every rep.</span>
          </div>
          <div className="detail-visual-footer">
            <span>FITLOG / MOVEMENT LIBRARY</span>
            <span>EST. EVERY REP</span>
          </div>
        </div>

        <div className="detail-copy">
          <p className="eyebrow"><span className="eyebrow-dot" />Workout detail</p>
          <h1>{workout.name}</h1>
          <p className="detail-description">{workout.description}</p>
          <div className="tag-row detail-tags">
            {workout.muscleGroups.map((group) => (
              <span className="tag" key={group}>{group}</span>
            ))}
          </div>

          <section className="detail-specs" aria-labelledby="specs-heading">
            <div className="detail-section-heading">
              <h2 id="specs-heading">Key specs</h2>
              <span>At a glance</span>
            </div>
            <dl>
              {specs.map(([label, value]) => (
                <SpecRow key={label} label={label} value={value} />
              ))}
            </dl>
          </section>

          <section className="instructions" aria-labelledby="instructions-heading">
            <div className="detail-section-heading">
              <h2 id="instructions-heading">Instructions</h2>
              <span>{String(workout.instructions.length).padStart(2, "0")} steps</span>
            </div>
            <ol>
              {workout.instructions.map((instruction, index) => (
                <li key={instruction}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{instruction}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="detail-actions">
            <button
              className="button button-primary"
              type="button"
              disabled={alreadyPlanned || (!alreadyPlanned && planIsFull)}
              onClick={() => addToPlan(workout.id)}
            >
              <span aria-hidden="true">{alreadyPlanned ? "✓" : "+"}</span>
              {alreadyPlanned
                ? "In today's plan"
                : planIsFull
                  ? "Today's plan is full"
                  : "Add to today's plan"}
            </button>
            <button
              className="button button-outline"
              type="button"
              disabled={alreadySaved}
              onClick={() => saveForLater(workout.id)}
            >
              <span aria-hidden="true">{alreadySaved ? "✓" : "☆"}</span>
              {alreadySaved ? "Saved for later" : "Save for later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
