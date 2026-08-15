import { ReactNode, useState } from "react";
import toast from 'react-hot-toast';
import { Building2, Search, Eye, EyeOff, Ban, Trash2, GraduationCap, Lock, Clock, User, X, Download } from "../../lib/icons";
import { exportToCSV } from "../../lib/exportToCSV";

type School = {
  id: string;
  name: string;
  code: string;
  director?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: "active" | "blocked" | "inactive";
  studentsCount: number;
  teachersCount: number;
  monthlyRevenue: number;
  staffCount: number;
  created_at: string;
  last_login: string | null;
  subscription_plan: string;
  subscription_expires_at: string;
  login_history: { timestamp: string, ip: string, action: 'login' | 'logout' }[];
};

const mockSchools: School[] = [
  {
      id: "s1",
      name: "Dom Bosco",
      code: "001",
      director: "Padre",
      address: "Rua A, 123 - Centro",
      phone: "99999-0000",
      email: "contato@escolacentral.edu",
      status: "active",
      studentsCount: 850,
      teachersCount: 45,
      monthlyRevenue: 125000,
      staffCount: 50,
      created_at: "2023-01-15T10:00:00Z",
      last_login: "2024-12-05T14:30:00Z",
      subscription_plan: 'premium',
      subscription_expires_at: '2025-12-31T00:00:00Z',
      login_history: [
        { timestamp: "2024-12-05T14:30:00Z", ip: "203.0.113.45", action: 'login' },
        { timestamp: "2024-12-05T10:15:00Z", ip: "203.0.113.45", action: 'logout' },
        { timestamp: "2024-12-04T09:00:00Z", ip: "198.51.100.10", action: 'login' },
      ]
  },
  {
      id: "s2",
      name: "Escola Norte",
      code: "002",
      director: "João Silva",
      address: "Av.456, Bairro Novo",
      phone: "98888-1111",
      email: "contato@escolanorte.edu",
      status: "blocked",
      studentsCount: 600,
      teachersCount: 30,
      monthlyRevenue: 90000,
      staffCount: 90,
      created_at: "2022-08-20T12:30:00Z",
      last_login: "2023-05-10T08:00:00Z",
      subscription_plan: 'basic',
      subscription_expires_at: '2024-06-30T00:00:00Z',
      login_history: [
        { timestamp: "2023-05-10T08:00:00Z", ip: "192.0.2.1", action: 'login' },
        { timestamp: "2023-05-09T17:00:00Z", ip: "192.0.2.1", action: 'logout' },
      ]
  }
];

// Componente de Detalhes da Escola (Modal)
interface SchoolDetailsModalProps {
    school: School;
    onClose: () => void;
}

