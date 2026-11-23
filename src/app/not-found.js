import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow"><span className="eyebrow-dot" />404 / Wrong turn</p>
      <h1>This page isn&apos;t in the plan.</h1>
      <p>The route may have moved. The next rep is still waiting in the library.</p>
      <Link className="button button-primary" href="/">
        Back to workouts <span aria-hidden="true">↗</span>
      </Link>
      <span className="not-found-code" aria-hidden="true">FL — 404</span>
    </section>
  );
}
