import { NextRequest, NextResponse } from 'next/server';
import Controlleur from '../../../../../models/User';
import { passwordCompare } from '@/utils/auth/ft_auth';
import dotenv from 'dotenv';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

dotenv.config();

// Stockage temporaire des tentatives (dans un environnement de production, utilisez Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Configuration des limites
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        console.log('Received login request for email:', email);

        // Vérification des tentatives de connexion
        const userAttempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        const currentTime = Date.now();

        // Vérifier si l'utilisateur est en période de blocage
        if (userAttempts.count >= MAX_ATTEMPTS) {
            const timeRemaining = LOCKOUT_TIME - (currentTime - userAttempts.lastAttempt);
            if (timeRemaining > 0) {
                const minutesRemaining = Math.ceil(timeRemaining / 60000);
                return NextResponse.json({
                    error: `Trop de tentatives. Veuillez réessayer dans ${minutesRemaining} minutes.`
                }, { status: 429 });
            } else {
                // Réinitialiser le compteur après la période de blocage
                loginAttempts.delete(email);
            }
        }

        // Vérifiez si l'utilisateur existe
        const user = await Controlleur.findOne({ where: { email } });
        if (!user) {
            // Incrémenter le compteur de tentatives
            updateLoginAttempts(email);
            return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 400 });
        }

        // Vérifiez le mot de passe
        const isPasswordValid = passwordCompare(password, user.password);
        if (!isPasswordValid) {
            // Incrémenter le compteur de tentatives
            updateLoginAttempts(email);
            return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 400 });
        }

        // Réinitialiser les tentatives en cas de succès
        loginAttempts.delete(email);

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '12h' }
        );

        // Définir le cookie
        const cookieStore = await cookies();
        cookieStore.set('tk_lgly_fftir_4454df', token, { 
            httpOnly: true, 
            maxAge: 12 * 60 * 60 // 12 heures en secondes
        });

        // Renvoyez une réponse de succès si les informations  
        return NextResponse.json({ message: 'Connexion réussie' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error);
        return NextResponse.json({ error: 'Erreur lors de la connexion de l\'utilisateur' }, { status: 500 });
    }
}

function updateLoginAttempts(email: string) {
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    loginAttempts.set(email, {
        count: attempts.count + 1,
        lastAttempt: Date.now()
    });
}
