import { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { Map, FileText, 
  LayoutDashboard,
  School,
  DollarSign,
  Activity,
  LogOut,
  Menu,
  X,
  Users2,
  User,
  SquareUser,
  MessageSquare,
  Settings
} from "../lib/icons";

import { useAuthStore } from '../store/authStore';
export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Interessados", icon: User, path: "/leads" },
    { name: "Schools", icon: School, path: "/schools" },
    { name: "Students", icon: User, path: "/students" },
    { name: "Parents", icon: Users2, path: "/parents" },
    { name: "Teachers", icon: SquareUser, path: "/teachers" },
    { name: "Payments", icon: DollarSign, path: "/payments" },
    { name: "Platforms", icon: Activity, path: "/platforms" },
    { name: "Planos e Preços", icon: Map, path: "/plans" },
    { name: "Suporte", icon: MessageSquare, path: "/tickets" },
    { name: "Auditoria (Logs)", icon: FileText, path: "/logs" },
    { name: "Configurações", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Administrador geral</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600 hover:text-slate-900"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full max-h-screen">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>School Manager</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Super Admin Platform</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 shrink-0 bg-white">
            <button
              onClick={() => {
                logout(); navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 font-medium text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-6 lg:p-8">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

