import { useState, useEffect } from 'react';
import { HealthReport } from "./HealthReport";
import { BroadcastComposer } from "./BroadcastComposer";
import {
  School,
  Users,
  GraduationCap,
  Briefcase,
  UserCircle,
  DollarSign,
  TrendingUp,
  Activity
} from '../../lib/icons';

interface DashboardStats {
  totalSchools: number;
  activeSchools: number;
  blockedSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalParents: number;
  activeParents: number;
  totalPayments: number;
  completedPayments: number;
  totalRevenue: number;
  pendingRevenue: number;
  activePlatforms: number;
}

const MOCK_STATS: DashboardStats = {
  totalSchools: 3,
  activeSchools: 3,
  blockedSchools: 0,
  totalStudents: 4250,
  totalTeachers: 185,
  totalStaff: 92,
  totalParents: 3890,
  activeParents: 2156,
  totalPayments: 10,
  completedPayments: 7,
  totalRevenue: 12850,
  pendingRevenue: 2100,
  activePlatforms: 9
};

import api from '../../services/api/axios';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSchools: 0,
    activeSchools: 0,
    blockedSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalParents: 0,
    activeParents: 0,
    totalPayments: 0,
    completedPayments: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    activePlatforms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get('/super-admin/dashboard');
        setStats(prev => ({
          ...prev,
          totalSchools: response.data.totalSchools || 0,
          activeSchools: response.data.activeSubscriptions || 0,
          blockedSchools: response.data.blockedSchools || 0,
          totalStudents: response.data.totalStudents || 0,
          totalTeachers: response.data.totalTeachers || 0,
          totalStaff: response.data.totalStaff || 0,
          totalParents: response.data.totalParents || 0,
          activeParents: response.data.activeParents || 0,
          totalPayments: response.data.totalPayments || 0,
          completedPayments: response.data.completedPayments || 0,
          totalRevenue: response.data.monthlyRevenue || 0,
          pendingRevenue: response.data.pendingRevenue || 0,
          activePlatforms: response.data.activePlatforms || 0,
        }));
      } catch (error) {
        console.error('Failed to load dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: 'Total Escolas',
      value: stats.totalSchools,
      subtitle: `${stats.activeSchools} activas, ${stats.blockedSchools} bloqueadas`,
      icon: School,
      color: 'bg-blue-500',
      trend: '+2 este mês'
    },
    {
      title: 'Total Alunos',
      value: stats.totalStudents.toLocaleString(),
      subtitle: 'Em todas as escolas',
      icon: GraduationCap,
      color: 'bg-emerald-500',
      trend: '+124 este mês'
    },
    {
      title: 'Total Professores',
      value: stats.totalTeachers.toLocaleString(),
      subtitle: 'Docentes Activos',
      icon: Briefcase,
      color: 'bg-purple-500',
      trend: '+12 este mês'
    },
    {
      title: 'Encarregados (Pais)',
      value: stats.totalParents.toLocaleString(),
      subtitle: `${stats.activeParents.toLocaleString()} com app instalada`,
      icon: Users,
      color: 'bg-amber-500',
      trend: '+45% adopção'
    },
    {
      title: 'Total Receita',
      value: new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(stats.totalRevenue),
      subtitle: `${new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(stats.pendingRevenue)} pendente`,
      icon: DollarSign,
      color: 'bg-emerald-600',
      trend: '+15% vs mês anterior'
    },
    {
      title: 'Pagamentos Processados',
      value: stats.totalPayments.toLocaleString(),
      subtitle: `${stats.completedPayments.toLocaleString()} pagos com sucesso`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      trend: '94% sucesso'
    },
    {
      title: 'Plataformas Activas',
      value: stats.activePlatforms,
      subtitle: 'Dispositivos sincronizados',
      icon: Activity,
      color: 'bg-rose-500',
      trend: 'Sistema saudável'
    },
    {
      title: 'Staff Global',
      value: stats.totalStaff.toLocaleString(),
      subtitle: 'Administrativos e Directores',
      icon: UserCircle,
      color: 'bg-slate-700',
      trend: 'Estável'
    }
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">A carregar estatísticas...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard de Administração</h1>
        <p className="text-slate-500">Visão global de todas as instituições e recursos da YhankoEduca</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-slate-900 mb-1">{card.value}</p>
                <p className="text-slate-500 text-xs">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <HealthReport />
        </div>
        <div className="lg:col-span-1">
          <BroadcastComposer />
        </div>
      </div>
    </div>
  );
}

