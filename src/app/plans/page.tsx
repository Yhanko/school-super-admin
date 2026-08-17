import { useState, useEffect } from 'react';
import api from '../../services/api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Trash2 } from '../../lib/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, PlanSchema } from '../../services/schema/plan';

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
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<PlanSchema>({
    resolver: zodResolver(planSchema)
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
      reset({
        name: plan.name,
        price: plan.price,
        maxStudents: plan.maxStudents ?? null,
        maxTeachers: plan.maxTeachers ?? null,
        maxParents: plan.maxParents ?? null,
        maxStaff: plan.maxStaff ?? null,
      });
      setFeaturesList(plan.features || []);
    } else {
      setEditingPlan(null);
      reset({
        name: '',
        price: 0,
        maxStudents: null,
        maxTeachers: null,
        maxParents: null,
        maxStaff: null,
      });
      setFeaturesList([]);
    }
    setShowModal(true);
  };

  const onSubmit = async (data: PlanSchema) => {
    try {
      const payload = {
        name: data.name,
        price: data.price,
        maxStudents: data.maxStudents,
        maxTeachers: data.maxTeachers,
        maxParents: data.maxParents,
        maxStaff: data.maxStaff,
        features: featuresList.filter(f => f.trim() !== '')
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
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
              {plan.features && plan.features.length > 0 && (
                <li className="pt-2">
                  <span className="text-slate-600 block mb-2 font-medium">Vantagens:</span>
                  <ul className="space-y-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
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

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Plano *</label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preço Mensal ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
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
                        {...register('maxStudents', { setValueAs: v => v === "" || Number.isNaN(v) ? null : parseInt(v, 10) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                      {errors.maxStudents && <p className="text-red-500 text-xs mt-1">{errors.maxStudents.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Professores</label>
                      <input
                        type="number"
                        min="1"
                        {...register('maxTeachers', { setValueAs: v => v === "" || Number.isNaN(v) ? null : parseInt(v, 10) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                      {errors.maxTeachers && <p className="text-red-500 text-xs mt-1">{errors.maxTeachers.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Encarregados</label>
                      <input
                        type="number"
                        min="1"
                        {...register('maxParents', { setValueAs: v => v === "" || Number.isNaN(v) ? null : parseInt(v, 10) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                      {errors.maxParents && <p className="text-red-500 text-xs mt-1">{errors.maxParents.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Máx Funcionários</label>
                      <input
                        type="number"
                        min="1"
                        {...register('maxStaff', { setValueAs: v => v === "" || Number.isNaN(v) ? null : parseInt(v, 10) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Ilimitado"
                      />
                      {errors.maxStaff && <p className="text-red-500 text-xs mt-1">{errors.maxStaff.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-800">Vantagens / Funcionalidades</h3>
                    <button
                      type="button"
                      onClick={() => setFeaturesList([...featuresList, ''])}
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded hover:bg-slate-200 transition font-medium"
                    >
                      + Adicionar Vantagem
                    </button>
                  </div>
                  <div className="space-y-2">
                    {featuresList.map((feat, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const newF = [...featuresList];
                            newF[index] = e.target.value;
                            setFeaturesList(newF);
                          }}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                          placeholder="Ex: Gestão de Turmas e Salas"
                        />
                        <button
                          type="button"
                          onClick={() => setFeaturesList(featuresList.filter((_, i) => i !== index))}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {featuresList.length === 0 && (
                      <p className="text-sm text-slate-500 italic">Nenhuma vantagem adicionada.</p>
                    )}
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
