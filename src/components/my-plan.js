"use client";

import Link from "next/link";
import PlanWorkoutCard from "./plan-workout-card";
import { useFitLog } from "./fitlog-provider";

function Metric({ label, value, icon }) {
  return (
    <article className="metric-card">
      <span className="metric-icon" aria-hidden="true">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default function MyPlan({ initialTab }) {
  const {
    workouts,
    workoutStatus,
    workoutError,
    retryWorkouts,
    planIds,
    savedIds,
    completedIds,
    storageReady,
  } = useFitLog();
  const isSavedTab = initialTab === "saved";
  const listIds = isSavedTab ? savedIds : planIds;
  const list = listIds
    .map((id) => workouts.find((workout) => workout.id === id))
    .filter(Boolean);
  const planned = planIds
    .map((id) => workouts.find((workout) => workout.id === id))
    .filter(Boolean);
  const totalMinutes = planned.reduce((total, workout) => total + workout.duration, 0);
  const totalCalories = planned.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0,
  );
  const isLoading = workoutStatus === "loading" || !storageReady;

  return (
    <div className="my-plan-page">
      <section className="plan-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" />Your training log / 01</p>
          <h1>My Plan</h1>
          <p className="plan-subtitle">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>
        <div className="plan-cap">
          <span>DAILY CAP</span>
          <strong>{String(planIds.length).padStart(2, "0")} <i>/ 05</i></strong>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Today's plan summary">
        <Metric label="Exercises" value={planIds.length} icon="01" />
        <Metric label="Minutes" value={totalMinutes} icon="◷" />
        <Metric label="Calories" value={totalCalories} icon="♨" />
      </section>

      <section className="plan-list-section">
        <div className="plan-tabs-wrap">
          <nav className="plan-tabs" aria-label="Plan lists">
            <Link
              className={`plan-tab${!isSavedTab ? " is-active" : ""}`}
              href="/my-plan"
              aria-current={!isSavedTab ? "page" : undefined}
            >
              Today&apos;s Plan <span>{planIds.length}</span>
            </Link>
            <Link
              className={`plan-tab${isSavedTab ? " is-active" : ""}`}
              href="/my-plan?tab=saved"
              aria-current={isSavedTab ? "page" : undefined}
            >
              Saved <span>{savedIds.length}</span>
            </Link>
          </nav>
          {!isSavedTab && (
            <span className="plan-list-count">
              {planIds.length} / 5 LIFTS
            </span>
          )}
        </div>

        {isLoading && (
          <div className="plan-loading" role="status">
            <span className="loading-spinner" />
            <span>Loading workouts…</span>
          </div>
        )}

        {!isLoading && workoutStatus === "error" && (
          <div className="data-error" role="alert">
            <p>We couldn&apos;t load your workout list.</p>
            <span>{workoutError}</span>
            <button className="button button-outline" onClick={retryWorkouts} type="button">
              Try again
            </button>
          </div>
        )}

        {!isLoading && workoutStatus === "ready" && list.length === 0 && (
          <div className="plan-empty">
            <span className="empty-index">FL / 00</span>
            <p className="eyebrow">A clean slate</p>
            <h2>Nothing here yet</h2>
            <p>Browse the library and add a lift to get today moving.</p>
            <Link className="button button-primary" href="/">
              Go to workouts <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}

        {!isLoading && workoutStatus === "ready" && list.length > 0 && (
          <div className="plan-workout-list">
            {list.map((workout) => (
              <PlanWorkoutCard
                key={workout.id}
                workout={workout}
                mode={isSavedTab ? "saved" : "plan"}
                completed={!isSavedTab && completedIds.includes(workout.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
