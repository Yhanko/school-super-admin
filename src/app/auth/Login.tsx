import { useState } from 'react';
import { LogIn } from '../../lib/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthSchema } from "../../services/schema/auth";
import { useNavigate } from 'react-router-dom';
import api, { AxiosError } from '../../services/api/axios';
import { useUserStore } from "../../contexts/AuthContext";


export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
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
          localStorage.setItem('token', dataResponse.access_token);
          // O backend agora devolve access_token, precisamos decodificar ou salvar para a authStore
          useUserStore.getState().setUser({ email: data.email, role: 'SUPER_ADMIN' } as any);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">School Manager</h1>
          <p className="text-slate-600 mt-2">Super Admin Platform</p>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              required
              />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Loading...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => {;
            }}
              className="text-slate-600 hover:text-slate-900 text-sm transition"
            >
              "Don't have an account? Sign Up"
            </button>
        </div>
  </div>
</div>
)}