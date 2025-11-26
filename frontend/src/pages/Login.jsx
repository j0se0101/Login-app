import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import InputWithIcon from '../components/InputWithIcon';
import Button from '../components/Button';
import LogoLogin from '../components/LogoLogin';

export default function Login() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string({ required_error: 'El email es requerido' })
      .email('Ingresa un email válido'),
    password: z.string({ required_error: 'La contraseña es requerida' })
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
  });

  const { register, handleSubmit, formState: { errors, isValid }, getValues } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const values = getValues();
      const response = await login(values);
      if (response.success) {
        toast.success('¡Bienvenido!');
        navigate('/profile');
      } else {
        setError(response.message);
        toast.error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {/* Icono y título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-full mb-4 transition-colors duration-300">
              <LogoLogin className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Iniciar Sesión</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">Accede a tu panel de control</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div
                className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-sm transition-colors"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Campo Email */}
            <InputWithIcon
              label="Email"
              id="email"
              type="email"
              placeholder="tu@email.com"
              disabled={loading}
              error={errors.email?.message}
              leftIcon={(
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              registerProps={{ ...register('email') }}
            />

            {/* Campo Contraseña */}
            <InputWithIcon
              label="Contraseña"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="........"
              disabled={loading}
              error={errors.password?.message}
              leftIcon={(
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              rightAdornment={(
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a18.77 18.77 0 013.315-4.763M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
              registerProps={{ ...register('password') }}
            />

            {/* UX extra: Recordarme + Olvidé mi contraseña */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 select-none transition-colors">
                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500" disabled={loading} />
                Recuérdame
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                onClick={() => alert('Funcionalidad próximamente')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de envío */}
            <Button type="submit" loading={loading} disabled={!isValid}>
              Iniciar Sesión
            </Button>
          </form>

          {/* Enlace de registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
