import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

type NavItem = {
  name: string;
  path: string;
  icon: string;
};

const NAV: NavItem[] = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Produtos", path: "/products", icon: "📦" },
  { name: "Matérias-Primas", path: "/materials", icon: "🧂" },
];

export default function Layout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Topbar */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:inline-flex rounded-lg px-3 py-2 hover:bg-slate-800/60 transition"
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            title={collapsed ? "Expandir" : "Recolher"}
          >
            {collapsed ? "»" : "«"}
          </button>

          <div className="flex items-center gap-3">
            {/* Mobile button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden rounded-lg px-3 py-2 hover:bg-slate-800/60 transition"
              aria-label="Abrir menu"
            >
              ☰
            </button>

            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight">
                Autoflex - Test
              </span>
              <span className="text-xs text-slate-400">
                Gestão de produção
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 p-6">
            <SidebarContent collapsed={false} isActive={isActive} />
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar desktop */}
        <aside
          className={[
            "hidden md:flex min-h-[calc(100vh-4rem)] sticky top-16",
            "border-r border-slate-800 bg-slate-900/40 backdrop-blur",
            "transition-all duration-300",
            collapsed ? "w-20" : "w-72",
          ].join(" ")}
        >
          <div className="w-full p-6">
            <SidebarContent collapsed={collapsed} isActive={isActive} />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  collapsed,
  isActive,
}: {
  collapsed: boolean;
  isActive: (path: string) => boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="mb-10">
        {!collapsed ? (
          <>
            <div className="text-3xl font-bold tracking-tight">
              Sistema
            </div>
            <div className="text-slate-400 text-sm mt-1">
              Produção & Estoque
            </div>
          </>
        ) : (
          <div className="text-3xl font-bold">⚛︎</div>
        )}
      </div>

      {/* Nav */}
      <nav className="space-y-2">
        {NAV.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                "relative flex items-center gap-3 rounded-xl px-2 py-3 transition",
                active
                  ? "bg-blue-600/20  text-blue-200"
                  : "text-slate-300 hover:bg-slate-800/60",
              ].join(" ")}
              title={collapsed ? item.name : undefined}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r" />
              )}

              <span className="text-lg">{item.icon}</span>

              {!collapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="mt-auto pt-8 text-xs text-slate-500">
        {!collapsed ? "v1.0 • Autoflex Test" : "v1"}
      </div>
    </div>
  );
}