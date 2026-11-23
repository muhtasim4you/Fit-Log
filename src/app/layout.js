import "./globals.css";
import { SiteFooter, SiteHeader } from "../components/site-shell";

export const metadata = {
  title: "FitLog — Workout Library",
  description:
    "Pick a lift, lock it into today's plan, and watch the week's work add up.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
