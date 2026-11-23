"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("FitLog route error:", error);
  }, [error]);

  return (
    <section className="not-found route-error">
      <p className="eyebrow"><span className="eyebrow-dot" />Something went wrong</p>
      <h1>Let&apos;s reset the set.</h1>
      <p>The page hit an unexpected error. Try loading it again.</p>
      <button className="button button-primary" type="button" onClick={reset}>
        Try again <span aria-hidden="true">↻</span>
      </button>
    </section>
  );
}
