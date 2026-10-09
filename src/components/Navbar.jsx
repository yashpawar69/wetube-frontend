import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LayoutDashboard, Radio } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TallyDot from "./TallyDot";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/?query=${encodeURIComponent(trimmed)}` : "/");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <TallyDot />
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            WE<span className="text-accent">·</span>TUBE
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="flex items-center rounded-full border border-line bg-surface px-4 py-2 focus-within:border-accent">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Videos"
              className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <button type="submit" className="font-mono text-xs text-muted hover:text-accent" aria-label="Search">
              GO
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link to="/tweets" className="hidden items-center gap-1.5 text-sm text-muted hover:text-ink sm:flex">
                <Radio size={14} /> Broadcasts
              </Link>
              <Link to="/dashboard" className="hidden items-center gap-1.5 text-sm text-muted hover:text-ink sm:flex">
                <LayoutDashboard size={14} /> Studio
              </Link>
              <Link
                to="/upload"
                className="rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-bg transition-colors"
              >
                Upload
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-line pl-1 pr-3 py-1 hover:border-muted"
                >
                  <img src={user.avatar} alt={user.username} className="h-7 w-7 rounded-full object-cover" />
                  <span className="text-sm text-ink">{user.username}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-line bg-surface py-1 shadow-xl">
                    <div className="px-3 py-2 text-xs text-muted font-mono truncate">{user.email}</div>
                    <Link
                      to={`/channel/${user.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                    >
                      My Channel
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                    >
                      Creator Studio
                    </Link>
                    <Link
                      to="/tweets"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover sm:hidden"
                    >
                      Broadcasts
                    </Link>
                    <Link
                      to="/liked"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                    >
                      Liked Videos
                    </Link>
                    <Link 
                    to="/history"
                    onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                    >Watch History</Link>

                    <Link 
                    to="/settings"
                    onClick={() => setMenuOpen(false)} className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                    >Settings</Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink hover:text-accent">Log in</Link>
              <Link to="/register" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
