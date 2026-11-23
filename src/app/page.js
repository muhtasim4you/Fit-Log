"use client";

import WorkoutCard from "../components/workout-card";
import WorkoutImage from "../components/workout-image";
import { useFitLog } from "../components/fitlog-provider";

function LoadingGrid() {
  return (
    <div className="workout-grid" aria-label="Loading workouts">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-image" />
          <div className="skeleton-copy" />
          <div className="skeleton-copy short" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { workouts, workoutStatus, workoutError, retryWorkouts } = useFitLog();
  const featuredWorkout = workouts[0];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" />Workout Library</p>
          <h1>
            Train with intent.
            <span>Log every set.</span>
          </h1>
          <p className="hero-description">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>
          <a className="button button-primary hero-cta" href="#library">
            Browse workouts <span aria-hidden="true">↘</span>
          </a>
          <div className="hero-footnote">
            <span className="footnote-line" />
            <span>Good training starts with a plan.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame">
            {featuredWorkout ? (
              <WorkoutImage
                src={featuredWorkout.image}
                alt={`${featuredWorkout.name} exercise illustration`}
              />
            ) : (
              <div className="hero-image-placeholder" aria-hidden="true">
                <span>FL / 01</span>
              </div>
            )}
            <div className="hero-image-shade" />
            <span className="hero-image-label">The work speaks.</span>
            <span className="hero-image-counter">01 <i>/</i> 12</span>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>TRAIN</span>
            <strong>HARD</strong>
            <span>STAY READY</span>
          </div>
        </div>
        <span className="hero-side-note" aria-hidden="true">MOVE WITH PURPOSE — 001</span>
      </section>

      <section className="library-section" id="library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / Find your next lift</p>
            <h2>The Library</h2>
            <p className="section-subtitle">
              Twelve lifts covering every major muscle group.
            </p>
          </div>
          {workoutStatus === "ready" && (
            <span className="result-count">
              <strong>{workouts.length.toString().padStart(2, "0")}</strong> exercises
            </span>
          )}
        </div>

        {workoutStatus === "loading" && (
          <div className="loading-state" role="status">
            <span className="loading-spinner" />
            <span>Loading workouts…</span>
          </div>
        )}
        {workoutStatus === "loading" && <LoadingGrid />}
        {workoutStatus === "error" && (
          <div className="data-error" role="alert">
            <p>We couldn&apos;t load the workout library.</p>
            <span>{workoutError}</span>
            <button className="button button-outline" onClick={retryWorkouts} type="button">
              Try again
            </button>
          </div>
        )}
        {workoutStatus === "ready" && (
          <div className="workout-grid">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
