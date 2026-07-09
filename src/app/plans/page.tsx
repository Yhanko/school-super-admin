import { useState, useEffect } from 'react';
import api from '../../services/api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Trash2 } from '../../lib/icons';

type Plan = {
  id: string;
  name: string;
  price: number;
  maxStudents: number | null;
  maxTeachers: number | null;
  maxParents: number | null;
  maxStaff: number | null;
  features: string[];
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxStudents: '',
    maxTeachers: '',
    maxParents: '',
    maxStaff: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/super-admin/plans');
      setPlans(response.data);
    } catch (err: any) {
      toast.error('Erro ao buscar planos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        maxStudents: plan.maxStudents ? plan.maxStudents.toString() : '',
        maxTeachers: plan.maxTeachers ? plan.maxTeachers.toString() : '',
        maxParents: plan.maxParents ? plan.maxParents.toString() : '',
        maxStaff: plan.maxStaff ? plan.maxStaff.toString() : '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: '',
        maxStudents: '',
        maxTeachers: '',
        maxParents: '',
        maxStaff: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : null,
        maxTeachers: formData.maxTeachers ? parseInt(formData.maxTeachers) : null,
        maxParents: formData.maxParents ? parseInt(formData.maxParents) : null,
        maxStaff: formData.maxStaff ? parseInt(formData.maxStaff) : null,
        features: []
      };

      if (editingPlan) {
        await api.put(`/super-admin/plans/${editingPlan.id}`, payload);
        toast.success('Plano atualizado com sucesso!');
      } else {
        await api.post('/super-admin/plans', payload);
        toast.success('Plano criado com sucesso!');
      }

      setShowModal(false);
      fetchPlans();
    } catch (err: any) {
      toast.error('Erro ao guardar plano: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este plano?')) {
      try {
        await api.delete(`/super-admin/plans/${id}`);
        toast.success('Plano removido com sucesso!');
        fetchPlans();
      } catch (err: any) {
        toast.error('Erro ao remover plano: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="p-8 text-slate-500">A carregar planos...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestão de Planos</h1>
            <p className="text-slate-500 mt-2">Gerir pacotes e preços de subscrição</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Criar Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-slate-900">{plan.name}</h2>
            <p className="text-4xl font-bold text-indigo-600 mb-6">{plan.price.toLocaleString('pt-AO')} Kz <span className="text-sm text-slate-500 font-normal">/mês</span></p>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-600">Alunos Máx:</span>
                <span className="font-semibold text-slate-900">{plan.maxStudents || 'Ilimitado'}</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-600">Professores Máx:</span>
                <span className="font-semibold text-slate-900">{plan.maxTeachers || 'Ilimitado'}</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-600">Encarregados Máx:</span>
                <span className="font-semibold text-slate-900">{plan.maxParents || 'Ilimitado'}</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-600">Funcionários Máx:</span>
                <span className="font-semibold text-slate-900">{plan.maxStaff || 'Ilimitado'}</span>
              </li>
            </ul>

            <div className="flex gap-3">
              <button 
                onClick={() => handleOpenModal(plan)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(plan.id)}
                className="flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-500 mb-4">Nenhum plano encontrado. Adicione um novo plano para iniciar a gestão.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Plano *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preço Mensal ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Limites do Plano (Deixe em branco para Ilimitado)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Alunos</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Professores</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxTeachers}
                        onChange={(e) => setFormData({ ...formData, maxTeachers: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Encarregados</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxParents}
                        onChange={(e) => setFormData({ ...formData, maxParents: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Funcionários</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxStaff}
                        onChange={(e) => setFormData({ ...formData, maxStaff: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
