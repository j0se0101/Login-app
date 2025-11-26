import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import InputWithIcon from '../components/InputWithIcon';
import Button from '../components/Button';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const schema = z.object({
    username: z.string({ required_error: 'El nombre de usuario es requerido' })
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string({ required_error: 'El email es requerido' })
      .email('Ingresa un email válido'),
    password: z.string({ required_error: 'La contraseña es requerida' })
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
  });

  const { register, handleSubmit, formState: { errors, isValid }, getValues } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { username: '', email: '', password: '' }
  });

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const values = getValues();
      const response = await authService.register(values);
      if (response.success) {
        toast.success('Cuenta creada. Inicia sesión.');
        navigate('/login');
      } else {
        setError(response.message);
        toast.error(response.message || 'No se pudo registrar');
      }
    } catch (err) {
      setError('Error al registrar usuario');
      toast.error('Error al registrar usuario');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full mb-4 transition-colors">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Crear una cuenta</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">Únete a nuestra plataforma</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-sm" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            {/* Campo Username */}
            <InputWithIcon
              label="Nombre de usuario"
              id="username"
              type="text"
              placeholder="tu_usuario"
              disabled={loading}
              error={errors.username?.message}
              leftIcon={(
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              registerProps={{ ...register('username') }}
            />

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
              type="password"
              placeholder="........"
              disabled={loading}
              error={errors.password?.message}
              leftIcon={(
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              registerProps={{ ...register('password') }}
            />

            {/* Botón de envío */}
            <Button type="submit" variant="success" loading={loading} disabled={!isValid}>
              Registrarse
            </Button>
          </form>

          {/* Enlace de login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
