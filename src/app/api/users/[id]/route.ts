import { NextRequest, NextResponse } from 'next/server';
import Controlleur from '../../../../../models/User';
import { generateRandomPassword, passwordHash } from '@/utils/auth/ft_auth';
import { verifyAdmin } from '@/utils/auth/verifyAdmin';

// DELETE - Supprimer un contrôleur
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier si l'utilisateur est admin
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const user = await Controlleur.findOne({ 
            where: { 
                id: params.id,
                role: 'controlleur'
            } 
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        await user.destroy();
        return NextResponse.json({ message: 'Utilisateur supprimé avec succès' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Réinitialiser le mot de passe
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Vérifier si l'utilisateur est admin
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const user = await Controlleur.findOne({ 
            where: { 
                id: params.id,
                role: 'controlleur'
            } 
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const newPassword = generateRandomPassword();
        await user.update({ password: passwordHash(newPassword) });

        return NextResponse.json({ 
            message: 'Mot de passe réinitialisé avec succès',
            newPassword 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
} 