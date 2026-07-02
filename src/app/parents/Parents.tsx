import { useState, useEffect } from "react";
import { Search } from "../../lib/icons";
import { Parent } from "../../types/parents";
import { ParentsTable } from "../../components/ParentsTable";
import { ParentsModal } from "../../components/ParentsModal";
import api from "../../services/api/axios";

export function Parents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    try {
      const response = await api.get('/super-admin/users?role=PARENT');
      const formatted = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        schoolId: user.institutionId || '',
        schoolName: user.institution?.name || 'N/A',
        class: 'N/A', // from relations if existed
        parentName: user.name,
        enrollmentDate: new Date(user.createdAt),
        isActive: true,
        lastLogin: undefined,
        attendanceRate: 0,
        averageGrade: 0,
        actions: []
      }));
      setParents(formatted);
    } catch (error) {
      console.error('Failed to load parents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParents = parents.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pl-6 pr-6 animate-fade-in">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold mb-2 text-black">
            Gestão de Encarregados
          </h1>
        </header>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar estudantes por nome, escola ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label htmlFor="school-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Filtrar Alunos por Escola:</label>
              <select 
                  id="school-filter" 
                  name="school-filter" 
                  className="block w-full min-w-[200px] py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition duration-150 ease-in-out"
              >
                  <option value="">Todas as Escolas</option>
                  <option value="sch-001">Escola Primária Alfa</option>
                  <option value="sch-002">Colégio Secundário Beta</option>
                  <option value="sch-003">Centro de Ensino Gama</option>
                  <option value="sch-004">Liceu de Artes Delta</option>
                  <option value="sch-005">Escola Técnica Epsilon</option>
              </select>
              <button 
                  type="button" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition duration-150 ease-in-out whitespace-nowrap"
              >
                Aplicar Filtro
              </button>
          </div>
        </div>

        <ParentsTable
          parents={filteredParents}
          onSelectParent={setSelectedParent}
        />

        <div className="mt-6 text-sm text-muted-foreground animate-fade-in">
          Total de estudantes: {filteredParents.length}
        </div>
      </div>

      <ParentsModal 
        parent={selectedParent}
        onClose={() => setSelectedParent(null)}
      />
    </div>
  );
}
