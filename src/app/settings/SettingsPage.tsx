import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import api from '../../services/api/axios';

export function SettingsPage() {
  const [platformName, setPlatformName] = useState('YhankoEduca');
  const [supportEmail, setSupportEmail] = useState('suporte@yhanko.com');
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        const parsed = response.data;
        if (parsed) {
          setPlatformName(parsed.platformName || 'YhankoEduca');
          setSupportEmail(parsed.supportEmail || 'suporte@yhanko.com');
          setAllowNewRegistrations(parsed.allowNewRegistrations ?? true);
          setMaintenanceMode(parsed.maintenanceMode ?? false);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', {
        platformName,
        supportEmail,
        allowNewRegistrations,
        maintenanceMode
      });
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar as configurações.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Configurações Globais</h2>
          <p className="text-slate-500 mt-2">Gira as preferências e estados da plataforma</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-3xl">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Preferências Gerais</h3>
        </div>
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome da Plataforma
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email de Suporte
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-md font-semibold text-slate-900 mb-4">Segurança & Acesso</h4>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Permitir Novos Registros (Leads)</p>
                <p className="text-sm text-slate-500">Escolas podem submeter interesse pela landing page</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={allowNewRegistrations}
                  onChange={(e) => setAllowNewRegistrations(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Modo Manutenção</p>
                <p className="text-sm text-slate-500">Bloqueia acesso a usuários comuns temporariamente</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

        </div>
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
          >
            {saving ? 'A salvar...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}
