'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  accessCode: z.string().min(1, 'Le code d\'accès est requis')
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log('Form data:', data);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if(response.ok) {
        Swal.fire({
          title: 'Inscription réussie',
          text: 'Vous pouvez maintenant vous connecter',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setTimeout(() => {
            router.push('/login');
        }, 2000);
      }else{
        Swal.fire({
          title: 'Erreur',
          text: result.error || 'Une erreur est survenue',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.log(result);
      }
      // Logique d'inscription ici
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Nom"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Mot de passe"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Code d'accès"
              {...register('accessCode')}
              error={errors.accessCode?.message}
            />
          </div>

          <Button type="submit" isLoading={isLoading}>
            Créer un compte
          </Button>

          <p className="mt-2 text-center text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 