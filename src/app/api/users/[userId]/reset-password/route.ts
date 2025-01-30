import { NextRequest, NextResponse } from 'next/server';
import Controlleur from '../../../../../../models/User';
import { generateRandomPassword, passwordHash } from '@/utils/auth/ft_auth';
import { verifyAdmin } from '@/utils/auth/verifyAdmin';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Vérifier si l'utilisateur est admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { userId } = params;

    // Vérifier si l'utilisateur existe
    const user = await Controlleur.findByPk(userId);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Générer un nouveau mot de passe
    const newPassword = generateRandomPassword();

    // Mettre à jour le mot de passe
    await user.update({
      password: passwordHash(newPassword)
    });

    return NextResponse.json({ 
      message: 'Mot de passe réinitialisé avec succès',
      newPassword
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 