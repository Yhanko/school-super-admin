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
      title: 'Total Schools',
      value: stats.totalSchools,
      subtitle: `${stats.activeSchools} active, ${stats.blockedSchools} blocked`,
      icon: School,
      color: 'bg-blue-500'
    },
    {
      title: 'Students',
      value: stats.totalStudents.toLocaleString(),
      subtitle: 'Across all schools',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers.toLocaleString(),
      subtitle: 'Active educators',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Staff Members',
      value: stats.totalStaff.toLocaleString(),
      subtitle: 'Administrative staff',
      icon: Briefcase,
      color: 'bg-slate-500'
    },
    {
      title: 'Parents',
      value: stats.totalParents.toLocaleString(),
      subtitle: `${stats.activeParents} using platform`,
      icon: UserCircle,
      color: 'bg-cyan-500'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subtitle: `${stats.completedPayments} completed payments`,
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: 'Pending Revenue',
      value: `$${stats.pendingRevenue.toLocaleString()}`,
      subtitle: `${stats.totalPayments - stats.completedPayments} pending payments`,
      icon: TrendingUp,
      color: 'bg-amber-500'
    },
    {
      title: 'Active Platforms',
      value: stats.activePlatforms,
      subtitle: 'Platform integrations',
      icon: Activity,
      color: 'bg-violet-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
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

