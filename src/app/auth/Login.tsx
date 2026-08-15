import { useState } from 'react';
import { LogIn, Eye, EyeOff } from '../../lib/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthSchema } from "../../services/schema/auth";
import { useNavigate } from 'react-router-dom';
import api, { AxiosError } from '../../services/api/axios';
import { useAuthStore } from "../../store/authStore";
import YhankoLogo from "../../assets/yhankoIMG.png";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthSchema) => {
    try {
        setLoading(true);
        const response = await api.post("/auth/login", {
          email: data.email,
          password: data.password,
        });

        if(response.status === 200 || response.status === 201){
          const dataResponse = response.data;
          
          useAuthStore.getState().setAuth({ email: data.email, name: data.fullName || 'Admin', role: 'SUPER_ADMIN', id: '1' }, dataResponse.access_token);
          reset();
          navigate('/dashboard');
        }

   } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
      }
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <img src={YhankoLogo} alt="Yhanko Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão Escolar</h1>
          <p className="text-slate-600 mt-2">Plataforma Super Admin</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              required
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Palavra-passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
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
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Entrar na Conta</span>
              </>
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-slate-600 hover:text-purple-600 font-medium text-sm transition"
          >
            <span>Não tem uma conta? Registe-se</span>
          </button>
        </div>
  </div>
</div>
)}