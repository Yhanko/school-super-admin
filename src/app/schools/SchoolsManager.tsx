import {
  School,
  Plus,
  X,
} from '../../lib/icons';
import { SchoolsList } from "./Shools"
import api from '../../services/api/axios';

// Dados fictícios para simular a resposta do Supabase
const mockSchools: School[] = [
  {
    id: 'sch-001',
    name: 'Escola Fictícia Primária',
    code: 'EFP001',
    status: 'active',
    email: 'contato@efp001.com',
    phone: '5511987654321',
    address: 'Rua das Flores, 123',
    max_students: 1500,
    max_teachers: 150,
    max_staff: 75,
    subscription_plan: 'premium',
    subscription_expires_at: '2026-12-31T00:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'sch-002',
    name: 'Colégio Fictício Secundário',
    code: 'CFS002',
    status: 'blocked',
    email: 'contato@cfs002.com',
    phone: null,
    address: 'Avenida Principal, 456',
    max_students: 800,
    max_teachers: 80,
    max_staff: 40,
    subscription_plan: 'basic',
    subscription_expires_at: '2025-06-30T00:00:00Z',
    created_at: '2024-02-20T12:30:00Z',
  },
  {
    id: 'sch-003',
    name: 'Centro de Ensino Fictício',
    code: 'CEF003',
    status: 'inactive',
    email: 'contato@cef003.com',
    phone: '5521912345678',
    address: 'Praça da Liberdade, 789',
    max_students: 2000,
    max_teachers: 200,
    max_staff: 100,
    subscription_plan: 'standard',
    subscription_expires_at: '2025-10-01T00:00:00Z',
    created_at: '2023-11-05T08:00:00Z',
  },
];

// Simulação de um banco de dados em memória para o CRUD
let schoolsData: School[] = [...mockSchools];

interface School {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'blocked' | 'inactive';
  email: string | null;
  phone: string | null;
  address: string | null;
  max_students: number;
  max_teachers: number;
  max_staff: number;
  subscription_plan: string;
  subscription_expires_at: string | null;
  created_at: string;
}

interface SchoolStats {
  students: number;
  teachers: number;
  staff: number;
  parents: number;
}

export function SchoolsManager() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    max_students: 1000,
    max_teachers: 100,
    max_staff: 50,
    subscription_plan: 'basic',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      max_students: 1000,
      max_teachers: 100,
      max_staff: 50,
      subscription_plan: 'basic',
      adminName: '',
      adminEmail: '',
      adminPassword: '',
    });
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/super-admin/institutions', {
        schoolName: formData.name,
        schoolEmail: formData.email,
        schoolAddress: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        planId: formData.subscription_plan // for now
      });

      resetForm();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create school:', error);
      alert('Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Schools Directory</h2>
          <p className="text-slate-500 mt-2">Manage registered institutions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add School
        </button>
      </div>
      <SchoolsList refreshTrigger={refreshTrigger} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingSchool ? 'Edit School' : 'Add New School'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                    disabled={!!editingSchool}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input
                type='text'
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Teachers
                  </label>
                  <input
                    type="number"
                    value={formData.max_teachers}
                    onChange={(e) => setFormData({ ...formData, max_teachers: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Staff
                  </label>
                  <input
                    type="number"
                    value={formData.max_staff}
                    onChange={(e) => setFormData({ ...formData, max_staff: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subscription Plan
                </label>
                <select
                  value={formData.subscription_plan}
                  onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className='space-y-4'>
                <h4 className="font-semibold text-slate-800 border-b pb-2">Admin Account</h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Password *
                  </label>
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    placeholder='Insira a senha'
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition"
                >
                  {editingSchool ? 'Update School' : 'Create School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
