import Link from "next/link";

export default function NotFound() {
  return (
    <main className="main-content section-container content-page not-found-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page or game code guide you were looking for doesn't exist or has moved.</p>
      <Link href="/" className="game-card-btn">
        Back to Homepage
      </Link>
    </main>
  );
}
