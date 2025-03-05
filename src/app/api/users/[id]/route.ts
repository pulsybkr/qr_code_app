import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateRandomPassword, passwordHash } from '@/utils/auth/ft_auth';
import { verifyAdmin } from '@/utils/auth/verifyAdmin';

// DELETE - Supprimer un contrôleur
export async function DELETE(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const id = request.url.split('/').pop();
        
        // Vérifier si l'utilisateur existe et est un contrôleur
        const user = await prisma.controlleur.findFirst({ 
            where: { 
                id: id,
                role: 'controlleur'
            } 
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Supprimer l'utilisateur
        await prisma.controlleur.delete({ where: { id: id } });
        
        return NextResponse.json({ message: 'Utilisateur supprimé avec succès' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Réinitialiser le mot de passe
export async function POST(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const id = request.url.split('/').pop();
        
        // Vérifier si l'utilisateur existe et est un contrôleur
        const user = await prisma.controlleur.findFirst({ 
            where: { 
                id: id,
                role: 'controlleur'
            } 
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const newPassword = generateRandomPassword();
        
        // Mettre à jour le mot de passe
        await prisma.controlleur.update({
            where: { id: id },
            data: { 
                password: passwordHash(newPassword)
            }
        });

        return NextResponse.json({ 
            message: 'Mot de passe réinitialisé avec succès',
            newPassword 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
} 