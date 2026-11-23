"use client";

import WorkoutCard from "../components/workout-card";
import WorkoutImage from "../components/workout-image";
import { useFitLog } from "../components/fitlog-provider";
import { useMemo, useState } from "react";

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
  const [sortBy, setSortBy] = useState("duration");
  const [search, setSearch] = useState("");
  const featuredWorkout = workouts[0];
  const visibleWorkouts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return workouts
      .filter((workout) =>
        `${workout.name} ${workout.muscleGroups.join(" ")} ${workout.equipment}`
          .toLowerCase()
          .includes(query),
      )
      .sort((left, right) => left[sortBy] - right[sortBy] || left.id - right.id);
  }, [search, sortBy, workouts]);

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
                priority
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
        </div>

        {workoutStatus === "ready" && (
          <div className="library-controls">
            <label className="search-control">
              <span className="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                </svg>
              </span>
              <span className="visually-hidden">Search workouts</span>
              <input
                type="search"
                placeholder="Search lifts or muscle groups"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="sort-control">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="duration">Duration</option>
                <option value="caloriesBurned">Calories</option>
                <option value="rating">Rating</option>
              </select>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
                <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </label>
            <span className="result-count">
              <strong>{visibleWorkouts.length.toString().padStart(2, "0")}</strong> exercises
            </span>
          </div>
        )}

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
          visibleWorkouts.length > 0 ? (
            <div className="workout-grid">
              {visibleWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          ) : (
            <div className="library-empty">
              <h3>No lifts found</h3>
              <p>Try a different workout name or muscle group.</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
