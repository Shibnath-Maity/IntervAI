import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BrainCircuit,
  FileText,
  History,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";
import UserAvatar from "./UserAvatar";

const mainLinks = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
  { name: "New Interview", path: "/dashboard/interview", icon: PlusCircle },
  { name: "My Interviews", path: "/dashboard/history", icon: History },
  { name: "Resume Analysis", path: "/dashboard/resume", icon: FileText },
  { name: "Performance Reports", path: "/dashboard/performance", icon: BarChart3 },
];

const secondaryLinks = [
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", path: "/dashboard/help", icon: LifeBuoy },
];

function SidebarLink({ link, collapsed }) {
  const { name, path, icon: Icon, end } = link;

  return (
    <NavLink
      to={path}
      end={end}
      title={collapsed ? name : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
          collapsed ? "lg:justify-center lg:px-0" : ""
        } ${
          isActive
            ? "bg-indigo-500/15 text-white ring-1 ring-inset ring-indigo-400/20"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={19}
            aria-hidden="true"
            className={`shrink-0 transition-colors ${
              isActive ? "text-indigo-300" : "text-slate-500 group-hover:text-slate-300"
            }`}
          />
          <span className={collapsed ? "lg:sr-only" : ""}>{name}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user } = useAuth();
  const handleLogout = useLogout();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl transition-[transform,width] duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Brand */}
        <div
          className={`flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <NavLink
            to="/dashboard"
            end
            className="flex items-center gap-2.5 rounded-md text-lg font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] shadow-[0_0_24px_rgba(99,102,241,0.35)]">
              <BrainCircuit size={20} aria-hidden="true" />
            </span>
            <span className={collapsed ? "lg:hidden" : ""}>
              Interv<span className="text-indigo-400">AI</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 lg:hidden"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Primary" className="flex-1 space-y-8 overflow-y-auto px-3 py-6">
          <div>
            <p
              className={`mb-3 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Workspace
            </p>
            <div className="space-y-1">
              {mainLinks.map((link) => (
                <SidebarLink key={link.path} link={link} collapsed={collapsed} />
              ))}
            </div>
          </div>

          <div>
            <p
              className={`mb-3 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Account
            </p>
            <div className="space-y-1">
              {secondaryLinks.map((link) => (
                <SidebarLink key={link.path} link={link} collapsed={collapsed} />
              ))}
            </div>
          </div>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden px-3 pb-2 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            aria-controls="dashboard-sidebar"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen size={19} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={19} aria-hidden="true" />
            )}
            <span className={collapsed ? "sr-only" : ""}>Collapse</span>
          </button>
        </div>

        {/* User */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <div
            className={`flex items-center gap-3 rounded-lg p-2 ${
              collapsed ? "lg:flex-col lg:gap-2 lg:px-0" : ""
            }`}
          >
            <UserAvatar name={user?.name} />

            <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-sm font-medium text-white">{user?.name || "Guest"}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="rounded-md p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}