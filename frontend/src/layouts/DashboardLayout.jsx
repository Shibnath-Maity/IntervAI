import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const COLLAPSE_KEY = "intervai:sidebar-collapsed";

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable — preference just won't persist */
    }
  }, [collapsed]);

  // Close the mobile drawer after navigating.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the drawer; lock page scroll while it is open.
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileOpen]);

  return (
    <div className="relative min-h-screen bg-[#070a13] text-slate-100 antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      {/* Ambient gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(60rem_40rem_at_20%_-10%,rgba(99,102,241,0.16),transparent),radial-gradient(50rem_35rem_at_100%_0%,rgba(139,92,246,0.10),transparent)]"
      />

      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={`relative transition-[padding] duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />

        <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}