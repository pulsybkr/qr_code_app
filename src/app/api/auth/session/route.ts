import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Controlleur from '../../../../../models/User';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('tk_lgly_fftir_4454df');

        if (!token) {
            return NextResponse.json({ 
                isValid: false, 
                error: 'Aucune session trouvée' 
            }, { status: 401 });
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { userId: number };
            
            // Vérifier si l'utilisateur existe toujours
            const user = await Controlleur.findOne({ 
                where: { id: decoded.userId },
                attributes: { exclude: ['password', "id", "createdAt", "updatedAt", "tokenResetPassword"] } // Exclure le mot de passe
            });

            if (!user) {
                return NextResponse.json({ 
                    isValid: false, 
                    error: 'Utilisateur non trouvé' 
                }, { status: 401 });
            }

            return NextResponse.json({ 
                isValid: true, 
                user 
            }, { status: 200 });

        } catch (jwtError) {
            return NextResponse.json({ 
                isValid: false, 
                error: 'Session invalide' 
            }, { status: 401 });
        }

    } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        return NextResponse.json({ 
            isValid: false, 
            error: 'Erreur serveur' 
        }, { status: 500 });
    }
}
