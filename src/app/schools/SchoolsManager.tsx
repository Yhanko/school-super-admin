import { useState, useEffect } from 'react';
import {
  School,
  Plus,
  X,
  Eye,
  EyeOff
} from '../../lib/icons';
import toast from 'react-hot-toast';
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
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    api.get('/super-admin/plans').then(res => setPlans(res.data)).catch(console.error);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    director: '',
    email: '',
    phone: '',
    address: '',
    planId: '',
    password: '',
    confirmPassword: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      director: '',
      email: '',
      phone: '',
      address: '',
      planId: '',
      password: '',
      confirmPassword: '',
    });
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      await api.post('/super-admin/schools', {
        schoolName: formData.name,
        schoolEmail: formData.email,
        schoolPhone: formData.phone,
        schoolAddress: formData.address,
        adminName: formData.director,
        adminEmail: formData.email,
        adminPassword: formData.password,
        planId: formData.planId
      });

      resetForm();
      setRefreshTrigger(prev => prev + 1);
      toast.success('Escola criada com sucesso!');
    } catch (error) {
      console.error('Failed to create school:', error);
      toast.error('Erro ao criar escola');
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
                    Nome da Escola *
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
                    Nome do Diretor *
                  </label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Plano de Assinatura *</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Selecione um plano</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Senha (Admin) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {loading ? 'Aguarde...' : editingSchool ? 'Atualizar Escola' : 'Criar Escola'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
