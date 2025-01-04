import { NextRequest, NextResponse } from 'next/server';
import Controlleur from '../../../../../models/User';
import { passwordHash } from '@/utils/auth/ft_auth';
import dotenv from 'dotenv';

dotenv.config();

// Stockage temporaire des tentatives (dans un environnement de production, utilisez Redis)
const registerAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Configuration des limites
const MAX_ATTEMPTS = 8; // Plus strict pour l'inscription
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes en millisecondes

function updateRegisterAttempts(identifier: string) {
    const attempts = registerAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
    registerAttempts.set(identifier, {
        count: attempts.count + 1,
        lastAttempt: Date.now()
    });
}

export const POST = async (req: NextRequest) => {
    try {
        const { firstName, lastName, email, password, accessCode } = await req.json();
        const codeEnv = process.env.CODE_REGISTRATION;

        // Utiliser l'IP comme identifiant (en production, vous devriez utiliser req.ip)
        const identifier = req.headers.get('x-forwarded-for') || 'unknown-ip';
        
        // Vérification des tentatives
        const attempts = registerAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
        const currentTime = Date.now();

        // Vérifier si l'utilisateur est en période de blocage
        if (attempts.count >= MAX_ATTEMPTS) {
            const timeRemaining = LOCKOUT_TIME - (currentTime - attempts.lastAttempt);
            if (timeRemaining > 0) {
                const minutesRemaining = Math.ceil(timeRemaining / 60000);
                return NextResponse.json({
                    error: `Trop de tentatives. Veuillez réessayer dans ${minutesRemaining} minutes.`
                }, { status: 429 });
            } else {
                // Réinitialiser le compteur après la période de blocage
                registerAttempts.delete(identifier);
            }
        }

        if (accessCode !== codeEnv) {
            // Incrémenter le compteur de tentatives
            updateRegisterAttempts(identifier);
            return NextResponse.json({ error: 'Code de validation incorrect' }, { status: 400 });
        }

        const emailExist = await Controlleur.findOne({ where: { email } });
        if (emailExist) {
            return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
        }

        const user = await Controlleur.create({ 
            firstName, 
            lastName, 
            email, 
            password: passwordHash(password) 
        });

        if (!user) {
            return NextResponse.json({ 
                error: 'Erreur lors de la création de l\'utilisateur' 
            }, { status: 500 });
        }

        // Réinitialiser les tentatives en cas de succès
        registerAttempts.delete(identifier);
        
        return NextResponse.json({ 
            message: 'Utilisateur créé avec succès' 
        }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        return NextResponse.json({ 
            error: 'Erreur lors de la création de l\'utilisateur' 
        }, { status: 500 });
    }
}
