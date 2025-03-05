import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const cookieStore = cookies();
        const token = (await cookieStore).get('tk_lgly_fftir_4454df');

        if (!token) {
            console.log('❌ Erreur: Token manquant');
            return NextResponse.json({ 
                error: 'Non autorisé - Veuillez vous connecter' 
            }, { status: 401 });
        }

        // Décoder le token
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };
        const controlleurId = decoded.userId;

        // Vérification du délai
        const uneHeureAvant = new Date(Date.now() - (60 * 60 * 1000));
        
        const existingScan = await prisma.scan.findFirst({
            where: {
                licence: body.licence,
                createdAt: {
                    gt: uneHeureAvant
                }
            }
        });

        if (existingScan) {
            return NextResponse.json({ 
                error: 'Cette licence a déjà été scannée il y a moins d\'une heure',
                lastScan: existingScan.createdAt
            }, { status: 400 });
        }

        // Création du nouveau scan
        const newScan = await prisma.scan.create({
            data: {
                controlleurId,
                licence: body.licence,
                nom: body.nom,
                prenom: body.prenom,
                photoUrl: body.photoUrl,
                photoData: body.photoData
            }
        });


        return NextResponse.json({
            success: true,
            message: 'Scan enregistré avec succès',
            data: {
                nom: body.nom,
                prenom: body.prenom,
                photoData: body.photoData,
                scanId: newScan.id,
                scannedAt: newScan.createdAt
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('🔥 Erreur critique lors du scan:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ 
                error: 'Token invalide' 
            }, { status: 401 });
        }

        // Log détaillé de l'erreur
        console.error('📝 Détails supplémentaires:', {
            timestamp: new Date().toISOString(),
            type: error.constructor.name,
            code: error.code,
            path: req.url
        });

        return NextResponse.json({ 
            error: 'Une erreur est survenue lors du traitement du scan' 
        }, { status: 500 });
    } finally {
        console.log('🏁 Fin du traitement de la requête');
    }
}