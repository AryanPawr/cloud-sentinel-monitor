import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    to: "/services",
    label: "Services",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v.75a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-.75M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm4.5 0h.008v.008H21V12zm-18 0h.008v.008H3V12z" />
      </svg>
    ),
  },
  {
    to: "/alerts",
    label: "Alerts",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-md bg-cyan-500/20 border border-cyan-500/40" />
              <div className="absolute inset-1 rounded-sm bg-cyan-400/30" />
              <svg className="absolute inset-0 w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-100 font-semibold text-sm tracking-tight">CloudReliability</span>
              <span className="text-slate-600 text-xs font-mono ml-2 hidden lg:inline">v2.1.0</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-colors ${isActive ? "text-cyan-400" : "group-hover:text-slate-300"}`}>
                      {item.icon}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right â€” user info + logout */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline">All Systems</span>
              <span>Live</span>
            </div>

            {/* User name */}
            {user && (
              <span className="hidden lg:block text-xs font-mono text-slate-500 truncate max-w-[120px]">
                {user.name}
              </span>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center
                justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40
                hover:bg-rose-500/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
