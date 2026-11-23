"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 9v6m4-9v12m8-12v12m4-9v6M8 12h8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.3"
        />
      </svg>
    </span>
  );
}

export function SiteHeader({ planCount = 0, savedCount = 0 }) {
  const pathname = usePathname();
  const isWorkoutPage = pathname === "/" || pathname.startsWith("/workout/");

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link className="brand" href="/" aria-label="FitLog home">
          <BrandMark />
          <span>FITLOG</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link className={`nav-link${isWorkoutPage ? " is-active" : ""}`} href="/">
            Workout
          </Link>
          <Link
            className={`nav-link${pathname === "/my-plan" ? " is-active" : ""}`}
            href="/my-plan"
          >
            My Plan
          </Link>
        </nav>
        <div className="nav-actions">
          <Link className="nav-badge" href="/my-plan" aria-label={`Plan, ${planCount} exercises`}>
            Plan <strong>{planCount}</strong>
          </Link>
          <Link
            className="nav-badge saved"
            href="/my-plan?tab=saved"
            aria-label={`Saved, ${savedCount} exercises`}
          >
            Saved <strong>{savedCount}</strong>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand" href="/" aria-label="FitLog home">
          <BrandMark />
          <span>FITLOG</span>
        </Link>
        <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </div>
    </footer>
  );
}
