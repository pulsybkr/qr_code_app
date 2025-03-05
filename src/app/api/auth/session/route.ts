import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

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
            const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { userId: string };
            
            // Vérifier si l'utilisateur existe toujours
            const user = await prisma.controlleur.findUnique({ 
                where: { id: decoded.userId },
                select: { 
                    firstName: true, 
                    lastName: true, 
                    email: true, 
                    role: true, 
                    photoData: true 
                }
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

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('tk_lgly_fftir_4454df');

        if (!token) {
            return NextResponse.json({ 
                isAdmin: false, 
                error: 'Aucune session trouvée' 
            }, { status: 401 });
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { userId: string };
            
            // Vérifier si l'utilisateur existe et a le rôle admin
            const user = await prisma.controlleur.findUnique({ 
                where: { id: decoded.userId },
                select: { role: true }
            });

            if (!user) {
                return NextResponse.json({ 
                    isAdmin: false, 
                    error: 'Utilisateur non trouvé' 
                }, { status: 401 });
            }

            // Vérifier si le rôle est admin
            const isAdmin = user.role === 'admin';

            return NextResponse.json({ 
                isAdmin 
            }, { status: 200 });

        } catch (jwtError) {
            return NextResponse.json({ 
                isAdmin: false, 
                error: 'Session invalide' 
            }, { status: 401 });
        }

    } catch (error) {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        return NextResponse.json({ 
            isAdmin: false, 
            error: 'Erreur serveur' 
        }, { status: 500 });
    }
}
