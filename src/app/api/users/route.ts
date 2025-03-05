import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateRandomPassword, passwordHash } from '@/utils/auth/ft_auth';
import { verifyAdmin } from '@/utils/auth/verifyAdmin';

// GET - Récupérer tous les contrôleurs
export async function GET(req: NextRequest) {
    try {
        // Vérifier si l'utilisateur est admin
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const users = await prisma.controlleur.findMany({
            where: { role: 'controlleur' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                password: true
            }
        });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer un nouveau contrôleur
export async function POST(req: NextRequest) {
    try {
        // Vérifier si l'utilisateur est admin
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { firstName, lastName, email } = await req.json();
        
        if(!firstName || !lastName || !email) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }
        // Vérifier si l'email existe déjà
        const existingUser = await prisma.controlleur.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        // Générer un mot de passe aléatoire
        const temporaryPassword = generateRandomPassword();

        // Créer l'utilisateur
        await prisma.controlleur.create({
            data: {
                firstName,
                lastName,
                email,
                password: passwordHash(temporaryPassword),
                role: 'controlleur'
            }
        });

        return NextResponse.json({ 
            message: 'Contrôleur créé avec succès',
            email,
            temporaryPassword
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
} 