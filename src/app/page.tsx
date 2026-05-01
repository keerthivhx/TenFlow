import Link from 'next/link';

export default function Home() {
  return (
    <main className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Team Task Manager</h1>
        <p className="landing-subtitle">
          Organize projects, assign tasks, and track team progress all in one place.
        </p>
        <div className="landing-actions">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/register" className="btn btn-secondary">Register</Link>
        </div>
      </div>
    </main>
  );
}
