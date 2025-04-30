import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-blue-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Revise su correo
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Si existe una cuenta asociada a {email}, recibirá un enlace para restablecer su contraseña.
              </p>
              <div className="mt-6">
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Volver al inicio de sesión
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingrese su correo electrónico y le enviaremos las instrucciones
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              icon={<Mail size={16} />}
            >
              Enviar instrucciones
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Volver al inicio de sesión
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;