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
  Settings,
  AlertOctagon
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
    { name: "Escolas", icon: School, path: "/schools" },
    { name: "Estudantes", icon: User, path: "/students" },
    { name: "Encarregados", icon: Users2, path: "/parents" },
    { name: "Professores", icon: SquareUser, path: "/teachers" },
    { name: "Pagamentos", icon: DollarSign, path: "/payments" },
    { name: "Plataformas", icon: Activity, path: "/platforms" },
    { name: "Planos e Preços", icon: Map, path: "/plans" },
    { name: "Faturação e Dívidas", icon: AlertOctagon, path: "/billing" },
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
                <span>Gestão Escolar</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Plataforma Super Admin</p>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  Admin Geral
                </p>
                <p className="text-xs text-slate-500 truncate">admin@yhanko.com</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
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

