import { useState, useEffect } from 'react';
import api from '../../services/api/axios';
import { Building2 } from '../../lib/icons';

interface School {
  id: string;
  name: string;
  studentsCount: number;
  teachersCount: number;
  status: string;
}

export function RecentSchools() {
    const [recentSchools, setRecentSchools] = useState<School[]>([]);

    useEffect(() => {
        api.get('/super-admin/schools')
            .then(response => {
                const schools = response.data.map((inst: any) => ({
                    id: inst.id,
                    name: inst.name,
                    studentsCount: inst.max_students || 0,
                    teachersCount: inst.max_teachers || 0,
                    status: inst.status || 'active'
                })).slice(0, 5); // Take only first 5 recent
                setRecentSchools(schools);
            })
            .catch(error => console.error('Failed to load recent schools', error));
    }, []);

    return (
    <div className="grid gap-6 lg:grid-cols-2 mt-10">
        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
                  Escolas Recentes
              </div>
              <div>Últimas escolas cadastradas no sistema</div>
            </div>
            <div>
              <div className="space-y-4">
                {recentSchools.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">Nenhuma escola cadastrada ainda.</p>
                ) : (
                  recentSchools.map((school, index) => (
                    <div key={school.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{school.name}</p>
                        <p className="text-sm text-muted-foreground">{school.studentsCount} alunos • {school.teachersCount} professores</p>
                      </div>
                      <div
                        className={
                          school.status === "active"
                            ? "px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                            : school.status === "blocked"
                            ? "px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                            : "px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                        }
                      >
                        {school.status === "active" ? "Ativa" : school.status === "blocked" ? "Bloqueada" : "Inativa"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
      </div>
    )
}