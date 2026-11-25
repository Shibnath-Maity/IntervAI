import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Bell, ChevronDown, LifeBuoy, LogOut, Menu, Search, Settings, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useDismiss from "../../hooks/useDismiss";
import useLogout from "../../hooks/useLogout";
import { mockNotifications } from "../../data/mockDashboard"; // MOCK — swap for real notifications later
import UserAvatar from "./UserAvatar";

const iconButton =
  "relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60";

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const notifications = mockNotifications;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        className={iconButton}
      >
        <Bell size={19} aria-hidden="true" />
        {notifications.length > 0 && (
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-[#0a0e1a]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/10 bg-[#0d1224]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">You're all caught up.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-white/5 overflow-y-auto">
              {notifications.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-100">{item.title}</p>
                    <span className="shrink-0 text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { user } = useAuth();
  const handleLogout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:outline-none";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-1 pl-1 pr-2 transition hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
      >
        <UserAvatar name={user?.name} size="sm" />
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile"
          className="absolute right-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/10 bg-[#0d1224]/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="border-b border-white/10 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-medium text-white">{user?.name || "Guest"}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <div className="pt-1.5">
            <Link role="menuitem" to="/dashboard/settings" onClick={close} className={itemClass}>
              <Settings size={16} aria-hidden="true" /> Settings
            </Link>
            <Link role="menuitem" to="/dashboard/help" onClick={close} className={itemClass}>
              <LifeBuoy size={16} aria-hidden="true" /> Help &amp; Support
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className={`${itemClass} hover:bg-rose-500/10 hover:text-rose-300`}
            >
              <LogOut size={16} aria-hidden="true" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onOpenMobileSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const inputRef = useRef(null);

  const urlQuery = params.get("q") ?? "";
  const onOverview = pathname === "/dashboard";
  const [query, setQuery] = useState(onOverview ? urlQuery : "");

  // Keep the input in sync with the URL (back/forward, clearing from the page, leaving Overview).
  useEffect(() => {
    setQuery(onOverview ? urlQuery : "");
  }, [onOverview, urlQuery]);

  // Cmd/Ctrl + K focuses search.
  useEffect(() => {
    const handleKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (onOverview) setParams(value ? { q: value } : {}, { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/dashboard?q=${encodeURIComponent(trimmed)}` : "/dashboard");
  };

  const clearSearch = () => {
    setQuery("");
    if (onOverview) setParams({}, { replace: true });
    inputRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070a13]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          aria-controls="dashboard-sidebar"
          className={`${iconButton} lg:hidden`}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 lg:flex-none">
          <h1 className="truncate text-base font-semibold text-white sm:text-lg">
            Welcome back, {user?.name || "there"}
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">Your interview preparation workspace</p>
        </div>

        <form
          role="search"
          onSubmit={handleSubmit}
          className="order-last w-full lg:order-none lg:mx-auto lg:max-w-md lg:flex-1"
        >
          <label htmlFor="dashboard-search" className="sr-only">
            Search interviews
          </label>
          <div className="relative">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              ref={inputRef}
              id="dashboard-search"
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search interviews…"
              autoComplete="off"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-20 text-sm text-white placeholder:text-slate-500 transition focus:border-indigo-400/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="rounded p-1 text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              ) : (
                <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:block">
                  Ctrl K
                </kbd>
              )}
            </div>
          </div>
        </form>

        <div className="flex items-center gap-2.5">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}