const SchoolDetailsModal = ({ school, onClose }: SchoolDetailsModalProps) => {
    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'logs'>('info');

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const InfoTab = () => (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">Informações Gerais</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="font-medium">Código:</span> {school.code}</p>
                <p><span className="font-medium">Diretor:</span> {school.director || 'N/A'}</p>
                <p><span className="font-medium">E-mail:</span> {school.email || 'N/A'}</p>
                <p><span className="font-medium">Telefone:</span> {school.phone || 'N/A'}</p>
                <p className="col-span-2"><span className="font-medium">Endereço:</span> {school.address || 'N/A'}</p>
            </div>

            <h4 className="text-lg font-semibold text-slate-800 pt-4">Plano e Status</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="font-medium">Plano de Assinatura:</span> <span className="capitalize">{school.subscription_plan}</span></p>
                <p><span className="font-medium">Expira em:</span> {formatDate(school.subscription_expires_at)}</p>
                <p><span className="font-medium">Status:</span> <span className={`font-bold capitalize ${school.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{school.status}</span></p>
                <p><span className="font-medium">Criada em:</span> {formatDate(school.created_at)}</p>
            </div>

            <h4 className="text-lg font-semibold text-slate-800 pt-4">Estatísticas de Capacidade</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <p><span className="font-medium">Alunos:</span> {school.studentsCount}</p>
                <p><span className="font-medium">Professores:</span> {school.teachersCount}</p>
                <p><span className="font-medium">Funcionários:</span> {school.staffCount}</p>
            </div>
        </div>
    );

    const SecurityTab = () => {
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        return (
        <div className="space-y-6">
            <h4 className="text-lg font-semibold text-slate-800">Alteração de Senha (Diretor/Admin)</h4>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nova Senha</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Insira a nova senha" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nova Senha</label>
                    <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirme a nova senha" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition">
                    Alterar Senha
                </button>
            </form>

            <h4 className="text-lg font-semibold text-slate-800 pt-4">Segurança da Conta</h4>
            <p className="text-sm text-slate-600">
                <span className="font-medium">Último Login:</span> {formatDate(school.last_login)}
            </p>
            <p className="text-sm text-slate-600">
                <span className="font-medium">Status de Bloqueio:</span> {school.status === 'blocked' ? 'Bloqueada' : 'Ativa'}
            </p>
        </div>
        );
    };

    const LogsTab = () => (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">Histórico de Login/Logout</h4>
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-3">
                {school.login_history.length > 0 ? (
                    school.login_history.map((log, index) => (
                        <div key={index} className={`flex justify-between items-center p-2 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} rounded-md`}>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.action === 'login' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {log.action.toUpperCase()}
                                </span>
                                <span className="text-sm text-slate-700">{formatDate(log.timestamp)}</span>
                            </div>
                            <span className="text-xs text-slate-500">IP: {log.ip}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">Nenhum registro de login encontrado.</p>
                )}
            </div>
        </div>
    );

    const tabs = [
        { id: 'info', label: 'Informações Pessoais', icon: User, component: InfoTab },
        { id: 'security', label: 'Segurança e Senha', icon: Lock, component: SecurityTab },
        { id: 'logs', label: 'Logs de Acesso', icon: Clock, component: LogsTab },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h3 className="text-2xl font-bold text-slate-900">
                        Detalhes da Escola: {school.name}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-slate-200 px-6 pt-2 sticky top-[77px] bg-white z-10">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'info' | 'security' | 'logs')}
                                className={`
                                    flex items-center space-x-2 py-3 px-1 text-sm font-medium transition-colors
                                    ${activeTab === tab.id
                                        ? 'border-b-2 border-slate-900 text-slate-900'
                                        : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }
                                `}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tabs Content */}
                <div className="p-6">
                    {activeTab === 'info' && <InfoTab />}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'logs' && <LogsTab />}
                </div>
            </div>
        </div>
    );
};

// --- SchoolsList Component ---
import api from '../../services/api/axios';
import { useEffect } from 'react';

export function SchoolsList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [actionType, setActionType] = useState<"block" | "delete" | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadSchools();
  }, [refreshTrigger]);

  const loadSchools = async () => {
    try {
      const response = await api.get('/super-admin/schools');
      const formatted = response.data.map((inst: any) => ({
        id: inst.id,
        name: inst.name,
        code: inst.code,
        email: inst.email,
        phone: inst.phone,
        address: inst.address,
        status: inst.status,
        director: inst.director,
        studentsCount: inst.studentsCount,
        teachersCount: inst.teachersCount,
        staffCount: inst.staffCount,
        subscription_plan: inst.subscription_plan,
        subscription_expires_at: inst.subscription_expires_at,
        monthlyRevenue: inst.monthlyRevenue,
        login_history: [],
        created_at: inst.createdAt,
      }));
      setSchools(formatted);
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
    (school.director || "").toLowerCase().includes(activeSearchTerm.toLowerCase())
  );

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBlockSchool = (school: School) => {
    setSelectedSchool(school);
    setActionType("block");
  };

  const handleDeleteSchool = (school: School) => {
    setSelectedSchool(school);
    setActionType("delete");
  };

  const handleViewDetails = (school: School) => {
    setSelectedSchool(school);
    setShowDetailsModal(true);
  };

  const confirmAction = () => {
    if (!selectedSchool) return;

    if (actionType === "block") {
      setSchools(schools.map(s =>
        s.id === selectedSchool.id
          ? { ...s, status: s.status === "blocked" ? "active" : "blocked" }
          : s
      ));
      toast.success(
        selectedSchool.status === "blocked"
          ? `Escola ${selectedSchool.name} desbloqueada com sucesso!`
          : `Escola ${selectedSchool.name} bloqueada com sucesso!`
      );
    } else if (actionType === "delete") {
      setSchools(schools.filter(s => s.id !== selectedSchool.id));
      toast.success(`Escola ${selectedSchool.name} removida com sucesso!`);
    }

    setSelectedSchool(null);
    setActionType(null);
  };

  const getStatusBadge = (status: School["status"]) => {
    // Nota: As classes 'default', 'destructive', 'secondary' não estão definidas aqui.
    // Assumindo que são classes Tailwind ou de um framework de componentes (shadcn/ui, etc.)
    // Vou usar classes Tailwind simples para simular.
    const variants = {
      active: { className: "bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium", label: "Ativa" },
      blocked: { className: "bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium", label: "Bloqueada" },
      inactive: { className: "bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium", label: "Inativa" }
    };
    return variants[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6 animate-fade-in">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Escolas Ativas</div>
              <Building2 className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{schools.filter(s => s.status === "active").length}</div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Escolas Bloqueadas</div>
              <Ban className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{schools.filter(s => s.status === "blocked").length}</div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total de Alunos</div>
              <GraduationCap className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{schools.reduce((sum, s) => sum + s.studentsCount, 0)}</div>
            </div>
          </div>
        </div>
        <div className="mb-6">
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                        type="text"
                        placeholder="Buscar por nome, código ou diretor..."
                        className="w-full pl-10 pr-4 py-2 border-[1px] border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button onClick={handleSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        Buscar
                    </button>
                    <button
                        onClick={() => exportToCSV(schools, 'schools')}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 font-medium"
                    >
                        <Download className="w-5 h-5" />
                        Exportar CSV
                    </button>
                  </div>
        </div>

        {/* Schools List */}
       {/* Schools Table */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-[1px] border-gray-200 rounded-lg">
                <thead>
                  <tr className="border-b border-border border-[1px] border-gray-200 rounded-lg bg-gray-50">
                    <th className="text-left p-4 font-semibold text-slate-700">Escola</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Local</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Código</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Diretor</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Contato</th>
                    <th className="text-left p-4 font-semibold text-slate-700">E-mail</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Alunos</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Professores</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Funcionários</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Plano</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Receita Mensal</th>
                    <th className="text-center p-4 font-semibold text-slate-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="border-[1px] border-gray-200">
                  {filteredSchools.map((school, index) => {
                    const statusInfo = getStatusBadge(school.status);
                    return (
                      <tr 
                        key={school.id} 
                        className="border-b border-border hover:bg-gray-50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-slate-900">{school.name}</p>
                          </div>
                        </td>

                        <td className="p-4">
                          <div>
                            <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                              {school.address}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-mono text-sm text-slate-900">{school.code}</span>
                        </td>
                        <td className="p-4">
                          <span className={statusInfo.className}>{statusInfo.label}</span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-slate-900">{school.director}</p>
                        </td>
                        <td className="p-4">
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              {school.phone}
                            </p>
                        </td>
                        <td className="p-4">
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              {school.email}
                            </p>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-slate-900">{school.studentsCount}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-slate-900">{school.teachersCount}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-slate-900">{school.staffCount}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded capitalize">
                            {school.subscription_plan}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-slate-900">
                              {(school.monthlyRevenue || 0).toLocaleString('pt-AO')} Kz
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                              <button title="Ver detalhes" onClick={() => handleViewDetails(school)}>
                                <Eye className="h-4 w-4 text-blue-600 hover:text-blue-800 transition" />
                              </button>
                            <button
                              onClick={() => handleBlockSchool(school)}
                              className={school.status === "blocked" ? "text-green-600 hover:text-green-800 transition" : "text-orange-600 hover:text-orange-800 transition"}
                              title={school.status === "blocked" ? "Desbloquear" : "Bloquear"}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchool(school)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Remover escola"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredSchools.length === 0 && (
          <div className="animate-fade-in">
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-lg font-medium text-slate-900">Nenhuma escola encontrada</p>
              <p className="text-sm text-slate-600">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {selectedSchool && actionType && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="text-lg font-semibold mb-2 text-slate-900">
              {actionType === "block"
                ? selectedSchool.status === "blocked"
                  ? "Desbloquear Escola"
                  : "Bloquear Escola"
                : "Remover Escola"}
            </div>
            <div className="text-sm text-slate-600 mb-4">
              {actionType === "block"
                ? selectedSchool.status === "blocked"
                  ? `Tem certeza que deseja desbloquear a escola "${selectedSchool.name}"? A escola voltará a ter acesso total à plataforma.`
                  : `Tem certeza que deseja bloquear a escola "${selectedSchool.name}"? Isso impedirá o acesso de todos os usuários vinculados a esta escola.`
                : `Tem certeza que deseja remover a escola "${selectedSchool.name}"? Esta ação não pode ser desfeita.`}
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setSelectedSchool(null); setActionType(null); }}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmAction} 
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition ${actionType === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Details Modal */}
      {selectedSchool && showDetailsModal && (
        <SchoolDetailsModal school={selectedSchool} onClose={() => { setShowDetailsModal(false); setSelectedSchool(null); }} />
      )}
    </div>
  );
};