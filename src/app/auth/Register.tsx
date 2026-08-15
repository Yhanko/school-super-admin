import { useState } from 'react';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff } from '../../lib/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthSchema } from "../../services/schema/auth";
import { useNavigate } from 'react-router-dom';
import api, { AxiosError } from '../../services/api/axios';
import { useAuthStore } from "../../store/authStore";
import YhankoLogo from "../../assets/yhankoIMG.png";

export function Register() {
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
        // Crio o super admin passando o role explicitamente
        const response = await api.post("/users", {
          name: data.fullName,
          email: data.email,
          password: data.password,
          role: 'SUPER_ADMIN'
        });

        if(response.status === 200 || response.status === 201) {
          toast.success('Conta criada com sucesso! Por favor, faça login.');
          reset();
          navigate('/');
        }

   } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
        toast.error(err.response?.data.message || 'Erro ao criar conta');
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
          <h1 className="text-3xl font-bold text-slate-900">School Manager</h1>
          <p className="text-slate-600 mt-2">Create Super Admin Account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
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
              Password
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
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Creating Account...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign Up
                </>
              )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-purple-600 font-medium text-sm transition"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
