'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Logique de réinitialisation ici avec params.token
      setIsSuccess(true);
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
            Réinitialiser le mot de passe
          </h2>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">
              Votre mot de passe a été réinitialisé avec succès !
            </p>
            <Button onClick={() => router.push('/login')} variant="primary">
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Nouveau mot de passe"
                type="password"
                {...register('password')}
                error={errors.password?.message}
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button type="submit" isLoading={isLoading}>
              Réinitialiser le mot de passe
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 