'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      console.log('Form data:', data);
      // Logique d'envoi d'email ici
      setEmailSent(true);
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
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {emailSent 
              ? "Un email a été envoyé avec les instructions pour réinitialiser votre mot de passe."
              : "Entrez votre email pour recevoir un lien de réinitialisation."}
          </p>
        </div>

        {!emailSent && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Button type="submit" isLoading={isLoading}>
              Envoyer les instructions
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
} 