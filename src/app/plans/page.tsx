"use client";

import { useState, useEffect } from 'react';
import api from '@/services/api/axios';
import { Button } from '@/components/ui/button';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/super-admin/plans');
      setPlans(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">A carregar planos...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Planos</h1>
        <Button>Criar Novo Plano</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <div key={plan.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold text-blue-600 mb-4">{plan.price}$ <span className="text-sm text-slate-500 font-normal">/mês</span></p>
            
            <ul className="space-y-2 mb-6">
              <li className="flex justify-between border-b pb-2">
                <span className="text-slate-600">Alunos Máx:</span>
                <span className="font-semibold">{plan.maxStudents || 'Ilimitado'}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-slate-600">Professores Máx:</span>
                <span className="font-semibold">{plan.maxTeachers || 'Ilimitado'}</span>
              </li>
            </ul>

            <div className="flex gap-2">
              <Button variant="outline" className="w-full">Editar</Button>
              <Button variant="destructive" className="w-full">Remover</Button>
            </div>
          </div>
        ))}
        {plans.length === 0 && <p>Nenhum plano encontrado. Adicione um novo plano para iniciar a gestão.</p>}
      </div>
    </div>
  );
}
