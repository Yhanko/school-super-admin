import { useState, useEffect } from 'react';
import {
  School,
  Plus,
  X,
} from 'lucide-react';
import { SchoolsList } from "./Shools"

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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [, setSchools] = useState<School[]>([]); // Novo estado para a lista de escolas

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    max_students: 1000,
    max_teachers: 100,
    max_staff: 50,
    subscription_plan: 'basic'
  });

  useEffect(() => {
    loadSchools();
  }, []);

  // Função fictícia para simular o carregamento de escolas
  const loadSchools = async () => {
    console.log('Simulando carregamento de escolas...');
    setLoading(true);
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Retorna os dados do "banco de dados" em memória
      const data = schoolsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (data) {
        console.log('Escolas carregadas (fictícias):', data);
        setSchools(data); // Atualiza o estado com os dados fictícios
        await loadSchoolStats(data.map(s => s.id));
      }
    } catch (error) {
      console.error('Erro simulado ao carregar escolas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função fictícia para simular o carregamento de estatísticas
  const loadSchoolStats = async (schoolIds: string[]) => {
    console.log('Simulando carregamento de estatísticas para IDs:', schoolIds);
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    const stats: Record<string, SchoolStats> = {};

    for (const schoolId of schoolIds) {
      // Dados fictícios de estatísticas
      const mockStats: SchoolStats = {
        students: Math.floor(Math.random() * 1000) + 100,
        teachers: Math.floor(Math.random() * 50) + 10,
        staff: Math.floor(Math.random() * 20) + 5,
        parents: Math.floor(Math.random() * 1500) + 200,
      };
      stats[schoolId] = mockStats;
    }

    console.log('Estatísticas carregadas (fictícias):', stats);
    // Nota: O componente original apenas logava as estatísticas.
    // Se a SchoolsList precisar delas, será necessário um novo estado e passar via props.
  };

  // Função fictícia para simular o envio do formulário (CRUD)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Simulando salvamento de escola com dados:', formData);
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      if (editingSchool) {
        // Simula a atualização
        schoolsData = schoolsData.map(s =>
          s.id === editingSchool.id
            ? { ...s, ...formData, updated_at: new Date().toISOString() }
            : s
        );
        console.log('Escola atualizada (fictícia).');
      } else {
        // Simula a inserção
        const newSchool: School = {
          ...formData,
          id: `sch-${Date.now()}`, // ID fictício
          status: 'active',
          subscription_expires_at: '2026-12-31T00:00:00Z',
          created_at: new Date().toISOString(),
        };
        schoolsData.push(newSchool);
        console.log('Escola criada (fictícia):', newSchool);
      }

      resetForm();
      loadSchools(); // Recarrega a lista fictícia
    } catch (error) {
      console.error('Erro simulado ao salvar escola:', error);
      alert('Erro simulado ao salvar escola. Tente novamente.');
    }
  };

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
      subscription_plan: 'basic'
    });
    setEditingSchool(null);
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading schools...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gerenciamento de Escolas</h2>
          <p className="text-slate-600 mt-1">Cadastrar, gerenciar e monitorar escolas da rede</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add School
        </button>
      </div>
      {/* Passando a lista de escolas fictícias para o componente SchoolsList */}
      <SchoolsList />

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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  placeholder='Insira a senha'
                />
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  placeholder='Confirme a senha'
                />
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