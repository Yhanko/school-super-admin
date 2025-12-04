import { useState, useEffect } from 'react';
import { Activity, Users, Clock, Smartphone, Globe, Monitor, Zap } from 'lucide-react';

interface Platform {
  id: string;
  school_id: string;
  platform_name: string;
  platform_type: 'mobile' | 'web' | 'desktop' | 'api';
  status: 'active' | 'inactive' | 'maintenance';
  active_users_count: number;
  last_sync: string | null;
  created_at: string;
}

interface PlatformWithDetails extends Platform {
  school_name?: string;
}

interface School {
  id: string;
  name: string;
}

const MOCK_SCHOOLS: School[] = [
  { id: 'sch_001', name: 'Lincoln High School' },
  { id: 'sch_002', name: 'Washington Academy' },
  { id: 'sch_003', name: 'Central Elementary' }
];

const MOCK_PLATFORMS: PlatformWithDetails[] = [
  {
    id: 'plat_001',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    platform_name: 'StudentHub Mobile',
    platform_type: 'mobile',
    status: 'active',
    active_users_count: 1245,
    last_sync: '2024-12-03T14:30:00Z',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 'plat_002',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    platform_name: 'StudentHub Web',
    platform_type: 'web',
    status: 'active',
    active_users_count: 2150,
    last_sync: '2024-12-03T14:25:00Z',
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: 'plat_003',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    platform_name: 'Teacher Dashboard',
    platform_type: 'web',
    status: 'active',
    active_users_count: 85,
    last_sync: '2024-12-03T13:50:00Z',
    created_at: '2024-02-01T09:00:00Z'
  },
  {
    id: 'plat_004',
    school_id: 'sch_002',
    school_name: 'Washington Academy',
    platform_name: 'WA Mobile App',
    platform_type: 'mobile',
    status: 'active',
    active_users_count: 890,
    last_sync: '2024-12-03T14:28:00Z',
    created_at: '2024-03-20T11:00:00Z'
  },
  {
    id: 'plat_005',
    school_id: 'sch_002',
    school_name: 'Washington Academy',
    platform_name: 'Parent Portal',
    platform_type: 'web',
    status: 'maintenance',
    active_users_count: 0,
    last_sync: '2024-12-02T10:00:00Z',
    created_at: '2024-03-25T14:00:00Z'
  },
  {
    id: 'plat_006',
    school_id: 'sch_002',
    school_name: 'Washington Academy',
    platform_name: 'WA API Service',
    platform_type: 'api',
    status: 'active',
    active_users_count: 45,
    last_sync: '2024-12-03T14:32:00Z',
    created_at: '2024-04-01T08:00:00Z'
  },
  {
    id: 'plat_007',
    school_id: 'sch_003',
    school_name: 'Central Elementary',
    platform_name: 'CE Mobile',
    platform_type: 'mobile',
    status: 'active',
    active_users_count: 560,
    last_sync: '2024-12-03T14:20:00Z',
    created_at: '2024-05-10T09:30:00Z'
  },
  {
    id: 'plat_008',
    school_id: 'sch_003',
    school_name: 'Central Elementary',
    platform_name: 'CE Desktop Admin',
    platform_type: 'desktop',
    status: 'active',
    active_users_count: 12,
    last_sync: '2024-12-03T14:15:00Z',
    created_at: '2024-05-15T10:00:00Z'
  },
  {
    id: 'plat_009',
    school_id: 'sch_003',
    school_name: 'Central Elementary',
    platform_name: 'CE Web Portal',
    platform_type: 'web',
    status: 'inactive',
    active_users_count: 0,
    last_sync: '2024-11-20T08:00:00Z',
    created_at: '2024-06-01T12:00:00Z'
  },
  {
    id: 'plat_010',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    platform_name: 'LHS Analytics API',
    platform_type: 'api',
    status: 'active',
    active_users_count: 28,
    last_sync: '2024-12-03T14:35:00Z',
    created_at: '2024-06-10T15:00:00Z'
  }
];

export function PlatformsManager() {
  const [platforms, setPlatforms] = useState<PlatformWithDetails[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [stats, setStats] = useState({
    active: 0,
    totalUsers: 0,
    maintenance: 0
  });

  useEffect(() => {
    setPlatforms(MOCK_PLATFORMS);
    calculateStats(MOCK_PLATFORMS);
  }, []);

  const calculateStats = (platformsData: PlatformWithDetails[]) => {
    const active = platformsData.filter(p => p.status === 'active').length;
    const maintenance = platformsData.filter(p => p.status === 'maintenance').length;
    const totalUsers = platformsData.reduce((sum, p) => sum + p.active_users_count, 0);

    setStats({
      active,
      totalUsers,
      maintenance
    });
  };

  const filteredPlatforms = selectedSchool === 'all'
    ? platforms
    : platforms.filter(p => p.school_id === selectedSchool);

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-6 h-6" />;
      case 'web':
        return <Globe className="w-6 h-6" />;
      case 'desktop':
        return <Monitor className="w-6 h-6" />;
      case 'api':
        return <Zap className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'maintenance':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'inactive':
        return 'bg-slate-50 border-slate-200 text-slate-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Platform Integrations</h2>
        <p className="text-slate-600 mt-1">Monitor platform usage and integration status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="text-sm font-medium text-slate-600">Active Platforms</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
          <p className="text-xs text-slate-500 mt-1">of {platforms.length} total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-slate-600">Total Active Users</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">across all platforms</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-slate-600">Maintenance</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.maintenance}</p>
          <p className="text-xs text-slate-500 mt-1">platforms under maintenance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-slate-700">Filter by School:</label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          >
            <option value="all">All Schools</option>
            {MOCK_SCHOOLS.map(school => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  platform.status === 'active' ? 'bg-green-100 text-green-700' :
                  platform.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {getPlatformIcon(platform.platform_type)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(platform.status)}`}>
                  {platform.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{platform.platform_name}</h3>
              <p className="text-sm text-slate-500 mb-4">{platform.school_name}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Platform Type</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {platform.platform_type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Users</span>
                  <span className="text-sm font-medium text-slate-900">
                    {platform.active_users_count.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Last Sync</span>
                  <span className="text-sm font-medium text-slate-900">
                    {platform.last_sync
                      ? new Date(platform.last_sync).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Created</span>
                  <span className="text-sm font-medium text-slate-900">
                    {new Date(platform.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlatforms.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No platforms found for this school.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Platform Types Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['mobile', 'web', 'desktop', 'api'].map(type => {
            const count = platforms.filter(p => p.platform_type === type as any).length;
            return (
              <div key={type} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  {getPlatformIcon(type)}
                </div>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-600 capitalize">{type}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}